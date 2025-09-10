/**
 * Action Intelligence System for BudgetCasa Pro
 * 
 * AI-driven system for determining next best actions, timing, and approach
 * for insurance professionals dealing with leads and prospects.
 */

import { EnhancedPersonCard, EnhancedCompanyCard } from './enhanced-types'

// Core Action Intelligence Types
export interface ActionIntelligence {
  recommendedAction: RecommendedAction
  timing: ActionTiming
  approach: ContactApproach
  successPrediction: SuccessPrediction
  riskAssessment: ActionRiskAssessment
}

export interface RecommendedAction {
  type: ActionType
  priority: 1 | 2 | 3 // 1 = immediate, 2 = this week, 3 = this month
  confidence: number // 0-100
  reasoning: string[]
  expectedOutcome: ExpectedOutcome[]
  alternatives: AlternativeAction[]
}

export type ActionType = 
  | 'call_immediate'
  | 'call_scheduled'
  | 'email_personalized'
  | 'email_nurture'
  | 'meeting_request'
  | 'linkedin_connect'
  | 'referral_request'
  | 'wait_monitor'
  | 'nurture_campaign'
  | 'competitive_intercept'
  | 'life_event_follow'

export interface ActionTiming {
  recommended: ActionTimeframe
  urgencyScore: number // 0-100
  deadline?: Date
  seasonalFactors: SeasonalFactor[]
  competitivePressure: number // 0-100
}

export type ActionTimeframe =
  | 'immediate' // within 24 hours
  | 'same_day'  // within same business day
  | 'next_day'  // within 2 business days
  | 'this_week' // within 5 business days
  | 'this_month' // within 30 days
  | 'next_month' // 30-60 days
  | 'quarterly'  // within 90 days

export interface SeasonalFactor {
  factor: string
  impact: 'positive' | 'negative' | 'neutral'
  multiplier: number // impact on success rate
  validPeriod: { start: string, end: string } // MM-DD format
}

export interface ContactApproach {
  primaryChannel: ContactChannel
  backupChannels: ContactChannel[]
  personalizedMessage: PersonalizedMessage
  timing: OptimalContactTiming
  followUpStrategy: FollowUpStrategy
}

export type ContactChannel = 
  | 'phone_cold'
  | 'phone_warm'
  | 'email_cold'
  | 'email_warm'
  | 'linkedin_message'
  | 'linkedin_connection'
  | 'in_person_meeting'
  | 'referral_introduction'
  | 'social_engagement'
  | 'event_approach'

export interface PersonalizedMessage {
  subject?: string // for emails
  opening: string
  valueProposition: string
  callToAction: string
  personalElements: PersonalElement[]
  urgencyTriggers: UrgencyTrigger[]
}

export interface PersonalElement {
  type: 'name' | 'location' | 'life_event' | 'business_event' | 'mutual_connection' | 'shared_interest'
  content: string
  relevanceScore: number // 0-100
}

export interface UrgencyTrigger {
  trigger: string
  urgencyLevel: 'mild' | 'moderate' | 'high' | 'critical'
  timebound: boolean
  validUntil?: Date
}

export interface OptimalContactTiming {
  preferredDays: string[] // ['Monday', 'Tuesday', etc.]
  preferredHours: string[] // ['9:00-11:00', '14:00-16:00', etc.]
  timeZone: string
  avoidPeriods: AvoidancePeriod[]
  bestTimeScore: number // 0-100 for recommended time
}

export interface AvoidancePeriod {
  period: string
  reason: string
  severity: 'mild' | 'moderate' | 'strict'
}

export interface FollowUpStrategy {
  sequence: FollowUpStep[]
  totalDuration: number // days
  escalationTriggers: EscalationTrigger[]
  fallbackStrategy: string
}

export interface FollowUpStep {
  step: number
  timing: number // days after initial contact
  channel: ContactChannel
  message: string
  successMetric: string
  nextStepConditions: NextStepCondition[]
}

export interface NextStepCondition {
  condition: 'response' | 'no_response' | 'positive_response' | 'negative_response' | 'meeting_scheduled'
  nextStep: number | 'escalate' | 'pause' | 'close'
  waitTime?: number // days to wait before next action
}

export interface EscalationTrigger {
  trigger: string
  threshold: number
  action: 'manager_review' | 'different_approach' | 'pause_campaign' | 'close_lead'
}

export interface SuccessPrediction {
  conversionProbability: number // 0-100
  timeToConversion: number // estimated days
  expectedRevenue: RevenueProjection
  confidenceInterval: { min: number, max: number } // probability range
  keySuccessFactors: SuccessFactor[]
  riskFactors: RiskFactor[]
}

export interface RevenueProjection {
  immediate: number // first year premium
  lifetime: number // estimated lifetime value
  additionalProducts: ProductOpportunity[]
  referralPotential: number // estimated referral value
}

export interface ProductOpportunity {
  product: string
  probability: number // 0-100
  timeline: string // when likely to purchase
  revenue: number // estimated annual premium
}

export interface SuccessFactor {
  factor: string
  importance: 'low' | 'medium' | 'high' | 'critical'
  currentStatus: 'absent' | 'weak' | 'moderate' | 'strong'
  improvability: 'fixed' | 'difficult' | 'moderate' | 'easy'
}

export interface RiskFactor {
  factor: string
  impact: 'low' | 'medium' | 'high' | 'critical'
  likelihood: number // 0-100
  mitigation: string[]
  monitoringRequired: boolean
}

export interface ActionRiskAssessment {
  overallRisk: 'low' | 'medium' | 'high'
  specificRisks: SpecificRisk[]
  mitigationStrategies: MitigationStrategy[]
  contingencyPlans: ContingencyPlan[]
}

export interface SpecificRisk {
  risk: string
  probability: number // 0-100
  impact: 'minor' | 'moderate' | 'major' | 'severe'
  category: 'timing' | 'approach' | 'competition' | 'market' | 'personal'
}

export interface MitigationStrategy {
  risk: string
  strategy: string
  effectiveness: number // 0-100
  cost: 'none' | 'low' | 'medium' | 'high'
  implementation: 'immediate' | 'short_term' | 'long_term'
}

export interface ContingencyPlan {
  trigger: string
  alternativeAction: ActionType
  implementation: string
  successMetrics: string[]
}

export interface ExpectedOutcome {
  outcome: string
  probability: number // 0-100
  timeline: string
  value: number // revenue or other benefit
  requirements: string[] // what needs to happen for this outcome
}

export interface AlternativeAction {
  action: ActionType
  reasoning: string
  tradeoffs: string[]
  situationalUse: string // when to use this instead
}

// Action Intelligence Generation Functions
export interface ActionIntelligenceEngine {
  generateActionPlan(lead: EnhancedPersonCard | EnhancedCompanyCard): ActionIntelligence
  optimizeTiming(lead: EnhancedPersonCard | EnhancedCompanyCard, baseAction: ActionType): ActionTiming
  personalizeApproach(lead: EnhancedPersonCard | EnhancedCompanyCard, action: ActionType): ContactApproach
  predictSuccess(lead: EnhancedPersonCard | EnhancedCompanyCard, approach: ContactApproach): SuccessPrediction
  assessRisks(lead: EnhancedPersonCard | EnhancedCompanyCard, action: ActionType): ActionRiskAssessment
}

// Smart Defaults and Configuration
export interface ActionRules {
  rules: ActionRule[]
  priorities: ActionPriority[]
  constraints: ActionConstraint[]
}

export interface ActionRule {
  name: string
  condition: string // logical expression
  action: ActionType
  confidence: number
  reasoning: string
}

export interface ActionPriority {
  scenario: string
  priorityOrder: ActionType[]
  reasoning: string
}

export interface ActionConstraint {
  constraint: string
  affectedActions: ActionType[]
  severity: 'soft' | 'hard'
  context: string
}

// Pre-configured Action Templates
export const ACTION_TEMPLATES: Record<ActionType, ActionTemplate> = {
  call_immediate: {
    name: 'Immediate Phone Call',
    description: 'High-priority call for time-sensitive opportunities',
    defaultTiming: 'immediate',
    successRate: 0.35,
    averageDuration: 15, // minutes
    bestScenarios: ['policy_expiring', 'life_event', 'high_intent']
  },
  call_scheduled: {
    name: 'Scheduled Phone Call',
    description: 'Planned call at optimal time based on lead behavior',
    defaultTiming: 'this_week',
    successRate: 0.45,
    averageDuration: 20,
    bestScenarios: ['warm_lead', 'referral', 'follow_up']
  },
  email_personalized: {
    name: 'Personalized Email',
    description: 'Highly targeted email with personal elements',
    defaultTiming: 'same_day',
    successRate: 0.25,
    averageDuration: 5,
    bestScenarios: ['digital_preference', 'initial_contact', 'information_sharing']
  },
  email_nurture: {
    name: 'Nurture Email Campaign',
    description: 'Series of educational emails to build relationship',
    defaultTiming: 'this_week',
    successRate: 0.15,
    averageDuration: 90, // campaign length in days
    bestScenarios: ['early_stage', 'education_needed', 'long_sales_cycle']
  },
  meeting_request: {
    name: 'Meeting Request',
    description: 'Request for in-person or video meeting',
    defaultTiming: 'this_week',
    successRate: 0.40,
    averageDuration: 60,
    bestScenarios: ['complex_needs', 'high_value', 'decision_maker']
  },
  linkedin_connect: {
    name: 'LinkedIn Connection',
    description: 'Professional networking approach via LinkedIn',
    defaultTiming: 'this_week',
    successRate: 0.30,
    averageDuration: 2,
    bestScenarios: ['professional_contact', 'cold_outreach', 'relationship_building']
  },
  referral_request: {
    name: 'Referral Request',
    description: 'Ask existing client for referral introduction',
    defaultTiming: 'this_week',
    successRate: 0.60,
    averageDuration: 10,
    bestScenarios: ['mutual_connection', 'satisfied_client', 'warm_introduction']
  },
  wait_monitor: {
    name: 'Wait and Monitor',
    description: 'Monitor lead for optimal timing signals',
    defaultTiming: 'next_month',
    successRate: 0.20,
    averageDuration: 0,
    bestScenarios: ['poor_timing', 'not_ready', 'under_contract']
  },
  nurture_campaign: {
    name: 'Nurture Campaign',
    description: 'Multi-touch campaign to maintain engagement',
    defaultTiming: 'this_month',
    successRate: 0.25,
    averageDuration: 180,
    bestScenarios: ['long_term_opportunity', 'education_phase', 'relationship_building']
  },
  competitive_intercept: {
    name: 'Competitive Intercept',
    description: 'Urgent action to compete for lead before competitor closes',
    defaultTiming: 'immediate',
    successRate: 0.30,
    averageDuration: 30,
    bestScenarios: ['competitor_active', 'price_comparison', 'decision_pending']
  },
  life_event_follow: {
    name: 'Life Event Follow-up',
    description: 'Follow up on specific life event that creates insurance need',
    defaultTiming: 'this_week',
    successRate: 0.50,
    averageDuration: 20,
    bestScenarios: ['recent_life_event', 'insurance_need_change', 'family_change']
  }
}

export interface ActionTemplate {
  name: string
  description: string
  defaultTiming: ActionTimeframe
  successRate: number // historical average
  averageDuration: number // minutes or days depending on action
  bestScenarios: string[]
}

// Utility Functions for Action Intelligence
export const calculateUrgencyScore = (
  timeFactors: { deadline?: Date, competitorActivity?: boolean, lifetimeEvent?: boolean }
): number => {
  let score = 0
  
  if (timeFactors.deadline) {
    const daysUntilDeadline = Math.max(0, 
      Math.floor((timeFactors.deadline.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    )
    score += Math.max(0, 50 - daysUntilDeadline) // 50 points max, decreasing by 1 per day
  }
  
  if (timeFactors.competitorActivity) score += 30
  if (timeFactors.lifetimeEvent) score += 20
  
  return Math.min(100, score)
}

export const determineOptimalChannel = (
  preferences: { digital?: boolean, phone?: boolean, inPerson?: boolean },
  context: { urgency: number, relationship: 'cold' | 'warm' | 'hot' }
): ContactChannel => {
  if (context.urgency > 80) {
    return context.relationship === 'cold' ? 'phone_cold' : 'phone_warm'
  }
  
  if (preferences.inPerson && context.relationship !== 'cold') {
    return 'in_person_meeting'
  }
  
  if (preferences.phone) {
    return context.relationship === 'cold' ? 'phone_cold' : 'phone_warm'
  }
  
  if (preferences.digital) {
    return context.relationship === 'cold' ? 'email_cold' : 'email_warm'
  }
  
  // Default fallback
  return context.relationship === 'cold' ? 'email_cold' : 'phone_warm'
}

export const generatePersonalizedElements = (
  lead: EnhancedPersonCard | EnhancedCompanyCard
): PersonalElement[] => {
  const elements: PersonalElement[] = []
  
  // Add location-based personalization
  if ('geo_city' in lead && lead.geo_city) {
    elements.push({
      type: 'location',
      content: `Given your location in ${lead.geo_city}`,
      relevanceScore: 60
    })
  }
  
  // Add life event personalization for persons
  if ('temporalContext' in lead) {
    const recentEvents = lead.temporalContext?.recentLifeEvents?.slice(0, 2)
    recentEvents?.forEach(event => {
      elements.push({
        type: 'life_event',
        content: `Congratulations on your recent ${event.type.replace('_', ' ')}`,
        relevanceScore: 85
      })
    })
  }
  
  // Add business event personalization for companies
  if ('businessHealth' in lead) {
    if (lead.businessHealth?.growthTrend === 'rapid_growth') {
      elements.push({
        type: 'business_event',
        content: `I noticed your company's impressive growth recently`,
        relevanceScore: 80
      })
    }
  }
  
  return elements.sort((a, b) => b.relevanceScore - a.relevanceScore)
}

// Export main types for external use
export type {
  ActionIntelligence,
  RecommendedAction,
  ActionTiming,
  ContactApproach,
  SuccessPrediction,
  ActionRiskAssessment
}