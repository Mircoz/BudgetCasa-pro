/**
 * Enhanced Data Models for BudgetCasa Pro
 * 
 * Extended PersonCard and CompanyCard interfaces that include critical missing fields
 * for comprehensive insurance risk assessment and lead intelligence.
 */

import { 
  CriticalInformation, 
  ContextualInformation, 
  DetailedInformation,
  CompletePersonalProfile,
  CompleteBusinessProfile
} from './information-hierarchy'

// Enhanced PersonCard with hierarchical information structure
export interface EnhancedPersonCard {
  // EXISTING CORE DATA (preserved from current PersonCard)
  id: string
  name?: string
  geo_city?: string
  lifestyle?: string[]
  mobility?: string[]
  hot_policy?: 'prima_casa' | 'rc_auto' | 'cane' | 'sport' | 'vita' | 'salute' | 'infortuni'
  policy_temperature?: 'hot' | 'warm' | 'cold'
  scores: {
    risk_home?: number
    risk_mobility?: number
    opportunity_home?: number
    opportunity_life?: number
  }

  // NEW CRITICAL FIELDS FOR INSURANCE ASSESSMENT
  riskProfile: PersonalRiskProfile
  assetPortfolio: PersonalAssetPortfolio
  temporalContext: PersonalTemporalContext
  digitalFootprint: PersonalDigitalProfile
  
  // B2C INTEGRATION ENHANCED DATA
  b2cEngagement: B2CEngagementProfile
  propertyIntent: PropertyIntentProfile
  
  // HIERARCHICAL INFORMATION STRUCTURE
  criticalInfo: CriticalInformation
  contextualInfo: ContextualInformation
  detailedInfo: DetailedInformation & { personalProfile: CompletePersonalProfile }
}

// Enhanced CompanyCard with business intelligence
export interface EnhancedCompanyCard {
  // EXISTING CORE DATA (preserved from current CompanyCard)
  id: string
  name: string
  ateco?: string
  geo_city?: string
  employees?: number
  scores: {
    risk_flood?: number
    risk_crime?: number
    risk_business_continuity?: number
    opportunity_property?: number
    opportunity_employee_benefits?: number
  }

  // NEW BUSINESS INTELLIGENCE FIELDS
  businessHealth: BusinessHealthProfile
  industryContext: BusinessIndustryContext
  propertyDetails: BusinessPropertyDetails
  riskExposure: ComprehensiveBusinessRisk
  
  // HIERARCHICAL INFORMATION STRUCTURE
  criticalInfo: CriticalInformation
  contextualInfo: ContextualInformation
  detailedInfo: DetailedInformation & { businessProfile: CompleteBusinessProfile }
}

// Personal Risk Assessment
export interface PersonalRiskProfile {
  // Claims History - Critical for pricing
  claimsHistory: ClaimRecord[]
  claimsFrequency: 'none' | 'rare' | 'moderate' | 'frequent'
  totalClaimsAmount: number // lifetime claims value
  
  // Credit & Financial Stability
  creditScore?: number // 300-850 range (Italian scoring)
  creditHistory: 'excellent' | 'good' | 'fair' | 'poor' | 'no_history'
  financialStability: 'stable' | 'volatile' | 'improving' | 'declining'
  debtToIncomeRatio?: number // 0-1
  
  // Employment & Professional Risk
  employmentType: 'permanent' | 'temporary' | 'freelance' | 'retired' | 'unemployed'
  jobStability: number // 0-100 score
  professionRiskLevel: 'low' | 'medium' | 'high' // based on job type
  yearsInCurrentJob?: number
  
  // Behavioral Risk Indicators
  paymentHistory: 'excellent' | 'good' | 'concerning' | 'poor'
  riskActivities: RiskActivity[]
  drivingRecord?: DrivingRecord
  healthRiskFactors: HealthRiskFactor[]
}

export interface ClaimRecord {
  date: Date
  type: 'property' | 'auto' | 'health' | 'life' | 'other'
  amount: number
  status: 'paid' | 'denied' | 'pending'
  cause: string
  provider?: string
}

export interface RiskActivity {
  activity: string
  riskLevel: 'low' | 'medium' | 'high' | 'extreme'
  frequency: 'occasional' | 'regular' | 'frequent'
  professionalLevel: boolean
}

export interface DrivingRecord {
  licenseAge: number // years since first license
  violations: ViolationRecord[]
  accidents: AccidentRecord[]
  riskScore: number // 0-100
}

export interface ViolationRecord {
  date: Date
  type: string
  severity: 'minor' | 'major' | 'severe'
  points?: number
}

export interface AccidentRecord {
  date: Date
  atFault: boolean
  severity: 'minor' | 'major' | 'total'
  claimAmount?: number
}

export interface HealthRiskFactor {
  factor: string
  riskLevel: 'low' | 'medium' | 'high'
  managed: boolean // whether under medical care
}

// Personal Asset Portfolio
export interface PersonalAssetPortfolio {
  // Property Assets
  existingProperties: PropertyAsset[]
  primaryResidence?: PropertyAsset
  
  // Vehicle Assets
  vehicles: VehicleAsset[]
  
  // Financial Assets
  totalNetWorth?: number
  liquidAssets?: number
  investments?: InvestmentAsset[]
  
  // Insurance Portfolio
  existingInsurance: ExistingInsurancePolicy[]
  totalInsurancePremiums: number // annual total
  insuranceGaps: InsuranceGap[] // identified coverage gaps
}

export interface PropertyAsset {
  address: string
  type: 'apartment' | 'house' | 'commercial' | 'land'
  value: number
  mortgageAmount?: number
  yearBuilt?: number
  squareMeters?: number
  condition: 'excellent' | 'good' | 'fair' | 'poor'
  riskFactors: string[] // flood zone, earthquake, crime area, etc.
}

export interface VehicleAsset {
  make: string
  model: string
  year: number
  value: number
  usage: 'personal' | 'business' | 'mixed'
  annualMileage?: number
  parkingType: 'garage' | 'street' | 'parking_lot'
  riskFactors: string[]
}

export interface InvestmentAsset {
  type: 'stocks' | 'bonds' | 'funds' | 'crypto' | 'real_estate' | 'other'
  value: number
  riskLevel: 'conservative' | 'moderate' | 'aggressive'
}

export interface ExistingInsurancePolicy {
  provider: string
  type: string
  premium: number
  coverage: number
  deductible?: number
  expiryDate: Date
  satisfactionScore?: number // 1-10
  renewalLikelihood: 'likely' | 'uncertain' | 'unlikely'
  switchingBarriers: string[] // cancellation fees, loyalty programs, etc.
}

export interface InsuranceGap {
  type: string
  riskLevel: 'low' | 'medium' | 'high'
  estimatedCoverage: number
  priority: number // 1-10
  reason: string
}

// Personal Temporal Context
export interface PersonalTemporalContext {
  // Decision Timeline
  decisionWindow: 'immediate' | '1month' | '3months' | '6months' | '1year+'
  urgencyFactors: UrgencyFactor[]
  
  // Life Events & Triggers
  recentLifeEvents: LifeEvent[]
  predictedLifeEvents: PredictedLifeEvent[]
  
  // Seasonal & Market Context
  seasonalBehavior: SeasonalInsuranceBehavior
  marketTiming: MarketTimingFactors
  
  // Competitive Context
  competitorPolicyExpiry?: Date
  renewalWindow?: { start: Date, end: Date }
  switchingPropensity: number // 0-100
  pricesSensitivity: 'low' | 'medium' | 'high'
}

export interface UrgencyFactor {
  factor: string
  urgencyLevel: 'low' | 'medium' | 'high' | 'critical'
  deadline?: Date
  impact: string
}

export interface LifeEvent {
  type: 'marriage' | 'divorce' | 'birth' | 'adoption' | 'death' | 'job_change' | 'retirement' | 'home_purchase' | 'home_sale' | 'move'
  date: Date
  insuranceImpact: InsuranceImpact[]
  verificationStatus: 'confirmed' | 'inferred' | 'predicted'
}

export interface PredictedLifeEvent {
  type: string
  probability: number // 0-100
  timeframe: string
  triggerIndicators: string[]
  insuranceOpportunity: string
}

export interface InsuranceImpact {
  productType: string
  changeType: 'new_need' | 'increased_coverage' | 'decreased_coverage' | 'product_switch'
  urgency: 'immediate' | 'short_term' | 'medium_term' | 'long_term'
  revenueImpact: number // estimated annual premium change
}

export interface SeasonalInsuranceBehavior {
  peakEngagementMonths: string[]
  preferredContactTimes: TimePreference[]
  seasonalNeeds: SeasonalNeed[]
}

export interface TimePreference {
  period: string
  preferredDays: string[]
  preferredHours: string
  responseRate: number
}

export interface SeasonalNeed {
  season: string
  productTypes: string[]
  urgency: 'low' | 'medium' | 'high'
}

export interface MarketTimingFactors {
  economicCondition: 'recession' | 'stable' | 'growth'
  interestRates: 'low' | 'medium' | 'high'
  inflationImpact: 'positive' | 'neutral' | 'negative'
  regulatoryChanges: RegulatoryChange[]
}

export interface RegulatoryChange {
  area: string
  effectDate: Date
  impact: 'positive' | 'negative' | 'neutral'
  description: string
}

// Personal Digital Profile
export interface PersonalDigitalProfile {
  // Digital Behavior & Risk
  onlineActivity: 'minimal' | 'moderate' | 'high' | 'very_high'
  digitalLiteracy: 'low' | 'medium' | 'high'
  socialMediaPresence: SocialMediaPresence[]
  
  // Fraud Risk Assessment
  fraudRiskScore: number // 0-100
  fraudRiskFactors: FraudRiskFactor[]
  
  // Digital Engagement Preferences
  preferredChannels: DigitalChannel[]
  deviceUsage: DeviceUsagePattern[]
  onlineBehaviorPatterns: OnlineBehaviorPattern[]
}

export interface SocialMediaPresence {
  platform: string
  activityLevel: 'inactive' | 'low' | 'medium' | 'high'
  influenceScore?: number // followers, engagement
  professionalContent: boolean
  riskIndicators: string[] // public complaints, lifestyle risks
}

export interface FraudRiskFactor {
  factor: string
  riskLevel: 'low' | 'medium' | 'high'
  confidence: number // 0-100
  source: string
}

export interface DigitalChannel {
  channel: 'email' | 'sms' | 'whatsapp' | 'social_media' | 'mobile_app' | 'website'
  preference: 'preferred' | 'acceptable' | 'avoid'
  responseRate: number // historical response rate
}

export interface DeviceUsagePattern {
  deviceType: 'mobile' | 'desktop' | 'tablet'
  usagePercentage: number // % of time
  preferredTimes: string[]
}

export interface OnlineBehaviorPattern {
  behavior: string
  frequency: 'rare' | 'occasional' | 'frequent' | 'constant'
  riskImplication?: string
}

// B2C Engagement Profile
export interface B2CEngagementProfile {
  // Enhanced B2C Data from BudgetCasa.it
  simulationCount: number
  completionRate: number // % of simulations completed
  averageSimulationTime: number // minutes
  lastSimulationDate?: Date
  
  // Engagement Quality Metrics
  engagementScore: number // 0-100
  qualityScore: number // depth of interaction
  intentStrength: 'weak' | 'moderate' | 'strong' | 'very_strong'
  
  // Behavioral Analysis from B2C
  searchPatterns: SearchPattern[]
  priceRangeEvolution: PriceRangeHistory[]
  locationPreferences: LocationPreference[]
  featurePreferences: FeaturePreference[]
}

export interface SearchPattern {
  searchType: string
  frequency: number
  timeOfDay: string
  seasonality?: string
}

export interface PriceRangeHistory {
  date: Date
  minPrice: number
  maxPrice: number
  averageViewed: number
}

export interface LocationPreference {
  area: string
  preferenceStrength: number // 0-100
  priceFlexibility: number // willingness to pay premium for location
}

export interface FeaturePreference {
  feature: string
  importance: 'low' | 'medium' | 'high' | 'critical'
  willingnessToPay: number // premium % willing to pay
}

// Property Intent Profile
export interface PropertyIntentProfile {
  // Purchase Intent Analysis
  purchaseTimeframe: 'immediate' | '3months' | '6months' | '1year' | '2years+'
  budgetConfidence: 'certain' | 'estimated' | 'flexible' | 'uncertain'
  financingReadiness: FinancingReadiness
  
  // Property Specifics
  targetPropertyType: 'apartment' | 'house' | 'commercial' | 'investment'
  desiredLocation: string[]
  budgetRange: { min: number, max: number }
  requiredFeatures: string[]
  
  // Insurance Implications
  insuranceNeeds: InsuranceNeed[]
  estimatedPremium: number
  riskFactors: PropertyRiskFactor[]
}

export interface FinancingReadiness {
  downPaymentAvailable: number
  mortgagePreApproval: 'yes' | 'no' | 'in_progress'
  creditReadiness: 'excellent' | 'good' | 'needs_improvement'
  monthlyBudget: number
}

export interface InsuranceNeed {
  type: string
  coverage: number
  urgency: 'immediate' | 'at_purchase' | 'after_purchase'
  priority: number // 1-10
}

export interface PropertyRiskFactor {
  factor: string
  riskLevel: 'low' | 'medium' | 'high'
  insuranceImpact: number // premium multiplier
  mitigationPossible: boolean
}

// Business Enhanced Types (for CompanyCard)

export interface BusinessHealthProfile {
  // Financial Health Indicators
  yearsInBusiness: number
  financialRating?: 'AAA' | 'AA' | 'A' | 'BBB' | 'BB' | 'B' | 'CCC' | 'D'
  growthTrend: 'rapid_growth' | 'steady_growth' | 'stable' | 'declining' | 'crisis'
  cashFlowStability: number // 0-100 score
  
  // Business Performance
  annualRevenue?: number
  revenueGrowth: number // year-over-year %
  profitMargin?: number
  debtToEquity?: number
  
  // Operational Health
  employeeTurnover: number // annual %
  businessContinuityRisk: number // 0-100
  supplyChainStability: number // 0-100
  customerConcentration: number // % revenue from top 3 customers
}

export interface BusinessIndustryContext {
  // Industry Risk Analysis
  sectorRiskMultiplier: number
  industryGrowthRate: number
  seasonalPatterns: BusinessSeasonalPattern[]
  cyclicalFactors: CyclicalFactor[]
  
  // Regulatory Environment
  regulatoryCompliance: BusinessComplianceStatus[]
  upcomingRegulations: UpcomingRegulation[]
  
  // Competitive Landscape
  marketPosition: 'leader' | 'strong' | 'moderate' | 'weak'
  competitiveAdvantage: string[]
  marketThreats: string[]
}

export interface BusinessSeasonalPattern {
  season: string
  revenueImpact: number // multiplier
  riskImpact: number // multiplier
  insuranceNeeds: string[]
}

export interface CyclicalFactor {
  factor: string
  cycleLength: string // e.g., "3-5 years"
  currentPhase: string
  riskImplication: string
}

export interface BusinessComplianceStatus {
  requirement: string
  status: 'compliant' | 'non_compliant' | 'partial' | 'pending'
  lastAudit?: Date
  riskLevel: 'low' | 'medium' | 'high'
  insuranceImpact?: string
}

export interface UpcomingRegulation {
  regulation: string
  effectiveDate: Date
  preparedness: 'ready' | 'preparing' | 'not_started'
  complianceCost: number
  insuranceImplication?: string
}

export interface BusinessPropertyDetails {
  // Physical Property Information
  properties: BusinessProperty[]
  totalPropertyValue: number
  
  // Construction & Safety Details
  buildingAge: number
  constructionType: string
  lastRenovation?: Date
  safetyFeatures: SafetyFeature[]
  
  // Certifications & Standards
  certifications: BusinessCertification[]
  complianceStandards: ComplianceStandard[]
  
  // Environmental Factors
  environmentalRisks: BusinessEnvironmentalRisk[]
  sustainabilityRating?: string
}

export interface BusinessProperty {
  address: string
  type: 'office' | 'warehouse' | 'retail' | 'manufacturing' | 'mixed'
  size: number // square meters
  value: number
  ownership: 'owned' | 'leased' | 'mixed'
  criticalToOperations: boolean
  riskFactors: string[]
}

export interface SafetyFeature {
  feature: string
  status: 'active' | 'inactive' | 'needs_maintenance'
  lastInspection?: Date
  effectiveness: 'high' | 'medium' | 'low'
}

export interface BusinessCertification {
  type: string
  issuer: string
  validUntil: Date
  status: 'active' | 'expired' | 'pending_renewal'
  insuranceDiscount?: number // % discount on premiums
}

export interface ComplianceStandard {
  standard: string
  complianceLevel: 'full' | 'partial' | 'non_compliant'
  lastAssessment?: Date
  requiredActions: string[]
}

export interface BusinessEnvironmentalRisk {
  riskType: 'flood' | 'earthquake' | 'fire' | 'storm' | 'industrial' | 'climate'
  severity: 'low' | 'medium' | 'high' | 'extreme'
  probability: number // 0-100
  mitigationMeasures: MitigationMeasure[]
  insuranceRequirement?: string
}

export interface MitigationMeasure {
  measure: string
  effectiveness: number // 0-100
  cost: number
  implemented: boolean
}

export interface ComprehensiveBusinessRisk {
  // Operational Risks
  businessInterruption: BusinessInterruptionRisk
  cyberSecurity: CyberSecurityRisk
  supplyChain: SupplyChainRisk
  keyPersonnel: KeyPersonnelRisk
  
  // Liability Risks
  productLiability: ProductLiabilityRisk
  professionalLiability: ProfessionalLiabilityRisk
  employmentLiability: EmploymentLiabilityRisk
  
  // Property & Physical Risks
  propertyRisk: PropertyRiskAssessment
  environmentalLiability: EnvironmentalLiabilityRisk
  
  // Financial Risks
  creditRisk: CreditRiskAssessment
  currencyRisk?: CurrencyRiskAssessment
}

export interface BusinessInterruptionRisk {
  maxDowntime: number // hours
  dailyRevenueLoss: number
  criticalProcesses: CriticalProcess[]
  recoveryTime: number // hours to full operation
  alternativeOperations: boolean
}

export interface CriticalProcess {
  process: string
  downtime Impact: number // 0-100
  alternatives: boolean
  recoveryPriority: number // 1-10
}

export interface CyberSecurityRisk {
  riskLevel: 'low' | 'medium' | 'high' | 'critical'
  dataTypes: DataType[]
  securityMeasures: SecurityMeasure[]
  lastSecurityAudit?: Date
  breachHistory: BreachIncident[]
}

export interface DataType {
  type: 'personal' | 'financial' | 'health' | 'commercial' | 'technical'
  volume: 'small' | 'medium' | 'large' | 'massive'
  sensitivity: 'low' | 'medium' | 'high' | 'critical'
  storageLocation: 'local' | 'cloud' | 'hybrid'
}

export interface SecurityMeasure {
  measure: string
  effectiveness: number // 0-100
  lastUpdate?: Date
  coverage: string[] // what it protects
}

export interface BreachIncident {
  date: Date
  type: string
  impact: 'minor' | 'moderate' | 'major' | 'severe'
  resolved: boolean
  cost?: number
}

export interface SupplyChainRisk {
  keySuppliers: KeySupplier[]
  geographicRisks: GeographicRisk[]
  alternativeSuppliers: number
  stockLevels: 'minimal' | 'normal' | 'high'
  supplyChainInsurance: boolean
}

export interface KeySupplier {
  name: string
  dependencyLevel: 'low' | 'medium' | 'high' | 'critical'
  geographicLocation: string
  stabilityRating: number // 0-100
  alternatives: number
}

export interface GeographicRisk {
  region: string
  riskTypes: string[]
  riskLevel: 'low' | 'medium' | 'high'
  supplierExposure: number // % of suppliers in region
}

export interface KeyPersonnelRisk {
  keyPersons: KeyPerson[]
  successionPlanning: boolean
  knowledgeDocumentation: 'poor' | 'adequate' | 'excellent'
  crossTraining: boolean
}

export interface KeyPerson {
  role: string
  criticalityLevel: 'medium' | 'high' | 'critical'
  replaceability: 'easy' | 'difficult' | 'very_difficult'
  knowledgeRisk: 'low' | 'medium' | 'high'
}

export interface ProductLiabilityRisk {
  productTypes: string[]
  riskLevel: 'low' | 'medium' | 'high'
  qualityControls: QualityControl[]
  recallHistory: RecallIncident[]
  liabilityInsurance: boolean
}

export interface QualityControl {
  control: string
  effectiveness: number // 0-100
  frequency: string
  lastAudit?: Date
}

export interface RecallIncident {
  date: Date
  product: string
  reason: string
  scope: 'local' | 'national' | 'international'
  cost?: number
}

export interface ProfessionalLiabilityRisk {
  serviceTypes: string[]
  riskLevel: 'low' | 'medium' | 'high'
  qualifications: Qualification[]
  claimsHistory: ProfessionalClaim[]
  insuranceCoverage: boolean
}

export interface Qualification {
  type: string
  validUntil?: Date
  issuer: string
  relevantTo: string[]
}

export interface ProfessionalClaim {
  date: Date
  type: string
  outcome: 'settled' | 'dismissed' | 'ongoing'
  amount?: number
  lessonLearned?: string
}

export interface EmploymentLiabilityRisk {
  employeeCount: number
  turnoverRate: number // annual %
  safetyRecord: SafetyRecord
  hrPolicies: HRPolicy[]
  claimsHistory: EmploymentClaim[]
}

export interface SafetyRecord {
  accidentsPerYear: number
  severity: 'low' | 'medium' | 'high'
  safetyTraining: boolean
  lastSafetyAudit?: Date
}

export interface HRPolicy {
  policyType: string
  lastUpdate: Date
  compliance: 'compliant' | 'needs_update' | 'non_compliant'
  riskLevel: 'low' | 'medium' | 'high'
}

export interface EmploymentClaim {
  date: Date
  type: string
  status: 'active' | 'settled' | 'dismissed'
  outcome?: string
  cost?: number
}

export interface PropertyRiskAssessment {
  totalValue: number
  riskFactors: PropertyRiskFactor[]
  protectionSystems: ProtectionSystem[]
  maintenanceStatus: 'excellent' | 'good' | 'adequate' | 'poor'
  replacementCost: number
}

export interface ProtectionSystem {
  system: string
  coverage: 'full' | 'partial' | 'limited'
  lastMaintenance?: Date
  effectiveness: number // 0-100
}

export interface EnvironmentalLiabilityRisk {
  industryRisk: 'low' | 'medium' | 'high'
  previousIssues: EnvironmentalIssue[]
  complianceStatus: 'compliant' | 'partial' | 'non_compliant'
  cleanupPotential: number // estimated cost
}

export interface EnvironmentalIssue {
  date: Date
  type: string
  severity: 'minor' | 'moderate' | 'major'
  resolved: boolean
  cost?: number
}

export interface CreditRiskAssessment {
  creditRating?: string
  paymentHistory: 'excellent' | 'good' | 'concerning' | 'poor'
  daysPayableOutstanding: number
  badDebtPercentage: number
  creditInsurance: boolean
}

export interface CurrencyRiskAssessment {
  exposureCurrencies: string[]
  hedgingStrategies: string[]
  riskLevel: 'low' | 'medium' | 'high'
  annualExposure: number
}

// Export all enhanced types for easy importing
export type {
  ClaimRecord,
  RiskActivity,
  DrivingRecord,
  ViolationRecord,
  AccidentRecord,
  HealthRiskFactor,
  PropertyAsset,
  VehicleAsset,
  InvestmentAsset,
  ExistingInsurancePolicy,
  InsuranceGap,
  UrgencyFactor,
  LifeEvent,
  PredictedLifeEvent,
  InsuranceImpact,
  SeasonalInsuranceBehavior,
  TimePreference,
  SeasonalNeed,
  MarketTimingFactors,
  RegulatoryChange,
  SocialMediaPresence,
  FraudRiskFactor,
  DigitalChannel,
  DeviceUsagePattern,
  OnlineBehaviorPattern,
  SearchPattern,
  PriceRangeHistory,
  LocationPreference,
  FeaturePreference,
  FinancingReadiness,
  InsuranceNeed,
  BusinessHealthProfile,
  BusinessIndustryContext,
  BusinessSeasonalPattern,
  CyclicalFactor,
  BusinessComplianceStatus,
  UpcomingRegulation,
  BusinessPropertyDetails,
  BusinessProperty,
  SafetyFeature,
  BusinessCertification,
  ComplianceStandard,
  BusinessEnvironmentalRisk,
  MitigationMeasure
}