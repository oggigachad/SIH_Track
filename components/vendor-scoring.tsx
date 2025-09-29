"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Award, 
  TrendingUp, 
  TrendingDown, 
  AlertCircle, 
  CheckCircle,
  Star,
  Target,
  BarChart3,
  Shield,
  Leaf,
  Lightbulb,
  Clock,
  FileCheck,
  Calendar,
  Activity
} from 'lucide-react'

import { 
  calculateVendorScore, 
  generateMockVendorMetrics, 
  VendorScore, 
  VendorMetrics 
} from '@/lib/vendor-scoring'

interface VendorScoringProps {
  vendorId?: string
  isAuthority?: boolean
  onBack?: () => void
}

export default function VendorScoring({ vendorId, isAuthority = false, onBack }: VendorScoringProps) {
  const [vendorMetrics, setVendorMetrics] = useState<VendorMetrics | null>(null)
  const [vendorScore, setVendorScore] = useState<VendorScore | null>(null)
  const [loading, setLoading] = useState(true)
  const [trendsPeriod, setTrendsPeriod] = useState('12months')
  const [trendsMetric, setTrendsMetric] = useState('overall')

  useEffect(() => {
    // Simulate loading vendor data
    const loadVendorData = () => {
      setLoading(true)
      
      setTimeout(() => {
        const metrics = generateMockVendorMetrics(vendorId || 'VN001234')
        const score = calculateVendorScore(metrics)
        
        setVendorMetrics(metrics)
        setVendorScore(score)
        setLoading(false)
      }, 1000)
    }

    loadVendorData()
  }, [vendorId])

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'A+': return 'bg-green-500'
      case 'A': return 'bg-green-400'
      case 'B+': return 'bg-blue-500'
      case 'B': return 'bg-blue-400'
      case 'C+': return 'bg-yellow-500'
      case 'C': return 'bg-yellow-400'
      case 'D': return 'bg-orange-500'
      case 'F': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  const getScoreIcon = (score: number) => {
    if (score >= 90) return <TrendingUp className="h-4 w-4 text-green-500" />
    if (score >= 70) return <Target className="h-4 w-4 text-blue-500" />
    return <TrendingDown className="h-4 w-4 text-orange-500" />
  }

  // Trends helper functions
  const getTrendsTitle = () => {
    const metricLabels: Record<string, string> = {
      overall: 'Overall Performance',
      quality: 'Quality Score',
      delivery: 'Delivery Performance',
      cost: 'Cost Effectiveness',
      service: 'Service Quality',
      compliance: 'Compliance Score'
    }
    const periodLabels: Record<string, string> = {
      '3months': 'Last 3 Months',
      '6months': 'Last 6 Months',
      '12months': 'Last 12 Months',
      '24months': 'Last 24 Months'
    }
    return `${metricLabels[trendsMetric]} - ${periodLabels[trendsPeriod]}`
  }

  const generateTrendLine = (historicalData: Array<{[key: string]: number}>, metric: string) => {
    if (!historicalData) return ''
    const points = historicalData.map((data, index) => {
      const x = (index / (historicalData.length - 1)) * 800
      const value = metric === 'overall' ? data.overall : data[metric] || 75
      const y = 160 - (value / 100) * 160
      return `${x},${y}`
    })
    return points.join(' ')
  }

  const generateIndustryAverageLine = () => {
    // Generate industry average trend line (typically more stable)
    const points = []
    for (let i = 0; i <= 12; i++) {
      const x = (i / 12) * 800
      const y = 160 - (0.75 * 160) // 75% industry average
      points.push(`${x},${y}`)
    }
    return points.join(' ')
  }

  const generateDataPoints = (historicalData: Array<{[key: string]: number | string}>, metric: string) => {
    if (!historicalData) return []
    return historicalData.map((data, index) => {
      const x = (index / (historicalData.length - 1)) * 800
      const value = metric === 'overall' ? data.overall : data[metric] || 75
      const y = 160 - (value / 100) * 160
      return {
        x,
        y,
        label: `${new Date(data.date).toLocaleDateString()}: ${value}%`
      }
    })
  }

  const getTimelineLabels = () => {
    const monthsBack = trendsPeriod === '3months' ? 3 : 
                     trendsPeriod === '6months' ? 6 : 
                     trendsPeriod === '12months' ? 12 : 24
    const labels = []
    for (let i = monthsBack - 1; i >= 0; i--) {
      const date = new Date()
      date.setMonth(date.getMonth() - i)
      labels.push(date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' }))
    }
    return labels
  }

  const calculateTrendImprovement = () => {
    if (!vendorScore?.historicalData || vendorScore.historicalData.length < 2) return 0
    const latest = vendorScore.historicalData[vendorScore.historicalData.length - 1]
    const baseline = vendorScore.historicalData[0]
    const latestValue = trendsMetric === 'overall' ? latest.overall : latest[trendsMetric] || 75
    const baselineValue = trendsMetric === 'overall' ? baseline.overall : baseline[trendsMetric] || 75
    return Math.round(((latestValue - baselineValue) / baselineValue) * 100)
  }

  const getCurrentScore = () => {
    if (trendsMetric === 'overall') return vendorScore?.overall || 85
    return vendorScore?.[trendsMetric] || 75
  }

  const calculateVolatility = () => {
    if (!vendorScore?.historicalData) return 5
    const values = vendorScore.historicalData.map(data => 
      trendsMetric === 'overall' ? data.overall : data[trendsMetric] || 75
    )
    const avg = values.reduce((a, b) => a + b, 0) / values.length
    const variance = values.reduce((sum, val) => sum + Math.pow(val - avg, 2), 0) / values.length
    return Math.round(Math.sqrt(variance))
  }

  const getIndustryRanking = () => {
    const score = getCurrentScore()
    if (score >= 90) return Math.floor(Math.random() * 5) + 1
    if (score >= 80) return Math.floor(Math.random() * 15) + 6
    if (score >= 70) return Math.floor(Math.random() * 30) + 21
    return Math.floor(Math.random() * 50) + 51
  }

  const getMilestoneIcon = (type: string) => {
    switch (type) {
      case 'achievement': return <Award className="h-4 w-4" />
      case 'improvement': return <TrendingUp className="h-4 w-4" />
      case 'milestone': return <Target className="h-4 w-4" />
      default: return <Activity className="h-4 w-4" />
    }
  }

  const getMilestoneIconStyle = (type: string) => {
    switch (type) {
      case 'achievement': return 'bg-yellow-100 text-yellow-600'
      case 'improvement': return 'bg-green-100 text-green-600'
      case 'milestone': return 'bg-blue-100 text-blue-600'
      default: return 'bg-gray-100 text-gray-600'
    }
  }

  const generateForecast = (scenario: string) => {
    const current = getCurrentScore()
    const improvement = calculateTrendImprovement()
    
    switch (scenario) {
      case 'optimistic':
        return Math.min(95, current + Math.max(5, improvement * 1.5))
      case 'realistic':
        return Math.max(60, current + improvement * 0.8)
      case 'conservative':
        return Math.max(50, current + improvement * 0.3)
      default:
        return current
    }
  }

  const generateRiskAssessment = () => {
    return [
      {
        factor: 'Supply Chain Disruption',
        level: 'medium',
        probability: 25
      },
      {
        factor: 'Quality Degradation',
        level: 'low',
        probability: 15
      },
      {
        factor: 'Delivery Delays',
        level: 'medium',
        probability: 30
      },
      {
        factor: 'Cost Inflation',
        level: 'high',
        probability: 45
      },
      {
        factor: 'Compliance Issues',
        level: 'low',
        probability: 12
      }
    ]
  }

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'high': return 'bg-red-500'
      case 'medium': return 'bg-yellow-500'
      case 'low': return 'bg-green-500'
      default: return 'bg-gray-500'
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          {onBack && (
            <Button variant="ghost" onClick={onBack}>
              ← Back
            </Button>
          )}
          <h2 className="text-2xl font-bold text-foreground">Vendor Performance Score</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse space-y-4">
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-8 bg-muted rounded w-1/2"></div>
                  <div className="h-2 bg-muted rounded w-full"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (!vendorScore || !vendorMetrics) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Unable to load vendor scoring data. Please try again later.
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        {onBack && (
          <Button variant="ghost" onClick={onBack}>
            ← Back
          </Button>
        )}
        <div>
          <h2 className="text-2xl font-bold text-foreground">Vendor Performance Score</h2>
          <p className="text-muted-foreground">
            {isAuthority ? 'Authority View' : 'Vendor Dashboard'} • Last Updated: {new Date().toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Overall Score Card */}
      <Card className="relative overflow-hidden">
        <div className={`absolute top-0 right-0 w-32 h-32 ${getGradeColor(vendorScore.grade)} opacity-10 transform rotate-45 translate-x-16 -translate-y-16`}></div>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-6 w-6 text-yellow-500" />
                Overall Vendor Score
              </CardTitle>
              <CardDescription>Comprehensive performance evaluation</CardDescription>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold text-foreground">{vendorScore.overall}</div>
              <Badge className={`${getGradeColor(vendorScore.grade)} text-white`}>
                Grade {vendorScore.grade}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Progress value={vendorScore.overall} className="h-3" />
          <div className="mt-4 grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Shield className="h-4 w-4 text-blue-500" />
                <span className="text-sm text-muted-foreground">Quality</span>
              </div>
              <div className="text-lg font-semibold text-foreground">{vendorScore.quality}</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Clock className="h-4 w-4 text-green-500" />
                <span className="text-sm text-muted-foreground">Reliability</span>
              </div>
              <div className="text-lg font-semibold text-foreground">{vendorScore.reliability}</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <FileCheck className="h-4 w-4 text-purple-500" />
                <span className="text-sm text-muted-foreground">Compliance</span>
              </div>
              <div className="text-lg font-semibold text-foreground">{vendorScore.compliance}</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Leaf className="h-4 w-4 text-emerald-500" />
                <span className="text-sm text-muted-foreground">Sustainability</span>
              </div>
              <div className="text-lg font-semibold text-foreground">{vendorScore.sustainability}</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Lightbulb className="h-4 w-4 text-orange-500" />
                <span className="text-sm text-muted-foreground">Innovation</span>
              </div>
              <div className="text-lg font-semibold text-foreground">{vendorScore.innovation}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Analysis */}
      <Tabs defaultValue="breakdown" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="breakdown">Score Breakdown</TabsTrigger>
          <TabsTrigger value="metrics">Raw Metrics</TabsTrigger>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
        </TabsList>

        <TabsContent value="breakdown" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { key: 'quality', label: 'Quality Score', icon: Shield, color: 'text-blue-500', description: 'Product quality and standards' },
              { key: 'reliability', label: 'Reliability Score', icon: Clock, color: 'text-green-500', description: 'Delivery and consistency' },
              { key: 'compliance', label: 'Compliance Score', icon: FileCheck, color: 'text-purple-500', description: 'Regulatory adherence' },
              { key: 'sustainability', label: 'Sustainability Score', icon: Leaf, color: 'text-emerald-500', description: 'Environmental impact' },
              { key: 'innovation', label: 'Innovation Score', icon: Lightbulb, color: 'text-orange-500', description: 'Technology adoption' }
            ].map(({ key, label, icon: Icon, color, description }) => (
              <Card key={key}>
                <CardHeader className="pb-3">
                  <CardTitle className={`flex items-center gap-2 text-sm ${color}`}>
                    <Icon className="h-4 w-4" />
                    {label}
                  </CardTitle>
                  <CardDescription className="text-xs">{description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl font-bold text-foreground">
                      {vendorScore[key as keyof VendorScore] as number}
                    </span>
                    {getScoreIcon(vendorScore[key as keyof VendorScore] as number)}
                  </div>
                  <Progress value={vendorScore[key as keyof VendorScore] as number} className="h-2" />
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="metrics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Batch Performance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Total Batches</span>
                  <span className="font-medium">{vendorMetrics.totalBatches}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Approved</span>
                  <span className="font-medium text-green-600">{vendorMetrics.approvedBatches}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Rejected</span>
                  <span className="font-medium text-red-600">{vendorMetrics.rejectedBatches}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Avg Quality</span>
                  <span className="font-medium">{vendorMetrics.averageQualityScore}%</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Delivery Performance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Total Deliveries</span>
                  <span className="font-medium">{vendorMetrics.totalDeliveries}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">On Time</span>
                  <span className="font-medium text-green-600">{vendorMetrics.onTimeDelivery}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Returns</span>
                  <span className="font-medium text-red-600">{vendorMetrics.returnsRejections}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Complaints</span>
                  <span className="font-medium text-orange-600">{vendorMetrics.customerComplaints}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Compliance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Documents</span>
                  <span className="font-medium">{vendorMetrics.documentsSubmitted}/{vendorMetrics.documentsRequired}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Certifications</span>
                  <span className="font-medium">{vendorMetrics.certifications.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Issues</span>
                  <span className="font-medium text-red-600">{vendorMetrics.complianceIssues}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Experience</span>
                  <span className="font-medium">{vendorMetrics.yearsInBusiness} years</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Certifications</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {vendorMetrics.certifications.map((cert, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {cert}
                    </Badge>
                  ))}
                  {vendorMetrics.certifications.length === 0 && (
                    <p className="text-sm text-muted-foreground">No certifications</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-600">
                  <CheckCircle className="h-5 w-5" />
                  Strengths
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {vendorScore.strengths.map((strength, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <Star className="h-3 w-3 text-green-500 mt-1 flex-shrink-0" />
                      {strength}
                    </li>
                  ))}
                  {vendorScore.strengths.length === 0 && (
                    <p className="text-sm text-muted-foreground">No specific strengths identified</p>
                  )}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-orange-600">
                  <AlertCircle className="h-5 w-5" />
                  Improvement Areas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {vendorScore.improvementAreas.map((area, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <Target className="h-3 w-3 text-orange-500 mt-1 flex-shrink-0" />
                      {area}
                    </li>
                  ))}
                  {vendorScore.improvementAreas.length === 0 && (
                    <p className="text-sm text-muted-foreground">No improvement areas identified</p>
                  )}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-600">
                  <Lightbulb className="h-5 w-5" />
                  Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {vendorScore.recommendations.map((recommendation, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <BarChart3 className="h-3 w-3 text-blue-500 mt-1 flex-shrink-0" />
                      {recommendation}
                    </li>
                  ))}
                  {vendorScore.recommendations.length === 0 && (
                    <p className="text-sm text-muted-foreground">No specific recommendations at this time</p>
                  )}
                </ul>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          {/* Time Period Selector */}
          <div className="flex items-center gap-4">
            <Select value={trendsPeriod} onValueChange={setTrendsPeriod}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Select time period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="3months">Last 3 Months</SelectItem>
                <SelectItem value="6months">Last 6 Months</SelectItem>
                <SelectItem value="12months">Last 12 Months</SelectItem>
                <SelectItem value="24months">Last 24 Months</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={trendsMetric} onValueChange={setTrendsMetric}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Select metric" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="overall">Overall Score</SelectItem>
                <SelectItem value="quality">Quality</SelectItem>
                <SelectItem value="delivery">Delivery</SelectItem>
                <SelectItem value="cost">Cost</SelectItem>
                <SelectItem value="service">Service</SelectItem>
                <SelectItem value="compliance">Compliance</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Performance Trends Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-blue-600" />
                Performance Trends
              </CardTitle>
              <CardDescription>
                Historical performance analysis showing {trendsMetric} trends over the {trendsPeriod}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Trend Line Visualization */}
                <div className="h-64 border rounded-lg p-4 bg-muted/50">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-medium">{getTrendsTitle()}</h4>
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        <span>Current Vendor</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                        <span>Industry Average</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Simple Line Chart Representation */}
                  <div className="relative h-40">
                    <svg className="w-full h-full" viewBox="0 0 800 160">
                      {/* Grid lines */}
                      {[0, 1, 2, 3, 4].map(i => (
                        <g key={i}>
                          <line x1="0" y1={i * 40} x2="800" y2={i * 40} stroke="#e5e5e5" strokeWidth="1"/>
                          <text x="10" y={i * 40 + 5} fill="#9ca3af" fontSize="12">{100 - i * 20}</text>
                        </g>
                      ))}
                      
                      {/* Vendor performance line */}
                      <polyline
                        fill="none"
                        stroke="#3b82f6"
                        strokeWidth="3"
                        points={generateTrendLine(vendorScore.historicalData, trendsMetric)}
                      />
                      
                      {/* Industry average line */}
                      <polyline
                        fill="none"
                        stroke="#9ca3af"
                        strokeWidth="2"
                        strokeDasharray="5,5"
                        points={generateIndustryAverageLine()}
                      />
                      
                      {/* Data points */}
                      {generateDataPoints(vendorScore.historicalData, trendsMetric).map((point, index) => (
                        <circle
                          key={index}
                          cx={point.x}
                          cy={point.y}
                          r="4"
                          fill="#3b82f6"
                          className="hover:r-6 cursor-pointer"
                        >
                          <title>{point.label}</title>
                        </circle>
                      ))}
                    </svg>
                  </div>
                  
                  {/* Timeline */}
                  <div className="flex justify-between text-xs text-muted-foreground mt-2">
                    {getTimelineLabels().map((label, index) => (
                      <span key={index}>{label}</span>
                    ))}
                  </div>
                </div>

                {/* Trend Statistics */}
                <div className="grid grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {calculateTrendImprovement()}%
                    </div>
                    <div className="text-sm text-blue-600 font-medium">Improvement</div>
                    <div className="text-xs text-muted-foreground">vs. baseline</div>
                  </div>
                  
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {getCurrentScore()}
                    </div>
                    <div className="text-sm text-green-600 font-medium">Current Score</div>
                    <div className="text-xs text-muted-foreground">latest assessment</div>
                  </div>
                  
                  <div className="text-center p-4 bg-orange-50 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">
                      {calculateVolatility()}%
                    </div>
                    <div className="text-sm text-orange-600 font-medium">Volatility</div>
                    <div className="text-xs text-muted-foreground">score variation</div>
                  </div>
                  
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">
                      #{getIndustryRanking()}
                    </div>
                    <div className="text-sm text-purple-600 font-medium">Industry Rank</div>
                    <div className="text-xs text-muted-foreground">current position</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Milestone Analysis */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-green-600" />
                Performance Milestones
              </CardTitle>
              <CardDescription>
                Key achievements and significant events in vendor performance history
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {vendorScore.milestones.map((milestone, index) => (
                  <div key={index} className="flex items-start gap-4 p-4 border rounded-lg">
                    <div className={`p-2 rounded-full ${getMilestoneIconStyle(milestone.type)}`}>
                      {getMilestoneIcon(milestone.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium">{milestone.title}</h4>
                        <Badge variant={milestone.type === 'achievement' ? 'default' : 
                                     milestone.type === 'improvement' ? 'secondary' : 'outline'}>
                          {milestone.type}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{milestone.description}</p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>{new Date(milestone.date).toLocaleDateString()}</span>
                        <span>Impact: {milestone.impact}</span>
                        {milestone.scoreChange && (
                          <span className={milestone.scoreChange > 0 ? 'text-green-600' : 'text-red-600'}>
                            {milestone.scoreChange > 0 ? '+' : ''}{milestone.scoreChange} points
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Predictive Analysis */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-indigo-600" />
                Predictive Analysis
              </CardTitle>
              <CardDescription>
                AI-powered insights and future performance projections
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Performance Forecast */}
                <div>
                  <h4 className="font-medium mb-3">3-Month Performance Forecast</h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-xl font-bold text-blue-600 mb-1">
                        {generateForecast('optimistic')}
                      </div>
                      <div className="text-sm text-green-600 mb-1">Optimistic</div>
                      <div className="text-xs text-muted-foreground">Best case scenario</div>
                    </div>
                    <div className="text-center p-4 border rounded-lg bg-blue-50">
                      <div className="text-xl font-bold text-blue-600 mb-1">
                        {generateForecast('realistic')}
                      </div>
                      <div className="text-sm text-blue-600 mb-1">Most Likely</div>
                      <div className="text-xs text-muted-foreground">Expected outcome</div>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-xl font-bold text-orange-600 mb-1">
                        {generateForecast('conservative')}
                      </div>
                      <div className="text-sm text-orange-600 mb-1">Conservative</div>
                      <div className="text-xs text-muted-foreground">Cautious estimate</div>
                    </div>
                  </div>
                </div>

                {/* Risk Assessment */}
                <div>
                  <h4 className="font-medium mb-3">Risk Assessment</h4>
                  <div className="space-y-3">
                    {generateRiskAssessment().map((risk, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className={`w-3 h-3 rounded-full ${getRiskColor(risk.level)}`}></div>
                          <span className="font-medium">{risk.factor}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={risk.level === 'high' ? 'destructive' : 
                                        risk.level === 'medium' ? 'secondary' : 'outline'}>
                            {risk.level} risk
                          </Badge>
                          <span className="text-sm text-muted-foreground">{risk.probability}%</span>
                        </div>
                      </div>
                    ))}
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