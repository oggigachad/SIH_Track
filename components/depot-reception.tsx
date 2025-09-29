"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Slider } from "@/components/ui/slider"
import {
  QrCode,
  Package,
  CheckCircle,
  AlertTriangle,
  Camera,
  MapPin,
  Star,
  Clock,
  Upload,
  X,
  FileImage,
  Send,
  RotateCcw,
} from "lucide-react"
import QRScanner from "./qr-scanner"

interface ReceivedItem {
  id: string
  batchNumber: string
  productName: string
  vendor: string
  quantityReceived: number
  quantityExpected: number
  receivedDate: string
  qualityStatus: "passed" | "failed" | "pending"
  storageLocation: string
  damageReported: boolean
  inspector: string
  qualityScores: {
    surfaceFinish: number
    dimensions: number
    materialIntegrity: number
    overallCondition: number
  }
}

interface QualityAssessment {
  surfaceFinish: number[]
  dimensions: number[]
  materialIntegrity: number[]
  overallCondition: number[]
  notes: string
}

interface RejectionWorkflow {
  step: number
  reasonCode: string
  description: string
  supplierNotified: boolean
  replacementRequested: boolean
}

export default function DepotReception({ onBack }: { onBack: () => void }) {
  const [activeTab, setActiveTab] = useState("scanner")
  const [receivedItems, setReceivedItems] = useState<ReceivedItem[]>([
    {
      id: "1",
      batchNumber: "EC-2024-001",
      productName: "Elastic Clips",
      vendor: "RailTech Industries",
      quantityReceived: 50,
      quantityExpected: 50,
      receivedDate: "2024-01-25",
      qualityStatus: "passed",
      storageLocation: "A-12-B",
      damageReported: false,
      inspector: "Amit Sharma",
      qualityScores: { surfaceFinish: 9, dimensions: 8, materialIntegrity: 9, overallCondition: 8 },
    },
    {
      id: "2",
      batchNumber: "RP-2024-002",
      productName: "Rail Pads",
      vendor: "PadCorp Ltd",
      quantityReceived: 180,
      quantityExpected: 200,
      receivedDate: "2024-01-26",
      qualityStatus: "pending",
      storageLocation: "B-05-A",
      damageReported: true,
      inspector: "Priya Patel",
      qualityScores: { surfaceFinish: 6, dimensions: 7, materialIntegrity: 5, overallCondition: 6 },
    },
  ])

  const [scanResult, setScanResult] = useState<string>("")
  const [isScanning, setIsScanning] = useState(false)
  const [scanAnimation, setScanAnimation] = useState(false)
  const [scannedItemDetails, setScannedItemDetails] = useState<any>(null)

  const [qualityAssessment, setQualityAssessment] = useState<QualityAssessment>({
    surfaceFinish: [8],
    dimensions: [7],
    materialIntegrity: [9],
    overallCondition: [8],
    notes: "",
  })

  const [uploadedPhotos, setUploadedPhotos] = useState<File[]>([])
  const [rejectionWorkflow, setRejectionWorkflow] = useState<RejectionWorkflow>({
    step: 1,
    reasonCode: "",
    description: "",
    supplierNotified: false,
    replacementRequested: false,
  })

  const [receiptVerification, setReceiptVerification] = useState({
    batchNumber: "",
    quantityReceived: "",
    damageAssessment: [] as string[],
    inspectorNotes: "",
  })

  const simulateQRScan = () => {
    setIsScanning(true)
    setScanAnimation(true)
    setTimeout(() => {
      const mockData = {
        batchNumber: "LN-2024-003",
        productName: "Liners",
        vendor: "LineTech Corp",
        expectedQuantity: 100,
        manufacturingDate: "2024-01-20",
        expiryDate: "2029-01-20",
      }
      setScanResult(mockData.batchNumber)
      setScannedItemDetails(mockData)
      setReceiptVerification((prev) => ({ ...prev, batchNumber: mockData.batchNumber }))
      setIsScanning(false)
      setScanAnimation(false)
    }, 3000)
  }

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    setUploadedPhotos([...uploadedPhotos, ...files])
  }

  const removePhoto = (index: number) => {
    setUploadedPhotos(uploadedPhotos.filter((_, i) => i !== index))
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "passed":
        return "bg-green-500/10 text-green-400 border-green-500/20"
      case "failed":
        return "bg-red-500/10 text-red-400 border-red-500/20"
      case "pending":
        return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
      default:
        return "bg-gray-500/10 text-gray-400 border-gray-500/20"
    }
  }

  const getInventoryAlertColor = (percentage: number) => {
    if (percentage >= 80) return "text-green-400"
    if (percentage >= 50) return "text-yellow-400"
    return "text-red-400"
  }

  const damageOptions = [
    "Surface scratches",
    "Dents/deformation",
    "Corrosion",
    "Cracks",
    "Missing components",
    "Packaging damage",
    "Contamination",
    "Other",
  ]

  const rejectionReasons = [
    { code: "DIM001", description: "Dimensional deviation beyond tolerance" },
    { code: "MAT002", description: "Material composition non-compliance" },
    { code: "SUR003", description: "Surface finish below standard" },
    { code: "DAM004", description: "Physical damage during transport" },
    { code: "DOC005", description: "Documentation incomplete/incorrect" },
  ]

  const storageZones = [
    { zone: "A", capacity: 85, status: "adequate", color: "text-green-400" },
    { zone: "B", capacity: 92, status: "low", color: "text-yellow-400" },
    { zone: "C", capacity: 67, status: "adequate", color: "text-green-400" },
    { zone: "D", capacity: 95, status: "critical", color: "text-red-400" },
  ]

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" onClick={onBack}>
          ← Back to Dashboard
        </Button>
        <div>
          <h2 className="text-2xl font-bold text-foreground">Depot Reception & QA</h2>
          <p className="text-muted-foreground">
            Material receipt scanning, quality assessment, and inventory management
          </p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="scanner">Scanner</TabsTrigger>
          <TabsTrigger value="verification">Verification</TabsTrigger>
          <TabsTrigger value="quality">Quality Matrix</TabsTrigger>
          <TabsTrigger value="photos">Documentation</TabsTrigger>
          <TabsTrigger value="inventory">Inventory Grid</TabsTrigger>
          <TabsTrigger value="storage">Storage Map</TabsTrigger>
        </TabsList>

        <TabsContent value="scanner" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Real QR Scanner Interface */}
            <div className="space-y-6">
              <QRScanner 
                onScan={(data) => {
                  // Parse QR data and extract information
                  const mockData = {
                    batchNumber: data.includes('RAILWAY') ? data.split(':')[1] || data : data,
                    productName: "Railway Component",
                    vendor: "Industrial Supplier",
                    expectedQuantity: 100,
                    manufacturingDate: new Date().toISOString().split('T')[0],
                    expiryDate: new Date(Date.now() + 5 * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                  }
                  setScanResult(data)
                  setScannedItemDetails(mockData)
                  setReceiptVerification((prev) => ({ ...prev, batchNumber: mockData.batchNumber }))
                  setActiveTab("verification")
                }}
                onError={(error) => {
                  console.error('QR Scanner error:', error)
                }}
              />
              
              {/* Scan Success Animation */}
              {scannedItemDetails && (
                <Card>
                  <CardContent className="p-4">
                    <div className="space-y-3 p-4 bg-green-500/10 border border-green-500/20 rounded-lg animate-in slide-in-from-bottom">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-green-400" />
                        <h4 className="font-medium text-green-400">Product Details Decoded</h4>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <p className="text-muted-foreground">Batch Number</p>
                          <p className="font-medium text-foreground">{scannedItemDetails.batchNumber}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Product</p>
                          <p className="font-medium text-foreground">{scannedItemDetails.productName}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Expected Qty</p>
                          <p className="font-medium text-foreground">{scannedItemDetails.expectedQuantity} units</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Vendor</p>
                          <p className="font-medium text-foreground">{scannedItemDetails.vendor}</p>
                        </div>
                      </div>
                      <Button size="sm" className="w-full" onClick={() => setActiveTab("verification")}>
                        Proceed to Verification
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Recent Receipts */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Receipts</CardTitle>
                <CardDescription>Latest material receipts and their status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {receivedItems.slice(0, 4).map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-3 border border-border rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 bg-primary/10 rounded-lg flex items-center justify-center">
                          <Package className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground text-sm">{item.batchNumber}</p>
                          <p className="text-xs text-muted-foreground">{item.productName}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge className={getStatusColor(item.qualityStatus)} size="sm">
                          {item.qualityStatus}
                        </Badge>
                        <p className="text-xs text-muted-foreground mt-1">{item.receivedDate}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="verification" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                Receipt Verification Form
              </CardTitle>
              <CardDescription>Auto-populated fields from QR scan with manual verification</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Batch Number</Label>
                  <Input
                    value={receiptVerification.batchNumber}
                    onChange={(e) => setReceiptVerification((prev) => ({ ...prev, batchNumber: e.target.value }))}
                    className="bg-muted/30"
                    placeholder="Auto-filled from QR scan"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Quantity Received</Label>
                  <Input
                    type="number"
                    value={receiptVerification.quantityReceived}
                    onChange={(e) => setReceiptVerification((prev) => ({ ...prev, quantityReceived: e.target.value }))}
                    placeholder="Enter actual quantity received"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <Label>Damage Assessment Checkboxes</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {damageOptions.map((option) => (
                    <label key={option} className="flex items-center space-x-2 text-sm">
                      <input
                        type="checkbox"
                        checked={receiptVerification.damageAssessment.includes(option)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setReceiptVerification((prev) => ({
                              ...prev,
                              damageAssessment: [...prev.damageAssessment, option],
                            }))
                          } else {
                            setReceiptVerification((prev) => ({
                              ...prev,
                              damageAssessment: prev.damageAssessment.filter((item) => item !== option),
                            }))
                          }
                        }}
                        className="rounded border-border"
                      />
                      <span className="text-foreground">{option}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Inspector Notes</Label>
                <Textarea
                  value={receiptVerification.inspectorNotes}
                  onChange={(e) => setReceiptVerification((prev) => ({ ...prev, inspectorNotes: e.target.value }))}
                  placeholder="Enter detailed inspection notes and observations"
                  rows={3}
                />
              </div>

              <div className="flex gap-2">
                <Button className="flex-1">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Verify Receipt
                </Button>
                <Button variant="outline" className="flex-1 bg-transparent" onClick={() => setActiveTab("quality")}>
                  Proceed to Quality Assessment
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="quality" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5 text-yellow-500" />
                Quality Assessment Matrix
              </CardTitle>
              <CardDescription>Interactive 1-10 rating sliders for different quality parameters</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {Object.entries(qualityAssessment)
                .filter(([key]) => key !== "notes")
                .map(([parameter, value]) => (
                  <div key={parameter} className="space-y-3">
                    <div className="flex justify-between items-center">
                      <Label className="capitalize font-medium">{parameter.replace(/([A-Z])/g, " $1").trim()}</Label>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold text-primary">{value[0]}</span>
                        <span className="text-sm text-muted-foreground">/10</span>
                      </div>
                    </div>
                    <Slider
                      value={value}
                      onValueChange={(newValue) =>
                        setQualityAssessment((prev) => ({
                          ...prev,
                          [parameter]: newValue,
                        }))
                      }
                      max={10}
                      min={1}
                      step={1}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Poor (1)</span>
                      <span>Average (5)</span>
                      <span>Excellent (10)</span>
                    </div>
                    <div className="text-sm">
                      <span
                        className={`font-medium ${
                          value[0] >= 8 ? "text-green-400" : value[0] >= 6 ? "text-yellow-400" : "text-red-400"
                        }`}
                      >
                        {value[0] >= 8 ? "Excellent" : value[0] >= 6 ? "Good" : value[0] >= 4 ? "Fair" : "Poor"}
                      </span>
                    </div>
                  </div>
                ))}

              <div className="space-y-2">
                <Label>Quality Assessment Notes</Label>
                <Textarea
                  value={qualityAssessment.notes}
                  onChange={(e) => setQualityAssessment((prev) => ({ ...prev, notes: e.target.value }))}
                  placeholder="Enter detailed quality assessment notes, defects found, and recommendations"
                  rows={4}
                />
              </div>

              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-medium mb-2">Overall Quality Score</h4>
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <Progress
                      value={
                        (Object.values(qualityAssessment)
                          .filter((v) => Array.isArray(v))
                          .reduce((sum, arr) => sum + arr[0], 0) /
                          4) *
                        10
                      }
                      className="h-3"
                    />
                  </div>
                  <span className="text-xl font-bold">
                    {Math.round(
                      (Object.values(qualityAssessment)
                        .filter((v) => Array.isArray(v))
                        .reduce((sum, arr) => sum + arr[0], 0) /
                        4) *
                        10,
                    )}
                    %
                  </span>
                </div>
              </div>

              <div className="flex gap-2">
                <Button className="flex-1">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Approve Material
                </Button>
                <Button variant="destructive" className="flex-1" onClick={() => setActiveTab("rejection")}>
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Initiate Rejection
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="photos" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Camera className="h-5 w-5 text-purple-500" />
                Photo Documentation
              </CardTitle>
              <CardDescription>Multiple image upload with thumbnails and annotation capability</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600 mb-2">Drag and drop images here, or click to select</p>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                  id="photo-upload"
                />
                <Button variant="outline" onClick={() => document.getElementById("photo-upload")?.click()}>
                  <Camera className="h-4 w-4 mr-2" />
                  Select Photos
                </Button>
              </div>

              {uploadedPhotos.length > 0 && (
                <div className="space-y-4">
                  <h4 className="font-medium">Uploaded Photos ({uploadedPhotos.length})</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {uploadedPhotos.map((photo, index) => (
                      <div key={index} className="relative group">
                        <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center border">
                          <FileImage className="h-8 w-8 text-gray-400" />
                        </div>
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                          <Button size="sm" variant="destructive" onClick={() => removePhoto(index)}>
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                        <p className="text-xs text-center mt-1 truncate">{photo.name}</p>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-2">
                    <Label>Photo Annotations</Label>
                    <Textarea placeholder="Add annotations or descriptions for the uploaded photos" rows={3} />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="inventory" className="space-y-6">
          {/* Inventory Grid with Color-coded Alerts */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Items</p>
                    <p className="text-2xl font-bold text-foreground">{receivedItems.length}</p>
                  </div>
                  <Package className="h-8 w-8 text-blue-400" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Quality Passed</p>
                    <p className={`text-2xl font-bold ${getInventoryAlertColor(85)}`}>
                      {receivedItems.filter((i) => i.qualityStatus === "passed").length}
                    </p>
                  </div>
                  <CheckCircle className={`h-8 w-8 ${getInventoryAlertColor(85)}`} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Pending QA</p>
                    <p className={`text-2xl font-bold ${getInventoryAlertColor(60)}`}>
                      {receivedItems.filter((i) => i.qualityStatus === "pending").length}
                    </p>
                  </div>
                  <Clock className={`h-8 w-8 ${getInventoryAlertColor(60)}`} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Damage Reports</p>
                    <p className={`text-2xl font-bold ${getInventoryAlertColor(30)}`}>
                      {receivedItems.filter((i) => i.damageReported).length}
                    </p>
                  </div>
                  <AlertTriangle className={`h-8 w-8 ${getInventoryAlertColor(30)}`} />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Real-time Stock Levels */}
          <Card>
            <CardHeader>
              <CardTitle>Real-time Stock Levels</CardTitle>
              <CardDescription>Color-coded inventory status with alerts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {receivedItems.map((item) => (
                  <div key={item.id} className="border border-border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-foreground">{item.productName}</h3>
                        <p className="text-sm text-muted-foreground">
                          Batch: {item.batchNumber} • Vendor: {item.vendor}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(item.qualityStatus)}>{item.qualityStatus}</Badge>
                        {item.damageReported && <Badge variant="destructive">Damage Reported</Badge>}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Received</p>
                        <p
                          className={`font-medium ${
                            item.quantityReceived === item.quantityExpected
                              ? "text-green-400"
                              : item.quantityReceived > item.quantityExpected * 0.8
                                ? "text-yellow-400"
                                : "text-red-400"
                          }`}
                        >
                          {item.quantityReceived}/{item.quantityExpected}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Date</p>
                        <p className="font-medium text-foreground">{item.receivedDate}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Location</p>
                        <p className="font-medium text-foreground flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {item.storageLocation}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Inspector</p>
                        <p className="font-medium text-foreground">{item.inspector}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Completion</p>
                        <div className="flex items-center gap-2">
                          <Progress
                            value={(item.quantityReceived / item.quantityExpected) * 100}
                            className="w-16 h-2"
                          />
                          <span className="font-medium text-foreground text-xs">
                            {Math.round((item.quantityReceived / item.quantityExpected) * 100)}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="storage" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-indigo-500" />
                Interactive Warehouse Map
              </CardTitle>
              <CardDescription>Clickable storage zones with capacity monitoring</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Storage Zone Capacity Overview */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {storageZones.map((zone) => (
                  <Card key={zone.zone} className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardContent className="p-4 text-center">
                      <h3 className="font-semibold text-foreground mb-2">Zone {zone.zone}</h3>
                      <p className={`text-2xl font-bold ${zone.color}`}>{zone.capacity}%</p>
                      <p className="text-sm text-muted-foreground capitalize">{zone.status}</p>
                      <div className="mt-2">
                        <Progress value={zone.capacity} className="h-2" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Interactive Warehouse Layout */}
              <div className="bg-gray-100 p-6 rounded-lg">
                <h4 className="font-medium mb-4 text-center">Warehouse Layout</h4>
                <div className="grid grid-cols-4 gap-4 max-w-md mx-auto">
                  {storageZones.map((zone) => (
                    <div
                      key={zone.zone}
                      className={`aspect-square border-2 rounded-lg flex items-center justify-center cursor-pointer transition-all hover:scale-105 ${
                        zone.status === "critical"
                          ? "border-red-500 bg-red-50"
                          : zone.status === "low"
                            ? "border-yellow-500 bg-yellow-50"
                            : "border-green-500 bg-green-50"
                      }`}
                    >
                      <div className="text-center">
                        <div className="font-bold text-lg">{zone.zone}</div>
                        <div className="text-sm">{zone.capacity}%</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Location Assignment */}
              <div className="space-y-3 mt-6">
                <h4 className="font-medium text-foreground">Current Storage Assignments</h4>
                {receivedItems.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-3 border border-border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Package className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{item.batchNumber}</p>
                        <p className="text-sm text-muted-foreground">{item.productName}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {item.storageLocation}
                      </Badge>
                      <Button size="sm" variant="ghost">
                        Relocate
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Rejection Workflow */}
          {activeTab === "rejection" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                  Multi-step Rejection Process
                </CardTitle>
                <CardDescription>
                  Structured rejection workflow with reason codes and supplier notification
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Rejection Reason Code</Label>
                  <Select
                    value={rejectionWorkflow.reasonCode}
                    onValueChange={(value) => setRejectionWorkflow((prev) => ({ ...prev, reasonCode: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select rejection reason" />
                    </SelectTrigger>
                    <SelectContent>
                      {rejectionReasons.map((reason) => (
                        <SelectItem key={reason.code} value={reason.code}>
                          {reason.code} - {reason.description}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Detailed Description</Label>
                  <Textarea
                    value={rejectionWorkflow.description}
                    onChange={(e) => setRejectionWorkflow((prev) => ({ ...prev, description: e.target.value }))}
                    placeholder="Provide detailed description of the rejection reason"
                    rows={3}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="supplier-notify"
                    checked={rejectionWorkflow.supplierNotified}
                    onChange={(e) => setRejectionWorkflow((prev) => ({ ...prev, supplierNotified: e.target.checked }))}
                  />
                  <Label htmlFor="supplier-notify">Notify supplier immediately</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="replacement-request"
                    checked={rejectionWorkflow.replacementRequested}
                    onChange={(e) =>
                      setRejectionWorkflow((prev) => ({ ...prev, replacementRequested: e.target.checked }))
                    }
                  />
                  <Label htmlFor="replacement-request">Request replacement batch</Label>
                </div>

                <div className="flex gap-2">
                  <Button variant="destructive" className="flex-1">
                    <Send className="h-4 w-4 mr-2" />
                    Process Rejection
                  </Button>
                  <Button variant="outline" onClick={() => setActiveTab("quality")}>
                    Back to Quality Assessment
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
