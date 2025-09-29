"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Package,
  CheckCircle,
  AlertCircle,
  Plus,
  Download,
  Eye,
  Upload,
  Globe,
  ArrowUpDown,
  Calendar,
  FileText,
  Star,
  Grid3X3,
} from "lucide-react"
import QRCodeGenerator from "./qr-code-generator"
import QRScanner from "./qr-scanner"
import VendorScoring from "./vendor-scoring"

interface Batch {
  id: string
  productName: string
  batchNumber: string
  quantity: number
  manufacturingDate: string
  expiryDate?: string
  vendorId: string
  status: "pending" | "approved" | "rejected" | "shipped"
  qrGenerated: boolean
  qualityScore: number
}

const translations = {
  en: {
    title: "Vendor & Manufacturing Portal",
    subtitle: "Manage batches, generate Data Matrix codes, and track quality control",
    dashboard: "Dashboard",
    createBatch: "Create Batch",
    batchTracking: "Batch Tracking",
    qualityControl: "Quality Control",
    totalBatches: "Total Batches",
    qrGenerated: "Data Matrix Generated",
    approved: "Approved",
    pending: "Pending",
    productName: "Product Name",
    quantity: "Quantity",
    manufacturingDate: "Manufacturing Date",
    expiryDate: "Expiry Date",
    vendorId: "Vendor ID",
    generateQR: "Generate Data Matrix",
    downloadQR: "Download Data Matrix",
  },
  hi: {
    title: "विक्रेता और विनिर्माण पोर्टल",
    subtitle: "बैच प्रबंधित करें, डेटा मैट्रिक्स कोड जेनरेट करें, और गुणवत्ता नियंत्रण ट्रैक करें",
    dashboard: "डैशबोर्ड",
    createBatch: "बैच बनाएं",
    batchTracking: "बैच ट्रैकिंग",
    qualityControl: "गुणवत्ता नियंत्रण",
    totalBatches: "कुल बैच",
    qrGenerated: "डेटा मैट्रिक्स जेनरेट किया गया",
    approved: "अनुमोदित",
    pending: "लंबित",
    productName: "उत्पाद का नाम",
    quantity: "मात्रा",
    manufacturingDate: "निर्माण तिथि",
    expiryDate: "समाप्ति तिथि",
    vendorId: "विक्रेता आईडी",
    generateQR: "डेटा मैट्रिक्स जेनरेट करें",
    downloadQR: "डेटा मैट्रिक्स डाउनलोड करें",
  },
}

export default function VendorPortal({ onBack }: { onBack: () => void }) {
  const [activeTab, setActiveTab] = useState("dashboard")
  const [sortField, setSortField] = useState<keyof Batch>("manufacturingDate")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")

  const [batches, setBatches] = useState<Batch[]>([
    {
      id: "1",
      productName: "Elastic Clips",
      batchNumber: "EC-2024-001",
      quantity: 50,
      manufacturingDate: "2024-01-15",
      expiryDate: "2029-01-15",
      vendorId: "VND001",
      status: "approved",
      qrGenerated: true,
      qualityScore: 95,
    },
    {
      id: "2",
      productName: "Rail Pads",
      batchNumber: "RP-2024-002",
      quantity: 200,
      manufacturingDate: "2024-01-20",
      expiryDate: "2029-01-20",
      vendorId: "VND001",
      status: "pending",
      qrGenerated: false,
      qualityScore: 88,
    },
  ])

  const [newBatch, setNewBatch] = useState({
    productName: "",
    quantity: "",
    manufacturingDate: "",
    expiryDate: "",
    vendorId: "",
    specifications: "",
    qualityNotes: "",
  })

  const [formErrors, setFormErrors] = useState<Record<string, string>>({})
  const [qrPreview, setQrPreview] = useState<string | null>(null)
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])

  const t = translations.en // Use English for now since this component will use global language context

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setUploadedFiles(files)
    console.log('Files uploaded:', files.map(f => f.name))
  }

  // Dashboard metrics calculation
  const dashboardMetrics = {
    totalBatches: batches.length,
    pendingApprovals: batches.filter(b => b.status === 'pending').length,
    qualityScoreAverage: Math.round(batches.reduce((acc, b) => acc + b.qualityScore, 0) / batches.length),
    monthlyProduction: batches.reduce((acc, b) => acc + b.quantity, 0)
  }

  // Get status color for badges
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-500/10 text-green-400 border-green-500/20'
      case 'pending': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
      case 'rejected': return 'bg-red-500/10 text-red-400 border-red-500/20'
      case 'shipped': return 'bg-blue-500/10 text-blue-400 border-blue-500/20'
      default: return 'bg-gray-500/10 text-gray-400 border-gray-500/20'
    }
  }

  // Handle table sorting
  const handleSort = (field: keyof Batch) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  // Generate QR code data for batch
  const generateQRData = (batch: Batch) => {
    return JSON.stringify({
      batchId: batch.id,
      batchNumber: batch.batchNumber,
      productName: batch.productName,
      quantity: batch.quantity,
      manufacturingDate: batch.manufacturingDate,
      vendorId: batch.vendorId,
      status: batch.status
    })
  }

  // Handle QR code view
  const handleViewQR = (batch: Batch) => {
    const qrData = generateQRData(batch)
    alert(`QR Code Data for Batch ${batch.id}:\n\n${qrData}`)
    console.log('Viewing QR code for batch:', batch.id, qrData)
  }

  // Handle QR code download
  const handleDownloadQR = (batch: Batch) => {
    const qrData = generateQRData(batch)
    // Create a simple data URL for download
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(qrData)
    const downloadAnchorNode = document.createElement('a')
    downloadAnchorNode.setAttribute("href", dataStr)
    downloadAnchorNode.setAttribute("download", `batch-${batch.id}-qr.json`)
    document.body.appendChild(downloadAnchorNode)
    downloadAnchorNode.click()
    downloadAnchorNode.remove()
    console.log('Downloaded QR data for batch:', batch.id)
  }

  const validateForm = () => {
    const errors: Record<string, string> = {}

    if (!newBatch.productName) errors.productName = "Product name is required"
    if (!newBatch.quantity || Number.parseInt(newBatch.quantity) <= 0) errors.quantity = "Valid quantity is required"
    if (!newBatch.manufacturingDate) errors.manufacturingDate = "Manufacturing date is required"
    if (!newBatch.vendorId) errors.vendorId = "Vendor ID is required"
    if (newBatch.quantity && Number.parseInt(newBatch.quantity) > 10000)
      errors.quantity = "Quantity cannot exceed 10,000"

    if (newBatch.manufacturingDate && newBatch.expiryDate) {
      const mfgDate = new Date(newBatch.manufacturingDate)
      const expDate = new Date(newBatch.expiryDate)
      if (expDate <= mfgDate) errors.expiryDate = "Expiry date must be after manufacturing date"
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleCreateBatch = () => {
    if (!validateForm()) return

    const batch: Batch = {
      id: Date.now().toString(),
      productName: newBatch.productName,
      batchNumber: `${newBatch.productName.substring(0, 2).toUpperCase()}-2024-${String(batches.length + 1).padStart(3, "0")}`,
      quantity: Number.parseInt(newBatch.quantity),
      manufacturingDate: newBatch.manufacturingDate,
      expiryDate: newBatch.expiryDate,
      vendorId: newBatch.vendorId,
      status: "pending",
      qrGenerated: false,
      qualityScore: Math.floor(Math.random() * 20) + 80, // Random score between 80-100
    }

    setBatches([...batches, batch])
    setNewBatch({
      productName: "",
      quantity: "",
      manufacturingDate: "",
      expiryDate: "",
      vendorId: "",
      specifications: "",
      qualityNotes: "",
    })
    setFormErrors({})
    setActiveTab("batches")
  }

  const generateQR = (batchId: string) => {
    const batch = batches.find((b) => b.id === batchId)
    if (batch) {
      const dataMatrixData = `RAILWAY-DM:${batch.batchNumber}:${batch.productName}:${batch.vendorId}:${batch.manufacturingDate}:${batch.quantity}`
      setQrPreview(dataMatrixData)
      setBatches(batches.map((b) => (b.id === batchId ? { ...b, qrGenerated: true, status: "approved" } : b)))
    }
  }

  const sortedBatches = [...batches].sort((a, b) => {
    const aVal = a[sortField]
    const bVal = b[sortField]
    const direction = sortDirection === "asc" ? 1 : -1

    if (typeof aVal === "string" && typeof bVal === "string") {
      return aVal.localeCompare(bVal) * direction
    }
    if (typeof aVal === "number" && typeof bVal === "number") {
      return (aVal - bVal) * direction
    }
    return 0
  })

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={onBack}>
            ← Back to Dashboard
          </Button>
          <div>
            <h2 className="text-2xl font-bold text-foreground">{t.title}</h2>
            <p className="text-muted-foreground">{t.subtitle}</p>
          </div>
        </div>

      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="dashboard">{t.dashboard}</TabsTrigger>
          <TabsTrigger value="create">{t.createBatch}</TabsTrigger>
          <TabsTrigger value="batches">{t.batchTracking}</TabsTrigger>
          <TabsTrigger value="quality">{t.qualityControl}</TabsTrigger>
          <TabsTrigger value="scanner">QR Scanner</TabsTrigger>
          <TabsTrigger value="scoring">Performance Score</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{t.totalBatches}</p>
                    <p className="text-2xl font-bold text-foreground">{dashboardMetrics.totalBatches}</p>
                  </div>
                  <Package className="h-8 w-8 text-blue-400" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Pending Approvals</p>
                    <p className="text-2xl font-bold text-yellow-400">{dashboardMetrics.pendingApprovals}</p>
                  </div>
                  <AlertCircle className="h-8 w-8 text-yellow-400" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Quality Score Avg</p>
                    <p className="text-2xl font-bold text-green-400">{dashboardMetrics.qualityScoreAverage}%</p>
                  </div>
                  <Star className="h-8 w-8 text-green-400" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Monthly Production</p>
                    <p className="text-2xl font-bold text-purple-400">{dashboardMetrics.monthlyProduction}</p>
                  </div>
                  <Calendar className="h-8 w-8 text-purple-400" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Batches */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Batches</CardTitle>
              <CardDescription>Latest manufacturing batches and their status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {batches.slice(0, 3).map((batch) => (
                  <div key={batch.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Package className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{batch.productName}</p>
                        <p className="text-sm text-muted-foreground">{batch.batchNumber}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(batch.status)}>{batch.status}</Badge>
                      {batch.qrGenerated && <Badge variant="secondary">Data Matrix Ready</Badge>}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="create" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Create New Batch</CardTitle>
              <CardDescription>Register a new manufacturing batch for QR code generation</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="productName">{t.productName} *</Label>
                  <Select
                    value={newBatch.productName}
                    onValueChange={(value) => setNewBatch({ ...newBatch, productName: value })}
                  >
                    <SelectTrigger className={formErrors.productName ? "border-red-500" : ""}>
                      <SelectValue placeholder="Select product type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Elastic Clips">Elastic Clips</SelectItem>
                      <SelectItem value="Rail Pads">Rail Pads</SelectItem>
                      <SelectItem value="Liners">Liners</SelectItem>
                    </SelectContent>
                  </Select>
                  {formErrors.productName && <p className="text-sm text-red-500">{formErrors.productName}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="vendorId">{t.vendorId} *</Label>
                  <Input
                    id="vendorId"
                    placeholder="Enter vendor ID"
                    value={newBatch.vendorId}
                    onChange={(e) => setNewBatch({ ...newBatch, vendorId: e.target.value })}
                    className={formErrors.vendorId ? "border-red-500" : ""}
                  />
                  {formErrors.vendorId && <p className="text-sm text-red-500">{formErrors.vendorId}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="quantity">{t.quantity} *</Label>
                  <Input
                    id="quantity"
                    type="number"
                    placeholder="Enter quantity (max 10,000)"
                    value={newBatch.quantity}
                    onChange={(e) => setNewBatch({ ...newBatch, quantity: e.target.value })}
                    className={formErrors.quantity ? "border-red-500" : ""}
                  />
                  {formErrors.quantity && <p className="text-sm text-red-500">{formErrors.quantity}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="manufacturingDate">{t.manufacturingDate} *</Label>
                  <Input
                    id="manufacturingDate"
                    type="date"
                    value={newBatch.manufacturingDate}
                    onChange={(e) => setNewBatch({ ...newBatch, manufacturingDate: e.target.value })}
                    className={formErrors.manufacturingDate ? "border-red-500" : ""}
                  />
                  {formErrors.manufacturingDate && (
                    <p className="text-sm text-red-500">{formErrors.manufacturingDate}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="expiryDate">{t.expiryDate}</Label>
                  <Input
                    id="expiryDate"
                    type="date"
                    value={newBatch.expiryDate}
                    onChange={(e) => setNewBatch({ ...newBatch, expiryDate: e.target.value })}
                    className={formErrors.expiryDate ? "border-red-500" : ""}
                  />
                  {formErrors.expiryDate && <p className="text-sm text-red-500">{formErrors.expiryDate}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Manufacturing Certificates & Quality Documents</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 mb-2">Drag and drop files here, or click to select</p>
                  <input
                    type="file"
                    multiple
                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="file-upload"
                  />
                  <Button variant="outline" onClick={() => document.getElementById("file-upload")?.click()}>
                    Select Files
                  </Button>
                </div>
                {uploadedFiles.length > 0 && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-600">Uploaded files:</p>
                    {uploadedFiles.map((file, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm">
                        <FileText className="h-4 w-4" />
                        <span>{file.name}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="specifications">Technical Specifications</Label>
                <Textarea
                  id="specifications"
                  placeholder="Enter technical specifications and standards compliance"
                  value={newBatch.specifications}
                  onChange={(e) => setNewBatch({ ...newBatch, specifications: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="qualityNotes">Quality Control Notes</Label>
                <Textarea
                  id="qualityNotes"
                  placeholder="Enter quality control test results and notes"
                  value={newBatch.qualityNotes}
                  onChange={(e) => setNewBatch({ ...newBatch, qualityNotes: e.target.value })}
                />
              </div>

              <Button onClick={handleCreateBatch} className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Create Batch
              </Button>
            </CardContent>
          </Card>

          <QRCodeGenerator
            onGenerate={(data, dataUrl) => {
              console.log("QR Code Generated:", data, dataUrl)
              // Update the latest batch with QR code data
              if (batches.length > 0) {
                const latestBatchId = batches[batches.length - 1].id
                setBatches(prev => prev.map(batch => 
                  batch.id === latestBatchId 
                    ? { ...batch, qrGenerated: true, qrData: data }
                    : batch
                ))
              }
            }}
          />
        </TabsContent>

        <TabsContent value="batches" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Batch Management Table
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <ArrowUpDown className="h-4 w-4" />
                  Click headers to sort
                </div>
              </CardTitle>
              <CardDescription>Sortable table showing all manufacturing batches</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th
                        className="text-left p-2 cursor-pointer hover:bg-muted/50 text-foreground"
                        onClick={() => handleSort("batchNumber")}
                      >
                        Batch ID {sortField === "batchNumber" && (sortDirection === "asc" ? "↑" : "↓")}
                      </th>
                      <th
                        className="text-left p-2 cursor-pointer hover:bg-muted/50 text-foreground"
                        onClick={() => handleSort("productName")}
                      >
                        Product {sortField === "productName" && (sortDirection === "asc" ? "↑" : "↓")}
                      </th>
                      <th
                        className="text-left p-2 cursor-pointer hover:bg-muted/50 text-foreground"
                        onClick={() => handleSort("quantity")}
                      >
                        Quantity {sortField === "quantity" && (sortDirection === "asc" ? "↑" : "↓")}
                      </th>
                      <th
                        className="text-left p-2 cursor-pointer hover:bg-muted/50 text-foreground"
                        onClick={() => handleSort("manufacturingDate")}
                      >
                        Date Created {sortField === "manufacturingDate" && (sortDirection === "asc" ? "↑" : "↓")}
                      </th>
                      <th
                        className="text-left p-2 cursor-pointer hover:bg-muted/50 text-foreground"
                        onClick={() => handleSort("status")}
                      >
                        Status {sortField === "status" && (sortDirection === "asc" ? "↑" : "↓")}
                      </th>
                      <th
                        className="text-left p-2 cursor-pointer hover:bg-muted/50 text-foreground"
                        onClick={() => handleSort("qualityScore")}
                      >
                        Quality Score {sortField === "qualityScore" && (sortDirection === "asc" ? "↑" : "↓")}
                      </th>
                      <th className="text-left p-2 text-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedBatches.map((batch) => (
                      <tr key={batch.id} className="border-b border-border hover:bg-muted/30">
                        <td className="p-2 font-mono text-sm text-foreground">{batch.batchNumber}</td>
                        <td className="p-2 text-foreground">{batch.productName}</td>
                        <td className="p-2 text-foreground">{batch.quantity}</td>
                        <td className="p-2 text-foreground">{batch.manufacturingDate}</td>
                        <td className="p-2">
                          <Badge className={getStatusColor(batch.status)}>{batch.status}</Badge>
                        </td>
                        <td className="p-2">
                          <div className="flex items-center gap-2">
                            <Progress value={batch.qualityScore} className="w-16 h-2" />
                            <span className="text-sm text-foreground">{batch.qualityScore}%</span>
                          </div>
                        </td>
                        <td className="p-2">
                          <div className="flex gap-1">
                            {!batch.qrGenerated ? (
                              <Button size="sm" onClick={() => generateQR(batch.id)}>
                                <Grid3X3 className="h-3 w-3" />
                              </Button>
                            ) : (
                              <>
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => handleViewQR(batch)}
                                >
                                  <Eye className="h-3 w-3" />
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => handleDownloadQR(batch)}
                                >
                                  <Download className="h-3 w-3" />
                                </Button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="quality" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Quality Control Checklist</CardTitle>
              <CardDescription>Ensure all batches meet Indian Railways standards</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  "Material composition verification",
                  "Dimensional accuracy check",
                  "Stress testing completed",
                  "Corrosion resistance test",
                  "Temperature tolerance verification",
                  "Documentation compliance",
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 border border-border rounded-lg">
                    <CheckCircle className="h-5 w-5 text-green-400" />
                    <span className="text-foreground">{item}</span>
                    <Badge variant="secondary" className="ml-auto">
                      Passed
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="scanner" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>QR Code Scanner & Validator</CardTitle>
              <CardDescription>Scan and validate QR codes generated by the system to verify product authenticity</CardDescription>
            </CardHeader>
            <CardContent>
              <QRScanner 
                onScan={(data) => {
                  console.log('QR scanned:', data)
                  // You can add additional handling here
                }}
                onError={(error) => {
                  console.error('QR scan error:', error)
                  alert(error)
                }}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="scoring" className="space-y-6">
          <VendorScoring 
            vendorId={"VN001234"} 
            isAuthority={false}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
