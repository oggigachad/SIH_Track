"use client"

import React, { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth-context'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Switch } from '@/components/ui/switch'
import { 
  Users, 
  Shield, 
  Settings, 
  UserPlus, 
  Edit, 
  Trash2, 
  Eye, 
  Search,
  Filter,
  Download,
  Upload,
  Calendar,
  Clock,
  MapPin,
  Phone,
  Mail,
  Building,
  Badge as BadgeIcon,
  Key,
  Bell,
  Activity,
  BarChart3,
  Database,
  FileText,
  Grid3x3,
  Layout,
  Navigation,
  RefreshCw,
  Save,
  Plus,
  ChevronRight,
  ArrowLeft,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Info
} from 'lucide-react'

// Enhanced interfaces
interface User {
  id: string
  name: string
  email: string
  role: string
  department: string
  zone: string
  isOnline: boolean
  lastActive: Date
  permissions: string[]
  createdAt: Date
  status: 'active' | 'inactive' | 'suspended'
  avatar?: string
  phone?: string
  location?: string
  employeeId: string
}

interface Role {
  id: string
  name: string
  displayName: string
  description: string
  permissions: Permission[]
  level: number
  createdAt: Date
}

interface Permission {
  id: string
  name: string
  description: string
  category: string
  module: string
}

interface NavigationItem {
  id: string
  title: string
  icon: React.ComponentType<any>
  path: string
  description: string
  permissions: string[]
  isNew?: boolean
  comingSoon?: boolean
}


export function EnhancedPortal() {
  const { currentUser, logout } = useAuth()
  const [activeTab, setActiveTab] = useState('navigation')
  const [users, setUsers] = useState<User[]>([])
  const [roles, setRoles] = useState<Role[]>([])
  const [permissions, setPermissions] = useState<Permission[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedRole, setSelectedRole] = useState<string>('')
  const [showUserDialog, setShowUserDialog] = useState(false)
  const [showRoleDialog, setShowRoleDialog] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(false)

  // Navigation items with role-based access
  const navigationItems: NavigationItem[] = [
    {
      id: 'workflow',
      title: 'Workflow Manager',
      icon: Activity,
      path: '/workflow',
      description: 'Manage tasks, schedules, and operational workflows',
      permissions: ['workflow.view', 'workflow.manage']
    },
    {
      id: 'calculator',
      title: 'Railway Calculator',
      icon: BarChart3,
      path: '/calculator',
      description: 'Calculate costs, materials, and project estimates',
      permissions: ['calculator.view', 'calculator.use']
    },
    {
      id: 'tracker',
      title: 'Asset Tracker',
      icon: Database,
      path: '/tracker',
      description: 'Track assets, maintenance, and inventory',
      permissions: ['tracker.view', 'asset.manage']
    },
    {
      id: 'scorecard',
      title: 'Performance Scorecard',
      icon: BadgeIcon,
      path: '/scorecard',
      description: 'Monitor performance metrics and KPIs',
      permissions: ['scorecard.view', 'analytics.read']
    },
    {
      id: 'analytics',
      title: 'Analytics Dashboard',
      icon: Grid3x3,
      path: '/analytics',
      description: 'Advanced analytics and reporting tools',
      permissions: ['analytics.view', 'reports.generate'],
      isNew: true
    },
    {
      id: 'reports',
      title: 'Report Builder',
      icon: FileText,
      path: '/reports',
      description: 'Create and manage custom reports',
      permissions: ['reports.create', 'reports.manage'],
      comingSoon: true
    }
  ]

  // Sample data initialization
  useEffect(() => {
    initializeData()
  }, [])

  const initializeData = () => {
    // Sample users
    const sampleUsers: User[] = [
      {
        id: '1',
        name: 'John Doe',
        email: 'john.doe@indianrailways.gov.in',
        role: 'inspector',
        department: 'Track Maintenance',
        zone: 'Northern Railway',
        isOnline: true,
        lastActive: new Date(),
        permissions: ['inspect.view', 'inspect.create', 'reports.read'],
        createdAt: new Date('2023-01-15'),
        status: 'active',
        phone: '+91-9876543210',
        location: 'New Delhi',
        employeeId: 'NR001234'
      },
      {
        id: '2',
        name: 'Priya Sharma',
        email: 'priya.sharma@indianrailways.gov.in',
        role: 'vendor',
        department: 'Supply Chain',
        zone: 'Western Railway',
        isOnline: false,
        lastActive: new Date(Date.now() - 3600000),
        permissions: ['vendor.profile', 'orders.view'],
        createdAt: new Date('2023-02-20'),
        status: 'active',
        phone: '+91-9876543211',
        location: 'Mumbai',
        employeeId: 'WR002345'
      },
      {
        id: '3',
        name: 'Rajesh Kumar',
        email: 'rajesh.kumar@indianrailways.gov.in',
        role: 'admin',
        department: 'IT Administration',
        zone: 'Central Railway',
        isOnline: true,
        lastActive: new Date(),
        permissions: ['admin.all', 'user.manage', 'system.config'],
        createdAt: new Date('2022-11-10'),
        status: 'active',
        phone: '+91-9876543212',
        location: 'Mumbai Central',
        employeeId: 'CR003456'
      }
    ]

    // Sample roles
    const sampleRoles: Role[] = [
      {
        id: 'admin',
        name: 'admin',
        displayName: 'System Administrator',
        description: 'Full system access and user management',
        permissions: [],
        level: 10,
        createdAt: new Date('2022-01-01')
      },
      {
        id: 'inspector',
        name: 'inspector',
        displayName: 'Quality Inspector',
        description: 'Quality assurance and inspection duties',
        permissions: [],
        level: 5,
        createdAt: new Date('2022-01-01')
      },
      {
        id: 'vendor',
        name: 'vendor',
        displayName: 'Vendor Partner',
        description: 'External supplier and vendor access',
        permissions: [],
        level: 2,
        createdAt: new Date('2022-01-01')
      }
    ]

    // Sample permissions
    const samplePermissions: Permission[] = [
      {
        id: 'user.view',
        name: 'View Users',
        description: 'View user profiles and basic information',
        category: 'User Management',
        module: 'users'
      },
      {
        id: 'user.manage',
        name: 'Manage Users',
        description: 'Create, edit, and delete user accounts',
        category: 'User Management',
        module: 'users'
      },
      {
        id: 'workflow.view',
        name: 'View Workflows',
        description: 'Access workflow management system',
        category: 'Operations',
        module: 'workflow'
      },
      {
        id: 'reports.generate',
        name: 'Generate Reports',
        description: 'Create and export reports',
        category: 'Reporting',
        module: 'reports'
      }
    ]

    setUsers(sampleUsers)
    setRoles(sampleRoles)
    setPermissions(samplePermissions)
  }

  const hasPermission = (permission: string): boolean => {
    if (!currentUser) return false
    return currentUser.role === 'admin' || false
  }

  const getVisibleNavigationItems = (): NavigationItem[] => {
    return navigationItems.filter(item => 
      item.permissions.some(permission => hasPermission(permission)) ||
      currentUser?.role === 'admin'
    )
  }

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.department.toLowerCase().includes(searchTerm.toLowerCase())
  ).filter(user => 
    !selectedRole || user.role === selectedRole
  )

  const handleUserSave = (userData: Partial<User>) => {
    setLoading(true)
    // Simulate API call
    setTimeout(() => {
      if (editingUser) {
        setUsers(users.map(user => 
          user.id === editingUser.id ? { ...user, ...userData } : user
        ))
      } else {
        const newUser: User = {
          id: Date.now().toString(),
          name: userData.name || '',
          email: userData.email || '',
          role: userData.role || 'vendor',
          department: userData.department || '',
          zone: userData.zone || '',
          isOnline: false,
          lastActive: new Date(),
          permissions: [],
          createdAt: new Date(),
          status: 'active',
          phone: userData.phone,
          location: userData.location,
          employeeId: userData.employeeId || ''
        }
        setUsers([...users, newUser])
      }
      setShowUserDialog(false)
      setEditingUser(null)
      setLoading(false)
    }, 1000)
  }

  const handleUserDelete = (userId: string) => {
    if (confirm('Are you sure you want to delete this user?')) {
      setUsers(users.filter(user => user.id !== userId))
    }
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      active: 'default',
      inactive: 'secondary',
      suspended: 'destructive'
    } as const
    
    return <Badge variant={variants[status as keyof typeof variants] || 'default'}>{status}</Badge>
  }

  const formatLastActive = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    
    if (minutes < 1) return 'Just now'
    if (minutes < 60) return `${minutes}m ago`
    if (minutes < 1440) return `${Math.floor(minutes / 60)}h ago`
    return `${Math.floor(minutes / 1440)}d ago`
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            Enhanced Portal
          </h1>
          <p className="text-muted-foreground">
            Advanced portal management with enhanced navigation and user controls
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Badge variant="outline" className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            System Online
          </Badge>
          <Button variant="outline" onClick={logout}>
            Logout
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="navigation" className="flex items-center gap-2">
            <Navigation className="h-4 w-4" />
            Navigation
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            User Management
          </TabsTrigger>
          <TabsTrigger value="roles" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Roles & Permissions
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Portal Settings
          </TabsTrigger>
        </TabsList>

        {/* Navigation Tab */}
        <TabsContent value="navigation" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Layout className="h-5 w-5" />
                Module Navigation
              </CardTitle>
              <CardDescription>
                Access modules based on your role and permissions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {getVisibleNavigationItems().map((item) => (
                  <Card key={item.id} className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-primary/10 rounded-md">
                            <item.icon className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-semibold">{item.title}</h3>
                            {item.isNew && <Badge variant="default" className="text-xs">New</Badge>}
                            {item.comingSoon && <Badge variant="secondary" className="text-xs">Coming Soon</Badge>}
                          </div>
                        </div>
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                      <div className="mt-3 flex flex-wrap gap-1">
                        {item.permissions.slice(0, 2).map((permission) => (
                          <Badge key={permission} variant="outline" className="text-xs">
                            {permission.split('.')[0]}
                          </Badge>
                        ))}
                        {item.permissions.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{item.permissions.length - 2}
                          </Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* User Management Tab */}
        <TabsContent value="users" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    User Management
                  </CardTitle>
                  <CardDescription>
                    Manage user accounts, roles, and permissions
                  </CardDescription>
                </div>
                {hasPermission('user.manage') && (
                  <Dialog open={showUserDialog} onOpenChange={setShowUserDialog}>
                    <DialogTrigger asChild>
                      <Button>
                        <UserPlus className="h-4 w-4 mr-2" />
                        Add User
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                      <DialogHeader>
                        <DialogTitle>
                          {editingUser ? "Edit User" : "Add New User"}
                        </DialogTitle>
                        <DialogDescription>
                          Enter user details and assign appropriate role
                        </DialogDescription>
                      </DialogHeader>
                      <UserForm
                        user={editingUser}
                        roles={roles}
                        onSave={handleUserSave}
                        onCancel={() => {
                          setShowUserDialog(false)
                          setEditingUser(null)
                        }}
                        loading={loading}
                      />
                    </DialogContent>
                  </Dialog>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Search and Filters */}
              <div className="flex items-center gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <Select value={selectedRole} onValueChange={setSelectedRole}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filter by role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Roles</SelectItem>
                    {roles.map((role) => (
                      <SelectItem key={role.id} value={role.id}>
                        {role.displayName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Users Table */}
              <div className="border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Last Active</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="relative">
                              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                                <span className="text-sm font-medium">
                                  {user.name.split(' ').map(n => n[0]).join('')}
                                </span>
                              </div>
                              {user.isOnline && (
                                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-background" />
                              )}
                            </div>
                            <div>
                              <p className="font-medium">{user.name}</p>
                              <p className="text-sm text-muted-foreground">{user.email}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{user.role}</Badge>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="text-sm">{user.department}</p>
                            <p className="text-xs text-muted-foreground">{user.zone}</p>
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(user.status)}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {formatLastActive(user.lastActive)}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            {hasPermission('user.manage') && (
                              <>
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => {
                                    setEditingUser(user)
                                    setShowUserDialog(true)
                                  }}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => handleUserDelete(user.id)}
                                >
                                  <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                              </>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Roles Tab */}
        <TabsContent value="roles" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Roles & Permissions
              </CardTitle>
              <CardDescription>
                Configure roles and their associated permissions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {roles.map((role) => (
                  <Card key={role.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Shield className="h-4 w-4 text-primary" />
                          <h3 className="font-semibold">{role.displayName}</h3>
                        </div>
                        <Badge variant="outline">Level {role.level}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{role.description}</p>
                      <div className="space-y-2">
                        <p className="text-xs font-medium text-muted-foreground">PERMISSIONS</p>
                        <div className="space-y-1">
                          {permissions.slice(0, 3).map((permission) => (
                            <div key={permission.id} className="flex items-center gap-2 text-xs">
                              <CheckCircle className="h-3 w-3 text-green-500" />
                              <span>{permission.name}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Portal Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Auto-refresh Dashboard</Label>
                    <p className="text-sm text-muted-foreground">Automatically refresh data every 30 seconds</p>
                  </div>
                  <Switch />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">Send email alerts for important events</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Audit Logging</Label>
                    <p className="text-sm text-muted-foreground">Track all user actions and changes</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  System Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Database Connection</span>
                  <Badge variant="default" className="flex items-center gap-1">
                    <CheckCircle className="h-3 w-3" />
                    Healthy
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">API Services</span>
                  <Badge variant="default" className="flex items-center gap-1">
                    <CheckCircle className="h-3 w-3" />
                    Online
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Background Jobs</span>
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    Processing
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Last Backup</span>
                  <span className="text-sm text-muted-foreground">2 hours ago</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

// User Form Component
interface UserFormProps {
  user?: User | null
  roles: Role[]
  onSave: (user: Partial<User>) => void
  onCancel: () => void
  loading: boolean
}

function UserForm({ user, roles, onSave, onCancel, loading }: UserFormProps) {
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    role: user?.role || 'vendor',
    department: user?.department || '',
    zone: user?.zone || '',
    phone: user?.phone || '',
    location: user?.location || '',
    employeeId: user?.employeeId || ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Name *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            required
          />
        </div>
        <div>
          <Label htmlFor="employeeId">Employee ID *</Label>
          <Input
            id="employeeId"
            value={formData.employeeId}
            onChange={(e) => setFormData({...formData, employeeId: e.target.value})}
            required
          />
        </div>
      </div>
      
      <div>
        <Label htmlFor="email">Email *</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({...formData, email: e.target.value})}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="role">Role *</Label>
          <Select value={formData.role} onValueChange={(value) => setFormData({...formData, role: value})}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {roles.map((role) => (
                <SelectItem key={role.id} value={role.id}>
                  {role.displayName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="department">Department</Label>
          <Input
            id="department"
            value={formData.department}
            onChange={(e) => setFormData({...formData, department: e.target.value})}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="zone">Zone</Label>
          <Input
            id="zone"
            value={formData.zone}
            onChange={(e) => setFormData({...formData, zone: e.target.value})}
          />
        </div>
        <div>
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            value={formData.phone}
            onChange={(e) => setFormData({...formData, phone: e.target.value})}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="location">Location</Label>
        <Input
          id="location"
          value={formData.location}
          onChange={(e) => setFormData({...formData, location: e.target.value})}
        />
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading && <RefreshCw className="h-4 w-4 mr-2 animate-spin" />}
          {user ? 'Update' : 'Create'} User
        </Button>
      </div>
    </form>
  )
}