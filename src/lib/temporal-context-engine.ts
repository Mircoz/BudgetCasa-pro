/**
 * Temporal Context Engine for BudgetCasa Pro
 * 
 * Advanced timing intelligence that analyzes temporal patterns, life events,
 * seasonal factors, and competitive windows to optimize action timing.
 */

import { EnhancedPersonCard, EnhancedCompanyCard } from './enhanced-types'

// Core temporal intelligence types
export interface TemporalIntelligence {
  urgencyScore: number // 0-100 composite urgency based on all temporal factors
  decisionWindow: DecisionWindow
  seasonalFactors: SeasonalContext
  competitiveWindow: CompetitiveWindow
  lifeEventTriggers: LifeEventContext
  marketTiming: MarketTimingContext
  optimalActionTiming: OptimalTiming
  riskFactors: TemporalRiskFactor[]
}

export interface DecisionWindow {
  phase: 'discovery' | 'consideration' | 'decision' | 'post_decision'
  timeRemaining: number // days until window closes
  confidence: number // 0-100 confidence in window assessment
  keyMilestones: Milestone[]
  windowDrivers: WindowDriver[]
}

export interface Milestone {
  event: string
  expectedDate: Date
  impact: 'minor' | 'moderate' | 'major' | 'critical'
  insuranceRelevance: string
}

export interface WindowDriver {
  factor: string
  type: 'accelerator' | 'decelerator' | 'deadline'
  impact: number // -100 to +100
  description: string
}

export interface SeasonalContext {
  currentSeason: 'peak' | 'normal' | 'low' | 'dead'
  historicalPatterns: SeasonalPattern[]
  predictedTrends: SeasonalTrend[]
  recommendedActions: SeasonalAction[]
  seasonalMultiplier: number // conversion rate multiplier
}

export interface SeasonalPattern {
  period: string // "Q1", "summer", "december", etc.
  conversionRate: number
  averageValue: number
  bestProducts: string[]
  commonTriggers: string[]
  historicalData: {
    year: number
    performance: number
  }[]
}

export interface SeasonalTrend {
  trend: string
  direction: 'increasing' | 'stable' | 'decreasing'
  magnitude: number // % change expected
  timeframe: string
  confidence: number
}

export interface SeasonalAction {
  action: string
  timing: string
  rationale: string
  expectedLift: number
}

export interface CompetitiveWindow {
  competitorVulnerability: number // 0-100 how vulnerable competitor is
  policyExpiry?: Date
  renewalLikelihood: number // 0-100 likelihood customer will renew with current provider
  switchingPropensity: number // 0-100 propensity to switch providers
  competitorWeaknesses: CompetitorWeakness[]
  switchingBarriers: SwitchingBarrier[]
  optimalInterceptTiming: Date
}

export interface CompetitorWeakness {
  provider: string
  weakness: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  exploitationStrategy: string
  timeWindow: {
    start: Date
    end: Date
  }
}

export interface SwitchingBarrier {
  barrier: string
  strength: 'low' | 'medium' | 'high'
  mitigationStrategy: string
  effort: 'easy' | 'moderate' | 'difficult'
}

export interface LifeEventContext {
  recentEvents: LifeEventAnalysis[]
  predictedEvents: PredictedLifeEvent[]
  eventImpactScore: number // 0-100
  insuranceNeedChanges: InsuranceNeedChange[]
  optimalFollowUpTiming: Date[]
}

export interface LifeEventAnalysis {
  event: string
  date: Date
  confidence: number // 0-100 confidence this event occurred
  source: 'declared' | 'inferred' | 'predicted'
  insuranceImpact: {
    newNeeds: string[]
    changedNeeds: string[]
    urgencyIncrease: number
    valueIncrease: number
  }
}

export interface PredictedLifeEvent {
  event: string
  probability: number // 0-100
  timeframe: string
  indicators: string[] // what suggests this event might happen
  preparatoryActions: string[]
}

export interface InsuranceNeedChange {
  needType: string
  changeType: 'new' | 'increased' | 'decreased' | 'modified'
  urgency: 'immediate' | 'short_term' | 'medium_term' | 'long_term'
  estimatedValue: number
  rationale: string
}

export interface MarketTimingContext {
  economicCondition: 'recession' | 'recovery' | 'stable' | 'growth' | 'boom'
  marketSentiment: number // -100 to +100
  regulatoryChanges: RegulatoryChange[]
  industryTrends: IndustryTrend[]
  optimalCampaignTiming: CampaignTiming[]
}

export interface RegulatoryChange {
  regulation: string
  effectiveDate: Date
  impact: 'positive' | 'negative' | 'neutral'
  affectedProducts: string[]
  marketReaction: string
  opportunityWindow: {
    start: Date
    end: Date
    strategy: string
  }
}

export interface IndustryTrend {
  trend: string
  direction: 'up' | 'down' | 'stable'
  strength: number // 0-100
  timeframe: string
  implication: string
}

export interface CampaignTiming {
  campaign: string
  optimalStart: Date
  duration: number // days
  expectedLift: number
  rationale: string
}

export interface OptimalTiming {
  bestContactTime: ContactTiming
  followUpSequence: FollowUpTiming[]
  avoidancePeriods: AvoidancePeriod[]
  urgencyDeadlines: UrgencyDeadline[]
}

export interface ContactTiming {
  preferredDays: string[]
  preferredHours: string[]
  timeZone: string
  responseRateByTime: {
    time: string
    rate: number
  }[]
  personalFactors: PersonalTimingFactor[]
}

export interface PersonalTimingFactor {
  factor: string // "has_children", "works_shifts", etc.
  impact: string
  adjustedTiming: string
}

export interface FollowUpTiming {
  sequence: number
  delay: number // days after previous contact
  channel: string
  message: string
  expectedResponse: number
  conditions: string[]
}

export interface AvoidancePeriod {
  period: string
  reason: string
  severity: 'soft' | 'hard'
  alternatives: string[]
}

export interface UrgencyDeadline {
  deadline: Date
  reason: string
  impact: 'minor' | 'moderate' | 'major' | 'critical'
  actions: string[]
}

export interface TemporalRiskFactor {
  risk: string
  probability: number // 0-100
  impact: 'minor' | 'moderate' | 'major' | 'severe'
  timeframe: string
  mitigation: string
}

// Temporal Context Engine Implementation
export class TemporalContextEngine {
  private historicalData: Map<string, any> = new Map()
  private seasonalPatterns: SeasonalPattern[] = []
  private competitorData: Map<string, any> = new Map()

  constructor() {
    this.initializePatterns()
  }

  /**
   * Generate complete temporal intelligence for a lead
   */
  async generateTemporalIntelligence(
    lead: EnhancedPersonCard | EnhancedCompanyCard
  ): Promise<TemporalIntelligence> {
    const [
      decisionWindow,
      seasonalContext,
      competitiveWindow,
      lifeEventContext,
      marketContext,
      optimalTiming
    ] = await Promise.all([
      this.analyzeDecisionWindow(lead),
      this.analyzeSeasonalContext(lead),
      this.analyzeCompetitiveWindow(lead),
      this.analyzeLifeEventContext(lead),
      this.analyzeMarketTiming(lead),
      this.calculateOptimalTiming(lead)
    ])

    const urgencyScore = this.calculateCompositeUrgency({
      decisionWindow,
      seasonalContext,
      competitiveWindow,
      lifeEventContext,
      marketContext
    })

    const riskFactors = this.identifyTemporalRisks({
      decisionWindow,
      competitiveWindow,
      marketContext
    })

    return {
      urgencyScore,
      decisionWindow,
      seasonalFactors: seasonalContext,
      competitiveWindow,
      lifeEventTriggers: lifeEventContext,
      marketTiming: marketContext,
      optimalActionTiming: optimalTiming,
      riskFactors
    }
  }

  /**
   * Analyze decision window phase and timing
   */
  private async analyzeDecisionWindow(lead: any): Promise<DecisionWindow> {
    const isCompany = 'ateco' in lead
    
    // Analyze behavioral signals to determine decision phase
    const behaviorSignals = this.extractBehaviorSignals(lead)
    const phase = this.determineDecisionPhase(behaviorSignals)
    
    // Calculate time remaining in window
    const timeRemaining = this.calculateTimeRemaining(phase, behaviorSignals)
    
    // Identify key milestones
    const keyMilestones = this.identifyMilestones(lead, phase)
    
    // Analyze window drivers
    const windowDrivers = this.analyzeWindowDrivers(lead, behaviorSignals)
    
    return {
      phase,
      timeRemaining,
      confidence: this.calculateDecisionConfidence(behaviorSignals),
      keyMilestones,
      windowDrivers
    }
  }

  /**
   * Analyze seasonal context and patterns
   */
  private async analyzeSeasonalContext(lead: any): Promise<SeasonalContext> {
    const currentMonth = new Date().getMonth()
    const currentSeason = this.getCurrentSeason()
    
    const relevantPatterns = this.seasonalPatterns.filter(pattern => 
      this.isPatternRelevant(pattern, lead)
    )
    
    const predictedTrends = this.predictSeasonalTrends(currentSeason, lead)
    const recommendedActions = this.generateSeasonalActions(currentSeason, lead)
    const seasonalMultiplier = this.calculateSeasonalMultiplier(currentSeason, lead)
    
    return {
      currentSeason,
      historicalPatterns: relevantPatterns,
      predictedTrends,
      recommendedActions,
      seasonalMultiplier
    }
  }

  /**
   * Analyze competitive window and switching opportunities
   */
  private async analyzeCompetitiveWindow(lead: any): Promise<CompetitiveWindow> {
    const existingProvider = this.identifyCurrentProvider(lead)
    const policyExpiry = this.estimatePolicyExpiry(lead)
    
    const competitorWeaknesses = await this.analyzeCompetitorWeaknesses(existingProvider)
    const switchingBarriers = this.identifySwitchingBarriers(lead, existingProvider)
    
    const renewalLikelihood = this.calculateRenewalLikelihood(lead, existingProvider)
    const switchingPropensity = this.calculateSwitchingPropensity(lead, existingProvider)
    
    const competitorVulnerability = this.assessCompetitorVulnerability(
      existingProvider,
      competitorWeaknesses,
      switchingBarriers
    )
    
    const optimalInterceptTiming = this.calculateOptimalInterceptTiming(
      policyExpiry,
      renewalLikelihood,
      competitorVulnerability
    )
    
    return {
      competitorVulnerability,
      policyExpiry,
      renewalLikelihood,
      switchingPropensity,
      competitorWeaknesses,
      switchingBarriers,
      optimalInterceptTiming
    }
  }

  /**
   * Analyze life events and their insurance implications
   */
  private async analyzeLifeEventContext(lead: any): Promise<LifeEventContext> {
    const recentEvents = this.identifyRecentLifeEvents(lead)
    const predictedEvents = this.predictUpcomingLifeEvents(lead)
    
    const eventImpactScore = this.calculateLifeEventImpact(recentEvents, predictedEvents)
    const insuranceNeedChanges = this.analyzeInsuranceNeedChanges(recentEvents, predictedEvents)
    
    const optimalFollowUpTiming = this.calculateLifeEventFollowUpTiming(
      recentEvents,
      predictedEvents
    )
    
    return {
      recentEvents,
      predictedEvents,
      eventImpactScore,
      insuranceNeedChanges,
      optimalFollowUpTiming
    }
  }

  /**
   * Analyze market timing factors
   */
  private async analyzeMarketTiming(lead: any): Promise<MarketTimingContext> {
    const economicCondition = this.assessEconomicCondition()
    const marketSentiment = this.calculateMarketSentiment()
    
    const regulatoryChanges = await this.fetchRegulatoryChanges()
    const industryTrends = await this.analyzeIndustryTrends()
    
    const optimalCampaignTiming = this.calculateOptimalCampaignTiming(
      economicCondition,
      marketSentiment,
      industryTrends
    )
    
    return {
      economicCondition,
      marketSentiment,
      regulatoryChanges,
      industryTrends,
      optimalCampaignTiming
    }
  }

  /**
   * Calculate optimal action timing
   */
  private async calculateOptimalTiming(lead: any): Promise<OptimalTiming> {
    const personalFactors = this.extractPersonalTimingFactors(lead)
    const historicalData = this.getHistoricalResponseData(lead)
    
    const bestContactTime = this.calculateBestContactTime(personalFactors, historicalData)
    const followUpSequence = this.generateFollowUpSequence(lead, bestContactTime)
    const avoidancePeriods = this.identifyAvoidancePeriods(lead, personalFactors)
    const urgencyDeadlines = this.calculateUrgencyDeadlines(lead)
    
    return {
      bestContactTime,
      followUpSequence,
      avoidancePeriods,
      urgencyDeadlines
    }
  }

  /**
   * Calculate composite urgency score from all temporal factors
   */
  private calculateCompositeUrgency(contexts: {
    decisionWindow: DecisionWindow
    seasonalContext: SeasonalContext
    competitiveWindow: CompetitiveWindow
    lifeEventContext: LifeEventContext
    marketContext: MarketTimingContext
  }): number {
    const weights = {
      decisionWindow: 0.3,
      competitive: 0.25,
      lifeEvent: 0.25,
      seasonal: 0.15,
      market: 0.05
    }

    let score = 0
    
    // Decision window urgency (time remaining)
    const windowUrgency = Math.max(0, 100 - contexts.decisionWindow.timeRemaining * 2)
    score += windowUrgency * weights.decisionWindow
    
    // Competitive window urgency
    const competitiveUrgency = contexts.competitiveWindow.competitorVulnerability
    score += competitiveUrgency * weights.competitive
    
    // Life event urgency
    const lifeEventUrgency = contexts.lifeEventContext.eventImpactScore
    score += lifeEventUrgency * weights.lifeEvent
    
    // Seasonal urgency
    const seasonalUrgency = (contexts.seasonalContext.seasonalMultiplier - 1) * 100
    score += Math.max(0, seasonalUrgency) * weights.seasonal
    
    // Market timing urgency
    const marketUrgency = Math.max(0, contexts.marketContext.marketSentiment)
    score += marketUrgency * weights.market
    
    return Math.min(100, Math.max(0, score))
  }

  // Helper methods (simplified implementations)
  private initializePatterns(): void {
    this.seasonalPatterns = [
      {
        period: 'Q1',
        conversionRate: 0.18,
        averageValue: 2800,
        bestProducts: ['vita', 'salute'],
        commonTriggers: ['new_year_resolutions', 'tax_planning'],
        historicalData: [
          { year: 2023, performance: 0.16 },
          { year: 2022, performance: 0.19 },
          { year: 2021, performance: 0.17 }
        ]
      },
      {
        period: 'summer',
        conversionRate: 0.12,
        averageValue: 2200,
        bestProducts: ['travel', 'sport'],
        commonTriggers: ['vacation_planning', 'sport_activities'],
        historicalData: [
          { year: 2023, performance: 0.11 },
          { year: 2022, performance: 0.13 },
          { year: 2021, performance: 0.12 }
        ]
      }
    ]
  }

  private extractBehaviorSignals(lead: any): any[] {
    // Extract behavioral indicators from lead data
    return []
  }

  private determineDecisionPhase(signals: any[]): DecisionWindow['phase'] {
    // Logic to determine decision phase based on signals
    return 'consideration'
  }

  private calculateTimeRemaining(phase: DecisionWindow['phase'], signals: any[]): number {
    // Calculate days remaining in decision window
    return 30
  }

  private identifyMilestones(lead: any, phase: DecisionWindow['phase']): Milestone[] {
    // Identify key upcoming milestones
    return []
  }

  private analyzeWindowDrivers(lead: any, signals: any[]): WindowDriver[] {
    // Analyze factors that accelerate or decelerate decision
    return []
  }

  private calculateDecisionConfidence(signals: any[]): number {
    // Calculate confidence in decision window assessment
    return 75
  }

  private getCurrentSeason(): SeasonalContext['currentSeason'] {
    // Determine current season based on date and patterns
    return 'normal'
  }

  private isPatternRelevant(pattern: SeasonalPattern, lead: any): boolean {
    // Check if seasonal pattern is relevant to this lead
    return true
  }

  private predictSeasonalTrends(season: string, lead: any): SeasonalTrend[] {
    // Predict upcoming seasonal trends
    return []
  }

  private generateSeasonalActions(season: string, lead: any): SeasonalAction[] {
    // Generate recommended actions for current season
    return []
  }

  private calculateSeasonalMultiplier(season: string, lead: any): number {
    // Calculate seasonal conversion rate multiplier
    return 1.2
  }

  private identifyCurrentProvider(lead: any): string | undefined {
    // Identify lead's current insurance provider
    return 'Generali'
  }

  private estimatePolicyExpiry(lead: any): Date | undefined {
    // Estimate when current policy expires
    return new Date(Date.now() + 90 * 24 * 60 * 60 * 1000) // 90 days from now
  }

  private async analyzeCompetitorWeaknesses(provider?: string): Promise<CompetitorWeakness[]> {
    // Analyze competitor weaknesses
    return []
  }

  private identifySwitchingBarriers(lead: any, provider?: string): SwitchingBarrier[] {
    // Identify barriers to switching providers
    return []
  }

  private calculateRenewalLikelihood(lead: any, provider?: string): number {
    // Calculate likelihood of renewing with current provider
    return 60
  }

  private calculateSwitchingPropensity(lead: any, provider?: string): number {
    // Calculate propensity to switch providers
    return 70
  }

  private assessCompetitorVulnerability(provider?: string, weaknesses?: CompetitorWeakness[], barriers?: SwitchingBarrier[]): number {
    // Assess how vulnerable competitor is to poaching
    return 75
  }

  private calculateOptimalInterceptTiming(expiry?: Date, renewalLikelihood?: number, vulnerability?: number): Date {
    // Calculate optimal timing to intercept competitor renewal
    return new Date(Date.now() + 45 * 24 * 60 * 60 * 1000) // 45 days from now
  }

  private identifyRecentLifeEvents(lead: any): LifeEventAnalysis[] {
    // Identify recent life events from lead data
    return []
  }

  private predictUpcomingLifeEvents(lead: any): PredictedLifeEvent[] {
    // Predict upcoming life events
    return []
  }

  private calculateLifeEventImpact(recent: LifeEventAnalysis[], predicted: PredictedLifeEvent[]): number {
    // Calculate impact score of life events
    return 80
  }

  private analyzeInsuranceNeedChanges(recent: LifeEventAnalysis[], predicted: PredictedLifeEvent[]): InsuranceNeedChange[] {
    // Analyze how life events change insurance needs
    return []
  }

  private calculateLifeEventFollowUpTiming(recent: LifeEventAnalysis[], predicted: PredictedLifeEvent[]): Date[] {
    // Calculate optimal follow-up timing after life events
    return []
  }

  private assessEconomicCondition(): MarketTimingContext['economicCondition'] {
    // Assess current economic condition
    return 'stable'
  }

  private calculateMarketSentiment(): number {
    // Calculate market sentiment score
    return 25
  }

  private async fetchRegulatoryChanges(): Promise<RegulatoryChange[]> {
    // Fetch upcoming regulatory changes
    return []
  }

  private async analyzeIndustryTrends(): Promise<IndustryTrend[]> {
    // Analyze industry trends
    return []
  }

  private calculateOptimalCampaignTiming(condition: string, sentiment: number, trends: IndustryTrend[]): CampaignTiming[] {
    // Calculate optimal timing for campaigns
    return []
  }

  private extractPersonalTimingFactors(lead: any): PersonalTimingFactor[] {
    // Extract personal timing factors
    return []
  }

  private getHistoricalResponseData(lead: any): any {
    // Get historical response data for lead
    return {}
  }

  private calculateBestContactTime(factors: PersonalTimingFactor[], historical: any): ContactTiming {
    // Calculate best time to contact lead
    return {
      preferredDays: ['Tuesday', 'Wednesday', 'Thursday'],
      preferredHours: ['10:00-12:00', '14:00-17:00'],
      timeZone: 'Europe/Rome',
      responseRateByTime: [],
      personalFactors: factors
    }
  }

  private generateFollowUpSequence(lead: any, contactTime: ContactTiming): FollowUpTiming[] {
    // Generate follow-up sequence
    return []
  }

  private identifyAvoidancePeriods(lead: any, factors: PersonalTimingFactor[]): AvoidancePeriod[] {
    // Identify periods to avoid contact
    return []
  }

  private calculateUrgencyDeadlines(lead: any): UrgencyDeadline[] {
    // Calculate urgency deadlines
    return []
  }

  private identifyTemporalRisks(contexts: any): TemporalRiskFactor[] {
    // Identify temporal risks
    return []
  }
}

// Export singleton instance
export const temporalEngine = new TemporalContextEngine()

// Utility functions
export const getOptimalContactTime = async (lead: EnhancedPersonCard | EnhancedCompanyCard): Promise<Date> => {
  const intelligence = await temporalEngine.generateTemporalIntelligence(lead)
  const timing = intelligence.optimalActionTiming.bestContactTime
  
  // Calculate next optimal contact time
  const now = new Date()
  const today = now.getDay() // 0 = Sunday, 1 = Monday, etc.
  
  // Find next preferred day
  const preferredDayNames = timing.preferredDays
  const preferredDayNumbers = preferredDayNames.map(day => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    return days.indexOf(day)
  })
  
  let nextPreferredDay = preferredDayNumbers.find(day => day > today)
  if (!nextPreferredDay) {
    nextPreferredDay = preferredDayNumbers[0] + 7 // Next week
  }
  
  const daysUntilPreferred = nextPreferredDay - today
  const optimalDate = new Date(now.getTime() + daysUntilPreferred * 24 * 60 * 60 * 1000)
  
  // Set to preferred hour (use first preferred hour)
  const preferredHour = parseInt(timing.preferredHours[0]?.split(':')[0] || '10')
  optimalDate.setHours(preferredHour, 0, 0, 0)
  
  return optimalDate
}

export const calculateUrgencyMultiplier = (urgencyScore: number): number => {
  // Convert urgency score to conversion rate multiplier
  if (urgencyScore >= 90) return 2.5
  if (urgencyScore >= 80) return 2.0
  if (urgencyScore >= 70) return 1.5
  if (urgencyScore >= 50) return 1.2
  return 1.0
}