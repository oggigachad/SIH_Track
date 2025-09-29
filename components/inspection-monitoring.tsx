"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { QrCode, Camera, Star, CheckCircle, Wifi, WifiOff, Languages, Download } from "lucide-react"
import QRScanner from "./qr-scanner"

interface InspectionRecord {
  id: string
  componentId: string
  componentName: string
  location: string
  inspectionDate: string
  inspector: string
  conditionRating: number
  status: "excellent" | "good" | "fair" | "poor" | "critical"
  issues: string[]
  notes: string
  nextInspectionDue: string
  isOfflineSync: boolean
}

export default function InspectionMonitoring({ onBack }: { onBack: () => void }) {
  const [activeTab, setActiveTab] = useState("scanner")
  const [isOffline, setIsOffline] = useState(false)
  const [scanResult, setScanResult] = useState<string>("")
  const [isScanning, setIsScanning] = useState(false)

  const [inspectionForm, setInspectionForm] = useState({
    componentId: "",
    conditionRating: [7],
    visualCondition: "",
    functionalTest: "",
    safetyCheck: "",
    maintenanceRequired: false,
    urgentRepair: false,
    notes: "",
  })

  const [inspections, setInspections] = useState<InspectionRecord[]>([
    {
      id: "1",
      componentId: "RSL-2024-001-01",
      componentName: "Railway Signal Light",
      location: "Platform 2, New Delhi Station",
      inspectionDate: "2024-01-25",
      inspector: "Rajesh Kumar",
      conditionRating: 8,
      status: "good",
      issues: [],
      notes: "Signal functioning properly. LED brightness optimal.",
      nextInspectionDue: "2024-04-25",
      isOfflineSync: false,
    },
    {
      id: "2",
      componentId: "TF-2024-002-15",
      componentName: "Track Fastener",
      location: "Track Section 12-A, Mumbai Central",
      inspectionDate: "2024-01-26",
      inspector: "Priya Patel",
      conditionRating: 5,
      status: "fair",
      issues: ["Minor corrosion detected", "Bolt tension needs adjustment"],
      notes: "Requires maintenance within 30 days.",
      nextInspectionDue: "2024-02-26",
      isOfflineSync: true,
    },
  ])

  const translations = {
    en: {
      title: "Inspection & Monitoring",
      subtitle: "Mobile inspection interface with QR scanning and condition rating",
      scanner: "QR Scanner",
      inspection: "Inspection Form",
      history: "History",
      offline: "Offline Mode",
      startScan: "Start QR Scan",
      scanning: "Scanning...",
      conditionRating: "Condition Rating",
      excellent: "Excellent",
      good: "Good",
      fair: "Fair",
      poor: "Poor",
      critical: "Critical",
    },
    hi: {
      title: "निरीक्षण और निगरानी",
      subtitle: "QR स्कैनिंग और स्थिति रेटिंग के साथ मोबाइल निरीक्षण इंटरफेस",
      scanner: "QR स्कैनर",
      inspection: "निरीक्षण फॉर्म",
      history: "इतिहास",
      offline: "ऑफलाइन मोड",
      startScan: "QR स्कैन शुरू करें",
      scanning: "स्कैन कर रहे हैं...",
      conditionRating: "स्थिति रेटिंग",
      excellent: "उत्कृष्ट",
      good: "अच्छा",
      fair: "ठीक",
      poor: "खराब",
      critical: "गंभीर",
    },
  }

  const t = translations.en // Use English for now since this component will use global language context

  const simulateQRScan = () => {
    setIsScanning(true)
    setTimeout(() => {
      setScanResult("RSL-2024-003-05")
      setInspectionForm({ ...inspectionForm, componentId: "RSL-2024-003-05" })
      setIsScanning(false)
      setActiveTab("inspection")
    }, 2000)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "excellent":
        return "bg-green-500/10 text-green-400 border-green-500/20"
      case "good":
        return "bg-blue-500/10 text-blue-400 border-blue-500/20"
      case "fair":
        return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
      case "poor":
        return "bg-orange-500/10 text-orange-400 border-orange-500/20"
      case "critical":
        return "bg-red-500/10 text-red-400 border-red-500/20"
      default:
        return "bg-gray-500/10 text-gray-400 border-gray-500/20"
    }
  }

  const getRatingStatus = (rating: number): InspectionRecord["status"] => {
    if (rating >= 9) return "excellent"
    if (rating >= 7) return "good"
    if (rating >= 5) return "fair"
    if (rating >= 3) return "poor"
    return "critical"
  }

  const submitInspection = () => {
    const newInspection: InspectionRecord = {
      id: Date.now().toString(),
      componentId: inspectionForm.componentId,
      componentName: "Railway Signal Light", // Would be fetched based on component ID
      location: "Current Location",
      inspectionDate: new Date().toISOString().split("T")[0],
      inspector: "Rajesh Kumar",
      conditionRating: inspectionForm.conditionRating[0],
      status: getRatingStatus(inspectionForm.conditionRating[0]),
      issues: inspectionForm.urgentRepair ? ["Urgent repair required"] : [],
      notes: inspectionForm.notes,
      nextInspectionDue: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      isOfflineSync: isOffline,
    }

    setInspections([newInspection, ...inspections])
    setInspectionForm({
      componentId: "",
      conditionRating: [7],
      visualCondition: "",
      functionalTest: "",
      safetyCheck: "",
      maintenanceRequired: false,
      urgentRepair: false,
      notes: "",
    })
    setActiveTab("history")
  }

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" onClick={onBack}>
          ← Back to Dashboard
        </Button>
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-foreground">{t.title}</h2>
          <p className="text-muted-foreground">{t.subtitle}</p>
        </div>


        {/* Offline Toggle */}
        <div className="flex items-center gap-2">
          {isOffline ? <WifiOff className="h-4 w-4 text-red-400" /> : <Wifi className="h-4 w-4 text-green-400" />}
          <Switch checked={isOffline} onCheckedChange={setIsOffline} />
          <span className="text-sm text-muted-foreground">{t.offline}</span>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="scanner">{t.scanner}</TabsTrigger>
          <TabsTrigger value="inspection">{t.inspection}</TabsTrigger>
          <TabsTrigger value="history">{t.history}</TabsTrigger>
          <TabsTrigger value="offline">Offline Data</TabsTrigger>
        </TabsList>

        <TabsContent value="scanner" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* QR Scanner */}
            <div className="lg:col-span-1">
              <QRScanner 
                onScan={(data) => {
                  setScanResult(data)
                  setInspectionForm({ ...inspectionForm, componentId: data })
                  setActiveTab("inspection")
                }}
                onError={(error) => {
                  console.error('Scanner error:', error)
                }}
              />
            </div>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Inspection Overview</CardTitle>
                <CardDescription>Today's inspection statistics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <p className="text-2xl font-bold text-foreground">12</p>
                    <p className="text-sm text-muted-foreground">Completed</p>
                  </div>
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <p className="text-2xl font-bold text-yellow-400">3</p>
                    <p className="text-sm text-muted-foreground">Pending</p>
                  </div>
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <p className="text-2xl font-bold text-red-400">1</p>
                    <p className="text-sm text-muted-foreground">Critical</p>
                  </div>
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <p className="text-2xl font-bold text-blue-400">7.8</p>
                    <p className="text-sm text-muted-foreground">Avg Rating</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="inspection" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t.inspection}</CardTitle>
              <CardDescription>Complete inspection assessment for scanned component</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="componentId">Component ID</Label>
                  <Input
                    id="componentId"
                    value={inspectionForm.componentId}
                    onChange={(e) => setInspectionForm({ ...inspectionForm, componentId: e.target.value })}
                    placeholder="Scan QR or enter manually"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="visualCondition">Visual Condition</Label>
                  <Select
                    value={inspectionForm.visualCondition}
                    onValueChange={(value) => setInspectionForm({ ...inspectionForm, visualCondition: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select condition" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="excellent">{t.excellent}</SelectItem>
                      <SelectItem value="good">{t.good}</SelectItem>
                      <SelectItem value="fair">{t.fair}</SelectItem>
                      <SelectItem value="poor">{t.poor}</SelectItem>
                      <SelectItem value="critical">{t.critical}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Condition Rating Slider */}
              <div className="space-y-4">
                <Label>
                  {t.conditionRating}: {inspectionForm.conditionRating[0]}/10
                </Label>
                <div className="px-4">
                  <Slider
                    value={inspectionForm.conditionRating}
                    onValueChange={(value) => setInspectionForm({ ...inspectionForm, conditionRating: value })}
                    max={10}
                    min={1}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-2">
                    <span>{t.critical}</span>
                    <span>{t.poor}</span>
                    <span>{t.fair}</span>
                    <span>{t.good}</span>
                    <span>{t.excellent}</span>
                  </div>
                </div>

                {/* Rating Visual Indicator */}
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((rating) => (
                    <div
                      key={rating}
                      className={`h-3 w-3 rounded-full ${
                        rating <= inspectionForm.conditionRating[0]
                          ? rating <= 3
                            ? "bg-red-400"
                            : rating <= 5
                              ? "bg-orange-400"
                              : rating <= 7
                                ? "bg-yellow-400"
                                : rating <= 8
                                  ? "bg-blue-400"
                                  : "bg-green-400"
                          : "bg-muted"
                      }`}
                    />
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="functionalTest">Functional Test</Label>
                  <Select
                    value={inspectionForm.functionalTest}
                    onValueChange={(value) => setInspectionForm({ ...inspectionForm, functionalTest: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Test result" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="passed">Passed</SelectItem>
                      <SelectItem value="failed">Failed</SelectItem>
                      <SelectItem value="partial">Partial Function</SelectItem>
                      <SelectItem value="not-tested">Not Tested</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="safetyCheck">Safety Check</Label>
                  <Select
                    value={inspectionForm.safetyCheck}
                    onValueChange={(value) => setInspectionForm({ ...inspectionForm, safetyCheck: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Safety status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="safe">Safe</SelectItem>
                      <SelectItem value="caution">Caution Required</SelectItem>
                      <SelectItem value="unsafe">Unsafe</SelectItem>
                      <SelectItem value="immediate-action">Immediate Action Required</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Maintenance Flags */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="maintenanceRequired"
                    checked={inspectionForm.maintenanceRequired}
                    onCheckedChange={(checked) =>
                      setInspectionForm({ ...inspectionForm, maintenanceRequired: checked })
                    }
                  />
                  <Label htmlFor="maintenanceRequired">Maintenance Required</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="urgentRepair"
                    checked={inspectionForm.urgentRepair}
                    onCheckedChange={(checked) => setInspectionForm({ ...inspectionForm, urgentRepair: checked })}
                  />
                  <Label htmlFor="urgentRepair">Urgent Repair Required</Label>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Inspection Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Enter detailed inspection notes, observations, and recommendations"
                  value={inspectionForm.notes}
                  onChange={(e) => setInspectionForm({ ...inspectionForm, notes: e.target.value })}
                  rows={4}
                />
              </div>

              <div className="flex gap-2">
                <Button onClick={submitInspection} className="flex-1">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Submit Inspection
                </Button>
                <Button variant="outline" className="flex-1 bg-transparent">
                  <Camera className="h-4 w-4 mr-2" />
                  Add Photos
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Inspection History</CardTitle>
              <CardDescription>Recent inspection records and component status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {inspections.map((inspection) => (
                  <div key={inspection.id} className="border border-border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-foreground">{inspection.componentName}</h3>
                        <p className="text-sm text-muted-foreground">ID: {inspection.componentId}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(inspection.status)}>{inspection.status}</Badge>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-yellow-400" />
                          <span className="text-sm font-medium">{inspection.conditionRating}/10</span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-3 text-sm">
                      <div>
                        <p className="text-muted-foreground">Location</p>
                        <p className="font-medium text-foreground">{inspection.location}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Inspector</p>
                        <p className="font-medium text-foreground">{inspection.inspector}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Date</p>
                        <p className="font-medium text-foreground">{inspection.inspectionDate}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Next Due</p>
                        <p className="font-medium text-foreground">{inspection.nextInspectionDue}</p>
                      </div>
                    </div>

                    {inspection.issues.length > 0 && (
                      <div className="mb-3">
                        <p className="text-sm text-muted-foreground mb-1">Issues Found:</p>
                        <div className="flex flex-wrap gap-1">
                          {inspection.issues.map((issue, index) => (
                            <Badge key={index} variant="destructive" className="text-xs">
                              {issue}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {inspection.notes && <p className="text-sm text-muted-foreground">{inspection.notes}</p>}

                    {inspection.isOfflineSync && (
                      <div className="mt-3 flex items-center gap-2 text-xs text-yellow-400">
                        <WifiOff className="h-3 w-3" />
                        Synced from offline data
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="offline" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Offline Data Management</CardTitle>
              <CardDescription>Manage inspections recorded while offline</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                  <div className="flex items-center gap-3">
                    <WifiOff className="h-5 w-5 text-yellow-400" />
                    <div>
                      <p className="font-medium text-foreground">Offline Storage</p>
                      <p className="text-sm text-muted-foreground">
                        {inspections.filter((i) => i.isOfflineSync).length} inspections stored locally
                      </p>
                    </div>
                  </div>
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Sync All
                  </Button>
                </div>

                {inspections
                  .filter((i) => i.isOfflineSync)
                  .map((inspection) => (
                    <div key={inspection.id} className="border border-yellow-500/20 rounded-lg p-4 bg-yellow-500/5">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h3 className="font-semibold text-foreground">{inspection.componentName}</h3>
                          <p className="text-sm text-muted-foreground">ID: {inspection.componentId}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className="bg-yellow-500/10 text-yellow-400 border-yellow-500/20">Offline</Badge>
                          <Button size="sm" variant="outline">
                            Sync Now
                          </Button>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Recorded: {inspection.inspectionDate} • Rating: {inspection.conditionRating}/10
                      </p>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
