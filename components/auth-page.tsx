"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Eye,
  EyeOff,
  Shield,
  Train,
  Building,
  Wrench,
  Search,
  BarChart3,
  Recycle,
  AlertCircle,
  CheckCircle,
} from "lucide-react"
import Image from "next/image"

interface User {
  name: string
  role: string
  id: string
  email: string
  department: string
  zone: string
  isOnline: boolean
}

interface AuthPageProps {
  onLogin: (user: User) => void
}

export default function AuthPage({ onLogin }: AuthPageProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
    role: "",
    rememberMe: false,
  })
  const [signupData, setSignupData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
    employeeId: "",
    department: "",
    zone: "",
    agreeTerms: false,
  })

  const userRoles = [
    {
      value: "vendor",
      label: "Vendor",
      description: "Manufacturing and supply management",
      icon: Building,
      color: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    },
    {
      value: "qa_manager",
      label: "QA Manager",
      description: "Depot reception and quality assurance",
      icon: CheckCircle,
      color: "bg-green-500/10 text-green-400 border-green-500/20",
    },
    {
      value: "inspector",
      label: "Inspector",
      description: "Quality control and field inspection",
      icon: Search,
      color: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    },
    {
      value: "engineer",
      label: "Engineer",
      description: "Installation and maintenance",
      icon: Wrench,
      color: "bg-orange-500/10 text-orange-400 border-orange-500/20",
    },
    {
      value: "authority",
      label: "Authority",
      description: "Analytics and reporting oversight",
      icon: BarChart3,
      color: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
    },
    {
      value: "recycler",
      label: "Recycler",
      description: "End-of-life and recycling management",
      icon: Recycle,
      color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    },
  ]

  const railwayZones = [
    "Central Railway",
    "Eastern Railway",
    "Northern Railway",
    "Southern Railway",
    "Western Railway",
    "North Eastern Railway",
    "Northeast Frontier Railway",
    "South Central Railway",
    "South Eastern Railway",
    "South East Central Railway",
    "South Western Railway",
    "West Central Railway",
    "North Western Railway",
    "North Central Railway",
    "East Central Railway",
    "East Coast Railway",
  ]

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Mock user data based on role
    const mockUsers = {
      vendor: {
        name: "Amit Sharma",
        role: "Vendor",
        id: "VN001234",
        email: loginData.email,
        department: "Manufacturing",
        zone: "Western Railway",
        isOnline: true,
      },
      qa_manager: {
        name: "Sunita Verma",
        role: "QA Manager",
        id: "QA001234",
        email: loginData.email,
        department: "Quality Assurance",
        zone: "Eastern Railway",
        isOnline: true,
      },
      inspector: {
        name: "Rajesh Kumar",
        role: "Inspector",
        id: "IR001234",
        email: loginData.email,
        department: "Quality Control",
        zone: "Central Railway",
        isOnline: true,
      },
      engineer: {
        name: "Priya Patel",
        role: "Engineer",
        id: "EN001234",
        email: loginData.email,
        department: "Installation",
        zone: "Northern Railway",
        isOnline: true,
      },
      authority: {
        name: "Dr. Suresh Gupta",
        role: "Authority",
        id: "AU001234",
        email: loginData.email,
        department: "Analytics",
        zone: "Railway Board",
        isOnline: true,
      },
      recycler: {
        name: "Meera Singh",
        role: "Recycler",
        id: "RC001234",
        email: loginData.email,
        department: "Environmental",
        zone: "South Central Railway",
        isOnline: true,
      },
    }

    const user = mockUsers[loginData.role as keyof typeof mockUsers]
    if (user) {
      onLogin(user)
    }

    setIsLoading(false)
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Create new user
    const newUser = {
      name: signupData.name,
      role: signupData.role.charAt(0).toUpperCase() + signupData.role.slice(1),
      id: signupData.employeeId,
      email: signupData.email,
      department: signupData.department,
      zone: signupData.zone,
      isOnline: true,
    }

    onLogin(newUser)
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('/railway-track-pattern.jpg')] opacity-5"></div>

      <div className="w-full max-w-4xl relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Left Side - Branding */}
          <div className="text-center lg:text-left space-y-6">
            <div className="flex items-center justify-center lg:justify-start gap-4">
              <div className="relative">
                <Image
                  src="/images/track-logo.png"
                  alt="Track Logo"
                  width={80}
                  height={80}
                  className="drop-shadow-2xl"
                />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-white">Track</h1>
                <p className="text-blue-200 text-lg">Railway QR Management</p>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-white">Digital Railway Component Management</h2>
              <p className="text-blue-100 text-lg leading-relaxed">
                Comprehensive tracking and quality assurance system for Indian Railways. Manage components from
                manufacturing to end-of-life with advanced QR technology.
              </p>
            </div>

            {/* Features */}
            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="flex items-center gap-3 text-blue-100">
                <div className="p-2 bg-blue-500/20 rounded-lg">
                  <Shield className="h-4 w-4 text-blue-400" />
                </div>
                <span className="text-sm">Secure Access</span>
              </div>
              <div className="flex items-center gap-3 text-blue-100">
                <div className="p-2 bg-green-500/20 rounded-lg">
                  <CheckCircle className="h-4 w-4 text-green-400" />
                </div>
                <span className="text-sm">Quality Assured</span>
              </div>
              <div className="flex items-center gap-3 text-blue-100">
                <div className="p-2 bg-orange-500/20 rounded-lg">
                  <Train className="h-4 w-4 text-orange-400" />
                </div>
                <span className="text-sm">Railway Compliant</span>
              </div>
              <div className="flex items-center gap-3 text-blue-100">
                <div className="p-2 bg-purple-500/20 rounded-lg">
                  <BarChart3 className="h-4 w-4 text-purple-400" />
                </div>
                <span className="text-sm">Real-time Analytics</span>
              </div>
            </div>
          </div>

          {/* Right Side - Authentication */}
          <Card className="w-full max-w-md mx-auto bg-background/95 backdrop-blur-sm border shadow-2xl">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-2xl font-bold text-foreground">Welcome to Track</CardTitle>
              <CardDescription className="text-muted-foreground">
                Sign in to access the Railway QR Management System
              </CardDescription>
            </CardHeader>

            <CardContent>
              <Tabs defaultValue="login" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="login">Sign In</TabsTrigger>
                  <TabsTrigger value="signup">Sign Up</TabsTrigger>
                </TabsList>

                {/* Login Tab */}
                <TabsContent value="login">
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="your.email@indianrailways.gov.in"
                        value={loginData.email}
                        onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <div className="relative">
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your password"
                          value={loginData.password}
                          onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                          required
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="role">Role</Label>
                      <Select
                        value={loginData.role}
                        onValueChange={(value) => setLoginData({ ...loginData, role: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select your role" />
                        </SelectTrigger>
                        <SelectContent>
                          {userRoles.map((role) => {
                            const IconComponent = role.icon
                            return (
                              <SelectItem key={role.value} value={role.value}>
                                <div className="flex items-center gap-2">
                                  <IconComponent className="h-4 w-4" />
                                  <div>
                                    <div className="font-medium">{role.label}</div>
                                    <div className="text-xs text-muted-foreground">{role.description}</div>
                                  </div>
                                </div>
                              </SelectItem>
                            )
                          })}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="remember"
                        checked={loginData.rememberMe}
                        onCheckedChange={(checked) => setLoginData({ ...loginData, rememberMe: checked as boolean })}
                      />
                      <Label htmlFor="remember" className="text-sm">
                        Remember me
                      </Label>
                    </div>

                    <Button type="submit" className="w-full" disabled={isLoading || !loginData.role}>
                      {isLoading ? "Signing In..." : "Sign In"}
                    </Button>

                    <div className="text-center">
                      <Button variant="link" className="text-sm text-blue-600 dark:text-blue-400">
                        Forgot your password?
                      </Button>
                    </div>
                  </form>
                </TabsContent>

                {/* Signup Tab */}
                <TabsContent value="signup">
                  <form onSubmit={handleSignup} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          placeholder="Your full name"
                          value={signupData.name}
                          onChange={(e) => setSignupData({ ...signupData, name: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="employeeId">Employee ID</Label>
                        <Input
                          id="employeeId"
                          placeholder="IR001234"
                          value={signupData.employeeId}
                          onChange={(e) => setSignupData({ ...signupData, employeeId: e.target.value })}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="signup-email">Email Address</Label>
                      <Input
                        id="signup-email"
                        type="email"
                        placeholder="your.email@indianrailways.gov.in"
                        value={signupData.email}
                        onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="signup-password">Password</Label>
                        <Input
                          id="signup-password"
                          type="password"
                          placeholder="Create password"
                          value={signupData.password}
                          onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirm-password">Confirm Password</Label>
                        <Input
                          id="confirm-password"
                          type="password"
                          placeholder="Confirm password"
                          value={signupData.confirmPassword}
                          onChange={(e) => setSignupData({ ...signupData, confirmPassword: e.target.value })}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="signup-role">Role</Label>
                      <Select
                        value={signupData.role}
                        onValueChange={(value) => setSignupData({ ...signupData, role: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select your role" />
                        </SelectTrigger>
                        <SelectContent>
                          {userRoles.map((role) => {
                            const IconComponent = role.icon
                            return (
                              <SelectItem key={role.value} value={role.value}>
                                <div className="flex items-center gap-2">
                                  <IconComponent className="h-4 w-4" />
                                  <div>
                                    <div className="font-medium">{role.label}</div>
                                    <div className="text-xs text-muted-foreground">{role.description}</div>
                                  </div>
                                </div>
                              </SelectItem>
                            )
                          })}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="department">Department</Label>
                        <Input
                          id="department"
                          placeholder="e.g., Quality Control"
                          value={signupData.department}
                          onChange={(e) => setSignupData({ ...signupData, department: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="zone">Railway Zone</Label>
                        <Select
                          value={signupData.zone}
                          onValueChange={(value) => setSignupData({ ...signupData, zone: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select zone" />
                          </SelectTrigger>
                          <SelectContent>
                            {railwayZones.map((zone) => (
                              <SelectItem key={zone} value={zone}>
                                {zone}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="terms"
                        checked={signupData.agreeTerms}
                        onCheckedChange={(checked) => setSignupData({ ...signupData, agreeTerms: checked as boolean })}
                      />
                      <Label htmlFor="terms" className="text-sm">
                        I agree to the{" "}
                        <Button variant="link" className="p-0 h-auto text-blue-600 dark:text-blue-400">
                          Terms of Service
                        </Button>{" "}
                        and{" "}
                        <Button variant="link" className="p-0 h-auto text-blue-600 dark:text-blue-400">
                          Privacy Policy
                        </Button>
                      </Label>
                    </div>

                    <Button
                      type="submit"
                      className="w-full"
                      disabled={
                        isLoading ||
                        !signupData.role ||
                        !signupData.zone ||
                        !signupData.agreeTerms ||
                        signupData.password !== signupData.confirmPassword
                      }
                    >
                      {isLoading ? "Creating Account..." : "Create Account"}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>

              {/* Security Notice */}
              <div className="mt-6 p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800">
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                  <div className="text-xs text-blue-800 dark:text-blue-200">
                    <p className="font-medium">Security Notice</p>
                    <p>
                      This system is for authorized Indian Railways personnel only. All activities are logged and
                      monitored.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
