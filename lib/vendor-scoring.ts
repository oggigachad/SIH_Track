// Vendor Scoring System for Railway QR Management

export interface VendorMetrics {
  totalBatches: number
  approvedBatches: number
  rejectedBatches: number
  averageQualityScore: number
  onTimeDelivery: number
  totalDeliveries: number
  documentsSubmitted: number
  documentsRequired: number
  complianceIssues: number
  customerComplaints: number
  returnsRejections: number
  yearsInBusiness: number
  certifications: string[]
  sustainabilityScore: number
  innovationScore: number
}

export interface VendorScore {
  overall: number
  quality: number
  reliability: number
  compliance: number
  sustainability: number
  innovation: number
  breakdown: {
    qualityScore: number
    reliabilityScore: number
    complianceScore: number
    sustainabilityScore: number
    innovationScore: number
  }
  grade: 'A+' | 'A' | 'B+' | 'B' | 'C+' | 'C' | 'D' | 'F'
  recommendations: string[]
  strengths: string[]
  improvementAreas: string[]
  historicalData: {
    date: string
    overall: number
    quality: number
    reliability: number
    compliance: number
    sustainability: number
    innovation: number
  }[]
  milestones: {
    date: string
    type: 'achievement' | 'improvement' | 'milestone'
    title: string
    description: string
    impact: string
    scoreChange?: number
  }[]
}

export function calculateVendorScore(metrics: VendorMetrics): VendorScore {
  // Quality Score (0-100)
  const qualityScore = calculateQualityScore(metrics)
  
  // Reliability Score (0-100)
  const reliabilityScore = calculateReliabilityScore(metrics)
  
  // Compliance Score (0-100)
  const complianceScore = calculateComplianceScore(metrics)
  
  // Sustainability Score (0-100)
  const sustainabilityScore = metrics.sustainabilityScore || 0
  
  // Innovation Score (0-100)
  const innovationScore = metrics.innovationScore || 0
  
  // Weighted Overall Score
  const weights = {
    quality: 0.30,      // 30% - Most important for railways
    reliability: 0.25,  // 25% - Critical for operations
    compliance: 0.20,   // 20% - Regulatory requirements
    sustainability: 0.15, // 15% - Environmental responsibility
    innovation: 0.10    // 10% - Future readiness
  }
  
  const overall = Math.round(
    qualityScore * weights.quality +
    reliabilityScore * weights.reliability +
    complianceScore * weights.compliance +
    sustainabilityScore * weights.sustainability +
    innovationScore * weights.innovation
  )
  
  const grade = getScoreGrade(overall)
  const { recommendations, strengths, improvementAreas } = generateRecommendations(
    { qualityScore, reliabilityScore, complianceScore, sustainabilityScore, innovationScore },
    metrics
  )
  
  return {
    overall,
    quality: qualityScore,
    reliability: reliabilityScore,
    compliance: complianceScore,
    sustainability: sustainabilityScore,
    innovation: innovationScore,
    breakdown: {
      qualityScore,
      reliabilityScore,
      complianceScore,
      sustainabilityScore,
      innovationScore
    },
    grade,
    recommendations,
    strengths,
    improvementAreas,
    historicalData: generateHistoricalData({
      overall,
      quality: qualityScore,
      reliability: reliabilityScore,
      compliance: complianceScore,
      sustainability: sustainabilityScore,
      innovation: innovationScore
    }),
    milestones: generateMilestones(overall, qualityScore, reliabilityScore, complianceScore)
  }
}

function calculateQualityScore(metrics: VendorMetrics): number {
  const approvalRate = metrics.totalBatches > 0 ? (metrics.approvedBatches / metrics.totalBatches) * 100 : 0
  const avgQuality = metrics.averageQualityScore || 0
  const returnRate = metrics.totalDeliveries > 0 ? (metrics.returnsRejections / metrics.totalDeliveries) * 100 : 0
  const complaintRate = metrics.totalDeliveries > 0 ? (metrics.customerComplaints / metrics.totalDeliveries) * 100 : 0
  
  // Quality score calculation
  let qualityScore = 0
  qualityScore += approvalRate * 0.4  // 40% weight on approval rate
  qualityScore += avgQuality * 0.3    // 30% weight on average quality score
  qualityScore += Math.max(0, 100 - returnRate * 10) * 0.2  // 20% weight (penalize returns)
  qualityScore += Math.max(0, 100 - complaintRate * 15) * 0.1  // 10% weight (penalize complaints)
  
  return Math.min(100, Math.max(0, Math.round(qualityScore)))
}

function calculateReliabilityScore(metrics: VendorMetrics): number {
  const onTimeRate = metrics.totalDeliveries > 0 ? (metrics.onTimeDelivery / metrics.totalDeliveries) * 100 : 0
  const experienceBonus = Math.min(20, metrics.yearsInBusiness * 2) // Max 20 points for experience
  const consistencyScore = calculateConsistencyScore(metrics)
  
  let reliabilityScore = 0
  reliabilityScore += onTimeRate * 0.6        // 60% weight on on-time delivery
  reliabilityScore += experienceBonus * 0.2   // 20% weight on experience
  reliabilityScore += consistencyScore * 0.2  // 20% weight on consistency
  
  return Math.min(100, Math.max(0, Math.round(reliabilityScore)))
}

function calculateComplianceScore(metrics: VendorMetrics): number {
  const documentationRate = metrics.documentsRequired > 0 ? (metrics.documentsSubmitted / metrics.documentsRequired) * 100 : 100
  const certificationBonus = metrics.certifications.length * 5 // 5 points per certification, max handled in cap
  const compliancePenalty = metrics.complianceIssues * 10 // 10 points penalty per issue
  
  let complianceScore = documentationRate * 0.6 + certificationBonus * 0.4
  complianceScore -= compliancePenalty
  
  return Math.min(100, Math.max(0, Math.round(complianceScore)))
}

function calculateConsistencyScore(metrics: VendorMetrics): number {
  // Measure consistency in quality scores and delivery performance
  // This is a simplified calculation - in reality, you'd analyze variance over time
  const qualityConsistency = Math.max(0, 100 - Math.abs(metrics.averageQualityScore - 85)) // Penalty if far from target
  const deliveryConsistency = metrics.onTimeDelivery > 0.8 ? 100 : metrics.onTimeDelivery * 125 // Scaled score
  
  return Math.round((qualityConsistency + deliveryConsistency) / 2)
}

function getScoreGrade(score: number): 'A+' | 'A' | 'B+' | 'B' | 'C+' | 'C' | 'D' | 'F' {
  if (score >= 95) return 'A+'
  if (score >= 90) return 'A'
  if (score >= 85) return 'B+'
  if (score >= 80) return 'B'
  if (score >= 75) return 'C+'
  if (score >= 70) return 'C'
  if (score >= 60) return 'D'
  return 'F'
}

function generateRecommendations(
  scores: { qualityScore: number; reliabilityScore: number; complianceScore: number; sustainabilityScore: number; innovationScore: number },
  metrics: VendorMetrics
): { recommendations: string[]; strengths: string[]; improvementAreas: string[] } {
  const recommendations: string[] = []
  const strengths: string[] = []
  const improvementAreas: string[] = []
  
  // Analyze scores and generate recommendations
  if (scores.qualityScore >= 90) {
    strengths.push('Excellent quality control and product standards')
  } else if (scores.qualityScore < 70) {
    improvementAreas.push('Quality control processes need enhancement')
    recommendations.push('Implement stricter quality control measures and testing protocols')
  }
  
  if (scores.reliabilityScore >= 90) {
    strengths.push('Outstanding delivery reliability and consistency')
  } else if (scores.reliabilityScore < 70) {
    improvementAreas.push('Delivery reliability and timeline adherence')
    recommendations.push('Improve supply chain management and delivery scheduling')
  }
  
  if (scores.complianceScore >= 90) {
    strengths.push('Excellent regulatory compliance and documentation')
  } else if (scores.complianceScore < 70) {
    improvementAreas.push('Regulatory compliance and documentation standards')
    recommendations.push('Enhance documentation processes and obtain relevant certifications')
  }
  
  if (scores.sustainabilityScore < 60) {
    improvementAreas.push('Environmental sustainability practices')
    recommendations.push('Develop and implement sustainable manufacturing practices')
  } else if (scores.sustainabilityScore >= 80) {
    strengths.push('Strong commitment to environmental sustainability')
  }
  
  if (scores.innovationScore < 50) {
    improvementAreas.push('Innovation and technology adoption')
    recommendations.push('Invest in R&D and adopt modern manufacturing technologies')
  } else if (scores.innovationScore >= 80) {
    strengths.push('Innovative approach to manufacturing and problem-solving')
  }
  
  // General recommendations based on metrics
  if (metrics.customerComplaints > 0) {
    recommendations.push('Focus on customer satisfaction and complaint resolution processes')
  }
  
  if (metrics.returnsRejections > metrics.totalDeliveries * 0.05) {
    recommendations.push('Reduce return rates by improving quality assurance before shipment')
  }
  
  if (metrics.certifications.length < 3) {
    recommendations.push('Consider obtaining additional industry certifications (ISO 9001, AS9100, etc.)')
  }
  
  return { recommendations, strengths, improvementAreas }
}

// Mock data generator for testing
export function generateMockVendorMetrics(vendorId: string): VendorMetrics {
  const random = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min
  
  return {
    totalBatches: random(50, 200),
    approvedBatches: random(40, 180),
    rejectedBatches: random(0, 10),
    averageQualityScore: random(75, 95),
    onTimeDelivery: random(15, 25),
    totalDeliveries: random(20, 30),
    documentsSubmitted: random(45, 50),
    documentsRequired: 50,
    complianceIssues: random(0, 3),
    customerComplaints: random(0, 5),
    returnsRejections: random(0, 3),
    yearsInBusiness: random(3, 15),
    certifications: ['ISO 9001', 'AS9100', 'ISO 14001'].slice(0, random(1, 3)),
    sustainabilityScore: random(60, 90),
    innovationScore: random(50, 85)
  }
}

function generateHistoricalData(currentScores: {
  overall: number
  quality: number
  reliability: number
  compliance: number
  sustainability: number
  innovation: number
}) {
  const historicalData = []
  const months = 12
  
  for (let i = months - 1; i >= 0; i--) {
    const date = new Date()
    date.setMonth(date.getMonth() - i)
    
    // Generate realistic historical progression
    const progressionFactor = (months - i) / months // 0 to 1
    const variation = (Math.random() - 0.5) * 10 // ±5 point variation
    
    const baseScore = currentScores.overall * 0.8 + (progressionFactor * currentScores.overall * 0.2)
    
    historicalData.push({
      date: date.toISOString().split('T')[0],
      overall: Math.max(50, Math.min(100, Math.round(baseScore + variation))),
      quality: Math.max(50, Math.min(100, Math.round(currentScores.quality * 0.8 + (progressionFactor * currentScores.quality * 0.2) + variation))),
      reliability: Math.max(50, Math.min(100, Math.round(currentScores.reliability * 0.8 + (progressionFactor * currentScores.reliability * 0.2) + variation))),
      compliance: Math.max(50, Math.min(100, Math.round(currentScores.compliance * 0.8 + (progressionFactor * currentScores.compliance * 0.2) + variation))),
      sustainability: Math.max(50, Math.min(100, Math.round(currentScores.sustainability * 0.8 + (progressionFactor * currentScores.sustainability * 0.2) + variation))),
      innovation: Math.max(50, Math.min(100, Math.round(currentScores.innovation * 0.8 + (progressionFactor * currentScores.innovation * 0.2) + variation)))
    })
  }
  
  return historicalData
}

function generateMilestones(
  overallScore: number,
  qualityScore: number,
  reliabilityScore: number,
  complianceScore: number
) {
  const milestones = []
  
  // Generate milestones based on performance levels
  if (qualityScore >= 90) {
    milestones.push({
      date: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 3 months ago
      type: 'achievement' as const,
      title: 'Quality Excellence Milestone',
      description: 'Achieved exceptional quality standards with 90+ quality score',
      impact: 'High',
      scoreChange: 8
    })
  }
  
  if (reliabilityScore >= 85) {
    milestones.push({
      date: new Date(Date.now() - 150 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 5 months ago
      type: 'improvement' as const,
      title: 'Delivery Reliability Improvement',
      description: 'Significant improvement in on-time delivery performance',
      impact: 'Medium',
      scoreChange: 5
    })
  }
  
  if (complianceScore >= 88) {
    milestones.push({
      date: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 6 months ago
      type: 'milestone' as const,
      title: 'Compliance Certification',
      description: 'Obtained additional industry certifications and improved compliance score',
      impact: 'Medium',
      scoreChange: 6
    })
  }
  
  // Always add a partnership milestone
  milestones.push({
    date: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 1 year ago
    type: 'milestone' as const,
    title: 'Partnership Established',
    description: 'Official partnership agreement signed and vendor onboarding completed',
    impact: 'High'
  })
  
  // Sort by date (most recent first)
  return milestones.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}
