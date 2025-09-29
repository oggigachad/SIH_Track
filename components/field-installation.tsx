"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MapPin, Camera, CheckCircle, Clock, AlertTriangle, Upload, Navigation, Wrench, Users } from "lucide-react"
import { getStoredLocation, formatLocation, type LocationData } from "@/lib/location-utils"

interface Installation {
  id: string
  componentId: string
  componentName: string
  location: string
  coordinates: { lat: number; lng: number }
  assignedCrew: string[]
  status: "pending" | "in-progress" | "completed" | "verified"
  installationDate: string
  verificationPhotos: string[]
  tmsIntegrated: boolean
  notes: string
}

export default function FieldInstallation({ onBack }: { onBack: () => void }) {
  const [activeTab, setActiveTab] = useState("dashboard")
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [installations, setInstallations] = useState<Installation[]>([
    {
      id: "1",
      componentId: "RSL-2024-001-01",
      componentName: "Railway Signal Light",
      location: "Platform 2, New Delhi Station",
      coordinates: { lat: 28.6448, lng: 77.2097 },
      assignedCrew: ["Suresh Kumar", "Amit Singh"],
      status: "completed",
      installationDate: "2024-01-25",
      verificationPhotos: ["photo1.jpg", "photo2.jpg"],
      tmsIntegrated: true,
      notes: "Installation completed successfully. Signal tested and operational.",
    },
    {
      id: "2",
      componentId: "TF-2024-002-15",
      componentName: "Track Fastener",
      location: "Track Section 12-A, Mumbai Central",
      coordinates: { lat: 19.033, lng: 72.8397 },
      assignedCrew: ["Rajesh Patel", "Vikram Yadav"],
      status: "in-progress",
      installationDate: "2024-01-26",
      verificationPhotos: [],
      tmsIntegrated: false,
      notes: "Installation in progress. Weather conditions favorable.",
    },
  ])

  const [newInstallation, setNewInstallation] = useState({
    componentId: "",
    location: "",
    notes: "",
    crewMembers: "",
  })

  // Real GPS location capture
  useEffect(() => {
    // First try to load stored location
    const stored = getStoredLocation()
    if (stored) {
      setCurrentLocation({
        lat: stored.latitude,
        lng: stored.longitude
      })
    } else {
      requestLocation()
    }
  }, [])

  const requestLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          })
        },
        (error) => {
          console.warn('Location access failed:', error)
          // Fallback to Delhi area coordinates
          setCurrentLocation({ lat: 28.6139, lng: 77.209 })
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000
        }
      )
    } else {
      // Fallback for browsers without geolocation
      setCurrentLocation({ lat: 28.6139, lng: 77.209 })
    }
  }

  const captureLocation = () => {
    requestLocation()
  }

  const updateInstallationStatus = (id: string, status: Installation["status"]) => {
    setInstallations(installations.map((inst) => (inst.id === id ? { ...inst, status } : inst)))
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500/10 text-green-400 border-green-500/20"
      case "in-progress":
        return "bg-blue-500/10 text-blue-400 border-blue-500/20"
      case "verified":
        return "bg-purple-500/10 text-purple-400 border-purple-500/20"
      case "pending":
        return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
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
        <div>
          <h2 className="text-2xl font-bold text-foreground">Field Installation</h2>
          <p className="text-muted-foreground">Installation crew dashboard with GPS tracking and verification</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="active">Active Jobs</TabsTrigger>
          <TabsTrigger value="verification">Verification</TabsTrigger>
          <TabsTrigger value="tms">TMS Integration</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Installations</p>
                    <p className="text-2xl font-bold text-foreground">{installations.length}</p>
                  </div>
                  <Wrench className="h-8 w-8 text-orange-400" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">In Progress</p>
                    <p className="text-2xl font-bold text-blue-400">
                      {installations.filter((i) => i.status === "in-progress").length}
                    </p>
                  </div>
                  <Clock className="h-8 w-8 text-blue-400" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Completed</p>
                    <p className="text-2xl font-bold text-green-400">
                      {installations.filter((i) => i.status === "completed").length}
                    </p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-400" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">TMS Integrated</p>
                    <p className="text-2xl font-bold text-purple-400">
                      {installations.filter((i) => i.tmsIntegrated).length}
                    </p>
                  </div>
                  <Navigation className="h-8 w-8 text-purple-400" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Current Location */}
          <Card>
            <CardHeader>
              <CardTitle>Current Location</CardTitle>
              <CardDescription>GPS coordinates for installation tracking</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <MapPin className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    {currentLocation ? (
                      <>
                        <p className="font-medium text-foreground">
                          {currentLocation.lat.toFixed(6)}, {currentLocation.lng.toFixed(6)}
                        </p>
                        <p className="text-sm text-muted-foreground">New Delhi Railway Station Area</p>
                      </>
                    ) : (
                      <p className="text-muted-foreground">Acquiring GPS location...</p>
                    )}
                  </div>
                </div>
                <Button onClick={captureLocation} variant="outline">
                  <Navigation className="h-4 w-4 mr-2" />
                  Update Location
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Recent Installations */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Installations</CardTitle>
              <CardDescription>Latest installation activities and their status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {installations.map((installation) => (
                  <div key={installation.id} className="border border-border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-foreground">{installation.componentName}</h3>
                        <p className="text-sm text-muted-foreground">ID: {installation.componentId}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(installation.status)}>{installation.status}</Badge>
                        {installation.tmsIntegrated && <Badge variant="secondary">TMS</Badge>}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Location</p>
                        <p className="font-medium text-foreground flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {installation.location}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Crew</p>
                        <p className="font-medium text-foreground flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {installation.assignedCrew.join(", ")}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Date</p>
                        <p className="font-medium text-foreground">{installation.installationDate}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="active" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Active Installation Jobs</CardTitle>
              <CardDescription>Manage ongoing installation work and crew assignments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {installations
                  .filter((i) => i.status === "in-progress" || i.status === "pending")
                  .map((installation) => (
                    <div key={installation.id} className="border border-border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="font-semibold text-foreground">{installation.componentName}</h3>
                          <p className="text-sm text-muted-foreground">Component ID: {installation.componentId}</p>
                        </div>
                        <Badge className={getStatusColor(installation.status)}>{installation.status}</Badge>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Installation Location</p>
                          <p className="font-medium text-foreground">{installation.location}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Assigned Crew</p>
                          <p className="font-medium text-foreground">{installation.assignedCrew.join(", ")}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">GPS Coordinates</p>
                          <p className="font-medium text-foreground">
                            {installation.coordinates.lat.toFixed(4)}, {installation.coordinates.lng.toFixed(4)}
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Scheduled Date</p>
                          <p className="font-medium text-foreground">{installation.installationDate}</p>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        {installation.status === "pending" && (
                          <Button size="sm" onClick={() => updateInstallationStatus(installation.id, "in-progress")}>
                            Start Installation
                          </Button>
                        )}
                        {installation.status === "in-progress" && (
                          <Button size="sm" onClick={() => updateInstallationStatus(installation.id, "completed")}>
                            Mark Complete
                          </Button>
                        )}
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => {
                            // Simulate opening location in maps
                            const { lat, lng } = installation.coordinates
                            const mapsUrl = `https://www.google.com/maps?q=${lat},${lng}`
                            window.open(mapsUrl, '_blank')
                          }}
                        >
                          <MapPin className="h-4 w-4 mr-2" />
                          View Location
                        </Button>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="verification" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Installation Verification</CardTitle>
              <CardDescription>Photo documentation and verification forms</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Photo Upload Section */}
              <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                <Camera className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-medium text-foreground mb-2">Upload Verification Photos</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Take photos of the installed component from multiple angles
                </p>
                <Button onClick={() => {
                  // Create file input element
                  const input = document.createElement('input')
                  input.type = 'file'
                  input.multiple = true
                  input.accept = 'image/*'
                  input.onchange = (e) => {
                    const files = (e.target as HTMLInputElement).files
                    if (files) {
                      console.log('Photos selected:', Array.from(files).map(f => f.name))
                      // Here you would normally upload the files
                      alert(`${files.length} photo(s) selected for upload`)
                    }
                  }
                  input.click()
                }}>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Photos
                </Button>
              </div>

              {/* Verification Form */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="componentId">Component ID</Label>
                  <Input
                    id="componentId"
                    placeholder="Enter component ID"
                    value={newInstallation.componentId}
                    onChange={(e) => setNewInstallation({ ...newInstallation, componentId: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="installationStatus">Installation Status</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="completed">Completed Successfully</SelectItem>
                      <SelectItem value="partial">Partially Completed</SelectItem>
                      <SelectItem value="issues">Completed with Issues</SelectItem>
                      <SelectItem value="failed">Installation Failed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="verificationNotes">Verification Notes</Label>
                <Textarea
                  id="verificationNotes"
                  placeholder="Enter installation verification notes, any issues encountered, and recommendations"
                  value={newInstallation.notes}
                  onChange={(e) => setNewInstallation({ ...newInstallation, notes: e.target.value })}
                  rows={4}
                />
              </div>

              <div className="flex gap-2">
                <Button 
                  className="flex-1"
                  onClick={() => {
                    if (!newInstallation.componentId) {
                      alert('Please enter Component ID')
                      return
                    }
                    // Simulate verification submission
                    alert('Verification submitted successfully!')
                    console.log('Verification data:', newInstallation)
                    // Reset form
                    setNewInstallation({ ...newInstallation, componentId: '', notes: '' })
                  }}
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Submit Verification
                </Button>
                <Button 
                  variant="outline" 
                  className="flex-1 bg-transparent"
                  onClick={() => {
                    const issue = prompt('Describe the issue:')
                    if (issue) {
                      alert('Issue reported successfully!')
                      console.log('Issue reported:', issue)
                    }
                  }}
                >
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Report Issue
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tms" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>TMS Integration Status</CardTitle>
              <CardDescription>Track Management System integration and synchronization</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {installations.map((installation) => (
                  <div key={installation.id} className="border border-border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-foreground">{installation.componentName}</h3>
                        <p className="text-sm text-muted-foreground">ID: {installation.componentId}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(installation.status)}>{installation.status}</Badge>
                        <Badge
                          className={
                            installation.tmsIntegrated
                              ? "bg-green-500/10 text-green-400 border-green-500/20"
                              : "bg-red-500/10 text-red-400 border-red-500/20"
                          }
                        >
                          {installation.tmsIntegrated ? "TMS Synced" : "TMS Pending"}
                        </Badge>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Location</p>
                        <p className="font-medium text-foreground">{installation.location}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Coordinates</p>
                        <p className="font-medium text-foreground">
                          {installation.coordinates.lat.toFixed(4)}, {installation.coordinates.lng.toFixed(4)}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Integration Status</p>
                        <p className={`font-medium ${installation.tmsIntegrated ? "text-green-400" : "text-red-400"}`}>
                          {installation.tmsIntegrated ? "Synchronized" : "Not Synchronized"}
                        </p>
                      </div>
                    </div>

                    {!installation.tmsIntegrated && installation.status === "completed" && (
                      <Button
                        size="sm"
                        onClick={() => {
                          setInstallations(
                            installations.map((inst) =>
                              inst.id === installation.id ? { ...inst, tmsIntegrated: true } : inst,
                            ),
                          )
                        }}
                      >
                        <Navigation className="h-4 w-4 mr-2" />
                        Sync with TMS
                      </Button>
                    )}
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
