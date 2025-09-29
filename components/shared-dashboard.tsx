"use client"

import React, { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Database,
  QrCode,
  Wrench,
  Search,
  BarChart3,
  Recycle,
  Shield,
  ArrowLeft,
  Settings,
} from "lucide-react"
import { type ModuleConfig } from "@/lib/role-utils"
import dynamic from "next/dynamic"

// Lazy load portal components for better performance
const VendorPortal = dynamic(() => import("@/components/vendor-portal"), {
  loading: () => <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div></div>
})

const DepotReception = dynamic(() => import("@/components/depot-reception"), {
  loading: () => <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600"></div></div>
})

const FieldInstallation = dynamic(() => import("@/components/field-installation"), {
  loading: () => <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-600"></div></div>
})

const InspectionMonitoring = dynamic(() => import("@/components/inspection-monitoring"), {
  loading: () => <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div></div>
})

const AnalyticsReporting = dynamic(() => import("@/components/analytics-reporting"), {
  loading: () => <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-32 w-32 border-b-2 border-cyan-600"></div></div>
})

const RecyclingModule = dynamic(() => import("@/components/recycling-module"), {
  loading: () => <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-32 w-32 border-b-2 border-emerald-600"></div></div>
})

const WorkflowManager = dynamic(() => import("@/components/workflow-manager"), {
  loading: () => <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div></div>
})

const RailwayCalculator = dynamic(() => import("@/components/railway-calculator"), {
  loading: () => <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-600"></div></div>
})

const AssetTracker = dynamic(() => import("@/components/asset-tracker"), {
  loading: () => <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div></div>
})

const PerformanceScorecard = dynamic(() => import("@/components/performance-scorecard"), {
  loading: () => <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-32 w-32 border-b-2 border-yellow-600"></div></div>
})

const EnhancedPortal = dynamic(() => import("@/components/enhanced-portal").then(mod => ({ default: mod.EnhancedPortal })), {
  loading: () => <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div></div>
})

interface SharedDashboardProps {
  modules: ModuleConfig[]
  welcomeMessage?: string
  quickStats?: Array<{
    title: string
    value: string
    color: string
    icon: React.ComponentType<{ className?: string }>
  }>
}

// All available modules configuration
const ALL_MODULES: Record<string, ModuleConfig> = {
  vendor: {
    id: "vendor",
    title: "Vendor & Manufacturing",
    description: "Data Matrix generation, batch tracking, and quality control for vendors",
    icon: Database,
    color: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    stats: "1,247 batches tracked",
    component: VendorPortal,
  },
  depot: {
    id: "depot",
    title: "Depot Reception & QA",
    description: "Material receipt scanning, quality assessment, and inventory management",
    icon: QrCode,
    color: "bg-green-500/10 text-green-400 border-green-500/20",
    stats: "856 items received",
    component: DepotReception,
  },
  installation: {
    id: "installation",
    title: "Field Installation",
    description: "Installation crew dashboard with GPS tracking and verification",
    icon: Wrench,
    color: "bg-orange-500/10 text-orange-400 border-orange-500/20",
    stats: "342 installations",
    component: FieldInstallation,
  },
  inspection: {
    id: "inspection",
    title: "Inspection & Monitoring",
    description: "Mobile inspection interface with Data Matrix scanning and condition rating",
    icon: Search,
    color: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    stats: "2,156 inspections",
    component: InspectionMonitoring,
  },
  analytics: {
    id: "analytics",
    title: "Analytics & Reporting",
    description: "Real-time dashboards, KPIs, and predictive maintenance alerts",
    icon: BarChart3,
    color: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
    stats: "98.5% uptime",
    component: AnalyticsReporting,
  },
  recycling: {
    id: "recycling",
    title: "End-of-Life & Recycling",
    description: "Recycling workflow and environmental impact tracking",
    icon: Recycle,
    color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    stats: "1,890 kg recycled",
    component: RecyclingModule,
  },
  workflow: {
    id: "workflow",
    title: "Workflow Manager",
    description: "Task creation, assignment, and progress tracking for railway operations",
    icon: Database,
    color: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    stats: "156 active tasks",
    component: WorkflowManager,
  },
  calculator: {
    id: "calculator",
    title: "Railway Calculator",
    description: "Comprehensive calculations for cost, materials, distance, and maintenance",
    icon: Database,
    color: "bg-orange-500/10 text-orange-400 border-orange-500/20",
    stats: "2,450 calculations",
    component: RailwayCalculator,
  },
  tracker: {
    id: "tracker",
    title: "Asset Tracker",
    description: "Real-time asset monitoring, maintenance scheduling, and lifecycle tracking",
    icon: Database,
    color: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    stats: "3,847 assets tracked",
    component: AssetTracker,
  },
  portal: {
    id: "portal",
    title: "Portal Management",
    description: "User management, role administration, and advanced portal configuration",
    icon: Settings,
    color: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
    stats: "124 active users",
    component: EnhancedPortal,
  },
  scorecard: {
    id: "scorecard",
    title: "Performance Scorecard",
    description: "Vendor performance, inspection quality, and maintenance effectiveness scoring",
    icon: Database,
    color: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    stats: "92% avg score",
    component: PerformanceScorecard,
  },
}

// Default quick stats by module
const DEFAULT_QUICK_STATS: Record<string, Array<{
  title: string
  value: string
  color: string
  icon: React.ComponentType<{ className?: string }>
}>> = {
  vendor: [
    { title: "Active Components", value: "12,847", color: "text-primary", icon: QrCode },
    { title: "Pending QA", value: "156", color: "text-orange-400", icon: Search },
    { title: "System Health", value: "98.5%", color: "text-green-400", icon: Shield },
    { title: "Alerts", value: "3", color: "text-red-400", icon: BarChart3 },
  ],
  depot: [
    { title: "Items Received", value: "856", color: "text-green-400", icon: QrCode },
    { title: "Pending QA", value: "42", color: "text-orange-400", icon: Search },
    { title: "Quality Pass Rate", value: "94.2%", color: "text-green-400", icon: Shield },
    { title: "Alerts", value: "2", color: "text-red-400", icon: BarChart3 },
  ],
  installation: [
    { title: "Installations", value: "342", color: "text-orange-400", icon: Wrench },
    { title: "Active Jobs", value: "28", color: "text-blue-400", icon: QrCode },
    { title: "Completion Rate", value: "89.5%", color: "text-green-400", icon: Shield },
    { title: "Issues", value: "5", color: "text-red-400", icon: BarChart3 },
  ],
  inspection: [
    { title: "Inspections", value: "2,156", color: "text-purple-400", icon: Search },
    { title: "Components", value: "1,847", color: "text-blue-400", icon: QrCode },
    { title: "Pass Rate", value: "92.1%", color: "text-green-400", icon: Shield },
    { title: "Critical", value: "12", color: "text-red-400", icon: BarChart3 },
  ],
  analytics: [
    { title: "System Uptime", value: "98.5%", color: "text-green-400", icon: Shield },
    { title: "Data Points", value: "1.2M", color: "text-cyan-400", icon: BarChart3 },
    { title: "Reports", value: "156", color: "text-blue-400", icon: QrCode },
    { title: "Alerts", value: "3", color: "text-red-400", icon: Search },
  ],
  recycling: [
    { title: "Recycled", value: "1,890kg", color: "text-emerald-400", icon: Recycle },
    { title: "EOL Items", value: "245", color: "text-orange-400", icon: QrCode },
    { title: "Recovery Rate", value: "87.3%", color: "text-green-400", icon: Shield },
    { title: "Pending", value: "18", color: "text-red-400", icon: BarChart3 },
  ],
}

export default function SharedDashboard({ modules, welcomeMessage, quickStats }: SharedDashboardProps) {
  const { currentUser } = useAuth()
  const [selectedModule, setSelectedModule] = useState<string | null>(null)

  // Get available modules with their full configuration
  const availableModules = modules.map(moduleId => 
    typeof moduleId === 'string' ? ALL_MODULES[moduleId] : moduleId
  ).filter(Boolean)

  // Get quick stats - use provided or default based on first module
  const displayStats = quickStats || (availableModules.length > 0 ? DEFAULT_QUICK_STATS[availableModules[0].id] : [])

  // Handle module selection
  const handleModuleSelect = (moduleId: string) => {
    setSelectedModule(moduleId)
  }

  const handleBackToDashboard = () => {
    setSelectedModule(null)
  }

  // Render selected module
  if (selectedModule) {
    const activeModule = availableModules.find(m => m.id === selectedModule)
    if (activeModule?.component) {
      const ModuleComponent = activeModule.component
      return <ModuleComponent onBack={handleBackToDashboard} />
    } else {
      // Fallback for modules without components
      return (
        <div>
          <div className="flex items-center gap-4 mb-6">
            <Button variant="ghost" onClick={handleBackToDashboard}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            <div>
              <h2 className="text-2xl font-bold text-foreground">
                {activeModule?.title || "Module"}
              </h2>
              <p className="text-muted-foreground">
                {activeModule?.description || "Loading..."}
              </p>
            </div>
          </div>

          <Card>
            <CardContent className="p-8 text-center">
              <div className="mb-4">
                {activeModule?.icon && React.createElement(activeModule.icon, { 
                  className: "h-16 w-16 mx-auto text-muted-foreground" 
                })}
              </div>
              <h3 className="text-xl font-semibold mb-2">
                Module Under Development
              </h3>
              <p className="text-muted-foreground mb-4">
                This module is being built with full functionality including Data Matrix scanning, form validation, and real-time data synchronization.
              </p>
              <Button onClick={handleBackToDashboard}>
                Return to Dashboard
              </Button>
            </CardContent>
          </Card>
        </div>
      )
    }
  }

  return (
    <>
      {/* Welcome Section */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-foreground mb-2">
          {welcomeMessage || "Welcome back"}, {currentUser?.name}
        </h2>
        <p className="text-muted-foreground text-lg">
          Manage railway components and quality assurance across all phases
        </p>
      </div>

      {/* Quick Stats */}
      {displayStats.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {displayStats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {stat.title}
                    </p>
                    <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                  </div>
                  <div className="h-8 w-8 bg-primary/10 rounded-lg flex items-center justify-center">
                    <stat.icon className={`h-4 w-4 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Modules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {availableModules.map((moduleConfig) => {
          const IconComponent = moduleConfig.icon
          return (
            <Card 
              key={moduleConfig.id} 
              className="module-card group cursor-pointer" 
              onClick={() => handleModuleSelect(moduleConfig.id)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className={`p-2 rounded-lg ${moduleConfig.color} border`}>
                    <IconComponent className="h-5 w-5" />
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {moduleConfig.stats}
                  </Badge>
                </div>
                <CardTitle className="text-lg group-hover:text-primary transition-colors">
                  {moduleConfig.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <CardDescription className="text-sm leading-relaxed">
                  {moduleConfig.description}
                </CardDescription>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </>
  )
}