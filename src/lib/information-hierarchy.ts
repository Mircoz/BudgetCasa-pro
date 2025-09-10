/**
 * Information Hierarchy Framework for BudgetCasa Pro
 * 
 * Defines the 3-level priority system for organizing and displaying information
 * to insurance professionals in an actionable, efficient manner.
 */

// Priority Level Definitions
export type InformationLevel = 'critical' | 'context' | 'detail'

export interface InformationHierarchy {
  level: InformationLevel
  priority: number // 1-100, higher = more important
  category: 'action' | 'risk' | 'opportunity' | 'demographic' | 'behavioral'
  displayMode: 'always' | 'on_demand' | 'deep_dive'
}

// LEVEL 1 - CRITICAL (Always Visible)
export interface CriticalInformation {
  // Primary Action Indicators
  leadScore: number // 0-100 composite score
  nextActionRequired: NextAction
  revenueOpportunity: number // € potential annual premium
  contactPriority: ContactPriority
  
  // Essential Context
  riskLevel: 'low' | 'medium' | 'high'
  policyTemperature: 'hot' | 'warm' | 'cold'
  urgencyScore: number // 0-100 based on timing factors
}

export interface NextAction {
  type: 'call' | 'email' | 'meeting' | 'wait' | 'nurture'
  priority: 1 | 2 | 3
  timing: 'immediate' | 'thisweek' | 'thismonth'
  reason: string
  dueDate?: Date
}

export interface ContactPriority {
  method: 'phone' | 'email' | 'linkedin' | 'meeting'
  bestTime?: string
  successProbability: number // 0-100
}

// LEVEL 2 - CONTEXT (On-demand)
export interface ContextualInformation {
  // Risk Profile Summary
  riskProfile: RiskProfileSummary
  productMatchScore: ProductMatchScore[]
  geographicIntelligence: GeographicContext
  engagementHistory: EngagementSummary
  
  // Temporal Context
  temporalFactors: TemporalContext
  competitiveContext: CompetitiveContext
}

export interface RiskProfileSummary {
  overallRisk: number // 0-1
  keyFactors: string[]
  claimsHistory: 'clean' | 'moderate' | 'high_risk'
  creditStability: 'excellent' | 'good' | 'fair' | 'poor'
}

export interface ProductMatchScore {
  productType: string
  matchScore: number // 0-100
  confidence: number // 0-100
  reason: string
}

export interface GeographicContext {
  cityRiskFactors: string[]
  marketPenetration: 'low' | 'medium' | 'high'
  localCompetition: number
}

export interface EngagementSummary {
  totalInteractions: number
  lastContactDate?: Date
  responseRate: number // 0-100
  preferredChannel: string
}

export interface TemporalContext {
  seasonalFactor: 'peak' | 'normal' | 'low'
  decisionWindow: 'immediate' | '3months' | '6months' | '1year+'
  lifeEventTriggers: LifeEvent[]
}

export interface CompetitiveContext {
  existingProvider?: string
  policyExpiry?: Date
  switchingPropensity: number // 0-100
  pricesensitivity: 'low' | 'medium' | 'high'
}

export interface LifeEvent {
  type: 'marriage' | 'birth' | 'job_change' | 'home_purchase' | 'retirement'
  date?: Date
  predicted?: boolean
  insuranceImpact: string
}

// LEVEL 3 - DETAIL (Deep-dive)
export interface DetailedInformation {
  // Complete Demographics
  fullDemographics: CompletePersonalProfile | CompleteBusinessProfile
  behavioralAnalytics: BehavioralProfile
  technicalData: TechnicalDataProfile
  historicalPatterns: HistoricalAnalysis
  
  // Advanced Intelligence
  digitalFootprint: DigitalProfile
  socialContext: SocialInfluenceProfile
  environmentalFactors: EnvironmentalContext
}

export interface CompletePersonalProfile {
  basicInfo: PersonalBasicInfo
  financialProfile: FinancialProfile
  familyContext: FamilyProfile
  professionalInfo: ProfessionalProfile
  healthContext?: HealthProfile
}

export interface PersonalBasicInfo {
  name: string
  age?: number
  email?: string
  phone?: string
  address?: AddressInfo
}

export interface FinancialProfile {
  monthlyIncome?: number
  creditScore?: number
  netWorth?: number
  liquidAssets?: number
  existingInsurance: ExistingPolicy[]
  financialStability: 'stable' | 'volatile' | 'improving' | 'declining'
}

export interface FamilyProfile {
  maritalStatus?: 'single' | 'married' | 'divorced' | 'widowed'
  children?: number
  dependents?: number
  householdSize?: number
  elderCare?: boolean
}

export interface ProfessionalProfile {
  jobTitle?: string
  industry?: string
  employmentType: 'permanent' | 'temporary' | 'freelance' | 'retired' | 'unemployed'
  yearsInCurrentJob?: number
  workLocation?: 'office' | 'remote' | 'hybrid'
}

export interface HealthProfile {
  riskFactors?: string[]
  chronicConditions?: boolean
  smoker?: boolean
  riskActivities?: string[]
}

export interface CompleteBusinessProfile {
  businessInfo: BusinessBasicInfo
  financialHealth: BusinessFinancialProfile
  riskExposure: BusinessRiskProfile
  industryContext: IndustryProfile
}

export interface BusinessBasicInfo {
  name: string
  atecoCode?: string
  employees?: number
  yearsInBusiness?: number
  businessType: 'small' | 'medium' | 'large' | 'enterprise'
}

export interface BusinessFinancialProfile {
  annualRevenue?: number
  financialRating?: 'A' | 'B' | 'C' | 'D'
  growthTrend: 'growing' | 'stable' | 'declining'
  cashFlowStability: number // 0-100
}

export interface BusinessRiskProfile {
  propertyValue?: number
  buildingAge?: number
  lastRenovation?: Date
  certifications: string[]
  environmentalRisks: EnvironmentalRisk[]
  cybersecurityRisk: 'low' | 'medium' | 'high'
}

export interface IndustryProfile {
  sectorRiskMultiplier: number
  seasonalPatterns: SeasonalPattern[]
  regulatoryCompliance: ComplianceStatus[]
  competitorAnalysis: CompetitorInfo[]
}

export interface BehavioralProfile {
  decisionMaking: 'analytical' | 'emotional' | 'social' | 'impulsive'
  riskTolerance: 'conservative' | 'moderate' | 'aggressive'
  communicationStyle: 'formal' | 'casual' | 'technical' | 'relationship_focused'
  purchasePatterns: PurchasePattern[]
}

export interface DigitalProfile {
  onlineActivity: 'high' | 'medium' | 'low'
  socialMediaPresence: SocialMediaProfile[]
  digitalLiteracy: 'high' | 'medium' | 'low'
  fraudRiskScore: number // 0-100
}

export interface SocialInfluenceProfile {
  networkSize: number
  influenceScore: number // 0-100
  referralPotential: 'high' | 'medium' | 'low'
  familyDecisionMaker: boolean
}

export interface EnvironmentalContext {
  climaticRisks: ClimaticRisk[]
  seismicRisk: number // 0-10
  floodRisk: number // 0-10
  crimeRate: number // local area crime index
  infrastructureQuality: number // 0-100
}

// Supporting Types
export interface AddressInfo {
  street?: string
  city?: string
  region?: string
  postalCode?: string
  country?: string
}

export interface ExistingPolicy {
  provider: string
  type: string
  premium: number
  expiryDate?: Date
  satisfactionLevel?: number // 0-100
}

export interface EnvironmentalRisk {
  type: 'flood' | 'earthquake' | 'fire' | 'storm' | 'industrial'
  severity: 'low' | 'medium' | 'high'
  probability: number // 0-100
}

export interface SeasonalPattern {
  season: 'spring' | 'summer' | 'fall' | 'winter'
  activityMultiplier: number
  riskAdjustment: number
}

export interface ComplianceStatus {
  requirement: string
  status: 'compliant' | 'non_compliant' | 'partial'
  lastAudit?: Date
}

export interface CompetitorInfo {
  name: string
  marketShare: number
  strengths: string[]
  weaknesses: string[]
}

export interface PurchasePattern {
  category: string
  frequency: 'high' | 'medium' | 'low'
  averageValue: number
  seasonality?: string
}

export interface SocialMediaProfile {
  platform: string
  activityLevel: 'high' | 'medium' | 'low'
  influenceMetrics?: number
}

export interface ClimaticRisk {
  type: 'drought' | 'flood' | 'storm' | 'hail' | 'temperature'
  historicalFrequency: number
  projectedChange: number
}

export interface HistoricalAnalysis {
  contactHistory: ContactRecord[]
  quoteHistory: QuoteRecord[]
  conversionPatterns: ConversionPattern[]
  seasonalBehavior: SeasonalBehavior[]
}

export interface ContactRecord {
  date: Date
  channel: 'phone' | 'email' | 'meeting' | 'digital'
  outcome: 'positive' | 'neutral' | 'negative'
  notes?: string
}

export interface QuoteRecord {
  date: Date
  productType: string
  premium: number
  status: 'pending' | 'accepted' | 'rejected'
  reason?: string
}

export interface ConversionPattern {
  timeframe: string
  successRate: number
  averageValue: number
  keyFactors: string[]
}

export interface SeasonalBehavior {
  period: string
  engagementLevel: number
  conversionRate: number
  preferredProducts: string[]
}

// Information Priority Configuration
export const INFORMATION_PRIORITY_CONFIG: Record<string, InformationHierarchy> = {
  // CRITICAL LEVEL
  leadScore: { level: 'critical', priority: 100, category: 'action', displayMode: 'always' },
  nextAction: { level: 'critical', priority: 95, category: 'action', displayMode: 'always' },
  revenueOpportunity: { level: 'critical', priority: 90, category: 'opportunity', displayMode: 'always' },
  contactPriority: { level: 'critical', priority: 85, category: 'action', displayMode: 'always' },
  urgencyScore: { level: 'critical', priority: 80, category: 'action', displayMode: 'always' },
  
  // CONTEXT LEVEL
  riskProfile: { level: 'context', priority: 75, category: 'risk', displayMode: 'on_demand' },
  productMatch: { level: 'context', priority: 70, category: 'opportunity', displayMode: 'on_demand' },
  geographicIntel: { level: 'context', priority: 65, category: 'demographic', displayMode: 'on_demand' },
  engagementHistory: { level: 'context', priority: 60, category: 'behavioral', displayMode: 'on_demand' },
  temporalContext: { level: 'context', priority: 55, category: 'behavioral', displayMode: 'on_demand' },
  
  // DETAIL LEVEL
  fullDemographics: { level: 'detail', priority: 50, category: 'demographic', displayMode: 'deep_dive' },
  behavioralAnalytics: { level: 'detail', priority: 45, category: 'behavioral', displayMode: 'deep_dive' },
  digitalFootprint: { level: 'detail', priority: 40, category: 'behavioral', displayMode: 'deep_dive' },
  environmentalFactors: { level: 'detail', priority: 35, category: 'risk', displayMode: 'deep_dive' },
  historicalPatterns: { level: 'detail', priority: 30, category: 'behavioral', displayMode: 'deep_dive' }
}

// Utility Functions for Information Hierarchy
export const getInformationByLevel = (level: InformationLevel): string[] => {
  return Object.keys(INFORMATION_PRIORITY_CONFIG).filter(
    key => INFORMATION_PRIORITY_CONFIG[key].level === level
  )
}

export const getInformationByPriority = (minPriority: number): string[] => {
  return Object.keys(INFORMATION_PRIORITY_CONFIG)
    .filter(key => INFORMATION_PRIORITY_CONFIG[key].priority >= minPriority)
    .sort((a, b) => INFORMATION_PRIORITY_CONFIG[b].priority - INFORMATION_PRIORITY_CONFIG[a].priority)
}

export const getCriticalInformationFields = (): string[] => {
  return getInformationByLevel('critical')
}

export const getContextualInformationFields = (): string[] => {
  return getInformationByLevel('context')
}

export const getDetailInformationFields = (): string[] => {
  return getInformationByLevel('detail')
}