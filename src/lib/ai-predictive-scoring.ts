/**
 * AI Predictive Lead Scoring Algorithm for BudgetCasa Pro
 * 
 * Advanced machine learning-based scoring system that combines multiple data sources
 * and behavioral patterns to predict conversion probability and lifetime value.
 */

import { EnhancedPersonCard, EnhancedCompanyCard } from './enhanced-types'
import { TemporalIntelligence } from './temporal-context-engine'

// Core scoring interfaces
export interface PredictiveScore {
  overallScore: number // 0-100 composite lead score
  conversionProbability: number // 0-100 probability of conversion
  lifetimeValuePrediction: number // estimated LTV in euros
  confidenceLevel: number // 0-100 confidence in prediction
  scoringBreakdown: ScoringBreakdown
  riskFactors: RiskFactor[]
  opportunityFactors: OpportunityFactor[]
  recommendedActions: ScoredAction[]
}

export interface ScoringBreakdown {
  demographic: DemographicScore
  behavioral: BehavioralScore
  financial: FinancialScore
  temporal: TemporalScore
  engagement: EngagementScore
  contextual: ContextualScore
}

export interface DemographicScore {
  score: number // 0-100
  weight: number // contribution weight
  factors: {
    age: number
    location: number
    familyStatus: number
    profession: number
    income: number
  }
  insights: string[]
}

export interface BehavioralScore {
  score: number
  weight: number
  patterns: BehavioralPattern[]
  insights: string[]
}

export interface BehavioralPattern {
  pattern: string
  frequency: number
  recency: number // days since last occurrence
  significance: number // 0-100 importance
  predictivePower: number // 0-100 correlation with conversion
}

export interface FinancialScore {
  score: number
  weight: number
  factors: {
    creditworthiness: number
    paymentCapacity: number
    existingCommitments: number
    financialStability: number
    growthTrend: number
  }
  insights: string[]
}

export interface TemporalScore {
  score: number
  weight: number
  urgency: number
  seasonalAlignment: number
  competitiveWindow: number
  lifeEventTiming: number
  insights: string[]
}

export interface EngagementScore {
  score: number
  weight: number
  touchpoints: TouchpointAnalysis[]
  responseRate: number
  engagementTrend: 'increasing' | 'stable' | 'decreasing'
  channelPreference: ChannelPreference[]
  insights: string[]
}

export interface TouchpointAnalysis {
  channel: string
  interactions: number
  lastInteraction: Date
  averageResponseTime: number // hours
  qualityScore: number // 0-100
}

export interface ChannelPreference {
  channel: string
  effectiveness: number // 0-100
  preference: number // 0-100
  costEfficiency: number // 0-100
}

export interface ContextualScore {
  score: number
  weight: number
  marketConditions: number
  competitivePositioning: number
  productFit: number
  timingAlignment: number
  insights: string[]
}

export interface RiskFactor {
  factor: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  impact: number // negative impact on score
  mitigation: string
  monitoring: boolean
}

export interface OpportunityFactor {
  factor: string
  potential: 'low' | 'medium' | 'high' | 'exceptional'
  uplift: number // positive impact on score
  exploitation: string
  timeframe: string
}

export interface ScoredAction {
  action: string
  expectedLift: number // expected increase in conversion probability
  effort: 'low' | 'medium' | 'high'
  timeline: string
  priority: number // 1-10
  rationale: string
}

// Machine Learning Models Interface
export interface MLModelPrediction {
  modelName: string
  version: string
  prediction: number
  confidence: number
  features: FeatureImportance[]
  lastTrained: Date
}

export interface FeatureImportance {
  feature: string
  importance: number // 0-1
  contribution: number // actual contribution to this prediction
}

// Scoring Engine Implementation
export class PredictiveScoringEngine {
  private models: Map<string, any> = new Map()
  private featureWeights: Map<string, number> = new Map()
  private historicalData: any[] = []

  constructor() {
    this.initializeModels()
    this.loadFeatureWeights()
  }

  /**
   * Generate comprehensive predictive score for a lead
   */
  async generatePredictiveScore(
    lead: EnhancedPersonCard | EnhancedCompanyCard,
    temporalIntelligence?: TemporalIntelligence,
    additionalContext?: any
  ): Promise<PredictiveScore> {
    // Extract features from lead data
    const features = this.extractFeatures(lead, temporalIntelligence, additionalContext)
    
    // Run ML model predictions
    const predictions = await this.runMLPredictions(features)
    
    // Calculate scoring breakdown
    const scoringBreakdown = this.calculateScoringBreakdown(lead, features, predictions)
    
    // Calculate composite scores
    const overallScore = this.calculateOverallScore(scoringBreakdown)
    const conversionProbability = this.calculateConversionProbability(predictions, features)
    const lifetimeValuePrediction = this.calculateLTVPrediction(predictions, features)
    
    // Identify risk and opportunity factors
    const riskFactors = this.identifyRiskFactors(features, predictions)
    const opportunityFactors = this.identifyOpportunityFactors(features, predictions)
    
    // Generate recommended actions
    const recommendedActions = this.generateScoredActions(
      lead, 
      scoringBreakdown, 
      riskFactors, 
      opportunityFactors
    )
    
    // Calculate confidence level
    const confidenceLevel = this.calculateConfidenceLevel(predictions, features)

    return {
      overallScore,
      conversionProbability,
      lifetimeValuePrediction,
      confidenceLevel,
      scoringBreakdown,
      riskFactors,
      opportunityFactors,
      recommendedActions
    }
  }

  /**
   * Extract features from lead data for ML models
   */
  private extractFeatures(
    lead: any,
    temporal?: TemporalIntelligence,
    context?: any
  ): Map<string, number> {
    const features = new Map<string, number>()
    const isCompany = 'ateco' in lead

    // Demographic features
    if (lead.demographics) {
      features.set('age', lead.demographics.age || 0)
      features.set('income', lead.demographics.income || 0)
      features.set('family_size', lead.demographics.familySize || 0)
      features.set('has_children', lead.demographics.hasChildren ? 1 : 0)
    }

    // Geographic features
    const cityScore = this.getCityScore(lead.geo_city)
    features.set('city_score', cityScore)

    // Behavioral features
    if (lead.lifestyle) {
      features.set('lifestyle_count', lead.lifestyle.length)
      features.set('lifestyle_diversity', this.calculateLifestyleDiversity(lead.lifestyle))
    }

    // Engagement features
    if (lead.b2c_engagement) {
      features.set('b2c_engagement_score', lead.b2c_engagement.engagementScore || 0)
      features.set('b2c_simulation_count', lead.b2c_engagement.simulationCount || 0)
      features.set('b2c_recency', this.calculateRecency(lead.b2c_engagement.lastActivity))
    }

    // Risk/Opportunity features
    if (lead.scores) {
      features.set('risk_home', lead.scores.risk_home || 0)
      features.set('risk_mobility', lead.scores.risk_mobility || 0)
      features.set('opportunity_home', lead.scores.opportunity_home || 0)
      features.set('opportunity_life', lead.scores.opportunity_life || 0)
    }

    // Temporal features
    if (temporal) {
      features.set('urgency_score', temporal.urgencyScore)
      features.set('seasonal_multiplier', temporal.seasonalFactors.seasonalMultiplier)
      features.set('competitive_vulnerability', temporal.competitiveWindow.competitorVulnerability)
      features.set('life_event_impact', temporal.lifeEventTriggers.eventImpactScore)
    }

    // Policy features
    features.set('policy_temperature', this.encodePolicyTemperature(lead.policy_temperature))
    features.set('hot_policy_encoded', this.encodeHotPolicy(lead.hot_policy))

    // Business-specific features
    if (isCompany) {
      features.set('employees', lead.employees || 0)
      features.set('business_health', this.calculateBusinessHealth(lead))
      features.set('industry_risk', this.getIndustryRisk(lead.ateco))
    }

    return features
  }

  /**
   * Run multiple ML model predictions
   */
  private async runMLPredictions(features: Map<string, number>): Promise<MLModelPrediction[]> {
    const predictions: MLModelPrediction[] = []

    // Conversion Probability Model
    const conversionModel = this.models.get('conversion_probability')
    if (conversionModel) {
      const prediction = this.runModel(conversionModel, features)
      predictions.push({
        modelName: 'conversion_probability',
        version: '2.1',
        prediction: prediction.score,
        confidence: prediction.confidence,
        features: prediction.featureImportance,
        lastTrained: new Date('2024-01-15')
      })
    }

    // Lifetime Value Model
    const ltvModel = this.models.get('lifetime_value')
    if (ltvModel) {
      const prediction = this.runModel(ltvModel, features)
      predictions.push({
        modelName: 'lifetime_value',
        version: '1.8',
        prediction: prediction.score,
        confidence: prediction.confidence,
        features: prediction.featureImportance,
        lastTrained: new Date('2024-01-10')
      })
    }

    // Churn Risk Model
    const churnModel = this.models.get('churn_risk')
    if (churnModel) {
      const prediction = this.runModel(churnModel, features)
      predictions.push({
        modelName: 'churn_risk',
        version: '1.5',
        prediction: prediction.score,
        confidence: prediction.confidence,
        features: prediction.featureImportance,
        lastTrained: new Date('2024-01-08')
      })
    }

    return predictions
  }

  /**
   * Calculate detailed scoring breakdown
   */
  private calculateScoringBreakdown(
    lead: any,
    features: Map<string, number>,
    predictions: MLModelPrediction[]
  ): ScoringBreakdown {
    const demographic = this.calculateDemographicScore(lead, features)
    const behavioral = this.calculateBehavioralScore(lead, features)
    const financial = this.calculateFinancialScore(lead, features)
    const temporal = this.calculateTemporalScore(features)
    const engagement = this.calculateEngagementScore(lead, features)
    const contextual = this.calculateContextualScore(lead, features)

    return {
      demographic,
      behavioral,
      financial,
      temporal,
      engagement,
      contextual
    }
  }

  /**
   * Calculate overall composite score
   */
  private calculateOverallScore(breakdown: ScoringBreakdown): number {
    const weights = {
      demographic: 0.20,
      behavioral: 0.25,
      financial: 0.20,
      temporal: 0.15,
      engagement: 0.15,
      contextual: 0.05
    }

    let score = 0
    score += breakdown.demographic.score * weights.demographic
    score += breakdown.behavioral.score * weights.behavioral
    score += breakdown.financial.score * weights.financial
    score += breakdown.temporal.score * weights.temporal
    score += breakdown.engagement.score * weights.engagement
    score += breakdown.contextual.score * weights.contextual

    return Math.round(Math.min(100, Math.max(0, score)))
  }

  /**
   * Calculate conversion probability
   */
  private calculateConversionProbability(
    predictions: MLModelPrediction[],
    features: Map<string, number>
  ): number {
    const conversionPrediction = predictions.find(p => p.modelName === 'conversion_probability')
    if (conversionPrediction) {
      return Math.round(conversionPrediction.prediction * 100)
    }

    // Fallback calculation based on features
    const baseRate = 0.15 // 15% base conversion rate
    let probability = baseRate

    // Adjust based on key features
    const engagementScore = features.get('b2c_engagement_score') || 0
    const urgencyScore = features.get('urgency_score') || 0
    const opportunityHome = features.get('opportunity_home') || 0

    probability *= (1 + (engagementScore / 100))
    probability *= (1 + (urgencyScore / 200))
    probability *= (1 + (opportunityHome))

    return Math.round(Math.min(100, probability * 100))
  }

  /**
   * Calculate lifetime value prediction
   */
  private calculateLTVPrediction(
    predictions: MLModelPrediction[],
    features: Map<string, number>
  ): number {
    const ltvPrediction = predictions.find(p => p.modelName === 'lifetime_value')
    if (ltvPrediction) {
      return Math.round(ltvPrediction.prediction)
    }

    // Fallback calculation
    const income = features.get('income') || 30000
    const riskScore = features.get('risk_home') || 0.5
    const baseLTV = income * 0.05 // 5% of annual income as base

    return Math.round(baseLTV * (1 + riskScore))
  }

  // Helper methods for scoring calculations
  private calculateDemographicScore(lead: any, features: Map<string, number>): DemographicScore {
    const ageScore = this.scoreAge(features.get('age') || 0)
    const locationScore = features.get('city_score') || 50
    const familyScore = this.scoreFamilyStatus(lead)
    const professionScore = this.scoreProfession(lead)
    const incomeScore = this.scoreIncome(features.get('income') || 0)

    const factors = {
      age: ageScore,
      location: locationScore,
      familyStatus: familyScore,
      profession: professionScore,
      income: incomeScore
    }

    const score = Object.values(factors).reduce((sum, val) => sum + val, 0) / Object.keys(factors).length

    return {
      score: Math.round(score),
      weight: 0.20,
      factors,
      insights: this.generateDemographicInsights(factors)
    }
  }

  private calculateBehavioralScore(lead: any, features: Map<string, number>): BehavioralScore {
    const patterns = this.extractBehavioralPatterns(lead)
    const score = this.scoreBehavioralPatterns(patterns)

    return {
      score,
      weight: 0.25,
      patterns,
      insights: this.generateBehavioralInsights(patterns)
    }
  }

  private calculateFinancialScore(lead: any, features: Map<string, number>): FinancialScore {
    const creditworthiness = this.scoreCreditworthiness(lead)
    const paymentCapacity = this.scorePaymentCapacity(lead)
    const existingCommitments = this.scoreExistingCommitments(lead)
    const financialStability = this.scoreFinancialStability(lead)
    const growthTrend = this.scoreGrowthTrend(lead)

    const factors = {
      creditworthiness,
      paymentCapacity,
      existingCommitments,
      financialStability,
      growthTrend
    }

    const score = Object.values(factors).reduce((sum, val) => sum + val, 0) / Object.keys(factors).length

    return {
      score: Math.round(score),
      weight: 0.20,
      factors,
      insights: this.generateFinancialInsights(factors)
    }
  }

  private calculateTemporalScore(features: Map<string, number>): TemporalScore {
    const urgency = features.get('urgency_score') || 0
    const seasonalAlignment = features.get('seasonal_multiplier') || 1
    const competitiveWindow = features.get('competitive_vulnerability') || 0
    const lifeEventTiming = features.get('life_event_impact') || 0

    const score = (urgency + (seasonalAlignment - 1) * 100 + competitiveWindow + lifeEventTiming) / 4

    return {
      score: Math.round(score),
      weight: 0.15,
      urgency,
      seasonalAlignment,
      competitiveWindow,
      lifeEventTiming,
      insights: this.generateTemporalInsights({ urgency, seasonalAlignment, competitiveWindow, lifeEventTiming })
    }
  }

  private calculateEngagementScore(lead: any, features: Map<string, number>): EngagementScore {
    const touchpoints = this.analyzeTouchpoints(lead)
    const responseRate = this.calculateResponseRate(lead)
    const engagementTrend = this.determineEngagementTrend(lead)
    const channelPreferences = this.analyzeChannelPreferences(lead)

    const score = this.calculateEngagementScoreFromData(touchpoints, responseRate, engagementTrend)

    return {
      score,
      weight: 0.15,
      touchpoints,
      responseRate,
      engagementTrend,
      channelPreference: channelPreferences,
      insights: this.generateEngagementInsights(touchpoints, responseRate, engagementTrend)
    }
  }

  private calculateContextualScore(lead: any, features: Map<string, number>): ContextualScore {
    const marketConditions = this.assessMarketConditions()
    const competitivePositioning = this.assessCompetitivePositioning(lead)
    const productFit = this.assessProductFit(lead)
    const timingAlignment = this.assessTimingAlignment(lead)

    const score = (marketConditions + competitivePositioning + productFit + timingAlignment) / 4

    return {
      score: Math.round(score),
      weight: 0.05,
      marketConditions,
      competitivePositioning,
      productFit,
      timingAlignment,
      insights: this.generateContextualInsights({ marketConditions, competitivePositioning, productFit, timingAlignment })
    }
  }

  // Simplified helper method implementations
  private initializeModels(): void {
    // Initialize ML models (simplified for demo)
    this.models.set('conversion_probability', { weights: new Map(), bias: 0 })
    this.models.set('lifetime_value', { weights: new Map(), bias: 0 })
    this.models.set('churn_risk', { weights: new Map(), bias: 0 })
  }

  private loadFeatureWeights(): void {
    // Load feature importance weights
    this.featureWeights.set('b2c_engagement_score', 0.25)
    this.featureWeights.set('urgency_score', 0.20)
    this.featureWeights.set('income', 0.15)
    this.featureWeights.set('opportunity_home', 0.15)
    this.featureWeights.set('competitive_vulnerability', 0.10)
  }

  private runModel(model: any, features: Map<string, number>): any {
    // Simplified model execution
    let score = 0.5 // base score
    
    features.forEach((value, key) => {
      const weight = this.featureWeights.get(key) || 0.01
      score += value * weight * 0.01 // normalized
    })

    return {
      score: Math.min(1, Math.max(0, score)),
      confidence: 0.75,
      featureImportance: Array.from(features.entries()).map(([feature, value]) => ({
        feature,
        importance: this.featureWeights.get(feature) || 0.01,
        contribution: value * (this.featureWeights.get(feature) || 0.01)
      }))
    }
  }

  // Additional helper methods (simplified implementations)
  private getCityScore(city?: string): number { return 70 }
  private calculateLifestyleDiversity(lifestyle: string[]): number { return lifestyle.length * 10 }
  private calculateRecency(lastActivity?: string): number { return lastActivity ? 90 : 0 }
  private encodePolicyTemperature(temp?: string): number { 
    return temp === 'hot' ? 100 : temp === 'warm' ? 60 : 30 
  }
  private encodeHotPolicy(policy?: string): number { return policy ? 80 : 40 }
  private calculateBusinessHealth(lead: any): number { return 75 }
  private getIndustryRisk(ateco?: string): number { return 50 }
  private scoreAge(age: number): number { return age >= 25 && age <= 45 ? 90 : 60 }
  private scoreFamilyStatus(lead: any): number { return 70 }
  private scoreProfession(lead: any): number { return 70 }
  private scoreIncome(income: number): number { return Math.min(100, income / 500) }
  private extractBehavioralPatterns(lead: any): BehavioralPattern[] { return [] }
  private scoreBehavioralPatterns(patterns: BehavioralPattern[]): number { return 75 }
  private scoreCreditworthiness(lead: any): number { return 80 }
  private scorePaymentCapacity(lead: any): number { return 75 }
  private scoreExistingCommitments(lead: any): number { return 70 }
  private scoreFinancialStability(lead: any): number { return 80 }
  private scoreGrowthTrend(lead: any): number { return 65 }
  private analyzeTouchpoints(lead: any): TouchpointAnalysis[] { return [] }
  private calculateResponseRate(lead: any): number { return 65 }
  private determineEngagementTrend(lead: any): EngagementScore['engagementTrend'] { return 'stable' }
  private analyzeChannelPreferences(lead: any): ChannelPreference[] { return [] }
  private calculateEngagementScoreFromData(touchpoints: any, rate: number, trend: any): number { return rate }
  private assessMarketConditions(): number { return 70 }
  private assessCompetitivePositioning(lead: any): number { return 75 }
  private assessProductFit(lead: any): number { return 80 }
  private assessTimingAlignment(lead: any): number { return 70 }
  private generateDemographicInsights(factors: any): string[] { return ['Strong demographic profile'] }
  private generateBehavioralInsights(patterns: any): string[] { return ['Positive behavioral indicators'] }
  private generateFinancialInsights(factors: any): string[] { return ['Good financial stability'] }
  private generateTemporalInsights(factors: any): string[] { return ['Favorable timing factors'] }
  private generateEngagementInsights(touchpoints: any, rate: any, trend: any): string[] { return ['High engagement potential'] }
  private generateContextualInsights(factors: any): string[] { return ['Positive market conditions'] }
  
  private identifyRiskFactors(features: Map<string, number>, predictions: MLModelPrediction[]): RiskFactor[] {
    const risks: RiskFactor[] = []
    
    if ((features.get('urgency_score') || 0) < 30) {
      risks.push({
        factor: 'Low Urgency',
        severity: 'medium',
        impact: -15,
        mitigation: 'Create urgency through limited-time offers',
        monitoring: true
      })
    }
    
    return risks
  }
  
  private identifyOpportunityFactors(features: Map<string, number>, predictions: MLModelPrediction[]): OpportunityFactor[] {
    const opportunities: OpportunityFactor[] = []
    
    if ((features.get('b2c_engagement_score') || 0) > 80) {
      opportunities.push({
        factor: 'High B2C Engagement',
        potential: 'high',
        uplift: 25,
        exploitation: 'Leverage B2C data for personalized approach',
        timeframe: 'immediate'
      })
    }
    
    return opportunities
  }
  
  private generateScoredActions(lead: any, breakdown: ScoringBreakdown, risks: RiskFactor[], opportunities: OpportunityFactor[]): ScoredAction[] {
    const actions: ScoredAction[] = []
    
    // Generate actions based on scoring breakdown
    if (breakdown.engagement.score < 60) {
      actions.push({
        action: 'Increase engagement through personalized content',
        expectedLift: 20,
        effort: 'medium',
        timeline: '2-4 weeks',
        priority: 8,
        rationale: 'Low engagement score indicates need for better content strategy'
      })
    }
    
    return actions.sort((a, b) => b.priority - a.priority)
  }
  
  private calculateConfidenceLevel(predictions: MLModelPrediction[], features: Map<string, number>): number {
    const avgConfidence = predictions.reduce((sum, p) => sum + p.confidence, 0) / predictions.length
    const dataQuality = this.assessDataQuality(features)
    
    return Math.round(avgConfidence * dataQuality * 100)
  }
  
  private assessDataQuality(features: Map<string, number>): number {
    const completeness = features.size / 20 // assume 20 ideal features
    const recency = 0.9 // assume 90% recent data
    
    return Math.min(1, completeness * recency)
  }
}

// Export singleton instance
export const predictiveScoringEngine = new PredictiveScoringEngine()

// Utility functions
export const getLeadScore = async (lead: EnhancedPersonCard | EnhancedCompanyCard, temporal?: TemporalIntelligence): Promise<number> => {
  const score = await predictiveScoringEngine.generatePredictiveScore(lead, temporal)
  return score.overallScore
}

export const getConversionProbability = async (lead: EnhancedPersonCard | EnhancedCompanyCard): Promise<number> => {
  const score = await predictiveScoringEngine.generatePredictiveScore(lead)
  return score.conversionProbability
}

export const scoringCategories = {
  EXCEPTIONAL: { min: 90, max: 100, label: 'Eccezionale', color: 'bg-green-600' },
  HIGH: { min: 75, max: 89, label: 'Alto', color: 'bg-blue-600' },
  MEDIUM: { min: 50, max: 74, label: 'Medio', color: 'bg-yellow-600' },
  LOW: { min: 25, max: 49, label: 'Basso', color: 'bg-orange-600' },
  POOR: { min: 0, max: 24, label: 'Scarso', color: 'bg-red-600' }
}

export const getScoreCategory = (score: number) => {
  return Object.values(scoringCategories).find(cat => score >= cat.min && score <= cat.max) || scoringCategories.POOR
}