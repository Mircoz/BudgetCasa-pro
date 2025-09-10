/**
 * Competitive Intelligence Monitoring System for BudgetCasa Pro
 * 
 * Advanced system for monitoring competitors, identifying vulnerabilities,
 * and creating strategic opportunities for customer acquisition and retention.
 */

import { EnhancedPersonCard, EnhancedCompanyCard } from './enhanced-types'

// Core competitive intelligence types
export interface CompetitiveIntelligence {
  leadId: string
  currentProvider?: CompetitorProfile
  competitiveAnalysis: CompetitiveAnalysis
  vulnerabilities: CompetitorVulnerability[]
  opportunities: CompetitiveOpportunity[]
  switchingAnalysis: SwitchingAnalysis
  interceptStrategies: InterceptStrategy[]
  monitoringAlerts: CompetitiveAlert[]
  lastUpdated: Date
}

export interface CompetitorProfile {
  name: string
  marketShare: number
  strengths: CompetitorStrength[]
  weaknesses: CompetitorWeakness[]
  pricing: PricingIntelligence
  reputation: ReputationMetrics
  vulnerabilityScore: number // 0-100, higher = more vulnerable
  marketTrends: MarketTrend[]
}

export interface CompetitorStrength {
  strength: string
  category: StrengthCategory
  impact: 'low' | 'medium' | 'high'
  stability: 'declining' | 'stable' | 'growing'
  counterStrategy?: string
}

export type StrengthCategory = 
  | 'pricing' 
  | 'brand_recognition' 
  | 'customer_service' 
  | 'product_portfolio' 
  | 'distribution' 
  | 'technology' 
  | 'market_presence'

export interface CompetitorWeakness {
  weakness: string
  category: WeaknessCategory
  severity: 'minor' | 'moderate' | 'major' | 'critical'
  trend: 'improving' | 'stable' | 'worsening'
  exploitationStrategy: string
  exploitationDifficulty: 'easy' | 'medium' | 'hard'
}

export type WeaknessCategory = 
  | 'customer_satisfaction' 
  | 'pricing_competitiveness' 
  | 'product_gaps' 
  | 'service_quality' 
  | 'claims_processing' 
  | 'digital_experience' 
  | 'innovation'

export interface PricingIntelligence {
  competitivePricing: PriceComparison[]
  pricingStrategy: 'premium' | 'competitive' | 'discount' | 'value'
  recentChanges: PriceChange[]
  priceElasticity: number // how price sensitive their customers are
  vulnerableSegments: string[] // where pricing is most vulnerable
}

export interface PriceComparison {
  productType: string
  competitorPrice: number
  ourPrice: number
  differential: number // % difference
  competitiveness: 'advantage' | 'parity' | 'disadvantage'
  marketPosition: string
}

export interface PriceChange {
  date: Date
  productType: string
  oldPrice: number
  newPrice: number
  changeReason: string
  marketReaction: string
}

export interface ReputationMetrics {
  overallRating: number // 1-5
  reviewSources: ReviewSource[]
  sentimentAnalysis: SentimentAnalysis
  complaintCategories: ComplaintCategory[]
  trustSignals: TrustSignal[]
  reputationTrend: 'improving' | 'stable' | 'declining'
}

export interface ReviewSource {
  source: string
  rating: number
  reviewCount: number
  recentTrend: 'up' | 'stable' | 'down'
  keyThemes: string[]
}

export interface SentimentAnalysis {
  positive: number // %
  neutral: number // %
  negative: number // %
  commonPositives: string[]
  commonNegatives: string[]
  sentimentTrend: 'improving' | 'stable' | 'declining'
}

export interface ComplaintCategory {
  category: string
  frequency: number // % of total complaints
  severity: 'low' | 'medium' | 'high'
  resolutionRate: number // %
  trend: 'improving' | 'stable' | 'worsening'
}

export interface TrustSignal {
  signal: string
  strength: 'weak' | 'moderate' | 'strong'
  authenticity: 'verified' | 'likely' | 'questionable'
  impact: number // 0-100
}

export interface MarketTrend {
  trend: string
  direction: 'positive' | 'negative' | 'neutral'
  impact: 'low' | 'medium' | 'high'
  timeframe: string
  competitorResponse: string
}

export interface CompetitiveAnalysis {
  competitorLandscape: CompetitorLandscape[]
  marketPositioning: MarketPositioning
  competitiveAdvantages: CompetitiveAdvantage[]
  threatAssessment: ThreatAssessment
  opportunityMatrix: OpportunityMatrix
}

export interface CompetitorLandscape {
  competitor: string
  marketShare: number
  customerSegments: string[]
  keyDifferentiators: string[]
  competitiveThreats: string[]
}

export interface MarketPositioning {
  ourPosition: MarketPosition
  competitorPositions: CompetitorPosition[]
  whiteSpaceOpportunities: WhiteSpace[]
  positioningRecommendations: PositioningRecommendation[]
}

export interface MarketPosition {
  dimension1: string // e.g., "price"
  dimension2: string // e.g., "service quality"
  position: { x: number, y: number } // coordinates on positioning map
  strength: number // 0-100
}

export interface CompetitorPosition {
  competitor: string
  position: MarketPosition
  movementTrend: 'towards_us' | 'away_from_us' | 'lateral' | 'stable'
}

export interface WhiteSpace {
  opportunity: string
  marketSize: number
  accessibility: 'easy' | 'medium' | 'difficult'
  competitorPresence: 'none' | 'weak' | 'moderate' | 'strong'
  strategicFit: number // 0-100
}

export interface PositioningRecommendation {
  recommendation: string
  rationale: string
  effort: 'low' | 'medium' | 'high'
  timeline: string
  expectedImpact: number // 0-100
}

export interface CompetitiveAdvantage {
  advantage: string
  sustainability: 'temporary' | 'medium_term' | 'sustainable'
  defendability: 'weak' | 'moderate' | 'strong'
  exploitationLevel: 'under_utilized' | 'well_utilized' | 'over_exploited'
  improvementPotential: number // 0-100
}

export interface ThreatAssessment {
  immediateThreats: CompetitiveThreat[]
  emergingThreats: CompetitiveThreat[]
  threatLevel: 'low' | 'medium' | 'high' | 'critical'
  responseStrategies: ThreatResponse[]
}

export interface CompetitiveThreat {
  threat: string
  source: string // competitor name
  probability: number // 0-100
  impact: 'low' | 'medium' | 'high' | 'severe'
  timeframe: string
  earlyWarnings: string[]
}

export interface ThreatResponse {
  threat: string
  responseStrategy: string
  resources_required: string
  timeline: string
  effectiveness: number // 0-100 expected effectiveness
}

export interface OpportunityMatrix {
  opportunities: CompetitiveOpportunity[]
  prioritization: OpportunityPriority[]
  resourceAllocation: ResourceAllocation[]
}

export interface CompetitiveOpportunity {
  opportunityId: string
  opportunity: string
  category: OpportunityCategory
  source: 'competitor_weakness' | 'market_gap' | 'trend_shift' | 'regulation_change'
  size: OpportunitySize
  accessibility: 'immediate' | 'short_term' | 'medium_term' | 'long_term'
  requiredCapabilities: RequiredCapability[]
  riskLevel: 'low' | 'medium' | 'high'
  competitorResponse: string
}

export type OpportunityCategory = 
  | 'customer_acquisition' 
  | 'market_expansion' 
  | 'product_development' 
  | 'pricing_optimization' 
  | 'service_improvement'

export interface OpportunitySize {
  potentialRevenue: number
  potentialCustomers: number
  marketShare: number // % of total market
  confidenceLevel: number // 0-100
}

export interface RequiredCapability {
  capability: string
  currentLevel: 'none' | 'basic' | 'intermediate' | 'advanced'
  requiredLevel: 'basic' | 'intermediate' | 'advanced' | 'expert'
  developmentTime: number // months
  developmentCost: number
}

export interface OpportunityPriority {
  opportunityId: string
  priorityScore: number // 0-100
  reasoning: string[]
  quickWins: boolean
  strategicImportance: number // 0-100
}

export interface ResourceAllocation {
  opportunityId: string
  recommendedInvestment: number
  resourceType: 'financial' | 'human' | 'technological' | 'partnership'
  expectedROI: number
  paybackPeriod: number // months
}

export interface CompetitorVulnerability {
  vulnerabilityId: string
  competitor: string
  vulnerability: string
  category: VulnerabilityCategory
  severity: 'low' | 'medium' | 'high' | 'critical'
  exploitability: 'difficult' | 'moderate' | 'easy'
  timeWindow: VulnerabilityWindow
  exploitationStrategy: ExploitationStrategy
  riskLevel: 'low' | 'medium' | 'high'
}

export type VulnerabilityCategory = 
  | 'customer_dissatisfaction' 
  | 'pricing_pressure' 
  | 'service_failures' 
  | 'regulatory_compliance' 
  | 'technology_gaps' 
  | 'talent_exodus' 
  | 'financial_constraints'

export interface VulnerabilityWindow {
  opening: Date
  estimated_duration: number // days
  closing_factors: string[]
  optimal_exploitation_period: string
}

export interface ExploitationStrategy {
  strategy: string
  tactics: string[]
  resources_needed: string[]
  timeline: string
  success_metrics: string[]
  contingency_plans: string[]
}

export interface SwitchingAnalysis {
  switchingProbability: number // 0-100
  switchingBarriers: SwitchingBarrier[]
  switchingDrivers: SwitchingDriver[]
  optimalSwitchingTime: Date
  switchingProcess: SwitchingProcess
  switchingIncentives: SwitchingIncentive[]
}

export interface SwitchingBarrier {
  barrier: string
  strength: 'weak' | 'moderate' | 'strong'
  type: 'financial' | 'procedural' | 'emotional' | 'contractual'
  overcoming_strategy: string
  effort_required: 'low' | 'medium' | 'high'
}

export interface SwitchingDriver {
  driver: string
  motivation: 'cost_savings' | 'better_service' | 'product_features' | 'convenience' | 'trust_issues'
  strength: number // 0-100
  addressability: 'fully' | 'partially' | 'minimally'
}

export interface SwitchingProcess {
  phases: SwitchingPhase[]
  totalDuration: number // days
  criticalPoints: CriticalPoint[]
  supportNeeded: string[]
}

export interface SwitchingPhase {
  phase: string
  duration: number // days
  activities: string[]
  potential_obstacles: string[]
  support_strategies: string[]
}

export interface CriticalPoint {
  point: string
  risk_level: 'low' | 'medium' | 'high'
  mitigation_strategy: string
  success_factors: string[]
}

export interface SwitchingIncentive {
  incentive: string
  type: 'financial' | 'service' | 'product' | 'convenience'
  appeal_level: number // 0-100
  cost: number
  effectiveness: number // 0-100
}

export interface InterceptStrategy {
  strategyId: string
  strategy: string
  target_competitor: string
  timing: InterceptTiming
  channels: InterceptChannel[]
  messaging: InterceptMessaging
  success_probability: number // 0-100
  resource_requirements: ResourceRequirement[]
}

export interface InterceptTiming {
  optimal_window: string
  trigger_events: string[]
  frequency: string
  duration: number // days
  seasonality_factors: string[]
}

export interface InterceptChannel {
  channel: string
  effectiveness: number // 0-100
  cost_efficiency: number // 0-100
  reach: number // potential customers reached
  competitive_advantage: string
}

export interface InterceptMessaging {
  primary_message: string
  key_differentiators: string[]
  proof_points: string[]
  call_to_action: string
  personalization_elements: string[]
}

export interface ResourceRequirement {
  resource: string
  quantity: number
  duration: number // months
  cost: number
  criticality: 'essential' | 'important' | 'nice_to_have'
}

export interface CompetitiveAlert {
  alertId: string
  alert_type: AlertType
  priority: 'low' | 'medium' | 'high' | 'critical'
  competitor: string
  description: string
  impact_assessment: string
  recommended_actions: string[]
  monitoring_frequency: string
  created_date: Date
  expiry_date?: Date
}

export type AlertType = 
  | 'price_change' 
  | 'new_product_launch' 
  | 'service_disruption' 
  | 'reputation_crisis' 
  | 'market_expansion' 
  | 'leadership_change' 
  | 'regulatory_issue'

// Competitive Intelligence Engine
export class CompetitiveIntelligenceEngine {
  private competitorProfiles: Map<string, CompetitorProfile> = new Map()
  private marketData: Map<string, any> = new Map()
  private vulnerabilityPatterns: Map<string, any> = new Map()

  constructor() {
    this.initializeCompetitorData()
    this.initializeVulnerabilityPatterns()
  }

  /**
   * Generate comprehensive competitive intelligence for a lead
   */
  async generateCompetitiveIntelligence(
    lead: EnhancedPersonCard | EnhancedCompanyCard,
    additionalContext?: any
  ): Promise<CompetitiveIntelligence> {
    const leadId = lead.id
    
    // Identify current provider
    const currentProvider = this.identifyCurrentProvider(lead)
    
    // Analyze competitive landscape
    const competitiveAnalysis = await this.analyzeCompetitiveLandscape(lead, currentProvider)
    
    // Identify vulnerabilities
    const vulnerabilities = await this.identifyVulnerabilities(currentProvider, lead)
    
    // Find opportunities
    const opportunities = this.identifyOpportunities(competitiveAnalysis, vulnerabilities, lead)
    
    // Analyze switching potential
    const switchingAnalysis = await this.analyzeSwitchingPotential(lead, currentProvider)
    
    // Generate intercept strategies
    const interceptStrategies = this.generateInterceptStrategies(
      currentProvider, vulnerabilities, switchingAnalysis, lead
    )
    
    // Create monitoring alerts
    const monitoringAlerts = this.generateMonitoringAlerts(currentProvider, vulnerabilities, lead)

    return {
      leadId,
      currentProvider,
      competitiveAnalysis,
      vulnerabilities,
      opportunities,
      switchingAnalysis,
      interceptStrategies,
      monitoringAlerts,
      lastUpdated: new Date()
    }
  }

  /**
   * Identify current insurance provider
   */
  private identifyCurrentProvider(lead: any): CompetitorProfile | undefined {
    // Use various signals to identify current provider
    const signals = []
    
    // Direct indicators
    if (lead.existingInsurance) {
      signals.push(...lead.existingInsurance.map((policy: any) => policy.provider))
    }
    
    // Behavioral indicators
    if (lead.demographics?.location) {
      const regionalProviders = this.getRegionalProviders(lead.demographics.location)
      signals.push(...regionalProviders)
    }
    
    // Competitive intelligence from previous interactions
    // Implementation would analyze past communications, quotes compared against, etc.
    
    const mostLikelyProvider = this.determineMostLikelyProvider(signals)
    return mostLikelyProvider ? this.competitorProfiles.get(mostLikelyProvider) : undefined
  }

  /**
   * Analyze competitive landscape
   */
  private async analyzeCompetitiveLandscape(
    lead: any,
    currentProvider?: CompetitorProfile
  ): Promise<CompetitiveAnalysis> {
    const competitorLandscape = this.buildCompetitorLandscape(lead)
    const marketPositioning = this.analyzeMarketPositioning(lead, currentProvider)
    const competitiveAdvantages = this.identifyCompetitiveAdvantages(lead)
    const threatAssessment = this.assessThreats(lead, currentProvider)
    const opportunityMatrix = this.buildOpportunityMatrix(lead, competitorLandscape)

    return {
      competitorLandscape,
      marketPositioning,
      competitiveAdvantages,
      threatAssessment,
      opportunityMatrix
    }
  }

  /**
   * Identify competitor vulnerabilities
   */
  private async identifyVulnerabilities(
    competitor?: CompetitorProfile,
    lead?: any
  ): Promise<CompetitorVulnerability[]> {
    if (!competitor) return []

    const vulnerabilities: CompetitorVulnerability[] = []

    // Analyze weaknesses for exploitability
    competitor.weaknesses.forEach(weakness => {
      if (weakness.severity === 'major' || weakness.severity === 'critical') {
        vulnerabilities.push({
          vulnerabilityId: `vuln_${weakness.category}_${Date.now()}`,
          competitor: competitor.name,
          vulnerability: weakness.weakness,
          category: weakness.category as VulnerabilityCategory,
          severity: weakness.severity,
          exploitability: weakness.exploitationDifficulty === 'easy' ? 'easy' : 'moderate',
          timeWindow: {
            opening: new Date(),
            estimated_duration: 90,
            closing_factors: ['competitor improvement', 'market attention'],
            optimal_exploitation_period: '30-60 days'
          },
          exploitationStrategy: {
            strategy: weakness.exploitationStrategy,
            tactics: this.generateExploitationTactics(weakness),
            resources_needed: ['marketing', 'sales', 'customer_service'],
            timeline: '4-8 weeks',
            success_metrics: ['conversion_rate', 'customer_acquisition_cost'],
            contingency_plans: ['pivot_to_different_weakness', 'increase_investment']
          },
          riskLevel: weakness.severity === 'critical' ? 'low' : 'medium'
        })
      }
    })

    // Analyze reputation issues
    if (competitor.reputation.overallRating < 3.5) {
      vulnerabilities.push({
        vulnerabilityId: `reputation_${Date.now()}`,
        competitor: competitor.name,
        vulnerability: 'Low customer satisfaction ratings',
        category: 'customer_dissatisfaction',
        severity: 'high',
        exploitability: 'easy',
        timeWindow: {
          opening: new Date(),
          estimated_duration: 180,
          closing_factors: ['reputation improvement initiatives', 'competitive response'],
          optimal_exploitation_period: '60-120 days'
        },
        exploitationStrategy: {
          strategy: 'Highlight superior customer service and satisfaction',
          tactics: ['customer_testimonials', 'satisfaction_guarantees', 'service_comparisons'],
          resources_needed: ['marketing', 'customer_service', 'content_creation'],
          timeline: '6-12 weeks',
          success_metrics: ['switching_rate', 'brand_preference'],
          contingency_plans: ['focus_on_specific_service_areas', 'competitive_pricing']
        },
        riskLevel: 'low'
      })
    }

    return vulnerabilities.sort((a, b) => {
      const severityWeight = { critical: 4, high: 3, medium: 2, low: 1 }
      return severityWeight[b.severity] - severityWeight[a.severity]
    })
  }

  /**
   * Generate intercept strategies
   */
  private generateInterceptStrategies(
    competitor?: CompetitorProfile,
    vulnerabilities?: CompetitorVulnerability[],
    switching?: SwitchingAnalysis,
    lead?: any
  ): InterceptStrategy[] {
    if (!competitor || !vulnerabilities) return []

    const strategies: InterceptStrategy[] = []

    // Vulnerability-based intercept strategies
    vulnerabilities.forEach(vuln => {
      if (vuln.exploitability === 'easy' || vuln.exploitability === 'moderate') {
        strategies.push({
          strategyId: `intercept_${vuln.vulnerabilityId}`,
          strategy: `Exploit ${vuln.competitor} weakness: ${vuln.vulnerability}`,
          target_competitor: vuln.competitor,
          timing: {
            optimal_window: vuln.timeWindow.optimal_exploitation_period,
            trigger_events: ['policy_renewal_approaching', 'service_issue', 'price_increase'],
            frequency: 'continuous_monitoring',
            duration: vuln.timeWindow.estimated_duration,
            seasonality_factors: ['renewal_seasons', 'budget_planning_periods']
          },
          channels: [
            {
              channel: 'direct_outreach',
              effectiveness: 75,
              cost_efficiency: 80,
              reach: 1000,
              competitive_advantage: 'personalized_approach'
            },
            {
              channel: 'digital_advertising',
              effectiveness: 60,
              cost_efficiency: 70,
              reach: 10000,
              competitive_advantage: 'targeted_messaging'
            }
          ],
          messaging: {
            primary_message: `Experience better ${vuln.category.replace('_', ' ')} with our superior service`,
            key_differentiators: this.generateKeyDifferentiators(vuln),
            proof_points: ['customer_testimonials', 'satisfaction_scores', 'awards'],
            call_to_action: 'Get a quote today and see the difference',
            personalization_elements: ['location', 'current_provider', 'specific_concerns']
          },
          success_probability: this.calculateInterceptSuccessProbability(vuln, switching),
          resource_requirements: [
            {
              resource: 'marketing_budget',
              quantity: 10000,
              duration: 3,
              cost: 10000,
              criticality: 'essential'
            }
          ]
        })
      }
    })

    return strategies.sort((a, b) => b.success_probability - a.success_probability)
  }

  // Helper methods (simplified implementations)
  private initializeCompetitorData(): void {
    // Initialize with major Italian insurance competitors
    this.competitorProfiles.set('Generali', {
      name: 'Generali',
      marketShare: 15.2,
      strengths: [
        {
          strength: 'Brand recognition',
          category: 'brand_recognition',
          impact: 'high',
          stability: 'stable',
          counterStrategy: 'Emphasize personal service and local expertise'
        }
      ],
      weaknesses: [
        {
          weakness: 'Slow claims processing',
          category: 'service_quality',
          severity: 'moderate',
          trend: 'stable',
          exploitationStrategy: 'Highlight our fast claims processing',
          exploitationDifficulty: 'easy'
        }
      ],
      pricing: {
        competitivePricing: [],
        pricingStrategy: 'premium',
        recentChanges: [],
        priceElasticity: 0.7,
        vulnerableSegments: ['price_sensitive_millennials']
      },
      reputation: {
        overallRating: 3.2,
        reviewSources: [],
        sentimentAnalysis: {
          positive: 35,
          neutral: 45,
          negative: 20,
          commonPositives: ['reliable', 'established'],
          commonNegatives: ['expensive', 'slow_service'],
          sentimentTrend: 'declining'
        },
        complaintCategories: [],
        trustSignals: [],
        reputationTrend: 'declining'
      },
      vulnerabilityScore: 65,
      marketTrends: []
    })

    // Add more competitors...
  }

  private initializeVulnerabilityPatterns(): void {
    // Initialize vulnerability detection patterns
  }

  private getRegionalProviders(location: string): string[] {
    const regionalMap: Record<string, string[]> = {
      'Milano': ['Generali', 'UnipolSai', 'Allianz'],
      'Roma': ['Generali', 'UnipolSai', 'AXA'],
      'Napoli': ['UnipolSai', 'Generali', 'ITAS']
    }
    return regionalMap[location] || ['Generali', 'UnipolSai']
  }

  private determineMostLikelyProvider(signals: string[]): string | undefined {
    // Count frequency of each provider mention
    const frequency: Record<string, number> = {}
    signals.forEach(signal => {
      frequency[signal] = (frequency[signal] || 0) + 1
    })
    
    // Return most frequent
    return Object.keys(frequency).reduce((a, b) => 
      frequency[a] > frequency[b] ? a : b, undefined
    )
  }

  private buildCompetitorLandscape(lead: any): CompetitorLandscape[] {
    // Build competitive landscape based on lead profile
    return []
  }

  private analyzeMarketPositioning(lead: any, competitor?: CompetitorProfile): MarketPositioning {
    return {
      ourPosition: {
        dimension1: 'price',
        dimension2: 'service',
        position: { x: 70, y: 85 },
        strength: 80
      },
      competitorPositions: [],
      whiteSpaceOpportunities: [],
      positioningRecommendations: []
    }
  }

  private identifyCompetitiveAdvantages(lead: any): CompetitiveAdvantage[] {
    return []
  }

  private assessThreats(lead: any, competitor?: CompetitorProfile): ThreatAssessment {
    return {
      immediateThreats: [],
      emergingThreats: [],
      threatLevel: 'medium',
      responseStrategies: []
    }
  }

  private buildOpportunityMatrix(lead: any, landscape: CompetitorLandscape[]): OpportunityMatrix {
    return {
      opportunities: [],
      prioritization: [],
      resourceAllocation: []
    }
  }

  private identifyOpportunities(
    analysis: CompetitiveAnalysis,
    vulnerabilities: CompetitorVulnerability[],
    lead: any
  ): CompetitiveOpportunity[] {
    return []
  }

  private async analyzeSwitchingPotential(
    lead: any,
    competitor?: CompetitorProfile
  ): Promise<SwitchingAnalysis> {
    return {
      switchingProbability: 65,
      switchingBarriers: [],
      switchingDrivers: [],
      optimalSwitchingTime: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
      switchingProcess: {
        phases: [],
        totalDuration: 30,
        criticalPoints: [],
        supportNeeded: []
      },
      switchingIncentives: []
    }
  }

  private generateMonitoringAlerts(
    competitor?: CompetitorProfile,
    vulnerabilities?: CompetitorVulnerability[],
    lead?: any
  ): CompetitiveAlert[] {
    return []
  }

  private generateExploitationTactics(weakness: CompetitorWeakness): string[] {
    const tacticMap: Record<WeaknessCategory, string[]> = {
      customer_satisfaction: ['satisfaction_guarantees', 'testimonial_campaigns', 'service_comparisons'],
      pricing_competitiveness: ['price_matching', 'value_demonstrations', 'cost_benefit_analysis'],
      product_gaps: ['feature_comparisons', 'comprehensive_coverage', 'customization_options'],
      service_quality: ['service_level_guarantees', 'response_time_commitments', 'dedicated_support'],
      claims_processing: ['fast_claims_promise', 'transparent_process', 'claims_satisfaction_guarantee'],
      digital_experience: ['user_friendly_apps', 'online_self_service', 'digital_first_approach'],
      innovation: ['latest_technology', 'innovative_products', 'future_ready_solutions']
    }
    return tacticMap[weakness.category] || ['competitive_comparison', 'value_proposition']
  }

  private generateKeyDifferentiators(vulnerability: CompetitorVulnerability): string[] {
    const differentiatorMap: Record<VulnerabilityCategory, string[]> = {
      customer_dissatisfaction: ['superior_customer_service', 'customer_first_approach', 'satisfaction_guarantee'],
      pricing_pressure: ['better_value', 'transparent_pricing', 'no_hidden_fees'],
      service_failures: ['reliable_service', 'proactive_support', 'service_excellence'],
      regulatory_compliance: ['full_compliance', 'regulatory_expertise', 'peace_of_mind'],
      technology_gaps: ['modern_technology', 'digital_innovation', 'user_friendly_experience'],
      talent_exodus: ['stable_team', 'experienced_professionals', 'consistent_service'],
      financial_constraints: ['financial_stability', 'strong_backing', 'secure_future']
    }
    return differentiatorMap[vulnerability.category] || ['better_service', 'superior_value']
  }

  private calculateInterceptSuccessProbability(
    vulnerability: CompetitorVulnerability,
    switching?: SwitchingAnalysis
  ): number {
    let probability = 50 // base probability
    
    // Adjust based on vulnerability severity
    const severityMultiplier = {
      low: 1.1,
      medium: 1.2,
      high: 1.4,
      critical: 1.6
    }
    probability *= severityMultiplier[vulnerability.severity]
    
    // Adjust based on exploitability
    const exploitabilityMultiplier = {
      difficult: 0.8,
      moderate: 1.0,
      easy: 1.3
    }
    probability *= exploitabilityMultiplier[vulnerability.exploitability]
    
    // Adjust based on switching probability
    if (switching) {
      probability = (probability + switching.switchingProbability) / 2
    }
    
    return Math.min(95, Math.max(10, Math.round(probability)))
  }
}

// Export singleton instance
export const competitiveIntelligenceEngine = new CompetitiveIntelligenceEngine()

// Utility functions
export const getCompetitorVulnerabilities = async (
  lead: EnhancedPersonCard | EnhancedCompanyCard
): Promise<CompetitorVulnerability[]> => {
  const intelligence = await competitiveIntelligenceEngine.generateCompetitiveIntelligence(lead)
  return intelligence.vulnerabilities
}

export const getInterceptOpportunities = async (
  lead: EnhancedPersonCard | EnhancedCompanyCard
): Promise<InterceptStrategy[]> => {
  const intelligence = await competitiveIntelligenceEngine.generateCompetitiveIntelligence(lead)
  return intelligence.interceptStrategies.filter(strategy => strategy.success_probability > 60)
}

export const getSwitchingProbability = async (
  lead: EnhancedPersonCard | EnhancedCompanyCard
): Promise<number> => {
  const intelligence = await competitiveIntelligenceEngine.generateCompetitiveIntelligence(lead)
  return intelligence.switchingAnalysis.switchingProbability
}

// Competitive intelligence constants
export const MAJOR_COMPETITORS = [
  'Generali', 'UnipolSai', 'Allianz', 'AXA', 'Zurich', 'ITAS', 'Sara Assicurazioni', 'Vittoria Assicurazioni'
] as const

export const VULNERABILITY_SEVERITY_COLORS = {
  low: 'bg-green-100 text-green-800',
  medium: 'bg-yellow-100 text-yellow-800', 
  high: 'bg-orange-100 text-orange-800',
  critical: 'bg-red-100 text-red-800'
} as const