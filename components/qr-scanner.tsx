"use client"

import { useState, useRef, useEffect, useCallback } from 'react'
import jsQR from 'jsqr'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Camera, 
  Upload, 
  Zap, 
  ZapOff, 
  RotateCcw, 
  ScanLine,
  CheckCircle,
  AlertCircle,
  FileText,
  Eye,
  X
} from 'lucide-react'

// Enhanced QR code detection using jsQR library
const detectQRCodeFromCanvas = (canvas: HTMLCanvasElement): string | null => {
  const ctx = canvas.getContext('2d')
  if (!ctx) return null

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
  
  try {
    // Try with different inversion settings for better detection
    let code = jsQR(imageData.data, imageData.width, imageData.height, {
      inversionAttempts: "dontInvert",
    })
    
    // If not found, try with inversion
    if (!code) {
      code = jsQR(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: "attemptBoth",
      })
    }
    
    // If still not found, try with only invert
    if (!code) {
      code = jsQR(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: "invertFirst",
      })
    }
    
    return code?.data || null
  } catch (error) {
    console.error('QR detection error:', error)
    return null
  }
}

interface QRScannerProps {
  onScan?: (data: string) => void
  onError?: (error: string) => void
}

export default function QRScanner({ onScan, onError }: QRScannerProps) {
  const [isScanning, setIsScanning] = useState(false)
  const [hasCamera, setHasCamera] = useState(false)
  const [cameraError, setCameraError] = useState<string | null>(null)
  const [scanResult, setScanResult] = useState<string | null>(null)
  const [scanHistory, setScanHistory] = useState<Array<{
    data: string
    timestamp: Date
    method: 'camera' | 'file'
    type?: string
    info?: any
  }>>([])
  const [flashEnabled, setFlashEnabled] = useState(false)
  
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const scanIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Check camera availability
  useEffect(() => {
    const checkCamera = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices()
        const hasVideoInput = devices.some(device => device.kind === 'videoinput')
        setHasCamera(hasVideoInput)
      } catch (error) {
        setHasCamera(false)
        setCameraError('Camera access not available')
      }
    }
    
    checkCamera()
  }, [])

  const startCamera = async () => {
    try {
      setCameraError(null)
      
      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: 'environment', // Prefer rear camera
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        }
      }

      if (flashEnabled) {
        // @ts-expect-error - torch is not in the TypeScript definitions but may be supported
        constraints.video.torch = true
      }

      const stream = await navigator.mediaDevices.getUserMedia(constraints)
      streamRef.current = stream
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        videoRef.current.play()
        setIsScanning(true)
        startScanning()
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to access camera'
      setCameraError(errorMessage)
      onError?.(errorMessage)
    }
  }

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
    
    if (scanIntervalRef.current) {
      clearInterval(scanIntervalRef.current)
      scanIntervalRef.current = null
    }
    
    setIsScanning(false)
    setFlashEnabled(false)
  }

  const startScanning = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return

    scanIntervalRef.current = setInterval(() => {
      const video = videoRef.current
      const canvas = canvasRef.current
      
      if (!video || !canvas || video.readyState !== video.HAVE_ENOUGH_DATA) {
        return
      }

      const ctx = canvas.getContext('2d')
      if (!ctx) return

      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
      
      const qrData = detectQRCodeFromCanvas(canvas)
      if (qrData) {
        handleScanResult(qrData, 'camera')
      }
    }, 100) // Scan every 100ms
  }, [])

  // Validate QR code format
  const validateQRCode = (data: string): { valid: boolean; type?: string; info?: any } => {
    try {
      // Check for Railway QR format (VEND-FITG-1234567890 format)
      const railwayQRPattern = /^[A-Z]{3,4}-[A-Z]{3,4}-\d{10}$/
      if (railwayQRPattern.test(data)) {
        const parts = data.split('-')
        return {
          valid: true,
          type: 'railway-qr',
          info: {
            vendorId: parts[0],
            fittingType: parts[1],
            serialNumber: parts[2]
          }
        }
      }
      
      // Check for Railway Data Matrix format (legacy support)
      if (data.startsWith('RAILWAY-DM:')) {
        const parts = data.split(':')
        if (parts.length >= 6) {
          return {
            valid: true,
            type: 'railway-datamatrix',
            info: {
              batchNumber: parts[1],
              productName: parts[2],
              vendorId: parts[3],
              manufacturingDate: parts[4],
              quantity: parts[5]
            }
          }
        }
      }
      
      // Check for JSON format (batch data)
      try {
        const parsed = JSON.parse(data)
        if (parsed.batchId && parsed.batchNumber && parsed.productName) {
          return {
            valid: true,
            type: 'batch-data',
            info: parsed
          }
        }
        
        // Check for QR generator format
        if (parsed.vendor && parsed.fitting && parsed.serial) {
          return {
            valid: true,
            type: 'qr-generator',
            info: parsed
          }
        }
      } catch (jsonError) {
        // Not JSON, continue with other checks
      }
      
      // Accept any reasonably formatted QR code for broader compatibility
      if (data.length >= 3 && data.length <= 200) {
        return {
          valid: true,
          type: 'generic-qr',
          info: { rawData: data }
        }
      }
      
      return { valid: false }
    } catch {
      return { valid: false }
    }
  }

  // Hide sensitive information from display
  const sanitizeDisplayData = (data: string): string => {
    // Remove IP addresses
    const ipRegex = /\b(?:[0-9]{1,3}\.){3}[0-9]{1,3}\b/g
    let sanitized = data.replace(ipRegex, '***.***.***')
    
    // Remove URLs with IP addresses
    const urlIpRegex = /https?:\/\/(?:[0-9]{1,3}\.){3}[0-9]{1,3}(?::[0-9]+)?/g
    sanitized = sanitized.replace(urlIpRegex, 'http://***.***.***')
    
    return sanitized
  }

  const handleScanResult = (data: string, method: 'camera' | 'file') => {
    const validation = validateQRCode(data)
    
    if (!validation.valid) {
      onError?.('Invalid QR code format. Please scan a valid QR code.')
      return
    }
    
    const sanitizedData = sanitizeDisplayData(data)
    setScanResult(sanitizedData)
    setScanHistory(prev => [{
      data: sanitizedData,
      timestamp: new Date(),
      method,
      type: validation.type,
      info: validation.info
    }, ...prev.slice(0, 9)]) // Keep last 10 scans
    
    onScan?.(data) // Pass original data to callback
    
    // Auto-stop camera after successful scan
    if (method === 'camera') {
      setTimeout(stopCamera, 1000)
    }
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Reset input value to allow re-uploading same file
    event.target.value = ''

    // Validate file type
    if (!file.type.startsWith('image/')) {
      onError?.('Please select an image file (PNG, JPEG, etc.)')
      addToHistory('Invalid file type', 'File upload rejected: Not an image file', false)
      return
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      onError?.('Image file is too large. Please select a file smaller than 10MB.')
      addToHistory('File too large', 'File upload rejected: File exceeds 10MB limit', false)
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new Image()
      img.onload = () => {
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext('2d')
        if (!ctx) return

        // Set canvas size with max dimensions for performance
        const maxDimension = 1000
        let { width, height } = img
        
        if (width > maxDimension || height > maxDimension) {
          const ratio = Math.min(maxDimension / width, maxDimension / height)
          width *= ratio
          height *= ratio
        }
        
        canvas.width = width
        canvas.height = height
        ctx.drawImage(img, 0, 0, width, height)
        
        // Try to detect QR code
        const qrData = detectQRCodeFromCanvas(canvas)
        if (qrData) {
          handleScanResult(qrData, 'file')
        } else {
          // Image uploaded but no QR code found - add to history as rejected
          const fileName = file.name || 'Unknown file'
          onError?.(`No QR code detected in ${fileName}. Please upload an image containing a valid QR code.`)
          addToHistory('No QR code found', `File upload rejected: ${fileName} - No QR code detected`, false)
        }
      }
      
      img.onerror = () => {
        onError?.('Failed to load image. Please try a different file.')
        addToHistory('Image load error', 'File upload rejected: Failed to load image', false)
      }
      
      img.src = e.target?.result as string
    }
    
    reader.onerror = () => {
      onError?.('Failed to read file. Please try again.')
      addToHistory('File read error', 'File upload rejected: Failed to read file', false)
    }
    
    reader.readAsDataURL(file)
  }

  const toggleFlash = async () => {
    if (!streamRef.current) return

    try {
      const track = streamRef.current.getVideoTracks()[0]
      const capabilities = track.getCapabilities?.() as MediaTrackCapabilities & { torch?: boolean }
      
      if (capabilities?.torch) {
        await track.applyConstraints({
          // @ts-expect-error - torch constraint not in TypeScript definitions
          advanced: [{ torch: !flashEnabled }]
        })
        setFlashEnabled(!flashEnabled)
      } else {
        onError?.('Flash not supported on this device')
      }
    } catch (error) {
      onError?.('Failed to toggle flash')
    }
  }

  const clearResults = () => {
    setScanResult(null)
    setScanHistory([])
  }

  // Helper function to add items to history
  const addToHistory = (title: string, details: string, success: boolean) => {
    const historyItem = {
      data: title,
      timestamp: new Date(),
      method: 'file' as const,
      type: success ? 'qr-scan' : 'error',
      info: { details, success }
    }
    setScanHistory(prev => [historyItem, ...prev.slice(0, 9)])
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ScanLine className="h-5 w-5" />
            QR Code Scanner
          </CardTitle>
          <CardDescription>
            Scan QR codes using your device camera or upload an image file
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {cameraError && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{cameraError}</AlertDescription>
            </Alert>
          )}
          
          {/* Camera Controls */}
          <div className="flex flex-wrap gap-2">
            {hasCamera && !isScanning && (
              <Button onClick={startCamera} className="flex-1 sm:flex-none">
                <Camera className="h-4 w-4 mr-2" />
                Start Camera
              </Button>
            )}
            
            {isScanning && (
              <>
                <Button onClick={stopCamera} variant="destructive" className="flex-1 sm:flex-none">
                  <X className="h-4 w-4 mr-2" />
                  Stop Scanning
                </Button>
                
                <Button 
                  onClick={toggleFlash} 
                  variant="outline"
                  className="flex-1 sm:flex-none"
                >
                  {flashEnabled ? (
                    <><Zap className="h-4 w-4 mr-2" />Flash On</>
                  ) : (
                    <><ZapOff className="h-4 w-4 mr-2" />Flash Off</>
                  )}
                </Button>
              </>
            )}
            
            <Button 
              onClick={() => fileInputRef.current?.click()} 
              variant="outline"
              className="flex-1 sm:flex-none"
            >
              <Upload className="h-4 w-4 mr-2" />
              Upload Image
            </Button>
            
            {(scanResult || scanHistory.length > 0) && (
              <Button onClick={clearResults} variant="outline" size="sm">
                <RotateCcw className="h-4 w-4 mr-2" />
                Clear
              </Button>
            )}
          </div>

          {/* Camera View */}
          <div className="relative">
            <video 
              ref={videoRef}
              className={`w-full rounded-lg ${isScanning ? 'block' : 'hidden'}`}
              style={{ maxHeight: '400px' }}
              playsInline
              muted
            />
            
            {isScanning && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="border-2 border-white border-dashed w-48 h-48 rounded-lg animate-pulse">
                  <div className="absolute -top-1 -left-1 w-6 h-6 border-t-2 border-l-2 border-blue-500"></div>
                  <div className="absolute -top-1 -right-1 w-6 h-6 border-t-2 border-r-2 border-blue-500"></div>
                  <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-2 border-l-2 border-blue-500"></div>
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-2 border-r-2 border-blue-500"></div>
                </div>
              </div>
            )}

            {!isScanning && !hasCamera && (
              <div className="bg-gray-100 rounded-lg p-8 text-center">
                <Camera className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Camera not available</p>
                <p className="text-sm text-gray-500">Please use the file upload option</p>
              </div>
            )}

            {!isScanning && hasCamera && (
              <div className="bg-gray-100 rounded-lg p-8 text-center">
                <ScanLine className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Ready to scan</p>
                <p className="text-sm text-gray-500">Click &ldquo;Start Camera&rdquo; to begin scanning</p>
              </div>
            )}
          </div>

          {/* Hidden canvas for image processing */}
          <canvas ref={canvasRef} className="hidden" />
          
          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />
        </CardContent>
      </Card>

      {/* Scan Results */}
      {scanResult && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              Scan Result
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="font-mono text-sm break-all">{scanResult}</div>
            </div>
            <div className="flex gap-2 mt-4">
              <Button size="sm" variant="outline">
                <Eye className="h-4 w-4 mr-2" />
                View Details
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => navigator.clipboard.writeText(scanResult)}
              >
                Copy Data
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Scan History */}
      {scanHistory.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Scan History
            </CardTitle>
            <CardDescription>
              Recent scans ({scanHistory.length}/10)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {scanHistory.map((scan, index) => (
                <div key={index} className="flex items-center justify-between p-3 border border-border rounded-lg">
                  <div className="flex-1 min-w-0">
                    <div className="font-mono text-sm truncate">{scan.data}</div>
                    <div className="text-xs text-muted-foreground">
                      {scan.timestamp.toLocaleString()} • 
                      <Badge variant="secondary" className="ml-1">
                        {scan.method === 'camera' ? 'Camera' : 'File'}
                      </Badge>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => navigator.clipboard.writeText(scan.data)}
                  >
                    Copy
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}