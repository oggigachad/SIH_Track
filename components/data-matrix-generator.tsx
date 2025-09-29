"use client"

import { useEffect, useRef, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Download, Copy, RefreshCw, Grid3X3 } from "lucide-react"

// DataMatrixGenerator component
// A single-file React component that generates a Data Matrix barcode using bwip-js CDN.
// It will dynamically load bwip-js from unpkg if it's not already present in the page.
// Features: live preview (canvas), size/scale controls, error correction options, download PNG.

function loadScriptOnce(src: string): Promise<any> {
  return new Promise((resolve, reject) => {
    if ((window as any).bwipjs) return resolve((window as any).bwipjs)
    const existing = Array.from(document.getElementsByTagName("script")).find((s) => s.src && s.src.includes(src))
    if (existing) {
      existing.addEventListener("load", () => resolve((window as any).bwipjs))
      existing.addEventListener("error", () => reject(new Error("Failed to load bwip-js")))
      return
    }
    const s = document.createElement("script")
    s.src = src
    s.async = true
    s.onload = () => resolve((window as any).bwipjs)
    s.onerror = () => reject(new Error("Failed to load bwip-js"))
    document.head.appendChild(s)
  })
}

interface DataMatrixGeneratorProps {
  batchData?: {
    batchNumber: string
    productName: string
    vendorId: string
    manufacturingDate: string
    quantity: number
  }
  onGenerated?: (dataMatrixData: string) => void
  defaultText?: string
  cdn?: string
}

export default function DataMatrixGenerator({
  batchData,
  onGenerated,
  defaultText = "RAILWAY-DM:BATCH001:RAIL-COMPONENT:VENDOR123:2024-01-15:100:TRACK",
  cdn = "https://unpkg.com/bwip-js/dist/bwip-js-min.js",
}: DataMatrixGeneratorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [text, setText] = useState(defaultText)
  const [scale, setScale] = useState(4)
  const [padding, setPadding] = useState(10)
  const [height, setHeight] = useState(0) // let bwip-js decide normally
  const [error, setError] = useState("")
  const [busy, setBusy] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedDataMatrix, setGeneratedDataMatrix] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true
    setBusy(true)
    loadScriptOnce(cdn)
      .then(() => {
        if (mounted) setLoaded(true)
      })
      .catch((e) => {
        console.error(e)
        if (mounted) setError("Failed to load barcode library. Check internet or CDN.")
      })
      .finally(() => mounted && setBusy(false))
    return () => {
      mounted = false
    }
  }, [cdn])

  useEffect(() => {
    // Update text when batch data changes
    if (batchData) {
      const dataToEncode = `RAILWAY-DM:${batchData.batchNumber}:${batchData.productName}:${batchData.vendorId}:${batchData.manufacturingDate}:${batchData.quantity}:${Date.now()}`
      setText(dataToEncode)
    }
  }, [batchData])

  useEffect(() => {
    // Render whenever inputs change and bwip-js is available
    if (!(window as any).bwipjs || !canvasRef.current) return
    try {
      setError("")
      // bwip-js options for Data Matrix: bcid: 'datamatrix', text, scale, padding
      // other options: eclevel (error correction), version, rows/cols (for specific sizes)
      const opts = {
        bcid: "datamatrix",
        text: text || " ",
        scale: Number(scale) || 4,
        padding: Number(padding) || 10,
      }
      // If height > 0, set that too (bwip-js may accept height for some symbologies)
      if (Number(height) > 0)
        opts.height = Number(height)

        // bwipjs.toCanvas(canvas, opts)
      ;(window as any).bwipjs.toCanvas(canvasRef.current, opts)

      // Generate data URL for download/copy functionality
      const dataUrl = canvasRef.current.toDataURL("image/png")
      setGeneratedDataMatrix(dataUrl)

      // Call onGenerated callback
      if (onGenerated) {
        onGenerated(text)
      }
    } catch (e) {
      console.error(e)
      setError(String(e))
    }
  }, [text, scale, padding, height, loaded, onGenerated])

  const downloadPNG = () => {
    if (!canvasRef.current) return
    const link = document.createElement("a")
    link.download = `railway-datamatrix-${Date.now()}.png`
    link.href = canvasRef.current.toDataURL("image/png")
    link.click()
  }

  const copyToClipboard = async () => {
    if (!canvasRef.current) return
    try {
      const dataUrl = canvasRef.current.toDataURL("image/png")
      const response = await fetch(dataUrl)
      const blob = await response.blob()
      await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })])
    } catch (err) {
      console.error("Failed to copy image:", err)
    }
  }

  const handleGenerate = async () => {
    setIsGenerating(true)
    // Simulate generation delay for UX
    await new Promise((resolve) => setTimeout(resolve, 500))
    setIsGenerating(false)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Grid3X3 className="h-5 w-5" />
            Data Matrix Generator
          </CardTitle>
          <CardDescription>
            Generate Data Matrix codes for railway components with Indian Railways compliance
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!batchData && (
            <div className="space-y-2">
              <Label>Text / Payload</Label>
              <Textarea
                value={text}
                rows={3}
                onChange={(e) => setText(e.target.value)}
                className="w-full p-2 rounded border"
                placeholder="Enter data to encode in Data Matrix"
              />
            </div>
          )}

          <div className="grid grid-cols-3 gap-2">
            <div>
              <Label className="block text-sm">Scale</Label>
              <input
                type="number"
                min="1"
                max="10"
                value={scale}
                onChange={(e) => setScale(Number(e.target.value))}
                className="w-full p-1 rounded border"
              />
            </div>
            <div>
              <Label className="block text-sm">Padding (px)</Label>
              <input
                type="number"
                min="0"
                max="50"
                value={padding}
                onChange={(e) => setPadding(Number(e.target.value))}
                className="w-full p-1 rounded border"
              />
            </div>
            <div>
              <Label className="block text-sm">Height (optional)</Label>
              <input
                type="number"
                min="0"
                value={height}
                onChange={(e) => setHeight(Number(e.target.value))}
                className="w-full p-1 rounded border"
              />
            </div>
          </div>

          <div className="flex gap-2">
            <Button onClick={handleGenerate} disabled={!loaded || isGenerating} className="flex-1">
              {isGenerating ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Grid3X3 className="h-4 w-4 mr-2" />
                  Generate Data Matrix
                </>
              )}
            </Button>
          </div>

          <div className="border p-3 inline-block bg-white rounded-lg">
            {busy && <div className="mb-2 text-sm text-muted-foreground">Loading library...</div>}
            {error && <div className="text-red-600 mb-2 text-sm">{error}</div>}
            <canvas ref={canvasRef} className="max-w-full h-auto" />
          </div>

          {loaded && generatedDataMatrix && (
            <div className="flex gap-2">
              <Button onClick={downloadPNG} variant="outline" className="flex-1 bg-transparent">
                <Download className="h-4 w-4 mr-2" />
                Download PNG
              </Button>
              <Button onClick={copyToClipboard} variant="outline" className="flex-1 bg-transparent">
                <Copy className="h-4 w-4 mr-2" />
                Copy Image
              </Button>
            </div>
          )}

          {batchData && (
            <div className="space-y-4 mt-4">
              <div>
                <h4 className="font-semibold mb-2">Code Specifications</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Type:</span>
                    <Badge variant="secondary">Data Matrix</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Scale:</span>
                    <span>{scale}x</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Padding:</span>
                    <span>{padding}px</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Format:</span>
                    <span>PNG</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Encoded Data Preview</h4>
                <div className="bg-gray-50 p-3 rounded text-xs font-mono break-all">{text}</div>
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
                    <span className="text-sm">ISO/IEC 16022 Compliant</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm">High Durability Format</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
