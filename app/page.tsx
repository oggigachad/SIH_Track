"use client"

// Force dynamic rendering to avoid static generation issues with context
export const dynamic = 'force-dynamic'

import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { getDashboardRoute } from "@/lib/role-utils"
import AuthPage from "@/components/auth-page"
import LocationRequest from "@/components/location-request"

export default function RailwayQRSystem() {
  const router = useRouter()
  const { isAuthenticated, currentUser, login, loading } = useAuth()
  const [locationRequested, setLocationRequested] = useState(false)
  const [userLocation, setUserLocation] = useState<{
    latitude: number
    longitude: number
    address?: string
  } | null>(null)
  
  // Redirect authenticated users to their portal dashboard
  useEffect(() => {
    if (!loading && isAuthenticated && currentUser) {
      const dashboardRoute = getDashboardRoute(currentUser.role, currentUser.id)
      // Immediate redirect
      router.replace(dashboardRoute)
    }
  }, [isAuthenticated, currentUser, loading, router])
  
  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }
  
  // If authenticated, show loading while redirecting
  if (!loading && isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg text-muted-foreground">Redirecting to your portal...</p>
        </div>
      </div>
    )
  }

  // Handle location and authentication flow
  if (!isAuthenticated) {
    // Show location request first if not done yet
    if (!locationRequested) {
      return (
        <LocationRequest 
          onLocationGranted={(location) => {
            setUserLocation(location)
            setLocationRequested(true)
            // Store location in localStorage for use by other components
            localStorage.setItem('userLocation', JSON.stringify(location))
            console.log('Location granted:', location)
          }}
          onLocationDenied={() => {
            setLocationRequested(true)
            console.log('Location access denied')
            // Store that location was denied
            localStorage.setItem('locationDenied', 'true')
          }}
        />
      )
    }
    
    // Show auth page after location is requested
    return <AuthPage onLogin={login} />
  }

  // This should not be reached due to redirect logic above, but fallback to login
  return <AuthPage onLogin={login} />
}