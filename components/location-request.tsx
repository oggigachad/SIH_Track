"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { MapPin, AlertCircle, CheckCircle, Loader2 } from 'lucide-react'

interface LocationRequestProps {
  onLocationGranted: (location: { latitude: number; longitude: number; address?: string }) => void
  onLocationDenied: () => void
}

export default function LocationRequest({ onLocationGranted, onLocationDenied }: LocationRequestProps) {
  const [locationStatus, setLocationStatus] = useState<'requesting' | 'loading' | 'error' | 'denied' | null>(null)
  const [errorMessage, setErrorMessage] = useState<string>('')

  // Auto-request location on component mount
  useEffect(() => {
    requestLocation()
  }, [])

  const requestLocation = async () => {
    if (!navigator.geolocation) {
      setLocationStatus('error')
      setErrorMessage('Geolocation is not supported by this browser.')
      return
    }

    setLocationStatus('requesting')

    const options: PositionOptions = {
      enableHighAccuracy: true,
      timeout: 10000, // 10 seconds
      maximumAge: 300000 // 5 minutes
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        setLocationStatus('loading')
        
        const latitude = position.coords.latitude
        const longitude = position.coords.longitude
        
        try {
          // Reverse geocoding to get address
          const address = await getAddressFromCoordinates(latitude, longitude)
          
          onLocationGranted({
            latitude,
            longitude,
            address
          })
        } catch (error) {
          // If reverse geocoding fails, still pass the coordinates
          onLocationGranted({
            latitude,
            longitude,
            address: 'Address not available'
          })
        }
      },
      (error) => {
        let message = 'Failed to get your location. '
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            message = 'Location access was denied. Please enable location services to continue.'
            setLocationStatus('denied')
            break
          case error.POSITION_UNAVAILABLE:
            message = 'Location information is unavailable. Please try again.'
            setLocationStatus('error')
            break
          case error.TIMEOUT:
            message = 'Location request timed out. Please try again.'
            setLocationStatus('error')
            break
          default:
            message = 'An unknown error occurred while retrieving location.'
            setLocationStatus('error')
            break
        }
        
        setErrorMessage(message)
      },
      options
    )
  }

  const getAddressFromCoordinates = async (lat: number, lng: number): Promise<string> => {
    try {
      // Using a free reverse geocoding service
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

  const handleRetry = () => {
    setLocationStatus(null)
    setErrorMessage('')
    requestLocation()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[url('/railway-track-pattern.jpg')] opacity-5"></div>
      
      <Card className="w-full max-w-md mx-auto bg-background/95 backdrop-blur-sm border shadow-2xl relative z-10">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mb-4">
            <MapPin className="h-8 w-8 text-blue-500" />
          </div>
          <CardTitle className="text-2xl font-bold text-foreground">Location Access</CardTitle>
          <CardDescription className="text-muted-foreground">
            Track requires your location for enhanced security and service optimization
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {locationStatus === 'requesting' && (
            <div className="text-center space-y-4">
              <Loader2 className="h-8 w-8 animate-spin mx-auto text-blue-500" />
              <p className="text-sm text-muted-foreground">
                Requesting location access...
              </p>
            </div>
          )}

          {locationStatus === 'loading' && (
            <div className="text-center space-y-4">
              <Loader2 className="h-8 w-8 animate-spin mx-auto text-green-500" />
              <p className="text-sm text-muted-foreground">
                Processing location data...
              </p>
            </div>
          )}

          {(locationStatus === 'error' || locationStatus === 'denied') && (
            <Alert className="border-orange-200 dark:border-orange-800">
              <AlertCircle className="h-4 w-4 text-orange-600 dark:text-orange-400" />
              <AlertDescription className="text-orange-800 dark:text-orange-200">
                {errorMessage}
              </AlertDescription>
            </Alert>
          )}

          {!locationStatus && (
            <div className="space-y-4">
              <div className="bg-blue-50 dark:bg-blue-950/30 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">Why we need your location:</h3>
                <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                  <li>• Enhanced security and fraud prevention</li>
                  <li>• Accurate location-based service delivery</li>
                  <li>• Compliance with railway safety protocols</li>
                  <li>• Optimized nearby resource recommendations</li>
                </ul>
              </div>
            </div>
          )}

          <div className="flex flex-col gap-3">
            {(locationStatus === 'error' || locationStatus === 'denied') && (
              <Button onClick={handleRetry} className="w-full">
                <MapPin className="h-4 w-4 mr-2" />
                Try Again
              </Button>
            )}

            {!locationStatus && (
              <Button onClick={requestLocation} className="w-full">
                <MapPin className="h-4 w-4 mr-2" />
                Allow Location Access
              </Button>
            )}
          </div>

          <div className="text-center">
            <p className="text-xs text-muted-foreground">
              Location access is required to proceed. Your location data is encrypted and used solely for service enhancement. 
              You can change these permissions anytime in your browser settings.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}