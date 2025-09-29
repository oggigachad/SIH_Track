"use client"

import React, { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import {
  Package,
  MapPin,
  Clock,
  AlertTriangle,
  CheckCircle,
  Wrench,
  QrCode,
  Calendar,
  TrendingUp,
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  Plus,
  RefreshCw,
  Activity,
  Truck,
  Settings,
  BarChart3
} from "lucide-react"

interface Asset {
  id: string
  name: string
  type: string
  location: string
  status: "active" | "maintenance" | "inactive" | "critical"
  lastMaintenance: Date
  nextMaintenance: Date
  condition: number // 0-100
  coordinates: { lat: number; lng: number }
  batchId?: string
  vendor: string
  installDate: Date
  specifications: Record<string, string>
  maintenanceHistory: MaintenanceRecord[]
  alerts: Alert[]
}

interface MaintenanceRecord {
  id: string
  date: Date
  type: string
  description: string
  technician: string
  cost: number
  parts: string[]
  duration: number // in hours
}

interface Alert {
  id: string
  severity: "low" | "medium" | "high" | "critical"
  message: string
  timestamp: Date
  acknowledged: boolean
}

interface MaintenanceSchedule {
  id: string
  assetId: string
  assetName: string
  type: string
  scheduledDate: Date
  priority: "low" | "medium" | "high" | "critical"
  estimatedDuration: number
  assignedTechnician: string
  description: string
  status: "scheduled" | "in-progress" | "completed" | "delayed"
}

interface Shipment {
  id: string
  origin: string
  destination: string
  assets: string[]
  status: "in-transit" | "delivered" | "delayed" | "pending"
  estimatedArrival: Date
  actualArrival?: Date
  carrier: string
  trackingNumber: string
  temperature?: number
  humidity?: number
}

export default function AssetTracker({ onBack }: { onBack: () => void }) {
  const [activeTab, setActiveTab] = useState("assets")
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterType, setFilterType] = useState("all")
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null)

  // Sample data
  const [assets, setAssets] = useState<Asset[]>([
    {
      id: "AST001",
      name: "Elastic Clip Set #2024-001",
      type: "elastic-clips",
      location: "Delhi Division - Track Section A",
      status: "active",
      lastMaintenance: new Date(2024, 8, 15),
      nextMaintenance: new Date(2024, 11, 15),
      condition: 85,
      coordinates: { lat: 28.6139, lng: 77.2090 },
      batchId: "BATCH-2024-001",
      vendor: "RailTech Industries",
      installDate: new Date(2024, 6, 20),
      specifications: {
        "Material": "High-strength steel",
        "Load Rating": "25 tons",
        "Temperature Range": "-40°C to +60°C",
        "Gauge": "Broad Gauge (1676mm)"
      },
      maintenanceHistory: [
        {
          id: "MH001",
          date: new Date(2024, 8, 15),
          type: "Routine Inspection",
          description: "Visual inspection and torque check",
          technician: "John Smith",
          cost: 1200,
          parts: [],
          duration: 2
        }
      ],
      alerts: []
    },
    {
      id: "AST002",
      name: "Rail Pad Assembly #2024-002",
      type: "rail-pads",
      location: "Mumbai Division - Track Section B",
      status: "maintenance",
      lastMaintenance: new Date(2024, 7, 10),
      nextMaintenance: new Date(2024, 10, 10),
      condition: 65,
      coordinates: { lat: 19.0760, lng: 72.8777 },
      batchId: "BATCH-2024-002",
      vendor: "SafeRail Systems",
      installDate: new Date(2024, 4, 15),
      specifications: {
        "Material": "HDPE composite",
        "Thickness": "10mm",
        "Compression Resistance": "50 MPa",
        "Gauge": "Broad Gauge (1676mm)"
      },
      maintenanceHistory: [
        {
          id: "MH002",
          date: new Date(2024, 7, 10),
          type: "Preventive Maintenance",
          description: "Pad replacement and alignment check",
          technician: "Sarah Johnson",
          cost: 2500,
          parts: ["Rail Pad", "Fasteners"],
          duration: 4
        }
      ],
      alerts: [
        {
          id: "AL001",
          severity: "medium",
          message: "Vibration levels above normal threshold",
          timestamp: new Date(2024, 9, 20),
          acknowledged: false
        }
      ]
    },
    {
      id: "AST003",
      name: "Liner Component #2024-003",
      type: "liners",
      location: "Kolkata Division - Track Section C",
      status: "critical",
      lastMaintenance: new Date(2024, 5, 20),
      nextMaintenance: new Date(2024, 8, 20),
      condition: 35,
      coordinates: { lat: 22.5726, lng: 88.3639 },
      batchId: "BATCH-2024-003",
      vendor: "MetalWorks Railway",
      installDate: new Date(2024, 2, 10),
      specifications: {
        "Material": "Cast iron",
        "Weight": "2.5 kg",
        "Dimensions": "150x100x25mm",
        "Surface Treatment": "Anti-corrosion coating"
      },
      maintenanceHistory: [],
      alerts: [
        {
          id: "AL002",
          severity: "critical",
          message: "Component showing signs of fatigue cracking",
          timestamp: new Date(2024, 9, 25),
          acknowledged: false
        },
        {
          id: "AL003",
          severity: "high",
          message: "Maintenance overdue by 45 days",
          timestamp: new Date(2024, 10, 1),
          acknowledged: false
        }
      ]
    }
  ])

  const [maintenanceSchedule, setMaintenanceSchedule] = useState<MaintenanceSchedule[]>([
    {
      id: "MS001",
      assetId: "AST001",
      assetName: "Elastic Clip Set #2024-001",
      type: "Routine Inspection",
      scheduledDate: new Date(2024, 11, 15),
      priority: "medium",
      estimatedDuration: 3,
      assignedTechnician: "John Smith",
      description: "Quarterly inspection and condition assessment",
      status: "scheduled"
    },
    {
      id: "MS002",
      assetId: "AST003",
      assetName: "Liner Component #2024-003",
      type: "Emergency Repair",
      scheduledDate: new Date(2024, 10, 28),
      priority: "critical",
      estimatedDuration: 6,
      assignedTechnician: "Mike Davis",
      description: "Urgent repair for fatigue cracking",
      status: "in-progress"
    }
  ])

  const [shipments, setShipments] = useState<Shipment[]>([
    {
      id: "SHP001",
      origin: "Delhi Manufacturing Plant",
      destination: "Mumbai Division Depot",
      assets: ["AST004", "AST005", "AST006"],
      status: "in-transit",
      estimatedArrival: new Date(2024, 10, 30),
      carrier: "RailLogistics Express",
      trackingNumber: "RLE2024001",
      temperature: 24,
      humidity: 45
    },
    {
      id: "SHP002",
      origin: "Kolkata Manufacturing Plant",
      destination: "Chennai Division Depot",
      assets: ["AST007", "AST008"],
      status: "delayed",
      estimatedArrival: new Date(2024, 10, 25),
      actualArrival: new Date(2024, 10, 27),
      carrier: "FastTrack Shipping",
      trackingNumber: "FTS2024002",
      temperature: 28,
      humidity: 60
    }
  ])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500/10 text-green-400 border-green-500/20"
      case "maintenance":
        return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
      case "critical":
        return "bg-red-500/10 text-red-400 border-red-500/20"
      case "inactive":
        return "bg-gray-500/10 text-gray-400 border-gray-500/20"
      default:
        return "bg-gray-500/10 text-gray-400 border-gray-500/20"
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-red-500/10 text-red-400 border-red-500/20"
      case "high":
        return "bg-orange-500/10 text-orange-400 border-orange-500/20"
      case "medium":
        return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
      case "low":
        return "bg-blue-500/10 text-blue-400 border-blue-500/20"
      default:
        return "bg-gray-500/10 text-gray-400 border-gray-500/20"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical":
        return "bg-red-500/10 text-red-400 border-red-500/20"
      case "high":
        return "bg-orange-500/10 text-orange-400 border-orange-500/20"
      case "medium":
        return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
      case "low":
        return "bg-green-500/10 text-green-400 border-green-500/20"
      default:
        return "bg-gray-500/10 text-gray-400 border-gray-500/20"
    }
  }

  const getShipmentStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "bg-green-500/10 text-green-400 border-green-500/20"
      case "in-transit":
        return "bg-blue-500/10 text-blue-400 border-blue-500/20"
      case "delayed":
        return "bg-red-500/10 text-red-400 border-red-500/20"
      case "pending":
        return "bg-gray-500/10 text-gray-400 border-gray-500/20"
      default:
        return "bg-gray-500/10 text-gray-400 border-gray-500/20"
    }
  }

  const filteredAssets = assets.filter(asset => {
    const matchesSearch = searchQuery === "" || 
      asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.vendor.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesStatus = filterStatus === "all" || asset.status === filterStatus
    const matchesType = filterType === "all" || asset.type === filterType
    
    return matchesSearch && matchesStatus && matchesType
  })

  const assetStats = {
    total: assets.length,
    active: assets.filter(a => a.status === 'active').length,
    maintenance: assets.filter(a => a.status === 'maintenance').length,
    critical: assets.filter(a => a.status === 'critical').length,
    alerts: assets.reduce((sum, a) => sum + a.alerts.length, 0),
    avgCondition: Math.round(assets.reduce((sum, a) => sum + a.condition, 0) / assets.length)
  }

  const acknowledgeAlert = (assetId: string, alertId: string) => {
    setAssets(assets.map(asset => 
      asset.id === assetId 
        ? {
            ...asset,
            alerts: asset.alerts.map(alert => 
              alert.id === alertId ? { ...alert, acknowledged: true } : alert
            )
          }
        : asset
    ))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" onClick={onBack}>
          ← Back to Dashboard
        </Button>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-500/10 rounded-lg">
            <Activity className="h-6 w-6 text-purple-500" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground">Asset Tracker</h2>
            <p className="text-muted-foreground">Comprehensive asset monitoring and maintenance tracking</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Assets</p>
                <p className="text-2xl font-bold text-foreground">{assetStats.total}</p>
              </div>
              <Package className="h-4 w-4 text-blue-400" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active</p>
                <p className="text-2xl font-bold text-green-400">{assetStats.active}</p>
              </div>
              <CheckCircle className="h-4 w-4 text-green-400" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Maintenance</p>
                <p className="text-2xl font-bold text-yellow-400">{assetStats.maintenance}</p>
              </div>
              <Wrench className="h-4 w-4 text-yellow-400" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Critical</p>
                <p className="text-2xl font-bold text-red-400">{assetStats.critical}</p>
              </div>
              <AlertTriangle className="h-4 w-4 text-red-400" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Alerts</p>
                <p className="text-2xl font-bold text-orange-400">{assetStats.alerts}</p>
              </div>
              <AlertTriangle className="h-4 w-4 text-orange-400" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Condition</p>
                <p className="text-2xl font-bold text-blue-400">{assetStats.avgCondition}%</p>
              </div>
              <BarChart3 className="h-4 w-4 text-blue-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="assets" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            Assets
          </TabsTrigger>
          <TabsTrigger value="maintenance" className="flex items-center gap-2">
            <Wrench className="h-4 w-4" />
            Maintenance
          </TabsTrigger>
          <TabsTrigger value="alerts" className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            Alerts
          </TabsTrigger>
          <TabsTrigger value="shipments" className="flex items-center gap-2">
            <Truck className="h-4 w-4" />
            Shipments
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Analytics
          </TabsTrigger>
        </TabsList>

        {/* Assets Tab */}
        <TabsContent value="assets" className="space-y-4">
          {/* Filters */}
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search assets..." 
                className="w-64"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="elastic-clips">Elastic Clips</SelectItem>
                <SelectItem value="rail-pads">Rail Pads</SelectItem>
                <SelectItem value="liners">Liners</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex-1" />

            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Asset
            </Button>
          </div>

          {/* Assets List */}
          <div className="grid gap-4">
            {filteredAssets.map((asset) => (
              <Card key={asset.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-semibold text-foreground">{asset.name}</h3>
                        <Badge className={getStatusColor(asset.status)}>{asset.status}</Badge>
                        {asset.alerts.length > 0 && (
                          <Badge className="bg-red-500/10 text-red-400 border-red-500/20">
                            {asset.alerts.length} alert{asset.alerts.length > 1 ? 's' : ''}
                          </Badge>
                        )}
                      </div>
                      <div className="space-y-1 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          {asset.location}
                        </div>
                        <div className="flex items-center gap-2">
                          <Package className="h-4 w-4" />
                          Vendor: {asset.vendor}
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          Next Maintenance: {asset.nextMaintenance.toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" onClick={() => setSelectedAsset(asset)}>
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>{asset.name}</DialogTitle>
                            <DialogDescription>Asset ID: {asset.id}</DialogDescription>
                          </DialogHeader>
                          <div className="space-y-6">
                            {/* Basic Info */}
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label>Type</Label>
                                <p className="text-sm text-foreground mt-1">{asset.type}</p>
                              </div>
                              <div>
                                <Label>Status</Label>
                                <Badge className={getStatusColor(asset.status)}>{asset.status}</Badge>
                              </div>
                              <div>
                                <Label>Location</Label>
                                <p className="text-sm text-foreground mt-1">{asset.location}</p>
                              </div>
                              <div>
                                <Label>Vendor</Label>
                                <p className="text-sm text-foreground mt-1">{asset.vendor}</p>
                              </div>
                              <div>
                                <Label>Install Date</Label>
                                <p className="text-sm text-foreground mt-1">{asset.installDate.toLocaleDateString()}</p>
                              </div>
                              <div>
                                <Label>Batch ID</Label>
                                <p className="text-sm text-foreground mt-1">{asset.batchId}</p>
                              </div>
                            </div>

                            {/* Condition */}
                            <div>
                              <Label>Condition</Label>
                              <div className="mt-2">
                                <Progress value={asset.condition} className="h-3" />
                                <p className="text-sm text-muted-foreground mt-1">{asset.condition}% - {asset.condition >= 80 ? 'Excellent' : asset.condition >= 60 ? 'Good' : asset.condition >= 40 ? 'Fair' : 'Poor'}</p>
                              </div>
                            </div>

                            {/* Specifications */}
                            <div>
                              <Label>Specifications</Label>
                              <div className="mt-2 space-y-2">
                                {Object.entries(asset.specifications).map(([key, value]) => (
                                  <div key={key} className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">{key}:</span>
                                    <span className="text-foreground">{value}</span>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Maintenance History */}
                            <div>
                              <Label>Maintenance History</Label>
                              <div className="mt-2 space-y-2">
                                {asset.maintenanceHistory.length > 0 ? (
                                  asset.maintenanceHistory.map((record) => (
                                    <div key={record.id} className="p-3 border border-border rounded-lg">
                                      <div className="flex justify-between items-start mb-2">
                                        <h4 className="font-medium text-foreground">{record.type}</h4>
                                        <span className="text-sm text-muted-foreground">{record.date.toLocaleDateString()}</span>
                                      </div>
                                      <p className="text-sm text-muted-foreground mb-2">{record.description}</p>
                                      <div className="grid grid-cols-3 gap-4 text-xs text-muted-foreground">
                                        <span>Technician: {record.technician}</span>
                                        <span>Cost: ₹{record.cost.toLocaleString()}</span>
                                        <span>Duration: {record.duration}h</span>
                                      </div>
                                    </div>
                                  ))
                                ) : (
                                  <p className="text-sm text-muted-foreground">No maintenance history available</p>
                                )}
                              </div>
                            </div>

                            {/* Active Alerts */}
                            {asset.alerts.length > 0 && (
                              <div>
                                <Label>Active Alerts</Label>
                                <div className="mt-2 space-y-2">
                                  {asset.alerts.map((alert) => (
                                    <div key={alert.id} className="p-3 border border-border rounded-lg">
                                      <div className="flex justify-between items-start mb-2">
                                        <Badge className={getSeverityColor(alert.severity)}>
                                          {alert.severity}
                                        </Badge>
                                        <span className="text-sm text-muted-foreground">
                                          {alert.timestamp.toLocaleDateString()}
                                        </span>
                                      </div>
                                      <p className="text-sm text-foreground">{alert.message}</p>
                                      {!alert.acknowledged && (
                                        <Button 
                                          size="sm" 
                                          variant="outline" 
                                          className="mt-2"
                                          onClick={() => acknowledgeAlert(asset.id, alert.id)}
                                        >
                                          Acknowledge
                                        </Button>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </DialogContent>
                      </Dialog>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                    </div>
                  </div>
                  
                  {/* Condition Progress */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm">Condition</Label>
                      <span className="text-sm text-muted-foreground">{asset.condition}%</span>
                    </div>
                    <Progress value={asset.condition} className="h-2" />
                  </div>

                  {/* Quick Actions */}
                  <div className="flex gap-2 mt-4">
                    <Button variant="outline" size="sm">
                      <QrCode className="h-4 w-4 mr-1" />
                      QR Code
                    </Button>
                    <Button variant="outline" size="sm">
                      <RefreshCw className="h-4 w-4 mr-1" />
                      Update Status
                    </Button>
                    <Button variant="outline" size="sm">
                      <Calendar className="h-4 w-4 mr-1" />
                      Schedule Maintenance
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Maintenance Tab */}
        <TabsContent value="maintenance" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-foreground">Maintenance Schedule</h3>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Schedule Maintenance
            </Button>
          </div>

          <div className="grid gap-4">
            {maintenanceSchedule.map((schedule) => (
              <Card key={schedule.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-semibold text-foreground">{schedule.assetName}</h4>
                        <Badge className={getPriorityColor(schedule.priority)}>{schedule.priority}</Badge>
                        <Badge className={getStatusColor(schedule.status)}>{schedule.status}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{schedule.description}</p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {schedule.scheduledDate.toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {schedule.estimatedDuration}h estimated
                        </div>
                        <div className="flex items-center gap-1">
                          <Settings className="h-4 w-4" />
                          {schedule.assignedTechnician}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Alerts Tab */}
        <TabsContent value="alerts" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-foreground">Active Alerts</h3>
            <Button variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>

          <div className="grid gap-4">
            {assets.flatMap(asset => 
              asset.alerts.map(alert => ({ ...alert, assetId: asset.id, assetName: asset.name }))
            ).map((alert) => (
              <Card key={alert.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className={getSeverityColor(alert.severity)}>{alert.severity}</Badge>
                        <h4 className="font-semibold text-foreground">{alert.assetName}</h4>
                        {alert.acknowledged && (
                          <Badge variant="outline">Acknowledged</Badge>
                        )}
                      </div>
                      <p className="text-sm text-foreground mb-2">{alert.message}</p>
                      <p className="text-xs text-muted-foreground">
                        {alert.timestamp.toLocaleString()}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      {!alert.acknowledged && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => acknowledgeAlert(alert.assetId, alert.id)}
                        >
                          Acknowledge
                        </Button>
                      )}
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-1" />
                        View Asset
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Shipments Tab */}
        <TabsContent value="shipments" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-foreground">Asset Shipments</h3>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Track Shipment
            </Button>
          </div>

          <div className="grid gap-4">
            {shipments.map((shipment) => (
              <Card key={shipment.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-semibold text-foreground">Shipment {shipment.id}</h4>
                        <Badge className={getShipmentStatusColor(shipment.status)}>{shipment.status}</Badge>
                      </div>
                      <div className="space-y-1 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          {shipment.origin} → {shipment.destination}
                        </div>
                        <div className="flex items-center gap-2">
                          <Truck className="h-4 w-4" />
                          Carrier: {shipment.carrier}
                        </div>
                        <div className="flex items-center gap-2">
                          <Package className="h-4 w-4" />
                          Assets: {shipment.assets.length} items
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          ETA: {shipment.estimatedArrival.toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 text-right">
                      <div className="text-sm">
                        <span className="text-muted-foreground">Tracking: </span>
                        <span className="font-mono text-foreground">{shipment.trackingNumber}</span>
                      </div>
                      {shipment.temperature && (
                        <div className="text-sm">
                          <span className="text-muted-foreground">Temp: </span>
                          <span className="text-foreground">{shipment.temperature}°C</span>
                        </div>
                      )}
                      {shipment.humidity && (
                        <div className="text-sm">
                          <span className="text-muted-foreground">Humidity: </span>
                          <span className="text-foreground">{shipment.humidity}%</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-1" />
                      Track
                    </Button>
                    <Button variant="outline" size="sm">
                      <Package className="h-4 w-4 mr-1" />
                      View Assets
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Asset Health Distribution</CardTitle>
                <CardDescription>Current condition of all tracked assets</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Excellent (80-100%)</span>
                    <span className="text-sm font-medium">{assets.filter(a => a.condition >= 80).length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Good (60-79%)</span>
                    <span className="text-sm font-medium">{assets.filter(a => a.condition >= 60 && a.condition < 80).length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Fair (40-59%)</span>
                    <span className="text-sm font-medium">{assets.filter(a => a.condition >= 40 && a.condition < 60).length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Poor (0-39%)</span>
                    <span className="text-sm font-medium">{assets.filter(a => a.condition < 40).length}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Maintenance Schedule</CardTitle>
                <CardDescription>Upcoming maintenance activities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">This Week</span>
                    <span className="text-sm font-medium">
                      {maintenanceSchedule.filter(m => {
                        const weekFromNow = new Date()
                        weekFromNow.setDate(weekFromNow.getDate() + 7)
                        return m.scheduledDate <= weekFromNow
                      }).length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">This Month</span>
                    <span className="text-sm font-medium">
                      {maintenanceSchedule.filter(m => {
                        const monthFromNow = new Date()
                        monthFromNow.setMonth(monthFromNow.getMonth() + 1)
                        return m.scheduledDate <= monthFromNow
                      }).length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Overdue</span>
                    <span className="text-sm font-medium text-red-400">
                      {assets.filter(a => a.nextMaintenance < new Date()).length}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
                <CardDescription>Key performance indicators</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Availability</span>
                    <span className="text-sm font-medium text-green-400">
                      {Math.round((assets.filter(a => a.status === 'active').length / assets.length) * 100)}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Average Condition</span>
                    <span className="text-sm font-medium text-blue-400">{assetStats.avgCondition}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Critical Issues</span>
                    <span className="text-sm font-medium text-red-400">{assetStats.alerts}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Asset Distribution</CardTitle>
                <CardDescription>Assets by type and location</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Elastic Clips</span>
                    <span className="text-sm font-medium">{assets.filter(a => a.type === 'elastic-clips').length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Rail Pads</span>
                    <span className="text-sm font-medium">{assets.filter(a => a.type === 'rail-pads').length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Liners</span>
                    <span className="text-sm font-medium">{assets.filter(a => a.type === 'liners').length}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}