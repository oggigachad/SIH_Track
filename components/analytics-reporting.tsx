"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart,
} from "recharts"
import {
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Star,
  Download,
  Filter,
  Calendar,
  Users,
  Package,
  Wrench,
} from "lucide-react"

export default function AnalyticsReporting({ onBack }: { onBack: () => void }) {
  const [activeTab, setActiveTab] = useState("overview")
  const [timeRange, setTimeRange] = useState("30d")
  const [selectedRegion, setSelectedRegion] = useState("all")

  // Sample data for charts
  const performanceData = [
    { month: "Jan", inspections: 1200, installations: 450, quality: 92 },
    { month: "Feb", inspections: 1350, installations: 520, quality: 94 },
    { month: "Mar", inspections: 1180, installations: 480, quality: 89 },
    { month: "Apr", inspections: 1420, installations: 580, quality: 96 },
    { month: "May", inspections: 1380, installations: 610, quality: 93 },
    { month: "Jun", inspections: 1500, installations: 650, quality: 95 },
  ]

  const vendorPerformance = [
    { name: "SignalTech Industries", rating: 4.8, batches: 45, onTime: 96 },
    { name: "RailFast Corp", rating: 4.6, batches: 38, onTime: 92 },
    { name: "TrackMaster Ltd", rating: 4.9, batches: 52, onTime: 98 },
    { name: "SafeRail Systems", rating: 4.4, batches: 29, onTime: 88 },
    { name: "MetalWorks Railway", rating: 4.7, batches: 41, onTime: 94 },
  ]

  const componentStatus = [
    { name: "Excellent", value: 45, color: "#10b981" },
    { name: "Good", value: 32, color: "#3b82f6" },
    { name: "Fair", value: 18, color: "#f59e0b" },
    { name: "Poor", value: 4, color: "#f97316" },
    { name: "Critical", value: 1, color: "#ef4444" },
  ]

  const predictiveAlerts = [
    {
      id: "1",
      component: "Signal Light SL-2024-045",
      location: "Platform 3, Mumbai Central",
      prediction: "Maintenance required in 15 days",
      confidence: 87,
      type: "maintenance",
    },
    {
      id: "2",
      component: "Track Fastener TF-2024-128",
      location: "Section 12-B, New Delhi",
      prediction: "Replacement needed in 7 days",
      confidence: 94,
      type: "replacement",
    },
    {
      id: "3",
      component: "Rail Joint RJ-2024-089",
      location: "Bridge 45, Chennai",
      prediction: "Inspection overdue by 3 days",
      confidence: 100,
      type: "overdue",
    },
  ]

  const getAlertColor = (type: string) => {
    switch (type) {
      case "maintenance":
        return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
      case "replacement":
        return "bg-red-500/10 text-red-400 border-red-500/20"
      case "overdue":
        return "bg-orange-500/10 text-orange-400 border-orange-500/20"
      default:
        return "bg-gray-500/10 text-gray-400 border-gray-500/20"
    }
  }

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" onClick={onBack}>
          ← Back to Dashboard
        </Button>
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-foreground">Analytics & Reporting</h2>
          <p className="text-muted-foreground">Real-time dashboards, KPIs, and predictive maintenance alerts</p>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedRegion} onValueChange={setSelectedRegion}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Regions</SelectItem>
              <SelectItem value="north">Northern Railway</SelectItem>
              <SelectItem value="south">Southern Railway</SelectItem>
              <SelectItem value="east">Eastern Railway</SelectItem>
              <SelectItem value="west">Western Railway</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" size="icon">
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="predictive">Predictive</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">System Uptime</p>
                    <p className="text-2xl font-bold text-green-400">98.5%</p>
                    <div className="flex items-center gap-1 mt-1">
                      <TrendingUp className="h-3 w-3 text-green-400" />
                      <span className="text-xs text-green-400">+0.3%</span>
                    </div>
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-400" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Active Components</p>
                    <p className="text-2xl font-bold text-foreground">12,847</p>
                    <div className="flex items-center gap-1 mt-1">
                      <TrendingUp className="h-3 w-3 text-green-400" />
                      <span className="text-xs text-green-400">+156</span>
                    </div>
                  </div>
                  <Package className="h-8 w-8 text-blue-400" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Pending Alerts</p>
                    <p className="text-2xl font-bold text-red-400">23</p>
                    <div className="flex items-center gap-1 mt-1">
                      <TrendingDown className="h-3 w-3 text-red-400" />
                      <span className="text-xs text-red-400">-5</span>
                    </div>
                  </div>
                  <AlertTriangle className="h-8 w-8 text-red-400" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Avg Quality Score</p>
                    <p className="text-2xl font-bold text-foreground">8.7</p>
                    <div className="flex items-center gap-1 mt-1">
                      <TrendingUp className="h-3 w-3 text-green-400" />
                      <span className="text-xs text-green-400">+0.2</span>
                    </div>
                  </div>
                  <Star className="h-8 w-8 text-yellow-400" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Performance Trend */}
            <Card>
              <CardHeader>
                <CardTitle>Performance Trends</CardTitle>
                <CardDescription>Monthly inspection and installation metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="month" className="text-muted-foreground" />
                    <YAxis className="text-muted-foreground" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="inspections"
                      stackId="1"
                      stroke="#3b82f6"
                      fill="#3b82f6"
                      fillOpacity={0.3}
                    />
                    <Area
                      type="monotone"
                      dataKey="installations"
                      stackId="1"
                      stroke="#10b981"
                      fill="#10b981"
                      fillOpacity={0.3}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Component Status Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Component Status Distribution</CardTitle>
                <CardDescription>Current condition of all railway components</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={componentStatus}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={120}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {componentStatus.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex flex-wrap gap-2 mt-4">
                  {componentStatus.map((item, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-sm text-muted-foreground">
                        {item.name} ({item.value}%)
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Alerts */}
          <Card>
            <CardHeader>
              <CardTitle>Recent System Alerts</CardTitle>
              <CardDescription>Latest maintenance and inspection alerts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {predictiveAlerts.slice(0, 3).map((alert) => (
                  <div key={alert.id} className="flex items-center justify-between p-3 border border-border rounded-lg">
                    <div className="flex items-center gap-3">
                      <AlertTriangle className="h-5 w-5 text-orange-400" />
                      <div>
                        <p className="font-medium text-foreground">{alert.component}</p>
                        <p className="text-sm text-muted-foreground">{alert.location}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge className={getAlertColor(alert.type)}>{alert.type}</Badge>
                      <p className="text-xs text-muted-foreground mt-1">{alert.confidence}% confidence</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          {/* Vendor Performance */}
          <Card>
            <CardHeader>
              <CardTitle>Vendor Performance Ratings</CardTitle>
              <CardDescription>Quality ratings and delivery performance by vendor</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={vendorPerformance} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="name" className="text-muted-foreground" angle={-45} textAnchor="end" height={100} />
                  <YAxis className="text-muted-foreground" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Bar dataKey="rating" fill="#3b82f6" name="Rating" />
                  <Bar dataKey="onTime" fill="#10b981" name="On-Time %" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Performance Metrics Table */}
          <Card>
            <CardHeader>
              <CardTitle>Detailed Performance Metrics</CardTitle>
              <CardDescription>Comprehensive vendor performance breakdown</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {vendorPerformance.map((vendor, index) => (
                  <div key={index} className="border border-border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-foreground">{vendor.name}</h3>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-yellow-400" />
                          <span className="font-medium">{vendor.rating}</span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Total Batches</p>
                        <p className="font-medium text-foreground">{vendor.batches}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">On-Time Delivery</p>
                        <p className="font-medium text-foreground">{vendor.onTime}%</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Quality Score</p>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-muted rounded-full h-2">
                            <div
                              className="bg-primary h-2 rounded-full"
                              style={{ width: `${(vendor.rating / 5) * 100}%` }}
                            />
                          </div>
                          <span className="font-medium text-foreground">{vendor.rating}/5</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="predictive" className="space-y-6">
          {/* Predictive Maintenance Alerts */}
          <Card>
            <CardHeader>
              <CardTitle>Predictive Maintenance Alerts</CardTitle>
              <CardDescription>AI-powered predictions for component maintenance and replacement</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {predictiveAlerts.map((alert) => (
                  <div key={alert.id} className="border border-border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-foreground">{alert.component}</h3>
                        <p className="text-sm text-muted-foreground">{alert.location}</p>
                      </div>
                      <Badge className={getAlertColor(alert.type)}>{alert.type}</Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                      <div>
                        <p className="text-sm text-muted-foreground">Prediction</p>
                        <p className="font-medium text-foreground">{alert.prediction}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Confidence Level</p>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-muted rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${
                                alert.confidence >= 90
                                  ? "bg-green-400"
                                  : alert.confidence >= 70
                                    ? "bg-yellow-400"
                                    : "bg-red-400"
                              }`}
                              style={{ width: `${alert.confidence}%` }}
                            />
                          </div>
                          <span className="font-medium text-foreground">{alert.confidence}%</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button size="sm">Schedule Maintenance</Button>
                      <Button size="sm" variant="outline">
                        View Details
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Component Lifecycle Tracking */}
          <Card>
            <CardHeader>
              <CardTitle>Component Lifecycle Tracking</CardTitle>
              <CardDescription>Track components through their entire lifecycle</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="month" className="text-muted-foreground" />
                  <YAxis className="text-muted-foreground" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Line type="monotone" dataKey="quality" stroke="#10b981" strokeWidth={3} dot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          {/* Executive Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Executive Summary Reports</CardTitle>
              <CardDescription>Generate comprehensive reports for management review</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="border border-border rounded-lg p-4 hover:bg-muted/50 cursor-pointer">
                  <div className="flex items-center gap-3 mb-3">
                    <BarChart className="h-8 w-8 text-blue-400" />
                    <div>
                      <h3 className="font-semibold text-foreground">Monthly Performance</h3>
                      <p className="text-sm text-muted-foreground">Comprehensive monthly metrics</p>
                    </div>
                  </div>
                  <Button size="sm" className="w-full">
                    <Download className="h-4 w-4 mr-2" />
                    Generate Report
                  </Button>
                </div>

                <div className="border border-border rounded-lg p-4 hover:bg-muted/50 cursor-pointer">
                  <div className="flex items-center gap-3 mb-3">
                    <Users className="h-8 w-8 text-green-400" />
                    <div>
                      <h3 className="font-semibold text-foreground">Vendor Analysis</h3>
                      <p className="text-sm text-muted-foreground">Vendor performance breakdown</p>
                    </div>
                  </div>
                  <Button size="sm" className="w-full">
                    <Download className="h-4 w-4 mr-2" />
                    Generate Report
                  </Button>
                </div>

                <div className="border border-border rounded-lg p-4 hover:bg-muted/50 cursor-pointer">
                  <div className="flex items-center gap-3 mb-3">
                    <Wrench className="h-8 w-8 text-orange-400" />
                    <div>
                      <h3 className="font-semibold text-foreground">Maintenance Report</h3>
                      <p className="text-sm text-muted-foreground">Predictive maintenance insights</p>
                    </div>
                  </div>
                  <Button size="sm" className="w-full">
                    <Download className="h-4 w-4 mr-2" />
                    Generate Report
                  </Button>
                </div>

                <div className="border border-border rounded-lg p-4 hover:bg-muted/50 cursor-pointer">
                  <div className="flex items-center gap-3 mb-3">
                    <CheckCircle className="h-8 w-8 text-purple-400" />
                    <div>
                      <h3 className="font-semibold text-foreground">Quality Assurance</h3>
                      <p className="text-sm text-muted-foreground">QA metrics and trends</p>
                    </div>
                  </div>
                  <Button size="sm" className="w-full">
                    <Download className="h-4 w-4 mr-2" />
                    Generate Report
                  </Button>
                </div>

                <div className="border border-border rounded-lg p-4 hover:bg-muted/50 cursor-pointer">
                  <div className="flex items-center gap-3 mb-3">
                    <AlertTriangle className="h-8 w-8 text-red-400" />
                    <div>
                      <h3 className="font-semibold text-foreground">Risk Assessment</h3>
                      <p className="text-sm text-muted-foreground">Component risk analysis</p>
                    </div>
                  </div>
                  <Button size="sm" className="w-full">
                    <Download className="h-4 w-4 mr-2" />
                    Generate Report
                  </Button>
                </div>

                <div className="border border-border rounded-lg p-4 hover:bg-muted/50 cursor-pointer">
                  <div className="flex items-center gap-3 mb-3">
                    <Calendar className="h-8 w-8 text-cyan-400" />
                    <div>
                      <h3 className="font-semibold text-foreground">Custom Report</h3>
                      <p className="text-sm text-muted-foreground">Build custom analytics</p>
                    </div>
                  </div>
                  <Button size="sm" className="w-full">
                    <Filter className="h-4 w-4 mr-2" />
                    Configure Report
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Reports */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Reports</CardTitle>
              <CardDescription>Previously generated reports and analytics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { name: "Q1 2024 Performance Summary", date: "2024-01-31", size: "2.4 MB", type: "PDF" },
                  { name: "Vendor Analysis - January", date: "2024-01-28", size: "1.8 MB", type: "Excel" },
                  { name: "Maintenance Predictions", date: "2024-01-25", size: "3.1 MB", type: "PDF" },
                  { name: "Quality Metrics Report", date: "2024-01-22", size: "1.2 MB", type: "PDF" },
                ].map((report, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border border-border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Download className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{report.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {report.date} • {report.size} • {report.type}
                        </p>
                      </div>
                    </div>
                    <Button size="sm" variant="outline">
                      Download
                    </Button>
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
