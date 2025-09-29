"use client"

import React, { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Calculator,
  IndianRupee,
  Ruler,
  Package,
  Clock,
  TrendingUp,
  Wrench,
  Train,
  Map,
  AlertTriangle,
  CheckCircle,
  Download,
  RotateCcw,
  Save
} from "lucide-react"
import { buttonHandlers } from "@/lib/button-utils"

interface CalculationResult {
  value: number
  unit: string
  details: string[]
  warnings?: string[]
}

export default function RailwayCalculator({ onBack }: { onBack: () => void }) {
  const [activeTab, setActiveTab] = useState("cost")
  
  // Cost Calculator State
  const [costCalc, setCostCalc] = useState({
    projectType: "",
    trackLength: "",
    componentType: "",
    quantity: "",
    laborCost: "",
    materialCost: "",
    region: ""
  })

  // Material Calculator State
  const [materialCalc, setMaterialCalc] = useState({
    trackType: "",
    length: "",
    spacing: "",
    componentType: "",
    safety_factor: "1.2"
  })

  // Distance Calculator State
  const [distanceCalc, setDistanceCalc] = useState({
    startStation: "",
    endStation: "",
    viaStations: "",
    trackType: "",
    terrain: ""
  })

  // Maintenance Calculator State
  const [maintenanceCalc, setMaintenanceCalc] = useState({
    componentType: "",
    age: "",
    usage: "",
    environment: "",
    lastMaintenance: ""
  })

  // Load Calculator State
  const [loadCalc, setLoadCalc] = useState({
    trainType: "",
    axleLoad: "",
    speed: "",
    frequency: "",
    trackGrade: ""
  })

  // Time Calculator State
  const [timeCalc, setTimeCalc] = useState({
    distance: "",
    avgSpeed: "",
    stops: "",
    dwellTime: "",
    accelerationTime: ""
  })

  const [results, setResults] = useState<Record<string, CalculationResult | null>>({
    cost: null,
    material: null,
    distance: null,
    maintenance: null,
    load: null,
    time: null
  })

  const calculateCost = () => {
    const { trackLength, quantity, laborCost, materialCost, region, projectType } = costCalc
    
    if (!trackLength || !quantity || !laborCost || !materialCost) {
      return
    }

    const baseLength = parseFloat(trackLength)
    const qty = parseFloat(quantity)
    const labor = parseFloat(laborCost)
    const material = parseFloat(materialCost)

    // Regional multipliers
    const regionalMultipliers: Record<string, number> = {
      "north": 1.0,
      "south": 0.9,
      "east": 0.85,
      "west": 1.1,
      "northeast": 1.2,
      "central": 0.95
    }

    const multiplier = regionalMultipliers[region] || 1.0
    
    const subtotal = (material * qty) + (labor * baseLength)
    const regional_cost = subtotal * multiplier
    const overhead = regional_cost * 0.15 // 15% overhead
    const tax = regional_cost * 0.18 // 18% GST
    const total = regional_cost + overhead + tax

    const details = [
      `Base Material Cost: ₹${(material * qty).toLocaleString()}`,
      `Labor Cost: ₹${(labor * baseLength).toLocaleString()}`,
      `Regional Adjustment (${region}): ${((multiplier - 1) * 100).toFixed(1)}%`,
      `Overhead (15%): ₹${overhead.toLocaleString()}`,
      `GST (18%): ₹${tax.toLocaleString()}`,
      `Project Type: ${projectType}`
    ]

    const warnings: string[] = []
    if (total > 10000000) warnings.push("High-value project - requires additional approvals")
    if (multiplier > 1.1) warnings.push("High regional cost factor - consider alternatives")

    setResults(prev => ({
      ...prev,
      cost: {
        value: total,
        unit: "INR",
        details,
        warnings
      }
    }))
  }

  const calculateMaterial = () => {
    const { trackType, length, spacing, componentType } = materialCalc
    
    if (!length || !spacing || !componentType) {
      return
    }

    const trackLength = parseFloat(length)
    const componentSpacing = parseFloat(spacing)
    const safetyFactor = parseFloat(materialCalc.safety_factor)

    // Component requirements per km
    const componentRequirements: Record<string, Record<string, number>> = {
      "elastic-clips": {
        "broad-gauge": 2000,
        "meter-gauge": 1800,
        "narrow-gauge": 1600
      },
      "rail-pads": {
        "broad-gauge": 1000,
        "meter-gauge": 900,
        "narrow-gauge": 800
      },
      "liners": {
        "broad-gauge": 1000,
        "meter-gauge": 900,
        "narrow-gauge": 800
      },
      "sleepers": {
        "broad-gauge": 1540,
        "meter-gauge": 1320,
        "narrow-gauge": 1100
      }
    }

    const baseRequirement = componentRequirements[componentType]?.[trackType] || 1000
    const totalQuantity = Math.ceil((trackLength * baseRequirement * safetyFactor) / 1000)
    
    const details = [
      `Track Type: ${trackType}`,
      `Track Length: ${trackLength} km`,
      `Component Spacing: ${componentSpacing} mm`,
      `Base Requirement: ${baseRequirement} per km`,
      `Safety Factor: ${safetyFactor}`,
      `Additional 10% for wastage included`
    ]

    const warnings: string[] = []
    if (safetyFactor < 1.1) warnings.push("Low safety factor - consider increasing")
    if (totalQuantity > 50000) warnings.push("Large quantity - ensure adequate storage")

    setResults(prev => ({
      ...prev,
      material: {
        value: totalQuantity,
        unit: "units",
        details,
        warnings
      }
    }))
  }

  const calculateDistance = () => {
    const { startStation, endStation, terrain, trackType } = distanceCalc
    
    if (!startStation || !endStation) {
      return
    }

    // Mock distance calculation based on station names
    // In real implementation, this would use actual geographic data
    const mockDistances: Record<string, number> = {
      "delhi-mumbai": 1384,
      "mumbai-delhi": 1384,
      "delhi-kolkata": 1472,
      "kolkata-delhi": 1472,
      "chennai-delhi": 2180,
      "delhi-chennai": 2180,
      "mumbai-kolkata": 1968,
      "kolkata-mumbai": 1968
    }

    const routeKey = `${startStation.toLowerCase()}-${endStation.toLowerCase()}`
    let baseDistance = mockDistances[routeKey] || 500 // Default distance

    // Terrain adjustments
    const terrainMultipliers: Record<string, number> = {
      "plain": 1.0,
      "hilly": 1.15,
      "mountainous": 1.3,
      "desert": 1.05,
      "coastal": 1.02
    }

    const terrainMultiplier = terrainMultipliers[terrain] || 1.0
    const adjustedDistance = baseDistance * terrainMultiplier

    const details = [
      `Start Station: ${startStation}`,
      `End Station: ${endStation}`,
      `Base Distance: ${baseDistance} km`,
      `Terrain: ${terrain}`,
      `Terrain Adjustment: ${((terrainMultiplier - 1) * 100).toFixed(1)}%`,
      `Track Type: ${trackType}`
    ]

    const warnings: string[] = []
    if (adjustedDistance > 2000) warnings.push("Long distance route - consider intermediate maintenance points")
    if (terrain === "mountainous") warnings.push("Mountainous terrain - additional safety measures required")

    setResults(prev => ({
      ...prev,
      distance: {
        value: adjustedDistance,
        unit: "km",
        details,
        warnings
      }
    }))
  }

  const calculateMaintenance = () => {
    const { componentType, age, usage, environment } = maintenanceCalc
    
    if (!age || !usage || !environment) {
      return
    }

    const componentAge = parseFloat(age)
    const usageLevel = usage
    const envConditions = environment

    // Base maintenance intervals (in months)
    const baseIntervals: Record<string, number> = {
      "elastic-clips": 12,
      "rail-pads": 18,
      "liners": 24,
      "sleepers": 60,
      "rails": 120
    }

    // Usage multipliers
    const usageMultipliers: Record<string, number> = {
      "light": 1.2,
      "medium": 1.0,
      "heavy": 0.8,
      "very-heavy": 0.6
    }

    // Environment multipliers
    const envMultipliers: Record<string, number> = {
      "normal": 1.0,
      "coastal": 0.8,
      "industrial": 0.7,
      "desert": 0.9,
      "hilly": 0.85
    }

    const baseInterval = baseIntervals[componentType] || 12
    const usageMultiplier = usageMultipliers[usageLevel] || 1.0
    const envMultiplier = envMultipliers[envConditions] || 1.0
    
    const recommendedInterval = Math.max(3, Math.floor(baseInterval * usageMultiplier * envMultiplier))
    const urgencyScore = Math.min(100, (componentAge / recommendedInterval) * 100)

    const details = [
      `Component Type: ${componentType}`,
      `Current Age: ${componentAge} months`,
      `Usage Level: ${usageLevel}`,
      `Environment: ${envConditions}`,
      `Base Interval: ${baseInterval} months`,
      `Recommended Interval: ${recommendedInterval} months`,
      `Urgency Score: ${urgencyScore.toFixed(1)}%`
    ]

    const warnings: string[] = []
    if (urgencyScore > 80) warnings.push("Maintenance overdue - schedule immediately")
    if (urgencyScore > 60) warnings.push("Maintenance due soon - plan accordingly")
    if (envConditions === "coastal" || envConditions === "industrial") {
      warnings.push("Harsh environment - consider more frequent inspections")
    }

    setResults(prev => ({
      ...prev,
      maintenance: {
        value: recommendedInterval,
        unit: "months",
        details,
        warnings
      }
    }))
  }

  const calculateLoad = () => {
    const { trainType, axleLoad, speed, frequency } = loadCalc
    
    if (!axleLoad || !speed || !frequency) {
      return
    }

    const axle_load = parseFloat(axleLoad)
    const train_speed = parseFloat(speed)
    const daily_frequency = parseFloat(frequency)

    // Load calculations
    const dynamicLoad = axle_load * (1 + (train_speed / 100) * 0.3)
    const dailyTonnage = dynamicLoad * daily_frequency * 365 / 1000 // Convert to annual tonnage in thousands
    
    // Track stress calculations
    const stressIndex = (dynamicLoad * Math.sqrt(train_speed)) / 1000
    
    const details = [
      `Train Type: ${trainType}`,
      `Static Axle Load: ${axle_load} tons`,
      `Operating Speed: ${train_speed} km/h`,
      `Daily Frequency: ${daily_frequency} trains`,
      `Dynamic Load Factor: ${(dynamicLoad / axle_load).toFixed(2)}`,
      `Annual Tonnage: ${dailyTonnage.toFixed(0)}k tons`,
      `Track Stress Index: ${stressIndex.toFixed(2)}`
    ]

    const warnings: string[] = []
    if (stressIndex > 15) warnings.push("High track stress - consider speed restrictions")
    if (axle_load > 25) warnings.push("Heavy axle load - ensure track is rated for this weight")
    if (daily_frequency > 50) warnings.push("High frequency - plan for accelerated maintenance")

    setResults(prev => ({
      ...prev,
      load: {
        value: stressIndex,
        unit: "stress index",
        details,
        warnings
      }
    }))
  }

  const calculateTime = () => {
    const { distance, avgSpeed, stops, dwellTime } = timeCalc
    
    if (!distance || !avgSpeed || !stops || !dwellTime) {
      return
    }

    const route_distance = parseFloat(distance)
    const average_speed = parseFloat(avgSpeed)
    const stop_count = parseFloat(stops)
    const dwell_time = parseFloat(dwellTime)

    // Time calculations
    const runningTime = route_distance / average_speed
    const totalDwellTime = stop_count * dwell_time / 60 // Convert to hours
    const accelerationTime = stop_count * 2 / 60 // 2 minutes per stop for accel/decel
    const totalTime = runningTime + totalDwellTime + accelerationTime

    const details = [
      `Route Distance: ${route_distance} km`,
      `Average Speed: ${average_speed} km/h`,
      `Number of Stops: ${stop_count}`,
      `Dwell Time per Stop: ${dwell_time} minutes`,
      `Running Time: ${(runningTime * 60).toFixed(0)} minutes`,
      `Total Dwell Time: ${(totalDwellTime * 60).toFixed(0)} minutes`,
      `Acceleration Time: ${(accelerationTime * 60).toFixed(0)} minutes`
    ]

    const warnings: string[] = []
    if (totalTime > 12) warnings.push("Long journey time - consider passenger comfort")
    if (average_speed > 160) warnings.push("High speed - ensure track is rated for this speed")
    if (stop_count > 20) warnings.push("Many stops - consider express services")

    setResults(prev => ({
      ...prev,
      time: {
        value: totalTime,
        unit: "hours",
        details,
        warnings
      }
    }))
  }

  const resetCalculator = (type: string) => {
    switch (type) {
      case "cost":
        setCostCalc({
          projectType: "",
          trackLength: "",
          componentType: "",
          quantity: "",
          laborCost: "",
          materialCost: "",
          region: ""
        })
        break
      case "material":
        setMaterialCalc({
          trackType: "",
          length: "",
          spacing: "",
          componentType: "",
          safety_factor: "1.2"
        })
        break
      case "distance":
        setDistanceCalc({
          startStation: "",
          endStation: "",
          viaStations: "",
          trackType: "",
          terrain: ""
        })
        break
      case "maintenance":
        setMaintenanceCalc({
          componentType: "",
          age: "",
          usage: "",
          environment: "",
          lastMaintenance: ""
        })
        break
      case "load":
        setLoadCalc({
          trainType: "",
          axleLoad: "",
          speed: "",
          frequency: "",
          trackGrade: ""
        })
        break
      case "time":
        setTimeCalc({
          distance: "",
          avgSpeed: "",
          stops: "",
          dwellTime: "",
          accelerationTime: ""
        })
        break
    }
    
    setResults(prev => ({ ...prev, [type]: null }))
  }

  const exportResults = (type: string) => {
    const result = results[type]
    if (!result) return

    const data = {
      calculator: type,
      result: result.value,
      unit: result.unit,
      details: result.details,
      warnings: result.warnings || [],
      timestamp: new Date().toISOString()
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `railway-${type}-calculation.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" onClick={onBack}>
          ← Back to Dashboard
        </Button>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-orange-500/10 rounded-lg">
            <Calculator className="h-6 w-6 text-orange-500" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground">Railway Calculator</h2>
            <p className="text-muted-foreground">Comprehensive calculations for railway projects</p>
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="cost" className="flex items-center gap-2">
            <IndianRupee className="h-4 w-4" />
            Cost
          </TabsTrigger>
          <TabsTrigger value="material" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            Material
          </TabsTrigger>
          <TabsTrigger value="distance" className="flex items-center gap-2">
            <Map className="h-4 w-4" />
            Distance
          </TabsTrigger>
          <TabsTrigger value="maintenance" className="flex items-center gap-2">
            <Wrench className="h-4 w-4" />
            Maintenance
          </TabsTrigger>
          <TabsTrigger value="load" className="flex items-center gap-2">
            <Train className="h-4 w-4" />
            Load
          </TabsTrigger>
          <TabsTrigger value="time" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Time
          </TabsTrigger>
        </TabsList>

        {/* Cost Calculator */}
        <TabsContent value="cost" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <IndianRupee className="h-5 w-5 text-green-500" />
                  Project Cost Calculator
                </CardTitle>
                <CardDescription>Calculate total project costs including materials, labor, and regional factors</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Project Type</Label>
                    <Select value={costCalc.projectType} onValueChange={(value) => setCostCalc(prev => ({...prev, projectType: value}))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select project type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="new-construction">New Construction</SelectItem>
                        <SelectItem value="maintenance">Maintenance</SelectItem>
                        <SelectItem value="upgrade">Track Upgrade</SelectItem>
                        <SelectItem value="electrification">Electrification</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Track Length (km)</Label>
                    <Input 
                      type="number" 
                      placeholder="Enter length" 
                      value={costCalc.trackLength}
                      onChange={(e) => setCostCalc(prev => ({...prev, trackLength: e.target.value}))}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Component Type</Label>
                    <Select value={costCalc.componentType} onValueChange={(value) => setCostCalc(prev => ({...prev, componentType: value}))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select component" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="elastic-clips">Elastic Clips</SelectItem>
                        <SelectItem value="rail-pads">Rail Pads</SelectItem>
                        <SelectItem value="liners">Liners</SelectItem>
                        <SelectItem value="sleepers">Sleepers</SelectItem>
                        <SelectItem value="rails">Rails</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Quantity</Label>
                    <Input 
                      type="number" 
                      placeholder="Enter quantity" 
                      value={costCalc.quantity}
                      onChange={(e) => setCostCalc(prev => ({...prev, quantity: e.target.value}))}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Material Cost (₹ per unit)</Label>
                    <Input 
                      type="number" 
                      placeholder="Enter material cost" 
                      value={costCalc.materialCost}
                      onChange={(e) => setCostCalc(prev => ({...prev, materialCost: e.target.value}))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Labor Cost (₹ per km)</Label>
                    <Input 
                      type="number" 
                      placeholder="Enter labor cost" 
                      value={costCalc.laborCost}
                      onChange={(e) => setCostCalc(prev => ({...prev, laborCost: e.target.value}))}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Region</Label>
                  <Select value={costCalc.region} onValueChange={(value) => setCostCalc(prev => ({...prev, region: value}))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select region" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="north">Northern Railway</SelectItem>
                      <SelectItem value="south">Southern Railway</SelectItem>
                      <SelectItem value="east">Eastern Railway</SelectItem>
                      <SelectItem value="west">Western Railway</SelectItem>
                      <SelectItem value="northeast">Northeast Frontier Railway</SelectItem>
                      <SelectItem value="central">Central Railway</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex gap-2">
                  <Button onClick={calculateCost} className="flex-1">
                    <Calculator className="h-4 w-4 mr-2" />
                    Calculate Cost
                  </Button>
                  <Button variant="outline" onClick={() => resetCalculator("cost")}>
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Cost Results */}
            {results.cost && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    Cost Calculation Results
                  </CardTitle>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => exportResults("cost")}>
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                      <div className="text-3xl font-bold text-green-400">
                        ₹{results.cost.value.toLocaleString()}
                      </div>
                      <div className="text-sm text-muted-foreground">Total Project Cost</div>
                    </div>

                    <Separator />

                    <div className="space-y-2">
                      <h4 className="font-medium text-foreground">Cost Breakdown:</h4>
                      {results.cost.details.map((detail, index) => (
                        <div key={index} className="text-sm text-muted-foreground">
                          • {detail}
                        </div>
                      ))}
                    </div>

                    {results.cost.warnings && results.cost.warnings.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="font-medium text-orange-400 flex items-center gap-2">
                          <AlertTriangle className="h-4 w-4" />
                          Warnings:
                        </h4>
                        {results.cost.warnings.map((warning, index) => (
                          <div key={index} className="text-sm text-orange-400 bg-orange-500/10 p-2 rounded">
                            • {warning}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        {/* Material Calculator */}
        <TabsContent value="material" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-blue-500" />
                  Material Requirement Calculator
                </CardTitle>
                <CardDescription>Calculate material quantities needed for railway projects</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Track Type</Label>
                    <Select value={materialCalc.trackType} onValueChange={(value) => setMaterialCalc(prev => ({...prev, trackType: value}))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select track type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="broad-gauge">Broad Gauge (1676mm)</SelectItem>
                        <SelectItem value="meter-gauge">Meter Gauge (1000mm)</SelectItem>
                        <SelectItem value="narrow-gauge">Narrow Gauge (762mm)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Track Length (km)</Label>
                    <Input 
                      type="number" 
                      placeholder="Enter length" 
                      value={materialCalc.length}
                      onChange={(e) => setMaterialCalc(prev => ({...prev, length: e.target.value}))}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Component Type</Label>
                    <Select value={materialCalc.componentType} onValueChange={(value) => setMaterialCalc(prev => ({...prev, componentType: value}))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select component" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="elastic-clips">Elastic Clips</SelectItem>
                        <SelectItem value="rail-pads">Rail Pads</SelectItem>
                        <SelectItem value="liners">Liners</SelectItem>
                        <SelectItem value="sleepers">Sleepers</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Component Spacing (mm)</Label>
                    <Input 
                      type="number" 
                      placeholder="Enter spacing" 
                      value={materialCalc.spacing}
                      onChange={(e) => setMaterialCalc(prev => ({...prev, spacing: e.target.value}))}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Safety Factor</Label>
                  <Select value={materialCalc.safety_factor} onValueChange={(value) => setMaterialCalc(prev => ({...prev, safety_factor: value}))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1.1">1.1 (Standard)</SelectItem>
                      <SelectItem value="1.2">1.2 (Recommended)</SelectItem>
                      <SelectItem value="1.3">1.3 (High Safety)</SelectItem>
                      <SelectItem value="1.5">1.5 (Critical Projects)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex gap-2">
                  <Button onClick={calculateMaterial} className="flex-1">
                    <Calculator className="h-4 w-4 mr-2" />
                    Calculate Material
                  </Button>
                  <Button variant="outline" onClick={() => resetCalculator("material")}>
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Material Results */}
            {results.material && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    Material Calculation Results
                  </CardTitle>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => exportResults("material")}>
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                      <div className="text-3xl font-bold text-blue-400">
                        {results.material.value.toLocaleString()}
                      </div>
                      <div className="text-sm text-muted-foreground">Units Required</div>
                    </div>

                    <Separator />

                    <div className="space-y-2">
                      <h4 className="font-medium text-foreground">Calculation Details:</h4>
                      {results.material.details.map((detail, index) => (
                        <div key={index} className="text-sm text-muted-foreground">
                          • {detail}
                        </div>
                      ))}
                    </div>

                    {results.material.warnings && results.material.warnings.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="font-medium text-orange-400 flex items-center gap-2">
                          <AlertTriangle className="h-4 w-4" />
                          Warnings:
                        </h4>
                        {results.material.warnings.map((warning, index) => (
                          <div key={index} className="text-sm text-orange-400 bg-orange-500/10 p-2 rounded">
                            • {warning}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        {/* Distance Calculator */}
        <TabsContent value="distance" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Map className="h-5 w-5 text-purple-500" />
                  Route Distance Calculator
                </CardTitle>
                <CardDescription>Calculate distances between railway stations with terrain adjustments</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Start Station</Label>
                    <Select value={distanceCalc.startStation} onValueChange={(value) => setDistanceCalc(prev => ({...prev, startStation: value}))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select start station" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Delhi">Delhi</SelectItem>
                        <SelectItem value="Mumbai">Mumbai</SelectItem>
                        <SelectItem value="Kolkata">Kolkata</SelectItem>
                        <SelectItem value="Chennai">Chennai</SelectItem>
                        <SelectItem value="Bangalore">Bangalore</SelectItem>
                        <SelectItem value="Hyderabad">Hyderabad</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>End Station</Label>
                    <Select value={distanceCalc.endStation} onValueChange={(value) => setDistanceCalc(prev => ({...prev, endStation: value}))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select end station" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Delhi">Delhi</SelectItem>
                        <SelectItem value="Mumbai">Mumbai</SelectItem>
                        <SelectItem value="Kolkata">Kolkata</SelectItem>
                        <SelectItem value="Chennai">Chennai</SelectItem>
                        <SelectItem value="Bangalore">Bangalore</SelectItem>
                        <SelectItem value="Hyderabad">Hyderabad</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Track Type</Label>
                    <Select value={distanceCalc.trackType} onValueChange={(value) => setDistanceCalc(prev => ({...prev, trackType: value}))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select track type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="single">Single Line</SelectItem>
                        <SelectItem value="double">Double Line</SelectItem>
                        <SelectItem value="multiple">Multiple Line</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Terrain Type</Label>
                    <Select value={distanceCalc.terrain} onValueChange={(value) => setDistanceCalc(prev => ({...prev, terrain: value}))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select terrain" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="plain">Plain</SelectItem>
                        <SelectItem value="hilly">Hilly</SelectItem>
                        <SelectItem value="mountainous">Mountainous</SelectItem>
                        <SelectItem value="desert">Desert</SelectItem>
                        <SelectItem value="coastal">Coastal</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Via Stations (optional)</Label>
                  <Input 
                    placeholder="Enter intermediate stations" 
                    value={distanceCalc.viaStations}
                    onChange={(e) => setDistanceCalc(prev => ({...prev, viaStations: e.target.value}))}
                  />
                </div>

                <div className="flex gap-2">
                  <Button onClick={calculateDistance} className="flex-1">
                    <Calculator className="h-4 w-4 mr-2" />
                    Calculate Distance
                  </Button>
                  <Button variant="outline" onClick={() => resetCalculator("distance")}>
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Distance Results */}
            {results.distance && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    Distance Calculation Results
                  </CardTitle>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => exportResults("distance")}>
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center p-4 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                      <div className="text-3xl font-bold text-purple-400">
                        {results.distance.value.toFixed(1)} km
                      </div>
                      <div className="text-sm text-muted-foreground">Total Route Distance</div>
                    </div>

                    <Separator />

                    <div className="space-y-2">
                      <h4 className="font-medium text-foreground">Route Details:</h4>
                      {results.distance.details.map((detail, index) => (
                        <div key={index} className="text-sm text-muted-foreground">
                          • {detail}
                        </div>
                      ))}
                    </div>

                    {results.distance.warnings && results.distance.warnings.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="font-medium text-orange-400 flex items-center gap-2">
                          <AlertTriangle className="h-4 w-4" />
                          Warnings:
                        </h4>
                        {results.distance.warnings.map((warning, index) => (
                          <div key={index} className="text-sm text-orange-400 bg-orange-500/10 p-2 rounded">
                            • {warning}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        {/* Maintenance Calculator */}
        <TabsContent value="maintenance" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wrench className="h-5 w-5 text-yellow-500" />
                  Maintenance Schedule Calculator
                </CardTitle>
                <CardDescription>Calculate optimal maintenance intervals based on component condition</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Component Type</Label>
                    <Select value={maintenanceCalc.componentType} onValueChange={(value) => setMaintenanceCalc(prev => ({...prev, componentType: value}))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select component" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="elastic-clips">Elastic Clips</SelectItem>
                        <SelectItem value="rail-pads">Rail Pads</SelectItem>
                        <SelectItem value="liners">Liners</SelectItem>
                        <SelectItem value="sleepers">Sleepers</SelectItem>
                        <SelectItem value="rails">Rails</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Current Age (months)</Label>
                    <Input 
                      type="number" 
                      placeholder="Enter age" 
                      value={maintenanceCalc.age}
                      onChange={(e) => setMaintenanceCalc(prev => ({...prev, age: e.target.value}))}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Usage Level</Label>
                    <Select value={maintenanceCalc.usage} onValueChange={(value) => setMaintenanceCalc(prev => ({...prev, usage: value}))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select usage level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">Light (0-20 trains/day)</SelectItem>
                        <SelectItem value="medium">Medium (21-50 trains/day)</SelectItem>
                        <SelectItem value="heavy">Heavy (51-100 trains/day)</SelectItem>
                        <SelectItem value="very-heavy">Very Heavy (100+ trains/day)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Environment</Label>
                    <Select value={maintenanceCalc.environment} onValueChange={(value) => setMaintenanceCalc(prev => ({...prev, environment: value}))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select environment" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="normal">Normal</SelectItem>
                        <SelectItem value="coastal">Coastal (High Humidity)</SelectItem>
                        <SelectItem value="industrial">Industrial (Polluted)</SelectItem>
                        <SelectItem value="desert">Desert (High Temperature)</SelectItem>
                        <SelectItem value="hilly">Hilly (Variable Weather)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Last Maintenance Date</Label>
                  <Input 
                    type="date" 
                    value={maintenanceCalc.lastMaintenance}
                    onChange={(e) => setMaintenanceCalc(prev => ({...prev, lastMaintenance: e.target.value}))}
                  />
                </div>

                <div className="flex gap-2">
                  <Button onClick={calculateMaintenance} className="flex-1">
                    <Calculator className="h-4 w-4 mr-2" />
                    Calculate Schedule
                  </Button>
                  <Button variant="outline" onClick={() => resetCalculator("maintenance")}>
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Maintenance Results */}
            {results.maintenance && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    Maintenance Schedule Results
                  </CardTitle>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => exportResults("maintenance")}>
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                      <div className="text-3xl font-bold text-yellow-400">
                        {results.maintenance.value} months
                      </div>
                      <div className="text-sm text-muted-foreground">Recommended Maintenance Interval</div>
                    </div>

                    <Separator />

                    <div className="space-y-2">
                      <h4 className="font-medium text-foreground">Analysis Details:</h4>
                      {results.maintenance.details.map((detail, index) => (
                        <div key={index} className="text-sm text-muted-foreground">
                          • {detail}
                        </div>
                      ))}
                    </div>

                    {results.maintenance.warnings && results.maintenance.warnings.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="font-medium text-orange-400 flex items-center gap-2">
                          <AlertTriangle className="h-4 w-4" />
                          Warnings:
                        </h4>
                        {results.maintenance.warnings.map((warning, index) => (
                          <div key={index} className="text-sm text-orange-400 bg-orange-500/10 p-2 rounded">
                            • {warning}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        {/* Load Calculator */}
        <TabsContent value="load" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Train className="h-5 w-5 text-red-500" />
                  Track Load Analysis Calculator
                </CardTitle>
                <CardDescription>Calculate track stress and load capacity requirements</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Train Type</Label>
                    <Select value={loadCalc.trainType} onValueChange={(value) => setLoadCalc(prev => ({...prev, trainType: value}))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select train type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="passenger">Passenger</SelectItem>
                        <SelectItem value="freight">Freight</SelectItem>
                        <SelectItem value="high-speed">High Speed</SelectItem>
                        <SelectItem value="metro">Metro</SelectItem>
                        <SelectItem value="goods">Goods</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Axle Load (tons)</Label>
                    <Input 
                      type="number" 
                      placeholder="Enter axle load" 
                      value={loadCalc.axleLoad}
                      onChange={(e) => setLoadCalc(prev => ({...prev, axleLoad: e.target.value}))}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Operating Speed (km/h)</Label>
                    <Input 
                      type="number" 
                      placeholder="Enter speed" 
                      value={loadCalc.speed}
                      onChange={(e) => setLoadCalc(prev => ({...prev, speed: e.target.value}))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Daily Frequency</Label>
                    <Input 
                      type="number" 
                      placeholder="Trains per day" 
                      value={loadCalc.frequency}
                      onChange={(e) => setLoadCalc(prev => ({...prev, frequency: e.target.value}))}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Track Grade (%)</Label>
                  <Input 
                    type="number" 
                    placeholder="Enter grade percentage" 
                    value={loadCalc.trackGrade}
                    onChange={(e) => setLoadCalc(prev => ({...prev, trackGrade: e.target.value}))}
                  />
                </div>

                <div className="flex gap-2">
                  <Button onClick={calculateLoad} className="flex-1">
                    <Calculator className="h-4 w-4 mr-2" />
                    Calculate Load
                  </Button>
                  <Button variant="outline" onClick={() => resetCalculator("load")}>
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Load Results */}
            {results.load && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    Track Load Analysis Results
                  </CardTitle>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => exportResults("load")}>
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                      <div className="text-3xl font-bold text-red-400">
                        {results.load.value.toFixed(2)}
                      </div>
                      <div className="text-sm text-muted-foreground">Track Stress Index</div>
                    </div>

                    <Separator />

                    <div className="space-y-2">
                      <h4 className="font-medium text-foreground">Load Analysis:</h4>
                      {results.load.details.map((detail, index) => (
                        <div key={index} className="text-sm text-muted-foreground">
                          • {detail}
                        </div>
                      ))}
                    </div>

                    {results.load.warnings && results.load.warnings.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="font-medium text-orange-400 flex items-center gap-2">
                          <AlertTriangle className="h-4 w-4" />
                          Warnings:
                        </h4>
                        {results.load.warnings.map((warning, index) => (
                          <div key={index} className="text-sm text-orange-400 bg-orange-500/10 p-2 rounded">
                            • {warning}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        {/* Time Calculator */}
        <TabsContent value="time" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-cyan-500" />
                  Journey Time Calculator
                </CardTitle>
                <CardDescription>Calculate total journey time including stops and delays</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Route Distance (km)</Label>
                    <Input 
                      type="number" 
                      placeholder="Enter distance" 
                      value={timeCalc.distance}
                      onChange={(e) => setTimeCalc(prev => ({...prev, distance: e.target.value}))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Average Speed (km/h)</Label>
                    <Input 
                      type="number" 
                      placeholder="Enter avg speed" 
                      value={timeCalc.avgSpeed}
                      onChange={(e) => setTimeCalc(prev => ({...prev, avgSpeed: e.target.value}))}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Number of Stops</Label>
                    <Input 
                      type="number" 
                      placeholder="Enter stop count" 
                      value={timeCalc.stops}
                      onChange={(e) => setTimeCalc(prev => ({...prev, stops: e.target.value}))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Dwell Time per Stop (minutes)</Label>
                    <Input 
                      type="number" 
                      placeholder="Enter dwell time" 
                      value={timeCalc.dwellTime}
                      onChange={(e) => setTimeCalc(prev => ({...prev, dwellTime: e.target.value}))}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Acceleration Time per Stop (minutes)</Label>
                  <Input 
                    type="number" 
                    placeholder="Enter accel time" 
                    value={timeCalc.accelerationTime}
                    onChange={(e) => setTimeCalc(prev => ({...prev, accelerationTime: e.target.value}))}
                  />
                </div>

                <div className="flex gap-2">
                  <Button onClick={calculateTime} className="flex-1">
                    <Calculator className="h-4 w-4 mr-2" />
                    Calculate Time
                  </Button>
                  <Button variant="outline" onClick={() => resetCalculator("time")}>
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Time Results */}
            {results.time && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    Journey Time Results
                  </CardTitle>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => exportResults("time")}>
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center p-4 bg-cyan-500/10 border border-cyan-500/20 rounded-lg">
                      <div className="text-3xl font-bold text-cyan-400">
                        {results.time.value.toFixed(1)} hours
                      </div>
                      <div className="text-sm text-muted-foreground">Total Journey Time</div>
                    </div>

                    <Separator />

                    <div className="space-y-2">
                      <h4 className="font-medium text-foreground">Time Breakdown:</h4>
                      {results.time.details.map((detail, index) => (
                        <div key={index} className="text-sm text-muted-foreground">
                          • {detail}
                        </div>
                      ))}
                    </div>

                    {results.time.warnings && results.time.warnings.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="font-medium text-orange-400 flex items-center gap-2">
                          <AlertTriangle className="h-4 w-4" />
                          Warnings:
                        </h4>
                        {results.time.warnings.map((warning, index) => (
                          <div key={index} className="text-sm text-orange-400 bg-orange-500/10 p-2 rounded">
                            • {warning}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}