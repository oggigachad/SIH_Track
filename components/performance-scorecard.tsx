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
import { Separator } from "@/components/ui/separator"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import {
  Award,
  TrendingUp,
  TrendingDown,
  Star,
  Users,
  Package,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Calendar,
  BarChart3,
  Target,
  Zap,
  Shield,
  Clock,
  DollarSign,
  Filter,
  Download,
  RefreshCw,
  Eye,
  Plus
} from "lucide-react"

interface VendorScore {
  vendorId: string
  vendorName: string
  overallScore: number
  category: string
  metrics: {
    quality: {
      score: number
      defectRate: number
      passRate: number
      reworkRate: number
    }
    delivery: {
      score: number
      onTimeRate: number
      leadTime: number
      reliability: number
    }
    cost: {
      score: number
      competitiveness: number
      totalCostOfOwnership: number
      priceStability: number
    }
    service: {
      score: number
      responsiveness: number
      technicalSupport: number
      communication: number
    }
    compliance: {
      score: number
      certifications: number
      auditResults: number
      documentation: number
    }
  }
  trends: {
    lastMonth: number
    lastQuarter: number
    yearOverYear: number
  }
  ranking: number
  totalOrders: number
  totalValue: number
  lastEvaluation: Date
}

interface InspectionScore {
  inspectionId: string
  assetId: string
  assetName: string
  inspector: string
  overallScore: number
  categories: {
    visual: { score: number; findings: string[] }
    dimensional: { score: number; findings: string[] }
    functional: { score: number; findings: string[] }
    safety: { score: number; findings: string[] }
    documentation: { score: number; findings: string[] }
  }
  date: Date
  location: string
  duration: number
  criticalIssues: number
  recommendations: string[]
  nextInspectionDue: Date
}

interface MaintenanceScore {
  maintenanceId: string
  assetId: string
  assetName: string
  technician: string
  overallScore: number
  metrics: {
    efficiency: { score: number; plannedVsActualTime: number }
    quality: { score: number; reworkRequired: boolean; followUpNeeded: boolean }
    safety: { score: number; incidentsReported: number; protocolsFollowed: boolean }
    cost: { score: number; budgetVariance: number; partsUsed: number }
    documentation: { score: number; completeness: number; accuracy: number }
  }
  date: Date
  type: string
  duration: number
  cost: number
  effectiveness: number
  nextMaintenanceDue: Date
}

interface KPITarget {
  id: string
  name: string
  current: number
  target: number
  unit: string
  trend: "up" | "down" | "stable"
  category: string
  priority: "high" | "medium" | "low"
  lastUpdated: Date
}

export default function PerformanceScorecard({ onBack }: { onBack: () => void }) {
  const [activeTab, setActiveTab] = useState("vendors")
  const [selectedPeriod, setSelectedPeriod] = useState("current-quarter")
  const [selectedCategory, setSelectedCategory] = useState("all")

  // Sample data
  const [vendorScores, setVendorScores] = useState<VendorScore[]>([
    {
      vendorId: "VEN001",
      vendorName: "RailTech Industries",
      overallScore: 92,
      category: "elastic-clips",
      metrics: {
        quality: { score: 95, defectRate: 0.5, passRate: 99.5, reworkRate: 0.3 },
        delivery: { score: 90, onTimeRate: 95, leadTime: 12, reliability: 92 },
        cost: { score: 88, competitiveness: 85, totalCostOfOwnership: 90, priceStability: 92 },
        service: { score: 94, responsiveness: 96, technicalSupport: 92, communication: 94 },
        compliance: { score: 96, certifications: 100, auditResults: 95, documentation: 93 }
      },
      trends: { lastMonth: +2, lastQuarter: +5, yearOverYear: +8 },
      ranking: 1,
      totalOrders: 45,
      totalValue: 2850000,
      lastEvaluation: new Date(2024, 9, 15)
    },
    {
      vendorId: "VEN002",
      vendorName: "SafeRail Systems",
      overallScore: 85,
      category: "rail-pads",
      metrics: {
        quality: { score: 88, defectRate: 1.2, passRate: 98.8, reworkRate: 0.8 },
        delivery: { score: 82, onTimeRate: 88, leadTime: 15, reliability: 85 },
        cost: { score: 90, competitiveness: 92, totalCostOfOwnership: 88, priceStability: 90 },
        service: { score: 85, responsiveness: 88, technicalSupport: 82, communication: 85 },
        compliance: { score: 82, certifications: 85, auditResults: 80, documentation: 82 }
      },
      trends: { lastMonth: -1, lastQuarter: +2, yearOverYear: +3 },
      ranking: 2,
      totalOrders: 32,
      totalValue: 1960000,
      lastEvaluation: new Date(2024, 9, 10)
    },
    {
      vendorId: "VEN003",
      vendorName: "MetalWorks Railway",
      overallScore: 78,
      category: "liners",
      metrics: {
        quality: { score: 80, defectRate: 2.1, passRate: 97.9, reworkRate: 1.5 },
        delivery: { score: 75, onTimeRate: 78, leadTime: 18, reliability: 72 },
        cost: { score: 82, competitiveness: 80, totalCostOfOwnership: 85, priceStability: 80 },
        service: { score: 76, responsiveness: 75, technicalSupport: 78, communication: 75 },
        compliance: { score: 78, certifications: 80, auditResults: 75, documentation: 80 }
      },
      trends: { lastMonth: -3, lastQuarter: -2, yearOverYear: +1 },
      ranking: 3,
      totalOrders: 28,
      totalValue: 1450000,
      lastEvaluation: new Date(2024, 9, 5)
    }
  ])

  const [inspectionScores, setInspectionScores] = useState<InspectionScore[]>([
    {
      inspectionId: "INS001",
      assetId: "AST001",
      assetName: "Elastic Clip Set #2024-001",
      inspector: "John Smith",
      overallScore: 88,
      categories: {
        visual: { score: 90, findings: ["Minor surface wear on 2 clips"] },
        dimensional: { score: 95, findings: [] },
        functional: { score: 85, findings: ["Slight torque variation in 1 fastener"] },
        safety: { score: 92, findings: [] },
        documentation: { score: 78, findings: ["Missing maintenance log entries"] }
      },
      date: new Date(2024, 9, 20),
      location: "Delhi Division - Track Section A",
      duration: 2.5,
      criticalIssues: 0,
      recommendations: ["Update maintenance logs", "Monitor torque values"],
      nextInspectionDue: new Date(2024, 11, 20)
    },
    {
      inspectionId: "INS002",
      assetId: "AST002",
      assetName: "Rail Pad Assembly #2024-002",
      inspector: "Sarah Johnson",
      overallScore: 72,
      categories: {
        visual: { score: 75, findings: ["Visible compression marks", "Edge wear detected"] },
        dimensional: { score: 70, findings: ["2mm thickness reduction"] },
        functional: { score: 68, findings: ["Reduced shock absorption capacity"] },
        safety: { score: 80, findings: ["Within acceptable limits"] },
        documentation: { score: 85, findings: [] }
      },
      date: new Date(2024, 9, 18),
      location: "Mumbai Division - Track Section B",
      duration: 3.0,
      criticalIssues: 1,
      recommendations: ["Schedule replacement within 30 days", "Increase inspection frequency"],
      nextInspectionDue: new Date(2024, 10, 18)
    }
  ])

  const [maintenanceScores, setMaintenanceScores] = useState<MaintenanceScore[]>([
    {
      maintenanceId: "MNT001",
      assetId: "AST001",
      assetName: "Elastic Clip Set #2024-001",
      technician: "Mike Davis",
      overallScore: 91,
      metrics: {
        efficiency: { score: 95, plannedVsActualTime: 1.05 },
        quality: { score: 90, reworkRequired: false, followUpNeeded: true },
        safety: { score: 100, incidentsReported: 0, protocolsFollowed: true },
        cost: { score: 85, budgetVariance: -5, partsUsed: 3 },
        documentation: { score: 85, completeness: 90, accuracy: 80 }
      },
      date: new Date(2024, 9, 15),
      type: "Preventive Maintenance",
      duration: 4.2,
      cost: 2500,
      effectiveness: 92,
      nextMaintenanceDue: new Date(2024, 11, 15)
    }
  ])

  const [kpiTargets, setKpiTargets] = useState<KPITarget[]>([
    {
      id: "KPI001",
      name: "Overall Quality Score",
      current: 88.5,
      target: 90,
      unit: "%",
      trend: "up",
      category: "quality",
      priority: "high",
      lastUpdated: new Date(2024, 9, 25)
    },
    {
      id: "KPI002",
      name: "On-Time Delivery Rate",
      current: 92.3,
      target: 95,
      unit: "%",
      trend: "up",
      category: "delivery",
      priority: "high",
      lastUpdated: new Date(2024, 9, 25)
    },
    {
      id: "KPI003",
      name: "Defect Rate",
      current: 1.2,
      target: 1.0,
      unit: "%",
      trend: "down",
      category: "quality",
      priority: "medium",
      lastUpdated: new Date(2024, 9, 25)
    },
    {
      id: "KPI004",
      name: "Cost Variance",
      current: -2.1,
      target: 0,
      unit: "%",
      trend: "stable",
      category: "cost",
      priority: "medium",
      lastUpdated: new Date(2024, 9, 25)
    },
    {
      id: "KPI005",
      name: "Maintenance Effectiveness",
      current: 89.7,
      target: 95,
      unit: "%",
      trend: "up",
      category: "maintenance",
      priority: "high",
      lastUpdated: new Date(2024, 9, 25)
    }
  ])

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-400"
    if (score >= 80) return "text-blue-400"
    if (score >= 70) return "text-yellow-400"
    if (score >= 60) return "text-orange-400"
    return "text-red-400"
  }

  const getScoreBadgeColor = (score: number) => {
    if (score >= 90) return "bg-green-500/10 text-green-400 border-green-500/20"
    if (score >= 80) return "bg-blue-500/10 text-blue-400 border-blue-500/20"
    if (score >= 70) return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
    if (score >= 60) return "bg-orange-500/10 text-orange-400 border-orange-500/20"
    return "bg-red-500/10 text-red-400 border-red-500/20"
  }

  const getTrendIcon = (trend: string | number) => {
    if (typeof trend === 'string') {
      switch (trend) {
        case 'up': return <TrendingUp className="h-4 w-4 text-green-400" />
        case 'down': return <TrendingDown className="h-4 w-4 text-red-400" />
        default: return <div className="h-4 w-4" />
      }
    } else {
      if (trend > 0) return <TrendingUp className="h-4 w-4 text-green-400" />
      if (trend < 0) return <TrendingDown className="h-4 w-4 text-red-400" />
      return <div className="h-4 w-4" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-red-500/10 text-red-400 border-red-500/20"
      case "medium": return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
      case "low": return "bg-green-500/10 text-green-400 border-green-500/20"
      default: return "bg-gray-500/10 text-gray-400 border-gray-500/20"
    }
  }

  const overallStats = {
    avgVendorScore: Math.round(vendorScores.reduce((sum, v) => sum + v.overallScore, 0) / vendorScores.length),
    avgInspectionScore: Math.round(inspectionScores.reduce((sum, i) => sum + i.overallScore, 0) / inspectionScores.length),
    avgMaintenanceScore: Math.round(maintenanceScores.reduce((sum, m) => sum + m.overallScore, 0) / maintenanceScores.length),
    kpisOnTarget: kpiTargets.filter(k => k.current >= k.target).length,
    totalKPIs: kpiTargets.length
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" onClick={onBack}>
          ← Back to Dashboard
        </Button>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-yellow-500/10 rounded-lg">
            <Award className="h-6 w-6 text-yellow-500" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground">Performance Scorecard</h2>
            <p className="text-muted-foreground">Comprehensive performance scoring and analytics</p>
          </div>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Vendor Score</p>
                <p className={`text-2xl font-bold ${getScoreColor(overallStats.avgVendorScore)}`}>
                  {overallStats.avgVendorScore}
                </p>
              </div>
              <Users className="h-4 w-4 text-blue-400" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Inspection Score</p>
                <p className={`text-2xl font-bold ${getScoreColor(overallStats.avgInspectionScore)}`}>
                  {overallStats.avgInspectionScore}
                </p>
              </div>
              <Shield className="h-4 w-4 text-purple-400" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Maintenance Score</p>
                <p className={`text-2xl font-bold ${getScoreColor(overallStats.avgMaintenanceScore)}`}>
                  {overallStats.avgMaintenanceScore}
                </p>
              </div>
              <Zap className="h-4 w-4 text-green-400" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">KPIs on Target</p>
                <p className="text-2xl font-bold text-cyan-400">
                  {overallStats.kpisOnTarget}/{overallStats.totalKPIs}
                </p>
              </div>
              <Target className="h-4 w-4 text-cyan-400" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Performance</p>
                <p className="text-2xl font-bold text-green-400">Excellent</p>
              </div>
              <Star className="h-4 w-4 text-yellow-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Select period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="current-quarter">Current Quarter</SelectItem>
            <SelectItem value="last-quarter">Last Quarter</SelectItem>
            <SelectItem value="ytd">Year to Date</SelectItem>
            <SelectItem value="last-year">Last Year</SelectItem>
          </SelectContent>
        </Select>

        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="quality">Quality</SelectItem>
            <SelectItem value="delivery">Delivery</SelectItem>
            <SelectItem value="cost">Cost</SelectItem>
            <SelectItem value="service">Service</SelectItem>
          </SelectContent>
        </Select>

        <div className="flex-1" />

        <Button variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="vendors" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Vendors
          </TabsTrigger>
          <TabsTrigger value="inspections" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Inspections
          </TabsTrigger>
          <TabsTrigger value="maintenance" className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            Maintenance
          </TabsTrigger>
          <TabsTrigger value="kpis" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            KPIs
          </TabsTrigger>
        </TabsList>

        {/* Vendors Tab */}
        <TabsContent value="vendors" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-foreground">Vendor Performance Scores</h3>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Evaluation
            </Button>
          </div>

          <div className="grid gap-4">
            {vendorScores.map((vendor, index) => (
              <Card key={vendor.vendorId} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20">
                            #{vendor.ranking}
                          </Badge>
                          <h3 className="text-lg font-semibold text-foreground">{vendor.vendorName}</h3>
                        </div>
                        <Badge className={getScoreBadgeColor(vendor.overallScore)}>
                          {vendor.overallScore}/100
                        </Badge>
                        <div className="flex items-center gap-1">
                          {getTrendIcon(vendor.trends.lastQuarter)}
                          <span className="text-sm text-muted-foreground">
                            {vendor.trends.lastQuarter > 0 ? '+' : ''}{vendor.trends.lastQuarter}% QoQ
                          </span>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                        <div>Category: {vendor.category}</div>
                        <div>Total Orders: {vendor.totalOrders}</div>
                        <div>Total Value: ₹{(vendor.totalValue / 1000000).toFixed(1)}M</div>
                        <div>Last Evaluation: {vendor.lastEvaluation.toLocaleDateString()}</div>
                      </div>
                    </div>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-1" />
                          Details
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>{vendor.vendorName} - Detailed Scorecard</DialogTitle>
                          <DialogDescription>Comprehensive performance analysis</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-6">
                          {/* Overall Score */}
                          <div className="text-center p-4 bg-primary/5 rounded-lg">
                            <div className={`text-4xl font-bold ${getScoreColor(vendor.overallScore)}`}>
                              {vendor.overallScore}/100
                            </div>
                            <div className="text-sm text-muted-foreground">Overall Performance Score</div>
                          </div>

                          {/* Metric Breakdown */}
                          <div className="space-y-4">
                            <h4 className="font-semibold text-foreground">Performance Breakdown</h4>
                            {Object.entries(vendor.metrics).map(([category, metrics]) => (
                              <div key={category} className="space-y-2">
                                <div className="flex items-center justify-between">
                                  <Label className="capitalize">{category}</Label>
                                  <span className={`font-semibold ${getScoreColor(metrics.score)}`}>
                                    {metrics.score}/100
                                  </span>
                                </div>
                                <Progress value={metrics.score} className="h-2" />
                                <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                                  {Object.entries(metrics).filter(([key]) => key !== 'score').map(([key, value]) => (
                                    <div key={key} className="flex justify-between">
                                      <span className="capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}:</span>
                                      <span>{typeof value === 'number' ? value.toFixed(1) : String(value)}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* Trends */}
                          <div className="space-y-2">
                            <h4 className="font-semibold text-foreground">Performance Trends</h4>
                            <div className="grid grid-cols-3 gap-4 text-sm">
                              <div className="flex items-center justify-between">
                                <span className="text-muted-foreground">Last Month:</span>
                                <div className="flex items-center gap-1">
                                  {getTrendIcon(vendor.trends.lastMonth)}
                                  <span>{vendor.trends.lastMonth > 0 ? '+' : ''}{vendor.trends.lastMonth}%</span>
                                </div>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-muted-foreground">Last Quarter:</span>
                                <div className="flex items-center gap-1">
                                  {getTrendIcon(vendor.trends.lastQuarter)}
                                  <span>{vendor.trends.lastQuarter > 0 ? '+' : ''}{vendor.trends.lastQuarter}%</span>
                                </div>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-muted-foreground">Year over Year:</span>
                                <div className="flex items-center gap-1">
                                  {getTrendIcon(vendor.trends.yearOverYear)}
                                  <span>{vendor.trends.yearOverYear > 0 ? '+' : ''}{vendor.trends.yearOverYear}%</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>

                  {/* Metric Cards */}
                  <div className="grid grid-cols-5 gap-4">
                    {Object.entries(vendor.metrics).map(([category, metrics]) => (
                      <div key={category} className="text-center p-3 bg-muted rounded-lg">
                        <div className={`text-lg font-bold ${getScoreColor(metrics.score)}`}>
                          {metrics.score}
                        </div>
                        <div className="text-xs text-muted-foreground capitalize">{category}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Inspections Tab */}
        <TabsContent value="inspections" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-foreground">Inspection Performance Scores</h3>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Inspection
            </Button>
          </div>

          <div className="grid gap-4">
            {inspectionScores.map((inspection) => (
              <Card key={inspection.inspectionId} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-semibold text-foreground">{inspection.assetName}</h3>
                        <Badge className={getScoreBadgeColor(inspection.overallScore)}>
                          {inspection.overallScore}/100
                        </Badge>
                        {inspection.criticalIssues > 0 && (
                          <Badge className="bg-red-500/10 text-red-400 border-red-500/20">
                            {inspection.criticalIssues} Critical
                          </Badge>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                        <div>Inspector: {inspection.inspector}</div>
                        <div>Date: {inspection.date.toLocaleDateString()}</div>
                        <div>Location: {inspection.location}</div>
                        <div>Duration: {inspection.duration}h</div>
                      </div>
                    </div>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-1" />
                          Details
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>Inspection Report - {inspection.assetName}</DialogTitle>
                          <DialogDescription>Detailed inspection analysis</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-6">
                          {/* Overall Score */}
                          <div className="text-center p-4 bg-primary/5 rounded-lg">
                            <div className={`text-4xl font-bold ${getScoreColor(inspection.overallScore)}`}>
                              {inspection.overallScore}/100
                            </div>
                            <div className="text-sm text-muted-foreground">Overall Inspection Score</div>
                          </div>

                          {/* Category Breakdown */}
                          <div className="space-y-4">
                            <h4 className="font-semibold text-foreground">Category Scores</h4>
                            {Object.entries(inspection.categories).map(([category, data]) => (
                              <div key={category} className="space-y-2">
                                <div className="flex items-center justify-between">
                                  <Label className="capitalize">{category}</Label>
                                  <span className={`font-semibold ${getScoreColor(data.score)}`}>
                                    {data.score}/100
                                  </span>
                                </div>
                                <Progress value={data.score} className="h-2" />
                                {data.findings.length > 0 && (
                                  <div className="ml-4 space-y-1">
                                    {data.findings.map((finding, index) => (
                                      <div key={index} className="text-sm text-orange-400">
                                        • {finding}
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>

                          {/* Recommendations */}
                          {inspection.recommendations.length > 0 && (
                            <div className="space-y-2">
                              <h4 className="font-semibold text-foreground">Recommendations</h4>
                              <div className="space-y-2">
                                {inspection.recommendations.map((rec, index) => (
                                  <div key={index} className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                                    <div className="text-sm text-blue-400">• {rec}</div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>

                  {/* Category Scores */}
                  <div className="grid grid-cols-5 gap-4">
                    {Object.entries(inspection.categories).map(([category, data]) => (
                      <div key={category} className="text-center p-3 bg-muted rounded-lg">
                        <div className={`text-lg font-bold ${getScoreColor(data.score)}`}>
                          {data.score}
                        </div>
                        <div className="text-xs text-muted-foreground capitalize">{category}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Maintenance Tab */}
        <TabsContent value="maintenance" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-foreground">Maintenance Performance Scores</h3>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Maintenance Record
            </Button>
          </div>

          <div className="grid gap-4">
            {maintenanceScores.map((maintenance) => (
              <Card key={maintenance.maintenanceId} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-semibold text-foreground">{maintenance.assetName}</h3>
                        <Badge className={getScoreBadgeColor(maintenance.overallScore)}>
                          {maintenance.overallScore}/100
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                        <div>Technician: {maintenance.technician}</div>
                        <div>Type: {maintenance.type}</div>
                        <div>Date: {maintenance.date.toLocaleDateString()}</div>
                        <div>Duration: {maintenance.duration}h</div>
                        <div>Cost: ₹{maintenance.cost.toLocaleString()}</div>
                        <div>Effectiveness: {maintenance.effectiveness}%</div>
                      </div>
                    </div>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-1" />
                          Details
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>Maintenance Report - {maintenance.assetName}</DialogTitle>
                          <DialogDescription>Detailed maintenance performance analysis</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-6">
                          {/* Overall Score */}
                          <div className="text-center p-4 bg-primary/5 rounded-lg">
                            <div className={`text-4xl font-bold ${getScoreColor(maintenance.overallScore)}`}>
                              {maintenance.overallScore}/100
                            </div>
                            <div className="text-sm text-muted-foreground">Overall Maintenance Score</div>
                          </div>

                          {/* Metric Breakdown */}
                          <div className="space-y-4">
                            <h4 className="font-semibold text-foreground">Performance Metrics</h4>
                            {Object.entries(maintenance.metrics).map(([category, metrics]) => (
                              <div key={category} className="space-y-2">
                                <div className="flex items-center justify-between">
                                  <Label className="capitalize">{category}</Label>
                                  <span className={`font-semibold ${getScoreColor(metrics.score)}`}>
                                    {metrics.score}/100
                                  </span>
                                </div>
                                <Progress value={metrics.score} className="h-2" />
                                <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                                  {Object.entries(metrics).filter(([key]) => key !== 'score').map(([key, value]) => (
                                    <div key={key} className="flex justify-between">
                                      <span className="capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}:</span>
                                      <span>{typeof value === 'boolean' ? (value ? 'Yes' : 'No') : typeof value === 'number' ? value.toFixed(1) : String(value)}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>

                  {/* Metric Cards */}
                  <div className="grid grid-cols-5 gap-4">
                    {Object.entries(maintenance.metrics).map(([category, metrics]) => (
                      <div key={category} className="text-center p-3 bg-muted rounded-lg">
                        <div className={`text-lg font-bold ${getScoreColor(metrics.score)}`}>
                          {metrics.score}
                        </div>
                        <div className="text-xs text-muted-foreground capitalize">{category}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* KPIs Tab */}
        <TabsContent value="kpis" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-foreground">Key Performance Indicators</h3>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add KPI
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {kpiTargets.map((kpi) => (
              <Card key={kpi.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-semibold text-foreground">{kpi.name}</h4>
                        <Badge className={getPriorityColor(kpi.priority)}>{kpi.priority}</Badge>
                        {getTrendIcon(kpi.trend)}
                      </div>
                      <div className="text-sm text-muted-foreground mb-3">
                        Category: {kpi.category} • Updated: {kpi.lastUpdated.toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-foreground">
                        {kpi.current.toFixed(1)}{kpi.unit}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        Target: {kpi.target}{kpi.unit}
                      </span>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress to Target</span>
                        <span>{Math.min(100, (kpi.current / kpi.target) * 100).toFixed(1)}%</span>
                      </div>
                      <Progress 
                        value={Math.min(100, (kpi.current / kpi.target) * 100)} 
                        className="h-2" 
                      />
                    </div>

                    <div className="flex items-center gap-1 text-sm">
                      {kpi.current >= kpi.target ? (
                        <CheckCircle className="h-4 w-4 text-green-400" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-400" />
                      )}
                      <span className={kpi.current >= kpi.target ? "text-green-400" : "text-red-400"}>
                        {kpi.current >= kpi.target ? "On Target" : "Below Target"}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}