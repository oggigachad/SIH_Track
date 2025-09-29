// Enhanced button functionality utilities

export interface NotificationMessage {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message: string
  timestamp: Date
  read: boolean
}

// Simple notification system
let notifications: NotificationMessage[] = [
  // Add some initial notifications for testing
  {
    id: '1',
    type: 'info',
    title: 'System Started',
    message: 'Railway Management System is now online',
    timestamp: new Date(Date.now() - 10 * 60 * 1000),
    read: false
  },
  {
    id: '2',
    type: 'warning',
    title: 'QR Scanner Alert',
    message: 'Camera permission required for QR scanning functionality',
    timestamp: new Date(Date.now() - 5 * 60 * 1000),
    read: false
  },
  {
    id: '3',
    type: 'success',
    title: 'Data Sync Complete',
    message: 'Successfully synchronized 150 records with the central database',
    timestamp: new Date(Date.now() - 2 * 60 * 1000),
    read: true
  },
  {
    id: '4',
    type: 'error',
    title: 'Receipt Verification Failed',
    message: 'Receipt ID RCP-001 could not be verified due to invalid signature',
    timestamp: new Date(Date.now() - 30 * 1000),
    read: false
  },
  {
    id: '5',
    type: 'success',
    title: 'Maintenance Scheduled',
    message: 'Preventive maintenance for Asset A-123 scheduled for tomorrow',
    timestamp: new Date(Date.now() - 60 * 1000),
    read: false
  }
]
let notificationListeners: ((notifications: NotificationMessage[]) => void)[] = []

export function addNotification(notification: Omit<NotificationMessage, 'id' | 'timestamp' | 'read'>) {
  const newNotification: NotificationMessage = {
    ...notification,
    id: Date.now().toString(),
    timestamp: new Date(),
    read: false
  }
  
  notifications = [newNotification, ...notifications].slice(0, 50) // Keep only last 50
  notificationListeners.forEach(listener => listener(notifications))
}

export function getNotifications(): NotificationMessage[] {
  return notifications
}

export function markNotificationAsRead(id: string) {
  notifications = notifications.map(n => 
    n.id === id ? { ...n, read: true } : n
  )
  notificationListeners.forEach(listener => listener(notifications))
}

export function subscribeToNotifications(listener: (notifications: NotificationMessage[]) => void) {
  notificationListeners.push(listener)
  return () => {
    notificationListeners = notificationListeners.filter(l => l !== listener)
  }
}

// Enhanced button handlers
export const buttonHandlers = {
  // Generic success handler
  handleSuccess: (action: string, callback?: () => void) => {
    addNotification({
      type: 'success',
      title: 'Success',
      message: `${action} completed successfully`
    })
    callback?.()
  },

  // Generic error handler
  handleError: (action: string, error: string, callback?: () => void) => {
    addNotification({
      type: 'error',
      title: 'Error',
      message: `Failed to ${action}: ${error}`
    })
    callback?.()
  },

  // File upload handler
  handleFileUpload: (accept: string = '*/*', multiple: boolean = false): Promise<File[]> => {
    return new Promise((resolve, reject) => {
      const input = document.createElement('input')
      input.type = 'file'
      input.accept = accept
      input.multiple = multiple
      
      input.onchange = (e) => {
        const files = (e.target as HTMLInputElement).files
        if (files) {
          resolve(Array.from(files))
        } else {
          reject(new Error('No files selected'))
        }
      }
      
      input.oncancel = () => {
        reject(new Error('File selection cancelled'))
      }
      
      input.click()
    })
  },

  // Download handler
  handleDownload: (data: any, filename: string, type: string = 'application/json') => {
    try {
      let content: string
      if (type === 'application/json') {
        content = JSON.stringify(data, null, 2)
      } else if (type === 'text/csv') {
        // Simple CSV conversion for arrays of objects
        if (Array.isArray(data) && data.length > 0) {
          const headers = Object.keys(data[0]).join(',')
          const rows = data.map(row => Object.values(row).join(',')).join('\n')
          content = headers + '\n' + rows
        } else {
          content = 'No data available'
        }
      } else {
        content = String(data)
      }

      const blob = new Blob([content], { type })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = filename
      a.click()
      URL.revokeObjectURL(url)

      addNotification({
        type: 'success',
        title: 'Download Complete',
        message: `${filename} has been downloaded successfully`
      })
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Download Failed',
        message: `Failed to download ${filename}: ${error instanceof Error ? error.message : 'Unknown error'}`
      })
    }
  },

  // Copy to clipboard handler
  handleCopyToClipboard: async (text: string, label: string = 'Text') => {
    try {
      await navigator.clipboard.writeText(text)
      addNotification({
        type: 'success',
        title: 'Copied',
        message: `${label} copied to clipboard`
      })
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Copy Failed',
        message: `Failed to copy ${label} to clipboard`
      })
    }
  },

  // Print handler
  handlePrint: (element?: HTMLElement) => {
    try {
      if (element) {
        const printContents = element.innerHTML
        const originalContents = document.body.innerHTML
        document.body.innerHTML = printContents
        window.print()
        document.body.innerHTML = originalContents
        window.location.reload() // Reload to restore original content
      } else {
        window.print()
      }
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Print Failed',
        message: 'Failed to print document'
      })
    }
  },

  // Share handler
  handleShare: async (data: { title?: string; text?: string; url?: string }) => {
    try {
      if (navigator.share) {
        await navigator.share(data)
        addNotification({
          type: 'success',
          title: 'Shared',
          message: 'Content shared successfully'
        })
      } else {
        // Fallback: copy URL to clipboard
        if (data.url) {
          await navigator.clipboard.writeText(data.url)
          addNotification({
            type: 'info',
            title: 'Link Copied',
            message: 'Link copied to clipboard (sharing not supported)'
          })
        } else {
          throw new Error('Sharing not supported and no URL provided')
        }
      }
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Share Failed',
        message: 'Failed to share content'
      })
    }
  }
}

// Data validation utilities
export const validators = {
  email: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  },

  phone: (phone: string): boolean => {
    const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/
    return phoneRegex.test(phone.replace(/\s/g, ''))
  },

  required: (value: any): boolean => {
    return value !== null && value !== undefined && value !== ''
  },

  minLength: (value: string, min: number): boolean => {
    return value.length >= min
  },

  maxLength: (value: string, max: number): boolean => {
    return value.length <= max
  },

  numeric: (value: string): boolean => {
    return !isNaN(Number(value)) && !isNaN(parseFloat(value))
  },

  positiveNumber: (value: string): boolean => {
    const num = parseFloat(value)
    return !isNaN(num) && num > 0
  }
}

// Form utilities
export const formUtils = {
  validateForm: (data: Record<string, any>, rules: Record<string, any>): { isValid: boolean; errors: Record<string, string> } => {
    const errors: Record<string, string> = {}
    
    for (const [field, value] of Object.entries(data)) {
      const fieldRules = rules[field]
      if (!fieldRules) continue
      
      if (fieldRules.required && !validators.required(value)) {
        errors[field] = `${field} is required`
        continue
      }
      
      if (fieldRules.email && value && !validators.email(value)) {
        errors[field] = `${field} must be a valid email`
        continue
      }
      
      if (fieldRules.phone && value && !validators.phone(value)) {
        errors[field] = `${field} must be a valid phone number`
        continue
      }
      
      if (fieldRules.minLength && value && !validators.minLength(value, fieldRules.minLength)) {
        errors[field] = `${field} must be at least ${fieldRules.minLength} characters`
        continue
      }
      
      if (fieldRules.numeric && value && !validators.numeric(value)) {
        errors[field] = `${field} must be a valid number`
        continue
      }
    }
    
    return {
      isValid: Object.keys(errors).length === 0,
      errors
    }
  }
}

// Task management utilities
export interface Task {
  id: string
  title: string
  description?: string
  type: 'qr-scan' | 'batch-process' | 'inspection' | 'report' | 'maintenance'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  status: 'pending' | 'in-progress' | 'completed' | 'failed'
  assignedTo?: string
  createdAt: Date
  updatedAt: Date
  dueDate?: Date
}

let tasks: Task[] = [
  {
    id: '1',
    title: 'QR Code Validation Failed',
    description: 'Multiple QR codes failed validation in the Mumbai Central depot',
    type: 'qr-scan',
    priority: 'high',
    status: 'pending',
    assignedTo: 'inspector001',
    createdAt: new Date(Date.now() - 30 * 60 * 1000),
    updatedAt: new Date(Date.now() - 30 * 60 * 1000),
    dueDate: new Date(Date.now() + 2 * 60 * 60 * 1000)
  },
  {
    id: '2',
    title: 'Batch Processing Delayed',
    description: 'Batch RW-001-2024 processing is behind schedule',
    type: 'batch-process',
    priority: 'medium',
    status: 'in-progress',
    assignedTo: 'depot-manager',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 15 * 60 * 1000),
    dueDate: new Date(Date.now() + 4 * 60 * 60 * 1000)
  },
  {
    id: '3',
    title: 'Weekly Report Generation',
    description: 'Generate and distribute weekly performance reports',
    type: 'report',
    priority: 'low',
    status: 'completed',
    assignedTo: 'analytics-team',
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000)
  }
]

let taskListeners: ((tasks: Task[]) => void)[] = []

export function addTask(task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) {
  const newTask: Task = {
    ...task,
    id: crypto.randomUUID(),
    createdAt: new Date(),
    updatedAt: new Date()
  }
  
  tasks = [newTask, ...tasks]
  taskListeners.forEach(listener => listener(tasks))
  
  // Add notification for new task
  addNotification({
    type: 'info',
    title: 'New Task Created',
    message: `Task "${task.title}" has been assigned`
  })
}

export function updateTask(id: string, updates: Partial<Task>) {
  const oldTask = tasks.find(t => t.id === id)
  if (!oldTask) return
  
  tasks = tasks.map(t => 
    t.id === id 
      ? { ...t, ...updates, updatedAt: new Date() }
      : t
  )
  taskListeners.forEach(listener => listener(tasks))
  
  // Add notification for task status changes
  if (updates.status && updates.status !== oldTask.status) {
    const notificationType = updates.status === 'completed' ? 'success' : 
                           updates.status === 'failed' ? 'error' : 'info'
    
    addNotification({
      type: notificationType,
      title: 'Task Updated',
      message: `Task "${oldTask.title}" is now ${updates.status}`
    })
  }
}

export function getTasks(): Task[] {
  return tasks
}

export function getTasksByStatus(status: Task['status']): Task[] {
  return tasks.filter(t => t.status === status)
}

export function getTasksByPriority(priority: Task['priority']): Task[] {
  return tasks.filter(t => t.priority === priority)
}

export function subscribeToTasks(listener: (tasks: Task[]) => void) {
  taskListeners.push(listener)
  return () => {
    taskListeners = taskListeners.filter(l => l !== listener)
  }
}

// Alert system for critical events
export interface Alert {
  id: string
  level: 'info' | 'warning' | 'error' | 'critical'
  title: string
  message: string
  source: string
  timestamp: Date
  acknowledged: boolean
  resolvedAt?: Date
}

let alerts: Alert[] = [
  {
    id: '1',
    level: 'warning',
    title: 'Camera Access Denied',
    message: 'QR scanner cannot access camera. Please grant camera permissions.',
    source: 'qr-scanner',
    timestamp: new Date(Date.now() - 15 * 60 * 1000),
    acknowledged: false
  },
  {
    id: '2',
    level: 'error',
    title: 'Network Connection Failed',
    message: 'Unable to sync data with central server. Check network connectivity.',
    source: 'sync-service',
    timestamp: new Date(Date.now() - 10 * 60 * 1000),
    acknowledged: false
  },
  {
    id: '3',
    level: 'critical',
    title: 'System Overload',
    message: 'System resources are critically low. Performance may be affected.',
    source: 'system-monitor',
    timestamp: new Date(Date.now() - 5 * 60 * 1000),
    acknowledged: true,
    resolvedAt: new Date(Date.now() - 2 * 60 * 1000)
  }
]

let alertListeners: ((alerts: Alert[]) => void)[] = []

export function addAlert(alert: Omit<Alert, 'id' | 'timestamp' | 'acknowledged'>) {
  const newAlert: Alert = {
    ...alert,
    id: crypto.randomUUID(),
    timestamp: new Date(),
    acknowledged: false
  }
  
  alerts = [newAlert, ...alerts]
  alertListeners.forEach(listener => listener(alerts))
  
  // Also add as notification
  addNotification({
    type: alert.level === 'critical' ? 'error' : alert.level === 'error' ? 'error' : 'warning',
    title: alert.title,
    message: alert.message
  })
}

export function acknowledgeAlert(id: string) {
  alerts = alerts.map(a => 
    a.id === id 
      ? { ...a, acknowledged: true }
      : a
  )
  alertListeners.forEach(listener => listener(alerts))
}

export function resolveAlert(id: string) {
  alerts = alerts.map(a => 
    a.id === id 
      ? { ...a, acknowledged: true, resolvedAt: new Date() }
      : a
  )
  alertListeners.forEach(listener => listener(alerts))
}

export function getAlerts(): Alert[] {
  return alerts
}

export function getUnacknowledgedAlerts(): Alert[] {
  return alerts.filter(a => !a.acknowledged)
}

export function getCriticalAlerts(): Alert[] {
  return alerts.filter(a => a.level === 'critical' && !a.resolvedAt)
}

export function subscribeToAlerts(listener: (alerts: Alert[]) => void) {
  alertListeners.push(listener)
  return () => {
    alertListeners = alertListeners.filter(l => l !== listener)
  }
}
