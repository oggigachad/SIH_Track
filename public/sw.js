// Service Worker for Railway Management System
// Provides offline capability and action queuing

const CACHE_NAME = 'railway-management-v1'
const STATIC_CACHE_NAME = 'railway-static-v1'
const DYNAMIC_CACHE_NAME = 'railway-dynamic-v1'

// Assets to cache on install
const STATIC_ASSETS = [
  '/',
  '/manifest.json',
  '/images/track-logo.png',
  // Add other static assets as needed
]

// API endpoints that can work offline
const CACHEABLE_ROUTES = [
  '/api/qr-codes',
  '/api/batches',
  '/api/reports'
]

// Action queue for offline operations
let actionQueue = []

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing')
  
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME)
      .then(cache => {
        console.log('Service Worker: Caching static assets')
        return cache.addAll(STATIC_ASSETS)
      })
      .then(() => {
        console.log('Service Worker: Static assets cached')
        return self.skipWaiting()
      })
      .catch(err => {
        console.error('Service Worker: Error caching static assets', err)
      })
  )
})

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating')
  
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName !== STATIC_CACHE_NAME && cacheName !== DYNAMIC_CACHE_NAME) {
              console.log('Service Worker: Deleting old cache', cacheName)
              return caches.delete(cacheName)
            }
          })
        )
      })
      .then(() => {
        console.log('Service Worker: Activated')
        return self.clients.claim()
      })
  )
})

// Fetch event - handle network requests
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)
  
  // Handle API requests
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(handleApiRequest(request))
  }
  // Handle static assets
  else if (request.destination === 'image' || request.destination === 'style' || request.destination === 'script') {
    event.respondWith(handleStaticAsset(request))
  }
  // Handle navigation requests
  else if (request.mode === 'navigate') {
    event.respondWith(handleNavigation(request))
  }
  // Handle other requests with network-first strategy
  else {
    event.respondWith(handleGenericRequest(request))
  }
})

// Handle API requests with cache-first strategy for GET requests
async function handleApiRequest(request) {
  const url = new URL(request.url)
  const isCacheable = CACHEABLE_ROUTES.some(route => url.pathname.startsWith(route))
  
  if (request.method === 'GET' && isCacheable) {
    try {
      // Try cache first
      const cachedResponse = await caches.match(request)
      if (cachedResponse) {
        console.log('Service Worker: Serving from cache', request.url)
        
        // Update cache in background
        fetch(request)
          .then(response => {
            if (response.ok) {
              caches.open(DYNAMIC_CACHE_NAME)
                .then(cache => cache.put(request, response.clone()))
            }
          })
          .catch(() => {
            // Ignore network errors during background update
          })
        
        return cachedResponse
      }
      
      // Try network
      const networkResponse = await fetch(request)
      if (networkResponse.ok) {
        // Cache successful response
        const cache = await caches.open(DYNAMIC_CACHE_NAME)
        cache.put(request, networkResponse.clone())
      }
      
      return networkResponse
    } catch (error) {
      console.log('Service Worker: Network failed, serving offline fallback')
      return new Response(JSON.stringify({
        error: 'Offline',
        message: 'This request requires an internet connection'
      }), {
        status: 503,
        statusText: 'Service Unavailable',
        headers: { 'Content-Type': 'application/json' }
      })
    }
  }
  
  // Handle non-GET requests (POST, PUT, DELETE)
  if (request.method !== 'GET') {
    return handleOfflineAction(request)
  }
  
  // Default: try network only
  return fetch(request)
}

// Handle offline actions by queuing them
async function handleOfflineAction(request) {
  try {
    // Try network first
    const response = await fetch(request)
    return response
  } catch (error) {
    // Network failed, queue the action
    console.log('Service Worker: Queueing offline action', request.method, request.url)
    
    const action = {
      id: Date.now().toString(),
      url: request.url,
      method: request.method,
      headers: Object.fromEntries(request.headers.entries()),
      body: request.method !== 'GET' ? await request.text() : null,
      timestamp: Date.now(),
      retryCount: 0
    }
    
    actionQueue.push(action)
    
    // Store queue in IndexedDB for persistence
    await storeActionQueue()
    
    // Notify the client about the queued action
    notifyClientsAboutQueuedAction(action)
    
    return new Response(JSON.stringify({
      success: true,
      message: 'Action queued for when connection is restored',
      actionId: action.id
    }), {
      status: 202,
      statusText: 'Accepted',
      headers: { 'Content-Type': 'application/json' }
    })
  }
}

// Handle static assets with cache-first strategy
async function handleStaticAsset(request) {
  try {
    const cachedResponse = await caches.match(request)
    if (cachedResponse) {
      return cachedResponse
    }
    
    const networkResponse = await fetch(request)
    if (networkResponse.ok) {
      const cache = await caches.open(STATIC_CACHE_NAME)
      cache.put(request, networkResponse.clone())
    }
    
    return networkResponse
  } catch (error) {
    console.log('Service Worker: Failed to load static asset', request.url)
    throw error
  }
}

// Handle navigation requests
async function handleNavigation(request) {
  try {
    // Try network first
    const networkResponse = await fetch(request)
    return networkResponse
  } catch (error) {
    // Serve cached index.html as fallback for SPA
    const cachedResponse = await caches.match('/')
    if (cachedResponse) {
      return cachedResponse
    }
    
    // Final fallback
    return new Response('<!DOCTYPE html><html><head><title>Offline</title></head><body><h1>You are offline</h1><p>Please check your internet connection and try again.</p></body></html>', {
      headers: { 'Content-Type': 'text/html' }
    })
  }
}

// Handle generic requests with network-first strategy
async function handleGenericRequest(request) {
  try {
    const networkResponse = await fetch(request)
    return networkResponse
  } catch (error) {
    const cachedResponse = await caches.match(request)
    if (cachedResponse) {
      return cachedResponse
    }
    throw error
  }
}

// Store action queue in IndexedDB
async function storeActionQueue() {
  try {
    const db = await openDB()
    const transaction = db.transaction(['actionQueue'], 'readwrite')
    const store = transaction.objectStore('actionQueue')
    await store.clear()
    await store.add({ id: 'queue', actions: actionQueue })
  } catch (error) {
    console.error('Service Worker: Failed to store action queue', error)
  }
}

// Load action queue from IndexedDB
async function loadActionQueue() {
  try {
    const db = await openDB()
    const transaction = db.transaction(['actionQueue'], 'readonly')
    const store = transaction.objectStore('actionQueue')
    const result = await store.get('queue')
    actionQueue = result?.actions || []
  } catch (error) {
    console.error('Service Worker: Failed to load action queue', error)
    actionQueue = []
  }
}

// Open IndexedDB
function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('RailwayManagementDB', 1)
    
    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve(request.result)
    
    request.onupgradeneeded = (event) => {
      const db = event.target.result
      if (!db.objectStoreNames.contains('actionQueue')) {
        db.createObjectStore('actionQueue', { keyPath: 'id' })
      }
    }
  })
}

// Process queued actions when online
async function processActionQueue() {
  if (actionQueue.length === 0) return
  
  console.log('Service Worker: Processing action queue', actionQueue.length, 'items')
  
  const processedActions = []
  
  for (const action of actionQueue) {
    try {
      const request = new Request(action.url, {
        method: action.method,
        headers: action.headers,
        body: action.body
      })
      
      const response = await fetch(request)
      
      if (response.ok) {
        console.log('Service Worker: Successfully processed queued action', action.id)
        processedActions.push(action.id)
        
        // Notify clients about successful action
        notifyClientsAboutProcessedAction(action, true)
      } else {
        action.retryCount++
        if (action.retryCount >= 3) {
          console.log('Service Worker: Max retries reached for action', action.id)
          processedActions.push(action.id)
          notifyClientsAboutProcessedAction(action, false, 'Max retries reached')
        }
      }
    } catch (error) {
      action.retryCount++
      console.log('Service Worker: Failed to process action', action.id, error)
      
      if (action.retryCount >= 3) {
        processedActions.push(action.id)
        notifyClientsAboutProcessedAction(action, false, error.message)
      }
    }
  }
  
  // Remove processed actions from queue
  actionQueue = actionQueue.filter(action => !processedActions.includes(action.id))
  
  if (processedActions.length > 0) {
    await storeActionQueue()
  }
}

// Notify clients about queued actions
function notifyClientsAboutQueuedAction(action) {
  self.clients.matchAll().then(clients => {
    clients.forEach(client => {
      client.postMessage({
        type: 'ACTION_QUEUED',
        action: {
          id: action.id,
          method: action.method,
          url: action.url,
          timestamp: action.timestamp
        }
      })
    })
  })
}

// Notify clients about processed actions
function notifyClientsAboutProcessedAction(action, success, error) {
  self.clients.matchAll().then(clients => {
    clients.forEach(client => {
      client.postMessage({
        type: 'ACTION_PROCESSED',
        action: {
          id: action.id,
          method: action.method,
          url: action.url,
          success,
          error
        }
      })
    })
  })
}

// Listen for online events to process queued actions
self.addEventListener('online', () => {
  console.log('Service Worker: Back online, processing queue')
  processActionQueue()
})

// Handle messages from clients
self.addEventListener('message', (event) => {
  const { type, data } = event.data
  
  switch (type) {
    case 'GET_QUEUE_STATUS':
      event.ports[0].postMessage({
        queueLength: actionQueue.length,
        actions: actionQueue.map(action => ({
          id: action.id,
          method: action.method,
          url: action.url,
          timestamp: action.timestamp,
          retryCount: action.retryCount
        }))
      })
      break
      
    case 'PROCESS_QUEUE':
      processActionQueue()
      break
      
    case 'CLEAR_QUEUE':
      actionQueue = []
      storeActionQueue()
      event.ports[0].postMessage({ success: true })
      break
  }
})

// Initialize service worker
loadActionQueue().then(() => {
  console.log('Service Worker: Initialized')
})