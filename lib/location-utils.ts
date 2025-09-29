// Location utility functions for sharing location data across components

export interface LocationData {
  latitude: number
  longitude: number
  address?: string
  timestamp?: Date
}

export interface LocationPermission {
  granted: boolean
  denied: boolean
  timestamp: Date
}

// Get stored location from localStorage
export function getStoredLocation(): LocationData | null {
  try {
    const stored = localStorage.getItem('userLocation')
    if (stored) {
      const location = JSON.parse(stored)
      return {
        ...location,
        timestamp: location.timestamp ? new Date(location.timestamp) : new Date()
      }
    }
  } catch (error) {
    console.error('Failed to get stored location:', error)
  }
  return null
}

// Store location in localStorage
export function storeLocation(location: LocationData): void {
  try {
    const locationWithTimestamp = {
      ...location,
      timestamp: new Date()
    }
    localStorage.setItem('userLocation', JSON.stringify(locationWithTimestamp))
  } catch (error) {
    console.error('Failed to store location:', error)
  }
}

// Check if location permission was denied
export function isLocationDenied(): boolean {
  try {
    return localStorage.getItem('locationDenied') === 'true'
  } catch (error) {
    return false
  }
}

// Get current location using Geolocation API
export function getCurrentLocation(): Promise<LocationData> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported'))
      return
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const locationData: LocationData = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          timestamp: new Date()
        }

        try {
          // Try to get address using reverse geocoding
          const address = await reverseGeocode(locationData.latitude, locationData.longitude)
          locationData.address = address
        } catch (error) {
          console.warn('Reverse geocoding failed:', error)
        }

        // Store the location
        storeLocation(locationData)
        resolve(locationData)
      },
      (error) => {
        reject(error)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5 minutes
      }
    )
  })
}

// Reverse geocoding to get address from coordinates
export async function reverseGeocode(lat: number, lng: number): Promise<string> {
  try {
    const response = await fetch(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`
    )
    
    if (!response.ok) {
      throw new Error('Failed to fetch address')
    }
    
    const data = await response.json()
    
    // Construct a readable address
    const parts = []
    if (data.locality) parts.push(data.locality)
    if (data.city) parts.push(data.city)
    if (data.principalSubdivision) parts.push(data.principalSubdivision)
    if (data.countryName) parts.push(data.countryName)
    
    return parts.join(', ') || 'Address not available'
  } catch (error) {
    console.error('Reverse geocoding failed:', error)
    return 'Address not available'
  }
}

// Calculate distance between two coordinates (in km)
export function calculateDistance(
  lat1: number, 
  lng1: number, 
  lat2: number, 
  lng2: number
): number {
  const R = 6371 // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLng = (lng2 - lng1) * Math.PI / 180
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLng/2) * Math.sin(dLng/2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
  return R * c
}

// Format location for display
export function formatLocation(location: LocationData): string {
  if (location.address) {
    return location.address
  }
  return `${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}`
}

// Check if location is stale (older than specified minutes)
export function isLocationStale(location: LocationData, staleMinutes: number = 30): boolean {
  if (!location.timestamp) return true
  const now = new Date()
  const diff = now.getTime() - new Date(location.timestamp).getTime()
  return diff > (staleMinutes * 60 * 1000)
}