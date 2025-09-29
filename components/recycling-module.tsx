"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Recycle, Leaf, Calculator, Award, Truck, TrendingUp } from "lucide-react"

interface RecyclingItem {
  id: string
  componentType: string
  quantity: number
  condition: string
  recoveryRate: number
  carbonSavings: number
  status: "pending" | "processing" | "completed"
}

export default function RecyclingModule({ onBack }: { onBack: () => void }) {
  const [activeTab, setActiveTab] = useState("workflow")
  const [recyclingItems, setRecyclingItems] = useState<RecyclingItem[]>([
    {
      id: "RC001",
      componentType: "Elastic Clips",
      quantity: 150,
      condition: "Good",
      recoveryRate: 85,
      carbonSavings: 12.5,
      status: "processing",
    },
    {
      id: "RC002",
      componentType: "Rail Pads",
      quantity: 200,
      condition: "Fair",
      recoveryRate: 70,
      carbonSavings: 18.2,
      status: "completed",
    },
    {
      id: "RC003",
      componentType: "Liners",
      quantity: 100,
      condition: "Poor",
      recoveryRate: 45,
      carbonSavings: 8.1,
      status: "pending",
    },
  ])

  const [carbonCalculator, setCarbonCalculator] = useState({
    componentType: "",
    quantity: "",
    weight: "",
    transportDistance: "",
  })

  const [sustainabilityScore, setSustainabilityScore] = useState({
    materialRecovery: 78,
    carbonReduction: 85,
    wasteMinimization: 72,
    circularEconomy: 80,
  })

  const calculateCarbonSavings = () => {
    const { quantity, weight, transportDistance } = carbonCalculator
    if (!quantity || !weight || !transportDistance) return 0

    // Mock calculation: (quantity * weight * 0.5) - (transport * 0.1)
    const savings =
      Number.parseInt(quantity) * Number.parseFloat(weight) * 0.5 - Number.parseFloat(transportDistance) * 0.1
    return Math.max(savings, 0).toFixed(2)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500/10 text-green-400 border-green-500/20"
      case "processing":
        return "bg-orange-500/10 text-orange-400 border-orange-500/20"
      case "pending":
        return "bg-gray-500/10 text-gray-400 border-gray-500/20"
      default:
        return "bg-gray-500/10 text-gray-400 border-gray-500/20"
    }
  }

  const workflowSteps = [
    { step: "Collection", progress: 100, status: "completed" },
    { step: "Sorting", progress: 85, status: "processing" },
    { step: "Processing", progress: 60, status: "processing" },
    { step: "Recovery", progress: 30, status: "pending" },
    { step: "Certification", progress: 0, status: "pending" },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" onClick={onBack}>
          ← Back to Dashboard
        </Button>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-green-500/10 rounded-lg">
            <Recycle className="h-6 w-6 text-green-500" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground">End-of-Life & Recycling</h2>
            <p className="text-muted-foreground">Sustainable component lifecycle management</p>
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="workflow" className="text-xs">
            Workflow
          </TabsTrigger>
          <TabsTrigger value="calculator" className="text-xs">
            Calculator
          </TabsTrigger>
          <TabsTrigger value="tracker" className="text-xs">
            Tracker
          </TabsTrigger>
          <TabsTrigger value="scorecard" className="text-xs">
            Scorecard
          </TabsTrigger>
          <TabsTrigger value="portal" className="text-xs">
            Portal
          </TabsTrigger>
          <TabsTrigger value="dashboard" className="text-xs">
            Dashboard
          </TabsTrigger>
        </TabsList>

        <TabsContent value="workflow" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-foreground flex items-center gap-2">
                <Truck className="h-5 w-5 text-orange-500" />
                Recycling Workflow Manager
              </CardTitle>
              <CardDescription>Track step-by-step recycling process</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {workflowSteps.map((step, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-foreground font-medium">{step.step}</span>
                    <Badge className={getStatusColor(step.status)}>{step.status}</Badge>
                  </div>
                  <Progress value={step.progress} className="h-2" />
                  <div className="text-sm text-muted-foreground">{step.progress}% Complete</div>
                </div>
              ))}

              <div className="mt-6 p-4 bg-muted rounded-lg">
                <h4 className="text-foreground font-medium mb-2">Current Batch: RC-2024-001</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Total Items:</span>
                    <span className="text-foreground ml-2">450 components</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Expected Recovery:</span>
                    <span className="text-green-400 ml-2">78%</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="calculator" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-foreground flex items-center gap-2">
                <Calculator className="h-5 w-5 text-blue-500" />
                Carbon Footprint Calculator
              </CardTitle>
              <CardDescription>Calculate CO2 savings from recycling</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Component Type</Label>
                  <Select
                    value={carbonCalculator.componentType}
                    onValueChange={(value) => setCarbonCalculator((prev) => ({ ...prev, componentType: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select component" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="elastic-clips">Elastic Clips</SelectItem>
                      <SelectItem value="rail-pads">Rail Pads</SelectItem>
                      <SelectItem value="liners">Liners</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Quantity</Label>
                  <Input
                    type="number"
                    placeholder="Enter quantity"
                    value={carbonCalculator.quantity}
                    onChange={(e) => setCarbonCalculator((prev) => ({ ...prev, quantity: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Weight per Unit (kg)</Label>
                  <Input
                    type="number"
                    step="0.1"
                    placeholder="Enter weight"
                    value={carbonCalculator.weight}
                    onChange={(e) => setCarbonCalculator((prev) => ({ ...prev, weight: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Transport Distance (km)</Label>
                  <Input
                    type="number"
                    placeholder="Enter distance"
                    value={carbonCalculator.transportDistance}
                    onChange={(e) => setCarbonCalculator((prev) => ({ ...prev, transportDistance: e.target.value }))}
                  />
                </div>
              </div>

              <div className="mt-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-green-400 font-medium">Estimated CO2 Savings</h4>
                    <p className="text-2xl font-bold text-green-400">{calculateCarbonSavings()} kg</p>
                  </div>
                  <Leaf className="h-8 w-8 text-green-400" />
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Equivalent to planting {Math.ceil(Number.parseFloat(calculateCarbonSavings()) / 22)} trees
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tracker" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-foreground flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-purple-500" />
                Material Recovery Tracker
              </CardTitle>
              <CardDescription>Monitor recovery rates by material type</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                {recyclingItems.map((item) => (
                  <div key={item.id} className="p-4 bg-muted rounded-lg">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="text-foreground font-medium">{item.componentType}</h4>
                        <p className="text-sm text-muted-foreground">
                          ID: {item.id} • Qty: {item.quantity}
                        </p>
                      </div>
                      <Badge className={getStatusColor(item.status)}>{item.status}</Badge>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Recovery Rate</span>
                        <span className="text-foreground">{item.recoveryRate}%</span>
                      </div>
                      <Progress value={item.recoveryRate} className="h-2" />
                    </div>

                    <div className="mt-3 flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Carbon Savings: {item.carbonSavings} kg CO2</span>
                      <span className="text-sm text-muted-foreground">Condition: {item.condition}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="scorecard" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-foreground flex items-center gap-2">
                <Award className="h-5 w-5 text-yellow-500" />
                Sustainability Scorecard
              </CardTitle>
              <CardDescription>Environmental impact metrics and scoring</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {Object.entries(sustainabilityScore).map(([key, value]) => (
                <div key={key} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-foreground capitalize">{key.replace(/([A-Z])/g, " $1").trim()}</span>
                    <span className="text-foreground font-bold">{value}/100</span>
                  </div>
                  <Progress value={value} className="h-3" />
                  <div className="text-sm text-muted-foreground">
                    {value >= 80 ? "Excellent" : value >= 60 ? "Good" : value >= 40 ? "Fair" : "Needs Improvement"}
                  </div>
                </div>
              ))}

              <div className="mt-6 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                <div className="flex items-center gap-3">
                  <Award className="h-6 w-6 text-yellow-500" />
                  <div>
                    <h4 className="text-yellow-400 font-medium">Overall Sustainability Score</h4>
                    <p className="text-2xl font-bold text-yellow-400">
                      {Math.round(
                        Object.values(sustainabilityScore).reduce((a, b) => a + b, 0) /
                          Object.values(sustainabilityScore).length,
                      )}
                      /100
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="portal" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-foreground flex items-center gap-2">
                <Truck className="h-5 w-5 text-indigo-500" />
                Recycler Portal
              </CardTitle>
              <CardDescription>Interface for recycling partners</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Recycler Company</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select recycler" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="green-tech">GreenTech Recycling</SelectItem>
                      <SelectItem value="eco-solutions">Eco Solutions Ltd</SelectItem>
                      <SelectItem value="sustainable-materials">Sustainable Materials Co</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Collection Date</Label>
                  <Input type="date" />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Special Instructions</Label>
                <Textarea
                  placeholder="Enter any special handling requirements..."
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-3 gap-4 mt-6">
                <div className="p-3 bg-muted rounded-lg text-center">
                  <div className="text-2xl font-bold text-green-400">15</div>
                  <div className="text-sm text-muted-foreground">Scheduled Collections</div>
                </div>
                <div className="p-3 bg-muted rounded-lg text-center">
                  <div className="text-2xl font-bold text-blue-400">8</div>
                  <div className="text-sm text-muted-foreground">Active Partners</div>
                </div>
                <div className="p-3 bg-muted rounded-lg text-center">
                  <div className="text-2xl font-bold text-purple-400">92%</div>
                  <div className="text-sm text-muted-foreground">On-time Rate</div>
                </div>
              </div>

              <Button className="w-full">Schedule Collection</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="dashboard" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-foreground flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-500" />
                Recycling Dashboard
              </CardTitle>
              <CardDescription>Overview of all recycling activities</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 bg-muted rounded-lg text-center">
                  <div className="text-2xl font-bold text-green-400">1,890</div>
                  <div className="text-sm text-muted-foreground">kg Recycled</div>
                </div>
                <div className="p-4 bg-muted rounded-lg text-center">
                  <div className="text-2xl font-bold text-blue-400">76%</div>
                  <div className="text-sm text-muted-foreground">Recovery Rate</div>
                </div>
                <div className="p-4 bg-muted rounded-lg text-center">
                  <div className="text-2xl font-bold text-purple-400">124</div>
                  <div className="text-sm text-muted-foreground">kg CO2 Saved</div>
                </div>
                <div className="p-4 bg-muted rounded-lg text-center">
                  <div className="text-2xl font-bold text-orange-400">12</div>
                  <div className="text-sm text-muted-foreground">Active Batches</div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                <h4 className="text-green-400 font-medium mb-2">Environmental Impact</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Trees Equivalent:</span>
                    <span className="text-foreground ml-2">6 trees planted</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Waste Diverted:</span>
                    <span className="text-foreground ml-2">98% from landfill</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}