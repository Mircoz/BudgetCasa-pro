/**
 * Behavioral Pattern Recognition System for BudgetCasa Pro
 * 
 * Advanced system that identifies, analyzes, and predicts behavioral patterns
 * from lead interactions to optimize engagement and conversion strategies.
 */

import { EnhancedPersonCard, EnhancedCompanyCard } from './enhanced-types'

// Core behavioral pattern types
export interface BehavioralProfile {
  leadId: string
  profileType: 'person' | 'company'
  overallBehaviorScore: number // 0-100
  behaviorSegment: BehaviorSegment
  patterns: DetectedPattern[]
  triggers: BehaviorTrigger[]
  predictions: BehaviorPrediction[]
  recommendations: BehaviorRecommendation[]
  lastUpdated: Date
}

export type BehaviorSegment = 
  | 'analytical_researcher' 
  | 'quick_decider' 
  | 'price_sensitive' 
  | 'relationship_focused'
  | 'security_oriented'
  | 'convenience_seeker'
  | 'early_adopter'
  | 'comparison_shopper'

export interface DetectedPattern {
  patternId: string
  patternName: string
  type: PatternType
  frequency: number // occurrences
  recency: number // days since last occurrence
  strength: number // 0-100 pattern strength
  confidence: number // 0-100 confidence in detection
  trend: 'increasing' | 'stable' | 'decreasing'
  correlations: PatternCorrelation[]
  businessImpact: BusinessImpact
}

export type PatternType = 
  | 'communication_preference'
  | 'decision_timing'
  | 'information_consumption'
  | 'price_sensitivity'
  | 'channel_preference'
  | 'content_engagement'
  | 'seasonal_behavior'
  | 'social_influence'
  | 'risk_tolerance'
  | 'purchase_journey'

export interface PatternCorrelation {
  correlatedPattern: string
  correlationStrength: number // -1 to 1
  significance: number // 0-100
  insights: string
}

export interface BusinessImpact {
  conversionImpact: number // -100 to +100
  ltv_impact: number // estimated LTV multiplier
  effort_required: 'low' | 'medium' | 'high'
  actionability: number // 0-100 how actionable this pattern is
}

export interface BehaviorTrigger {
  triggerId: string
  triggerName: string
  category: TriggerCategory
  conditions: TriggerCondition[]
  predictedResponse: string
  confidenceLevel: number
  activationHistory: TriggerActivation[]
  optimization: TriggerOptimization
}

export type TriggerCategory = 
  | 'engagement'
  | 'content'
  | 'timing'
  | 'channel'
  | 'offer'
  | 'social_proof'
  | 'urgency'
  | 'personalization'

export interface TriggerCondition {
  condition: string
  operator: '>' | '<' | '=' | '!=' | 'contains' | 'not_contains'
  value: any
  weight: number
}

export interface TriggerActivation {
  date: Date
  context: string
  outcome: 'positive' | 'neutral' | 'negative'
  metrics: {
    response_rate: number
    engagement_increase: number
    conversion_lift: number
  }
}

export interface TriggerOptimization {
  optimalTiming: string
  bestChannel: string
  recommendedMessage: string
  personalizations: string[]
  successRate: number
}

export interface BehaviorPrediction {
  predictionId: string
  type: PredictionType
  prediction: string
  probability: number // 0-100
  timeframe: string
  confidence: number
  factors: PredictionFactor[]
  actions: PredictiveAction[]
}

export type PredictionType = 
  | 'next_action'
  | 'conversion_probability'
  | 'churn_risk'
  | 'upsell_opportunity'
  | 'content_preference'
  | 'optimal_contact_time'
  | 'decision_timeline'

export interface PredictionFactor {
  factor: string
  weight: number
  contribution: number
  explanation: string
}

export interface PredictiveAction {
  action: string
  expectedLift: number
  effort: string
  timing: string
}

export interface BehaviorRecommendation {
  recommendationId: string
  category: RecommendationCategory
  title: string
  description: string
  implementation: string
  expectedImpact: ExpectedImpact
  priority: number // 1-10
  effort: 'low' | 'medium' | 'high'
  timeframe: string
}

export type RecommendationCategory = 
  | 'communication_strategy'
  | 'content_personalization'
  | 'timing_optimization'
  | 'channel_optimization'
  | 'offer_customization'
  | 'relationship_building'

export interface ExpectedImpact {
  engagement_lift: number // %
  conversion_lift: number // %
  ltv_increase: number // %
  satisfaction_increase: number // %
}

// Specific pattern implementations
export interface CommunicationPattern extends DetectedPattern {
  preferredChannels: ChannelPreference[]
  responseTimePatterns: ResponseTimePattern[]
  messageStylePreference: MessageStylePreference
  frequencyTolerance: FrequencyTolerance
}

export interface ChannelPreference {
  channel: string
  preference_score: number // 0-100
  response_rate: number
  engagement_quality: number
  time_to_response: number // hours
}

export interface ResponseTimePattern {
  timeframe: string
  average_response_time: number // hours
  response_rate: number
  quality_score: number
}

export interface MessageStylePreference {
  formality: 'formal' | 'casual' | 'mixed'
  length: 'short' | 'medium' | 'long'
  tone: 'professional' | 'friendly' | 'authoritative'
  personalization: 'high' | 'medium' | 'low'
}

export interface FrequencyTolerance {
  optimal_frequency: string // e.g., "2-3 times per week"
  saturation_point: number // contacts before negative response
  recovery_time: number // days to reset after saturation
}

export interface DecisionPattern extends DetectedPattern {
  decisionStyle: DecisionStyle
  informationNeeds: InformationNeed[]
  influencers: Influencer[]
  timeToDecision: TimeToDecision
  decisionFactors: DecisionFactor[]
}

export interface DecisionStyle {
  style: 'analytical' | 'intuitive' | 'consensus' | 'authoritative'
  evidencePreference: 'data' | 'testimonials' | 'expert_opinion' | 'peer_reviews'
  riskTolerance: 'conservative' | 'moderate' | 'aggressive'
  changeReadiness: 'early_adopter' | 'early_majority' | 'late_majority' | 'laggard'
}

export interface InformationNeed {
  category: string
  importance: number // 0-100
  format_preference: 'text' | 'video' | 'infographic' | 'demo'
  detail_level: 'overview' | 'detailed' | 'technical'
}

export interface Influencer {
  relationship: 'family' | 'friends' | 'colleagues' | 'experts' | 'online_reviews'
  influence_strength: number // 0-100
  influence_type: 'positive' | 'negative' | 'gatekeeper'
}

export interface TimeToDecision {
  average_days: number
  decision_phases: DecisionPhase[]
  acceleration_factors: string[]
  delay_factors: string[]
}

export interface DecisionPhase {
  phase: string
  typical_duration: number // days
  activities: string[]
  key_questions: string[]
  optimal_actions: string[]
}

export interface DecisionFactor {
  factor: string
  weight: number // 0-100 importance
  sentiment: 'positive' | 'neutral' | 'negative' | 'concern'
  addressability: 'easy' | 'medium' | 'difficult'
}

// Pattern Recognition Engine
export class BehavioralPatternEngine {
  private patternLibrary: Map<string, any> = new Map()
  private segmentDefinitions: Map<BehaviorSegment, any> = new Map()
  private triggerRules: Map<string, any> = new Map()

  constructor() {
    this.initializePatternLibrary()
    this.initializeSegmentDefinitions()
    this.initializeTriggerRules()
  }

  /**
   * Analyze behavioral patterns for a lead
   */
  async analyzeBehavioralPatterns(
    lead: EnhancedPersonCard | EnhancedCompanyCard,
    historicalData?: any[],
    contextData?: any
  ): Promise<BehavioralProfile> {
    const leadId = lead.id
    const profileType = 'ateco' in lead ? 'company' : 'person'

    // Detect patterns from available data
    const patterns = await this.detectPatterns(lead, historicalData, contextData)
    
    // Determine behavior segment
    const behaviorSegment = this.classifyBehaviorSegment(patterns, lead)
    
    // Identify behavior triggers
    const triggers = await this.identifyTriggers(patterns, behaviorSegment, lead)
    
    // Generate predictions
    const predictions = await this.generateBehaviorPredictions(patterns, triggers, lead)
    
    // Create recommendations
    const recommendations = this.generateRecommendations(patterns, triggers, predictions, behaviorSegment)
    
    // Calculate overall behavior score
    const overallBehaviorScore = this.calculateBehaviorScore(patterns, behaviorSegment)

    return {
      leadId,
      profileType,
      overallBehaviorScore,
      behaviorSegment,
      patterns,
      triggers,
      predictions,
      recommendations,
      lastUpdated: new Date()
    }
  }

  /**
   * Detect behavioral patterns from data
   */
  private async detectPatterns(
    lead: any,
    historical?: any[],
    context?: any
  ): Promise<DetectedPattern[]> {
    const patterns: DetectedPattern[] = []

    // Communication pattern detection
    const commPattern = this.detectCommunicationPattern(lead, historical)
    if (commPattern) patterns.push(commPattern)

    // Decision timing pattern
    const decisionPattern = this.detectDecisionTimingPattern(lead, historical)
    if (decisionPattern) patterns.push(decisionPattern)

    // Content engagement pattern
    const contentPattern = this.detectContentEngagementPattern(lead, historical)
    if (contentPattern) patterns.push(contentPattern)

    // Price sensitivity pattern
    const pricePattern = this.detectPriceSensitivityPattern(lead, historical)
    if (pricePattern) patterns.push(pricePattern)

    // Channel preference pattern
    const channelPattern = this.detectChannelPreferencePattern(lead, historical)
    if (channelPattern) patterns.push(channelPattern)

    // Social influence pattern
    const socialPattern = this.detectSocialInfluencePattern(lead, historical)
    if (socialPattern) patterns.push(socialPattern)

    // Risk tolerance pattern
    const riskPattern = this.detectRiskTolerancePattern(lead, historical)
    if (riskPattern) patterns.push(riskPattern)

    // Seasonal behavior pattern
    const seasonalPattern = this.detectSeasonalBehaviorPattern(lead, historical)
    if (seasonalPattern) patterns.push(seasonalPattern)

    return patterns.sort((a, b) => b.strength - a.strength)
  }

  /**
   * Classify lead into behavior segment
   */
  private classifyBehaviorSegment(patterns: DetectedPattern[], lead: any): BehaviorSegment {
    const scores = new Map<BehaviorSegment, number>()

    // Initialize all segments with base score
    const segments: BehaviorSegment[] = [
      'analytical_researcher', 'quick_decider', 'price_sensitive', 'relationship_focused',
      'security_oriented', 'convenience_seeker', 'early_adopter', 'comparison_shopper'
    ]

    segments.forEach(segment => scores.set(segment, 0))

    // Score based on detected patterns
    patterns.forEach(pattern => {
      const segmentScores = this.getSegmentScores(pattern)
      segmentScores.forEach((score, segment) => {
        const currentScore = scores.get(segment) || 0
        scores.set(segment, currentScore + score * (pattern.strength / 100))
      })
    })

    // Add demographic-based scoring
    this.addDemographicSegmentScoring(scores, lead)

    // Find highest scoring segment
    let maxScore = 0
    let bestSegment: BehaviorSegment = 'analytical_researcher'

    scores.forEach((score, segment) => {
      if (score > maxScore) {
        maxScore = score
        bestSegment = segment
      }
    })

    return bestSegment
  }

  /**
   * Identify behavior triggers
   */
  private async identifyTriggers(
    patterns: DetectedPattern[],
    segment: BehaviorSegment,
    lead: any
  ): Promise<BehaviorTrigger[]> {
    const triggers: BehaviorTrigger[] = []

    // Pattern-based triggers
    patterns.forEach(pattern => {
      const patternTriggers = this.getTriggersForPattern(pattern, segment)
      triggers.push(...patternTriggers)
    })

    // Segment-specific triggers
    const segmentTriggers = this.getTriggersForSegment(segment, lead)
    triggers.push(...segmentTriggers)

    // Lead-specific triggers
    const leadTriggers = this.getLeadSpecificTriggers(lead, patterns)
    triggers.push(...leadTriggers)

    return triggers.sort((a, b) => b.confidenceLevel - a.confidenceLevel)
  }

  /**
   * Generate behavior predictions
   */
  private async generateBehaviorPredictions(
    patterns: DetectedPattern[],
    triggers: BehaviorTrigger[],
    lead: any
  ): Promise<BehaviorPrediction[]> {
    const predictions: BehaviorPrediction[] = []

    // Next action prediction
    const nextActionPred = this.predictNextAction(patterns, triggers, lead)
    predictions.push(nextActionPred)

    // Conversion probability prediction
    const conversionPred = this.predictConversionProbability(patterns, triggers, lead)
    predictions.push(conversionPred)

    // Optimal contact time prediction
    const timingPred = this.predictOptimalContactTime(patterns, lead)
    predictions.push(timingPred)

    // Content preference prediction
    const contentPred = this.predictContentPreference(patterns, lead)
    predictions.push(contentPred)

    // Decision timeline prediction
    const timelinePred = this.predictDecisionTimeline(patterns, lead)
    predictions.push(timelinePred)

    return predictions.sort((a, b) => b.confidence - a.confidence)
  }

  /**
   * Generate behavior-based recommendations
   */
  private generateRecommendations(
    patterns: DetectedPattern[],
    triggers: BehaviorTrigger[],
    predictions: BehaviorPrediction[],
    segment: BehaviorSegment
  ): BehaviorRecommendation[] {
    const recommendations: BehaviorRecommendation[] = []

    // Communication strategy recommendations
    const commRecs = this.generateCommunicationRecommendations(patterns, segment)
    recommendations.push(...commRecs)

    // Content personalization recommendations
    const contentRecs = this.generateContentRecommendations(patterns, predictions)
    recommendations.push(...contentRecs)

    // Timing optimization recommendations
    const timingRecs = this.generateTimingRecommendations(patterns, predictions)
    recommendations.push(...timingRecs)

    // Channel optimization recommendations
    const channelRecs = this.generateChannelRecommendations(patterns, segment)
    recommendations.push(...channelRecs)

    return recommendations.sort((a, b) => b.priority - a.priority)
  }

  // Pattern detection methods (simplified implementations)
  private detectCommunicationPattern(lead: any, historical?: any[]): DetectedPattern | null {
    // Analyze communication preferences from B2C data and interactions
    const b2cEngagement = lead.b2c_engagement
    if (!b2cEngagement) return null

    return {
      patternId: 'comm_001',
      patternName: 'High Digital Engagement',
      type: 'communication_preference',
      frequency: b2cEngagement.simulationCount || 0,
      recency: this.calculateRecency(b2cEngagement.lastActivity),
      strength: b2cEngagement.engagementScore || 50,
      confidence: 75,
      trend: 'stable',
      correlations: [],
      businessImpact: {
        conversionImpact: 25,
        ltv_impact: 1.2,
        effort_required: 'low',
        actionability: 85
      }
    }
  }

  private detectDecisionTimingPattern(lead: any, historical?: any[]): DetectedPattern | null {
    // Analyze decision-making speed from behavior signals
    const urgencyScore = lead.criticalInfo?.urgencyScore || 0
    
    if (urgencyScore > 70) {
      return {
        patternId: 'decision_001',
        patternName: 'Quick Decision Maker',
        type: 'decision_timing',
        frequency: 1,
        recency: 0,
        strength: urgencyScore,
        confidence: 80,
        trend: 'stable',
        correlations: [],
        businessImpact: {
          conversionImpact: 35,
          ltv_impact: 1.1,
          effort_required: 'low',
          actionability: 90
        }
      }
    }

    return null
  }

  private detectContentEngagementPattern(lead: any, historical?: any[]): DetectedPattern | null {
    // Analyze content engagement from lifestyle and interests
    if (lead.lifestyle && lead.lifestyle.length > 3) {
      return {
        patternId: 'content_001',
        patternName: 'Diverse Content Interest',
        type: 'content_engagement',
        frequency: lead.lifestyle.length,
        recency: 30,
        strength: Math.min(100, lead.lifestyle.length * 20),
        confidence: 70,
        trend: 'stable',
        correlations: [],
        businessImpact: {
          conversionImpact: 20,
          ltv_impact: 1.15,
          effort_required: 'medium',
          actionability: 75
        }
      }
    }

    return null
  }

  private detectPriceSensitivityPattern(lead: any, historical?: any[]): DetectedPattern | null {
    // Analyze price sensitivity from income and behavior
    const income = lead.demographics?.income || 0
    const budgetRange = lead.b2c_engagement?.budgetRange || 'medium'
    
    const priceSensitivity = income < 40000 ? 80 : income > 80000 ? 30 : 60
    
    return {
      patternId: 'price_001',
      patternName: income < 40000 ? 'High Price Sensitivity' : 'Low Price Sensitivity',
      type: 'price_sensitivity',
      frequency: 1,
      recency: 0,
      strength: priceSensitivity,
      confidence: 65,
      trend: 'stable',
      correlations: [],
      businessImpact: {
        conversionImpact: income < 40000 ? -15 : 10,
        ltv_impact: income < 40000 ? 0.9 : 1.2,
        effort_required: income < 40000 ? 'high' : 'low',
        actionability: 70
      }
    }
  }

  // Additional helper methods (simplified)
  private calculateRecency(lastActivity?: string): number {
    if (!lastActivity) return 365
    const daysSince = Math.floor((Date.now() - new Date(lastActivity).getTime()) / (1000 * 60 * 60 * 24))
    return daysSince
  }

  private detectChannelPreferencePattern(lead: any, historical?: any[]): DetectedPattern | null { return null }
  private detectSocialInfluencePattern(lead: any, historical?: any[]): DetectedPattern | null { return null }
  private detectRiskTolerancePattern(lead: any, historical?: any[]): DetectedPattern | null { return null }
  private detectSeasonalBehaviorPattern(lead: any, historical?: any[]): DetectedPattern | null { return null }

  private calculateBehaviorScore(patterns: DetectedPattern[], segment: BehaviorSegment): number {
    const baseScore = 50
    let patternBonus = 0
    let segmentMultiplier = 1.0

    patterns.forEach(pattern => {
      patternBonus += (pattern.strength * pattern.businessImpact.conversionImpact) / 100
    })

    // Segment-based multipliers
    const segmentMultipliers: Record<BehaviorSegment, number> = {
      'quick_decider': 1.3,
      'analytical_researcher': 1.1,
      'relationship_focused': 1.2,
      'early_adopter': 1.25,
      'security_oriented': 1.0,
      'convenience_seeker': 1.1,
      'price_sensitive': 0.9,
      'comparison_shopper': 0.95
    }

    segmentMultiplier = segmentMultipliers[segment] || 1.0

    return Math.round(Math.min(100, Math.max(0, (baseScore + patternBonus) * segmentMultiplier)))
  }

  // Placeholder implementations for remaining methods
  private initializePatternLibrary(): void {}
  private initializeSegmentDefinitions(): void {}
  private initializeTriggerRules(): void {}
  private getSegmentScores(pattern: DetectedPattern): Map<BehaviorSegment, number> { return new Map() }
  private addDemographicSegmentScoring(scores: Map<BehaviorSegment, number>, lead: any): void {}
  private getTriggersForPattern(pattern: DetectedPattern, segment: BehaviorSegment): BehaviorTrigger[] { return [] }
  private getTriggersForSegment(segment: BehaviorSegment, lead: any): BehaviorTrigger[] { return [] }
  private getLeadSpecificTriggers(lead: any, patterns: DetectedPattern[]): BehaviorTrigger[] { return [] }
  private predictNextAction(patterns: DetectedPattern[], triggers: BehaviorTrigger[], lead: any): BehaviorPrediction {
    return {
      predictionId: 'pred_001',
      type: 'next_action',
      prediction: 'Email with personalized content',
      probability: 75,
      timeframe: '2-3 days',
      confidence: 80,
      factors: [],
      actions: []
    }
  }
  private predictConversionProbability(patterns: DetectedPattern[], triggers: BehaviorTrigger[], lead: any): BehaviorPrediction {
    return {
      predictionId: 'pred_002',
      type: 'conversion_probability',
      prediction: '65% conversion probability',
      probability: 65,
      timeframe: '30 days',
      confidence: 75,
      factors: [],
      actions: []
    }
  }
  private predictOptimalContactTime(patterns: DetectedPattern[], lead: any): BehaviorPrediction {
    return {
      predictionId: 'pred_003',
      type: 'optimal_contact_time',
      prediction: 'Tuesday-Thursday, 10:00-12:00',
      probability: 80,
      timeframe: 'ongoing',
      confidence: 70,
      factors: [],
      actions: []
    }
  }
  private predictContentPreference(patterns: DetectedPattern[], lead: any): BehaviorPrediction {
    return {
      predictionId: 'pred_004',
      type: 'content_preference',
      prediction: 'Visual content with data backing',
      probability: 70,
      timeframe: 'ongoing',
      confidence: 65,
      factors: [],
      actions: []
    }
  }
  private predictDecisionTimeline(patterns: DetectedPattern[], lead: any): BehaviorPrediction {
    return {
      predictionId: 'pred_005',
      type: 'decision_timeline',
      prediction: '14-21 days to decision',
      probability: 60,
      timeframe: '21 days',
      confidence: 70,
      factors: [],
      actions: []
    }
  }
  private generateCommunicationRecommendations(patterns: DetectedPattern[], segment: BehaviorSegment): BehaviorRecommendation[] { return [] }
  private generateContentRecommendations(patterns: DetectedPattern[], predictions: BehaviorPrediction[]): BehaviorRecommendation[] { return [] }
  private generateTimingRecommendations(patterns: DetectedPattern[], predictions: BehaviorPrediction[]): BehaviorRecommendation[] { return [] }
  private generateChannelRecommendations(patterns: DetectedPattern[], segment: BehaviorSegment): BehaviorRecommendation[] { return [] }
}

// Export singleton instance
export const behavioralPatternEngine = new BehavioralPatternEngine()

// Utility functions
export const getBehaviorSegment = async (lead: EnhancedPersonCard | EnhancedCompanyCard): Promise<BehaviorSegment> => {
  const profile = await behavioralPatternEngine.analyzeBehavioralPatterns(lead)
  return profile.behaviorSegment
}

export const getBehaviorInsights = async (lead: EnhancedPersonCard | EnhancedCompanyCard): Promise<string[]> => {
  const profile = await behavioralPatternEngine.analyzeBehavioralPatterns(lead)
  return profile.patterns.map(p => `${p.patternName}: ${p.businessImpact.conversionImpact > 0 ? 'Positive' : 'Negative'} impact`)
}

export const getPersonalizationRecommendations = async (lead: EnhancedPersonCard | EnhancedCompanyCard): Promise<string[]> => {
  const profile = await behavioralPatternEngine.analyzeBehavioralPatterns(lead)
  return profile.recommendations.map(r => r.description)
}

// Behavior segment descriptions
export const BEHAVIOR_SEGMENT_DESCRIPTIONS: Record<BehaviorSegment, string> = {
  analytical_researcher: 'Cerca informazioni dettagliate, confronta opzioni, decide con dati',
  quick_decider: 'Prende decisioni rapidamente, preferisce azione immediata',
  price_sensitive: 'Molto attento al prezzo, cerca sempre il miglior affare',
  relationship_focused: 'Valorizza le relazioni personali e la fiducia',
  security_oriented: 'Prioritizza sicurezza e stabilità nelle scelte',
  convenience_seeker: 'Preferisce soluzioni semplici e convenienti',
  early_adopter: 'Aperto a nuove tecnologie e soluzioni innovative',
  comparison_shopper: 'Confronta sistematicamente tutte le opzioni disponibili'
}