"use client"

import React, { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  Plus,
  Clock,
  User,
  Calendar as CalendarIcon,
  CheckCircle,
  AlertCircle,
  XCircle,
  ArrowRight,
  FileText,
  Settings,
  Users,
  TrendingUp,
  Filter,
  Search,
  Download,
  Eye
} from "lucide-react"
import { format } from "date-fns"

interface Task {
  id: string
  title: string
  description: string
  assignee: string
  priority: "low" | "medium" | "high" | "critical"
  status: "pending" | "in-progress" | "completed" | "blocked"
  dueDate: Date
  createdDate: Date
  progress: number
  tags: string[]
  dependencies: string[]
  comments: Comment[]
}

interface Comment {
  id: string
  author: string
  content: string
  timestamp: Date
}

interface WorkflowTemplate {
  id: string
  name: string
  description: string
  tasks: Omit<Task, 'id' | 'createdDate'>[]
}

export default function WorkflowManager({ onBack }: { onBack: () => void }) {
  const [activeTab, setActiveTab] = useState("tasks")
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: "WF001",
      title: "Quality Inspection - Batch #2024-001",
      description: "Conduct comprehensive quality inspection for elastic clips batch",
      assignee: "John Smith",
      priority: "high",
      status: "in-progress",
      dueDate: new Date(2024, 11, 15),
      createdDate: new Date(2024, 10, 1),
      progress: 65,
      tags: ["inspection", "quality", "urgent"],
      dependencies: ["WF002"],
      comments: [
        {
          id: "C001",
          author: "John Smith",
          content: "Started initial inspection, 65% complete",
          timestamp: new Date(2024, 10, 10)
        }
      ]
    },
    {
      id: "WF002",
      title: "Material Approval Process",
      description: "Review and approve incoming raw materials for production",
      assignee: "Sarah Johnson",
      priority: "medium",
      status: "completed",
      dueDate: new Date(2024, 10, 30),
      createdDate: new Date(2024, 9, 15),
      progress: 100,
      tags: ["approval", "materials"],
      dependencies: [],
      comments: []
    },
    {
      id: "WF003",
      title: "Installation Planning - Northern Route",
      description: "Plan component installation for northern railway route",
      assignee: "Mike Davis",
      priority: "critical",
      status: "pending",
      dueDate: new Date(2024, 11, 20),
      createdDate: new Date(2024, 10, 5),
      progress: 0,
      tags: ["installation", "planning", "northern"],
      dependencies: ["WF001"],
      comments: []
    }
  ])

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [filterPriority, setFilterPriority] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState("")

  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    assignee: "",
    priority: "medium" as const,
    dueDate: new Date(),
    tags: "",
    dependencies: ""
  })

  const workflowTemplates: WorkflowTemplate[] = [
    {
      id: "TPL001",
      name: "Quality Assurance Workflow",
      description: "Standard QA process for component inspection",
      tasks: [
        {
          title: "Initial Inspection",
          description: "Perform initial visual and dimensional inspection",
          assignee: "",
          priority: "high",
          status: "pending",
          dueDate: new Date(),
          progress: 0,
          tags: ["inspection", "qa"],
          dependencies: [],
          comments: []
        },
        {
          title: "Technical Testing",
          description: "Conduct technical performance tests",
          assignee: "",
          priority: "high",
          status: "pending",
          dueDate: new Date(),
          progress: 0,
          tags: ["testing", "technical"],
          dependencies: [],
          comments: []
        },
        {
          title: "Documentation Review",
          description: "Review and approve documentation",
          assignee: "",
          priority: "medium",
          status: "pending",
          dueDate: new Date(),
          progress: 0,
          tags: ["documentation", "review"],
          dependencies: [],
          comments: []
        }
      ]
    },
    {
      id: "TPL002",
      name: "Installation Workflow",
      description: "Standard installation process for railway components",
      tasks: [
        {
          title: "Site Survey",
          description: "Conduct site survey and preparation assessment",
          assignee: "",
          priority: "high",
          status: "pending",
          dueDate: new Date(),
          progress: 0,
          tags: ["survey", "site"],
          dependencies: [],
          comments: []
        },
        {
          title: "Material Preparation",
          description: "Prepare and transport materials to site",
          assignee: "",
          priority: "medium",
          status: "pending",
          dueDate: new Date(),
          progress: 0,
          tags: ["materials", "preparation"],
          dependencies: [],
          comments: []
        },
        {
          title: "Installation Execution",
          description: "Execute component installation",
          assignee: "",
          priority: "critical",
          status: "pending",
          dueDate: new Date(),
          progress: 0,
          tags: ["installation", "execution"],
          dependencies: [],
          comments: []
        }
      ]
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500/10 text-green-400 border-green-500/20"
      case "in-progress":
        return "bg-blue-500/10 text-blue-400 border-blue-500/20"
      case "blocked":
        return "bg-red-500/10 text-red-400 border-red-500/20"
      case "pending":
        return "bg-gray-500/10 text-gray-400 border-gray-500/20"
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

  const handleCreateTask = () => {
    const task: Task = {
      id: `WF${String(tasks.length + 1).padStart(3, '0')}`,
      title: newTask.title,
      description: newTask.description,
      assignee: newTask.assignee,
      priority: newTask.priority,
      status: "pending",
      dueDate: newTask.dueDate,
      createdDate: new Date(),
      progress: 0,
      tags: newTask.tags.split(',').map(tag => tag.trim()).filter(Boolean),
      dependencies: newTask.dependencies.split(',').map(dep => dep.trim()).filter(Boolean),
      comments: []
    }

    setTasks([...tasks, task])
    setNewTask({
      title: "",
      description: "",
      assignee: "",
      priority: "medium",
      dueDate: new Date(),
      tags: "",
      dependencies: ""
    })
    setIsCreateDialogOpen(false)
  }

  const updateTaskStatus = (taskId: string, status: Task['status']) => {
    setTasks(tasks.map(task => 
      task.id === taskId 
        ? { ...task, status, progress: status === 'completed' ? 100 : task.progress }
        : task
    ))
  }

  const updateTaskProgress = (taskId: string, progress: number) => {
    setTasks(tasks.map(task => 
      task.id === taskId 
        ? { ...task, progress, status: progress === 100 ? 'completed' : task.status }
        : task
    ))
  }

  const filteredTasks = tasks.filter(task => {
    const matchesStatus = filterStatus === "all" || task.status === filterStatus
    const matchesPriority = filterPriority === "all" || task.priority === filterPriority
    const matchesSearch = searchQuery === "" || 
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.assignee.toLowerCase().includes(searchQuery.toLowerCase())
    
    return matchesStatus && matchesPriority && matchesSearch
  })

  const taskStats = {
    total: tasks.length,
    completed: tasks.filter(t => t.status === 'completed').length,
    inProgress: tasks.filter(t => t.status === 'in-progress').length,
    pending: tasks.filter(t => t.status === 'pending').length,
    blocked: tasks.filter(t => t.status === 'blocked').length,
    overdue: tasks.filter(t => t.dueDate < new Date() && t.status !== 'completed').length
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" onClick={onBack}>
          ← Back to Dashboard
        </Button>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-500/10 rounded-lg">
            <Settings className="h-6 w-6 text-blue-500" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground">Workflow Manager</h2>
            <p className="text-muted-foreground">Task creation, assignment, and progress tracking</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Tasks</p>
                <p className="text-2xl font-bold text-foreground">{taskStats.total}</p>
              </div>
              <FileText className="h-4 w-4 text-blue-400" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold text-green-400">{taskStats.completed}</p>
              </div>
              <CheckCircle className="h-4 w-4 text-green-400" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">In Progress</p>
                <p className="text-2xl font-bold text-blue-400">{taskStats.inProgress}</p>
              </div>
              <Clock className="h-4 w-4 text-blue-400" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold text-gray-400">{taskStats.pending}</p>
              </div>
              <AlertCircle className="h-4 w-4 text-gray-400" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Blocked</p>
                <p className="text-2xl font-bold text-red-400">{taskStats.blocked}</p>
              </div>
              <XCircle className="h-4 w-4 text-red-400" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Overdue</p>
                <p className="text-2xl font-bold text-red-400">{taskStats.overdue}</p>
              </div>
              <AlertCircle className="h-4 w-4 text-red-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="tasks" className="space-y-4">
          {/* Filters and Actions */}
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search tasks..." 
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
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="blocked">Blocked</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterPriority} onValueChange={setFilterPriority}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter by priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priority</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex-1" />

            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Task
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Create New Task</DialogTitle>
                  <DialogDescription>
                    Create a new workflow task with details and assignments
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label>Task Title</Label>
                    <Input 
                      value={newTask.title}
                      onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                      placeholder="Enter task title"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Textarea 
                      value={newTask.description}
                      onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                      placeholder="Describe the task requirements"
                      rows={3}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Assignee</Label>
                      <Select value={newTask.assignee} onValueChange={(value) => setNewTask({...newTask, assignee: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select assignee" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="John Smith">John Smith</SelectItem>
                          <SelectItem value="Sarah Johnson">Sarah Johnson</SelectItem>
                          <SelectItem value="Mike Davis">Mike Davis</SelectItem>
                          <SelectItem value="Emily Chen">Emily Chen</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Priority</Label>
                      <Select value={newTask.priority} onValueChange={(value: any) => setNewTask({...newTask, priority: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="critical">Critical</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Due Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start text-left font-normal">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {format(newTask.dueDate, "PPP")}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={newTask.dueDate}
                          onSelect={(date) => date && setNewTask({...newTask, dueDate: date})}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="space-y-2">
                    <Label>Tags (comma-separated)</Label>
                    <Input 
                      value={newTask.tags}
                      onChange={(e) => setNewTask({...newTask, tags: e.target.value})}
                      placeholder="inspection, urgent, quality"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Dependencies (comma-separated task IDs)</Label>
                    <Input 
                      value={newTask.dependencies}
                      onChange={(e) => setNewTask({...newTask, dependencies: e.target.value})}
                      placeholder="WF001, WF002"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateTask}>Create Task</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          {/* Tasks List */}
          <div className="space-y-4">
            {filteredTasks.map((task) => (
              <Card key={task.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-semibold text-foreground">{task.title}</h3>
                        <Badge className={getStatusColor(task.status)}>{task.status}</Badge>
                        <Badge className={getPriorityColor(task.priority)}>{task.priority}</Badge>
                      </div>
                      <p className="text-muted-foreground mb-3">{task.description}</p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          {task.assignee}
                        </div>
                        <div className="flex items-center gap-1">
                          <CalendarIcon className="h-4 w-4" />
                          {format(task.dueDate, "MMM dd, yyyy")}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {task.progress}% complete
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-3xl">
                          <DialogHeader>
                            <DialogTitle>{task.title}</DialogTitle>
                            <DialogDescription>Task ID: {task.id}</DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <Label>Description</Label>
                              <p className="text-sm text-muted-foreground mt-1">{task.description}</p>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label>Assignee</Label>
                                <p className="text-sm text-foreground mt-1">{task.assignee}</p>
                              </div>
                              <div>
                                <Label>Due Date</Label>
                                <p className="text-sm text-foreground mt-1">{format(task.dueDate, "PPP")}</p>
                              </div>
                            </div>
                            <div>
                              <Label>Progress</Label>
                              <div className="mt-2">
                                <Progress value={task.progress} className="h-2" />
                                <p className="text-sm text-muted-foreground mt-1">{task.progress}% complete</p>
                              </div>
                            </div>
                            <div>
                              <Label>Tags</Label>
                              <div className="flex gap-2 mt-1">
                                {task.tags.map((tag, index) => (
                                  <Badge key={index} variant="outline">{tag}</Badge>
                                ))}
                              </div>
                            </div>
                            {task.dependencies.length > 0 && (
                              <div>
                                <Label>Dependencies</Label>
                                <div className="flex gap-2 mt-1">
                                  {task.dependencies.map((dep, index) => (
                                    <Badge key={index} variant="outline">{dep}</Badge>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </DialogContent>
                      </Dialog>
                      <Select value={task.status} onValueChange={(value: Task['status']) => updateTaskStatus(task.id, value)}>
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="in-progress">In Progress</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="blocked">Blocked</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm">Progress</Label>
                      <span className="text-sm text-muted-foreground">{task.progress}%</span>
                    </div>
                    <Progress value={task.progress} className="h-2" />
                  </div>

                  {/* Tags */}
                  {task.tags.length > 0 && (
                    <div className="flex gap-2 mt-3">
                      {task.tags.map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">{tag}</Badge>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          <div className="grid gap-4">
            {workflowTemplates.map((template) => (
              <Card key={template.id}>
                <CardHeader>
                  <CardTitle>{template.name}</CardTitle>
                  <CardDescription>{template.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                      {template.tasks.length} tasks included
                    </p>
                    <div className="flex gap-2">
                      {template.tasks.slice(0, 3).map((task, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {task.title}
                        </Badge>
                      ))}
                      {template.tasks.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{template.tasks.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>
                  <Button className="mt-4" variant="outline">
                    Use Template
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Task Completion Rate</CardTitle>
                <CardDescription>Weekly completion trends</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-32 flex items-center justify-center text-muted-foreground">
                  <TrendingUp className="h-8 w-8" />
                  <div className="space-y-4">
                    <div className="h-32 bg-gradient-to-r from-blue-500/10 to-green-500/10 rounded-lg p-4 flex items-center justify-center border border-border">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-foreground mb-1">
                          {Math.round((taskStats.completed / taskStats.total) * 100)}%
                        </div>
                        <div className="text-sm text-muted-foreground">Completion Rate</div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <div className="text-lg font-semibold text-green-500">{taskStats.completed}</div>
                        <div className="text-xs text-muted-foreground">Completed</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-semibold text-blue-500">{taskStats.inProgress}</div>
                        <div className="text-xs text-muted-foreground">In Progress</div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Task Distribution</CardTitle>
                <CardDescription>By status and priority</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Completed</span>
                    <span className="text-sm font-medium">{taskStats.completed}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">In Progress</span>
                    <span className="text-sm font-medium">{taskStats.inProgress}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Pending</span>
                    <span className="text-sm font-medium">{taskStats.pending}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Blocked</span>
                    <span className="text-sm font-medium">{taskStats.blocked}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Workflow Settings</CardTitle>
              <CardDescription>Configure workflow preferences and notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Default Task Priority</Label>
                <Select defaultValue="medium">
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Auto-assign Tasks</Label>
                <Select defaultValue="manual">
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="manual">Manual Assignment</SelectItem>
                    <SelectItem value="round-robin">Round Robin</SelectItem>
                    <SelectItem value="workload">Based on Workload</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Notification Settings</Label>
                <div className="space-y-2">
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" defaultChecked />
                    <span className="text-sm">Email notifications for task assignments</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" defaultChecked />
                    <span className="text-sm">Reminder for due dates</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" />
                    <span className="text-sm">Daily workflow summary</span>
                  </label>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}