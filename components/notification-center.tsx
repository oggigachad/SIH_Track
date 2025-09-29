"use client"

import React, { useState, useEffect } from 'react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { X, CheckCircle, AlertTriangle, AlertCircle, Info } from 'lucide-react'
import { getNotifications, markNotificationAsRead, subscribeToNotifications, type NotificationMessage } from '@/lib/button-utils'

interface NotificationCenterProps {
  className?: string
}

export default function NotificationCenter({ className = '' }: NotificationCenterProps) {
  const [notifications, setNotifications] = useState<NotificationMessage[]>([])
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Load initial notifications
    setNotifications(getNotifications())

    // Subscribe to notification updates
    const unsubscribe = subscribeToNotifications((newNotifications) => {
      setNotifications(newNotifications)
      if (newNotifications.some(n => !n.read)) {
        setIsVisible(true)
      }
    })

    return unsubscribe
  }, [])

  const getIcon = (type: NotificationMessage['type']) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      case 'info':
        return <Info className="h-4 w-4 text-blue-500" />
      default:
        return <Info className="h-4 w-4 text-blue-500" />
    }
  }

  const unreadCount = notifications.filter(n => !n.read).length

  if (!isVisible || notifications.length === 0) {
    return null
  }

  return (
    <div className={`fixed top-4 right-4 z-50 max-w-md space-y-2 ${className}`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-foreground">Notifications</h3>
          {unreadCount > 0 && (
            <Badge variant="destructive" className="text-xs">
              {unreadCount}
            </Badge>
          )}
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsVisible(false)}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-2 max-h-96 overflow-y-auto">
        {notifications.slice(0, 5).map((notification) => (
          <Alert
            key={notification.id}
            className={`${
              !notification.read 
                ? 'border-primary bg-primary/5' 
                : 'border-border opacity-75'
            } relative`}
          >
            <div className="flex items-start gap-2">
              {getIcon(notification.type)}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-sm">{notification.title}</h4>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={() => markNotificationAsRead(notification.id)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
                <AlertDescription className="text-xs mt-1">
                  {notification.message}
                </AlertDescription>
                <div className="text-xs text-muted-foreground mt-1">
                  {notification.timestamp.toLocaleTimeString()}
                </div>
              </div>
            </div>
          </Alert>
        ))}
      </div>

      {notifications.length > 5 && (
        <div className="text-center">
          <Button variant="ghost" size="sm" className="text-xs">
            View all {notifications.length} notifications
          </Button>
        </div>
      )}
    </div>
  )
}

// Simple hook for showing notifications from components
export function useNotifications() {
  const [notifications, setNotifications] = useState<NotificationMessage[]>([])

  useEffect(() => {
    setNotifications(getNotifications())
    
    const unsubscribe = subscribeToNotifications((newNotifications) => {
      setNotifications(newNotifications)
    })

    return unsubscribe
  }, [])

  return {
    notifications,
    unreadCount: notifications.filter(n => !n.read).length
  }
}