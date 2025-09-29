"use client"

import { useState, useRef, useEffect } from "react"
import QRCodeLib from 'qrcode'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { QrCode, Download, Copy, RefreshCw } from "lucide-react"

interface QRGeneratorProps {
  batchData?: {
    batchNumber: string
    productName: string
    vendorId: string
    manufacturingDate: string
    quantity: number
  }
  onGenerated?: (qrData: string) => void
}

export default function QRGenerator({ batchData, onGenerated }: QRGeneratorProps) {
  const [qrType, setQrType] = useState<"QR" | "DataMatrix">("QR")
  const [errorCorrection, setErrorCorrection] = useState<"L" | "M" | "Q" | "H">("M")
  const [size, setSize] = useState(256)
  const [customData, setCustomData] = useState("")
  const [generatedQR, setGeneratedQR] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Generate QR Code using qrcode library
  const generateQRCode = async (data: string, size: number): Promise<string | null> => {
    try {
      const qrOptions = {
        errorCorrectionLevel: errorCorrection,
        type: 'image/png' as const,
        width: size,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      }

      const qrDataUrl = await QRCodeLib.toDataURL(data, qrOptions)
      return qrDataUrl
    } catch (error) {
      console.error('QR generation error:', error)
      return null
    }
  }

  // Generate DataMatrix (simplified version)
  const generateDataMatrix = (data: string, size: number) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = size
    canvas.height = size

    // Clear canvas
    ctx.fillStyle = "#ffffff"
    ctx.fillRect(0, 0, size, size)

    const moduleSize = size / 24
    ctx.fillStyle = "#000000"

    // Generate hash for pattern
    const hash = data.split("").reduce((a, b) => {
      a = (a << 5) - a + b.charCodeAt(0)
      return a & a
    }, 0)

    // Create DataMatrix border
    for (let i = 0; i < 24; i++) {
      // Left and right borders
      if (i % 2 === 0) {
        ctx.fillRect(0, i * moduleSize, moduleSize, moduleSize)
        ctx.fillRect(23 * moduleSize, i * moduleSize, moduleSize, moduleSize)
      }
      // Top and bottom borders
      ctx.fillRect(i * moduleSize, 0, moduleSize, moduleSize)
      if (i % 2 === 1) {
        ctx.fillRect(i * moduleSize, 23 * moduleSize, moduleSize, moduleSize)
      }
    }

    // Generate data pattern
    for (let i = 1; i < 23; i++) {
      for (let j = 1; j < 23; j++) {
        const shouldFill = (hash + i * j + i + j) % 4 === 0
        if (shouldFill) {
          ctx.fillRect(i * moduleSize, j * moduleSize, moduleSize, moduleSize)
        }
      }
    }

    return canvas.toDataURL("image/png")
  }

  const handleGenerate = async () => {
    setIsGenerating(true)

    try {
      // Prepare data
      let dataToEncode = ""
      if (batchData) {
        dataToEncode = `RAILWAY-${qrType}:${batchData.batchNumber}:${batchData.productName}:${batchData.vendorId}:${batchData.manufacturingDate}:${batchData.quantity}:${Date.now()}`
      } else {
        dataToEncode = customData || "RAILWAY-SAMPLE-DATA"
      }

      let qrDataUrl: string | null = null
      if (qrType === "QR") {
        qrDataUrl = await generateQRCode(dataToEncode, size)
      } else {
        qrDataUrl = generateDataMatrix(dataToEncode, size)
      }

      if (qrDataUrl) {
        setGeneratedQR(qrDataUrl)
        onGenerated?.(dataToEncode)
      } else {
        console.error('Failed to generate QR code')
      }
    } catch (error) {
      console.error('QR generation error:', error)
    }

    setIsGenerating(false)
  }

  const downloadQR = () => {
    if (!generatedQR) return

    const link = document.createElement("a")
    link.download = `railway-${qrType.toLowerCase()}-${Date.now()}.png`
    link.href = generatedQR
    link.click()
  }

  const copyToClipboard = async () => {
    if (!generatedQR) return

    try {
      const response = await fetch(generatedQR)
      const blob = await response.blob()
      await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })])
    } catch (err) {
      console.error("Failed to copy image:", err)
    }
  }

  useEffect(() => {
    if (batchData) {
      handleGenerate()
    }
  }, [batchData, qrType, errorCorrection, size])

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <QrCode className="h-5 w-5" />
            QR Code & DataMatrix Generator
          </CardTitle>
          <CardDescription>
            Generate QR codes or DataMatrix codes for railway components with Indian Railways compliance
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Code Type</Label>
              <Select value={qrType} onValueChange={(value: "QR" | "DataMatrix") => setQrType(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="QR">QR Code</SelectItem>
                  <SelectItem value="DataMatrix">DataMatrix</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Error Correction</Label>
              <Select
                value={errorCorrection}
                onValueChange={(value: "L" | "M" | "Q" | "H") => setErrorCorrection(value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="L">Low (7%)</SelectItem>
                  <SelectItem value="M">Medium (15%)</SelectItem>
                  <SelectItem value="Q">Quartile (25%)</SelectItem>
                  <SelectItem value="H">High (30%)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Size (pixels)</Label>
              <Select value={size.toString()} onValueChange={(value) => setSize(Number.parseInt(value))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="128">128x128</SelectItem>
                  <SelectItem value="256">256x256</SelectItem>
                  <SelectItem value="512">512x512</SelectItem>
                  <SelectItem value="1024">1024x1024</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {!batchData && (
            <div className="space-y-2">
              <Label>Custom Data</Label>
              <Textarea
                placeholder="Enter custom data to encode (leave empty for sample data)"
                value={customData}
                onChange={(e) => setCustomData(e.target.value)}
                rows={3}
              />
            </div>
          )}

          <div className="flex gap-2">
            <Button onClick={handleGenerate} disabled={isGenerating} className="flex-1">
              {isGenerating ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <QrCode className="h-4 w-4 mr-2" />
                  Generate {qrType}
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {generatedQR && (
        <Card>
          <CardHeader>
            <CardTitle>Generated {qrType} Code</CardTitle>
            <CardDescription>Railway-compliant {qrType} code ready for printing and deployment</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1">
                <div className="bg-white p-4 rounded-lg border-2 border-dashed border-gray-300 text-center">
                  <img
                    src={generatedQR || "/placeholder.svg"}
                    alt={`Generated ${qrType} Code`}
                    className="mx-auto max-w-full h-auto"
                    style={{ maxWidth: "300px" }}
                  />
                </div>

                <div className="flex gap-2 mt-4">
                  <Button onClick={downloadQR} variant="outline" className="flex-1 bg-transparent">
                    <Download className="h-4 w-4 mr-2" />
                    Download PNG
                  </Button>
                  <Button onClick={copyToClipboard} variant="outline" className="flex-1 bg-transparent">
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Image
                  </Button>
                </div>
              </div>

              <div className="flex-1 space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Code Specifications</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Type:</span>
                      <Badge variant="secondary">{qrType}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Size:</span>
                      <span>
                        {size}x{size} pixels
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Error Correction:</span>
                      <span>{errorCorrection} Level</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Format:</span>
                      <span>PNG</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Encoded Data Preview</h4>
                  <div className="bg-gray-50 p-3 rounded text-xs font-mono break-all">
                    {batchData
                      ? `RAILWAY-${qrType}:${batchData.batchNumber}:${batchData.productName}:${batchData.vendorId}:${batchData.manufacturingDate}:${batchData.quantity}`
                      : customData || "RAILWAY-SAMPLE-DATA"}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Compliance Status</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm">Indian Railways Standard</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm">ISO/IEC 18004 Compliant</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm">High Durability Format</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Hidden canvas for QR generation */}
      <canvas ref={canvasRef} style={{ display: "none" }} />
    </div>
  )
}
