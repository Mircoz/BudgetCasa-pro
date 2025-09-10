/**
 * Smart Campaign Automation Engine for BudgetCasa Pro
 * 
 * Advanced automation system that orchestrates intelligent campaigns,
 * sequences, and workflows based on AI insights and behavioral patterns.
 */

import { EnhancedPersonCard, EnhancedCompanyCard } from './enhanced-types'
import { TemporalIntelligence } from './temporal-context-engine'
import { PredictiveScore } from './ai-predictive-scoring'
import { BehavioralProfile } from './behavioral-pattern-recognition'
import { CompetitiveIntelligence } from './competitive-intelligence'

// Core automation types
export interface AutomationEngine {
  campaigns: SmartCampaign[]
  workflows: AutomationWorkflow[]
  triggers: AutomationTrigger[]
  sequences: CommunicationSequence[]
  rules: AutomationRule[]
  analytics: AutomationAnalytics
}

export interface SmartCampaign {
  campaignId: string
  name: string
  type: CampaignType
  status: CampaignStatus
  targeting: SmartTargeting
  messaging: DynamicMessaging
  channels: ChannelOrchestration
  automation: CampaignAutomation
  performance: CampaignPerformance
  optimization: CampaignOptimization
  created: Date
  lastOptimized: Date
}

export type CampaignType = 
  | 'lead_nurturing'
  | 'competitor_intercept'
  | 'life_event_trigger'
  | 'reactivation'
  | 'cross_sell'
  | 'retention'
  | 'seasonal_campaign'
  | 'urgency_response'

export type CampaignStatus = 
  | 'draft'
  | 'active'
  | 'paused'
  | 'optimizing'
  | 'completed'
  | 'archived'

export interface SmartTargeting {
  segments: TargetSegment[]
  exclusions: ExclusionCriteria[]
  dynamicFilters: DynamicFilter[]
  aiRecommendations: TargetingRecommendation[]
  targetSize: number
  refreshFrequency: 'real_time' | 'hourly' | 'daily' | 'weekly'
}

export interface TargetSegment {
  segmentId: string
  name: string
  criteria: SegmentCriteria[]
  size: number
  conversionRate: number
  priority: number // 1-10
  activeUsers: number
}

export interface SegmentCriteria {
  field: string
  operator: 'equals' | 'not_equals' | 'greater_than' | 'less_than' | 'contains' | 'in' | 'not_in'
  value: any
  weight: number // 0-1
  aiGenerated: boolean
}

export interface ExclusionCriteria {
  reason: string
  criteria: SegmentCriteria[]
  temporaryDuration?: number // days
  priority: 'low' | 'medium' | 'high'
}

export interface DynamicFilter {
  filterId: string
  name: string
  logic: string // JavaScript-like expression
  updateFrequency: 'real_time' | 'hourly' | 'daily'
  aiOptimized: boolean
  performance: FilterPerformance
}

export interface FilterPerformance {
  precision: number // 0-1
  recall: number // 0-1
  f1Score: number // 0-1
  falsePositiveRate: number // 0-1
  lastEvaluated: Date
}

export interface TargetingRecommendation {
  recommendation: string
  impact: 'low' | 'medium' | 'high'
  confidence: number // 0-100
  estimatedLift: number // % improvement
  implementation: string
}

export interface DynamicMessaging {
  templates: MessageTemplate[]
  personalization: PersonalizationEngine
  aiGeneration: AIMessageGeneration
  variations: MessageVariation[]
  optimization: MessagingOptimization
}

export interface MessageTemplate {
  templateId: string
  name: string
  channel: 'email' | 'sms' | 'push' | 'linkedin' | 'phone_script'
  content: MessageContent
  variables: TemplateVariable[]
  aiEnhanced: boolean
  performance: TemplatePerformance
}

export interface MessageContent {
  subject?: string
  headline?: string
  body: string
  callToAction: string
  footer?: string
  attachments?: string[]
}

export interface TemplateVariable {
  name: string
  type: 'text' | 'number' | 'date' | 'boolean' | 'list'
  source: VariableSource
  fallback: any
  personalization: PersonalizationType
}

export type VariableSource = 
  | 'lead_data'
  | 'behavioral_data'
  | 'temporal_data'
  | 'competitive_data'
  | 'external_api'
  | 'ai_generated'

export type PersonalizationType = 
  | 'name'
  | 'location'
  | 'interest'
  | 'behavior'
  | 'timing'
  | 'offer'
  | 'social_proof'

export interface TemplatePerformance {
  openRate: number
  clickRate: number
  responseRate: number
  conversionRate: number
  unsubscribeRate: number
  spamRate: number
  sentimentScore: number // -1 to 1
}

export interface PersonalizationEngine {
  rules: PersonalizationRule[]
  aiModels: PersonalizationModel[]
  dynamicContent: DynamicContentRule[]
  contextualAdaptation: ContextualRule[]
}

export interface PersonalizationRule {
  ruleId: string
  name: string
  condition: string
  action: PersonalizationAction
  priority: number
  performance: RulePerformance
}

export interface PersonalizationAction {
  type: 'replace_content' | 'add_content' | 'change_tone' | 'adjust_timing' | 'select_offer'
  target: string // what to personalize
  value: string | any[]
  aiGenerated: boolean
}

export interface RulePerformance {
  triggerRate: number // how often rule triggers
  successRate: number // success when triggered
  impact: number // average lift when applied
  lastOptimized: Date
}

export interface PersonalizationModel {
  modelId: string
  type: 'content_selection' | 'timing_optimization' | 'offer_matching' | 'tone_adaptation'
  accuracy: number // 0-1
  trainedOn: Date
  features: string[]
}

export interface DynamicContentRule {
  ruleId: string
  trigger: ContentTrigger
  contentOptions: ContentOption[]
  selectionLogic: 'ai_optimized' | 'performance_based' | 'random' | 'sequential'
}

export interface ContentTrigger {
  event: string
  conditions: TriggerCondition[]
  timing: 'immediate' | 'delayed' | 'scheduled'
  delay?: number // minutes if delayed
}

export interface TriggerCondition {
  field: string
  operator: string
  value: any
  weight: number
}

export interface ContentOption {
  content: string
  weight: number
  performance: ContentPerformance
  targetAudience: string[]
}

export interface ContentPerformance {
  impressions: number
  engagements: number
  conversions: number
  engagementRate: number
  conversionRate: number
}

export interface ContextualRule {
  ruleId: string
  context: ContextType
  adaptations: ContextualAdaptation[]
  priority: number
}

export type ContextType = 
  | 'time_of_day'
  | 'day_of_week'
  | 'season'
  | 'weather'
  | 'market_conditions'
  | 'competitor_actions'
  | 'user_behavior'

export interface ContextualAdaptation {
  contextValue: string
  messageAdjustment: MessageAdjustment
  expectedImpact: number
}

export interface MessageAdjustment {
  toneChange?: 'more_formal' | 'more_casual' | 'more_urgent' | 'more_relaxed'
  contentFocus?: 'benefits' | 'features' | 'social_proof' | 'urgency'
  callToActionStrength?: 'soft' | 'medium' | 'strong' | 'urgent'
  lengthAdjustment?: 'shorter' | 'longer' | 'no_change'
}

export interface AIMessageGeneration {
  enabled: boolean
  models: AIModel[]
  generationRules: GenerationRule[]
  qualityControl: QualityControl
  humanReview: boolean
}

export interface AIModel {
  modelId: string
  provider: 'openai' | 'anthropic' | 'custom'
  modelName: string
  purpose: 'subject_generation' | 'content_generation' | 'personalization' | 'optimization'
  configuration: ModelConfiguration
}

export interface ModelConfiguration {
  temperature: number // 0-1 creativity
  maxTokens: number
  systemPrompt: string
  examples: TrainingExample[]
}

export interface TrainingExample {
  input: any
  output: string
  performance: number // how well this example performed
}

export interface GenerationRule {
  ruleId: string
  trigger: string
  prompt: string
  constraints: string[]
  reviewRequired: boolean
}

export interface QualityControl {
  enabled: boolean
  checks: QualityCheck[]
  approvalThreshold: number // 0-1
  humanReviewTriggers: string[]
}

export interface QualityCheck {
  check: 'toxicity' | 'sentiment' | 'relevance' | 'compliance' | 'brand_alignment'
  threshold: number
  action: 'reject' | 'flag' | 'modify' | 'human_review'
}

export interface MessageVariation {
  variationId: string
  baseTemplate: string
  variations: VariationOption[]
  testType: 'a_b' | 'multivariate' | 'champion_challenger'
  allocation: VariationAllocation[]
  results: VariationResults
}

export interface VariationOption {
  name: string
  content: MessageContent
  hypothesis: string
  expectedLift: number
}

export interface VariationAllocation {
  variation: string
  percentage: number
  minSampleSize: number
  maxDuration: number // days
}

export interface VariationResults {
  winner: string | null
  confidence: number // 0-1 statistical confidence
  lift: number // % improvement of winner
  results: VariationResult[]
  recommendation: string
}

export interface VariationResult {
  variation: string
  sent: number
  opens: number
  clicks: number
  conversions: number
  revenue: number
  metrics: VariationMetrics
}

export interface VariationMetrics {
  openRate: number
  clickRate: number
  conversionRate: number
  revenuePerRecipient: number
  statisticalSignificance: number
}

export interface MessagingOptimization {
  enabled: boolean
  optimizationGoals: OptimizationGoal[]
  algorithms: OptimizationAlgorithm[]
  constraints: OptimizationConstraint[]
  schedule: OptimizationSchedule
}

export interface OptimizationGoal {
  metric: 'open_rate' | 'click_rate' | 'conversion_rate' | 'revenue' | 'engagement_time'
  target: number
  weight: number // relative importance
  priority: 'primary' | 'secondary' | 'tertiary'
}

export interface OptimizationAlgorithm {
  algorithm: 'genetic' | 'gradient_descent' | 'bayesian' | 'reinforcement_learning'
  parameters: AlgorithmParameters
  performance: AlgorithmPerformance
}

export interface AlgorithmParameters {
  learningRate?: number
  populationSize?: number
  mutationRate?: number
  explorationRate?: number
  [key: string]: any
}

export interface AlgorithmPerformance {
  convergenceRate: number
  stability: number
  generalization: number
  lastEvaluation: Date
}

export interface OptimizationConstraint {
  constraint: string
  type: 'hard' | 'soft'
  penalty: number // for soft constraints
  rationale: string
}

export interface OptimizationSchedule {
  frequency: 'continuous' | 'daily' | 'weekly' | 'monthly'
  minDataPoints: number
  cooldownPeriod: number // hours between optimizations
  maxChangesPerPeriod: number
}

export interface ChannelOrchestration {
  channels: CommunicationChannel[]
  sequencing: ChannelSequence[]
  crossChannelRules: CrossChannelRule[]
  optimization: ChannelOptimization
}

export interface CommunicationChannel {
  channel: 'email' | 'sms' | 'push' | 'linkedin' | 'phone' | 'direct_mail'
  priority: number
  capacity: ChannelCapacity
  performance: ChannelPerformance
  rules: ChannelRule[]
  integration: ChannelIntegration
}

export interface ChannelCapacity {
  maxDailyVolume: number
  maxHourlyVolume: number
  currentUtilization: number
  peakTimes: string[]
  restrictions: string[]
}

export interface ChannelPerformance {
  deliverability: number // 0-1
  engagement: number // 0-1
  conversion: number // 0-1
  cost: number // per contact
  roi: number
  trends: PerformanceTrend[]
}

export interface PerformanceTrend {
  period: string
  metric: string
  value: number
  change: number // % change from previous period
}

export interface ChannelRule {
  rule: string
  type: 'frequency_cap' | 'time_restriction' | 'content_rule' | 'targeting_rule'
  parameters: any
  enforcement: 'strict' | 'flexible'
}

export interface ChannelIntegration {
  platform: string
  apiEndpoint: string
  authentication: AuthConfig
  rateLimits: RateLimit[]
  capabilities: ChannelCapability[]
}

export interface AuthConfig {
  type: 'api_key' | 'oauth' | 'jwt' | 'basic'
  credentials: any // encrypted
  refreshToken?: string
  expiresAt?: Date
}

export interface RateLimit {
  limitType: 'requests_per_second' | 'requests_per_minute' | 'requests_per_hour' | 'requests_per_day'
  limit: number
  currentUsage: number
  resetTime?: Date
}

export interface ChannelCapability {
  capability: 'personalization' | 'automation' | 'analytics' | 'real_time' | 'bulk_operations'
  supported: boolean
  limitations?: string[]
}

export interface ChannelSequence {
  sequenceId: string
  name: string
  channels: ChannelStep[]
  rules: SequenceRule[]
  performance: SequencePerformance
}

export interface ChannelStep {
  step: number
  channel: string
  delay: number // hours from previous step
  conditions: StepCondition[]
  alternatives: AlternativeStep[]
}

export interface StepCondition {
  condition: string
  action: 'continue' | 'skip' | 'exit' | 'branch'
  branchTo?: number
}

export interface AlternativeStep {
  condition: string
  alternativeChannel: string
  alternativeContent?: string
}

export interface SequenceRule {
  rule: string
  applies: 'all_steps' | 'specific_steps'
  steps?: number[]
  action: string
}

export interface SequencePerformance {
  completionRate: number
  conversionRate: number
  dropoffPoints: DropoffPoint[]
  averageTimeToComplete: number // hours
  optimization: SequenceOptimization
}

export interface DropoffPoint {
  step: number
  dropoffRate: number
  reasons: string[]
  improvement: string
}

export interface SequenceOptimization {
  recommendations: SequenceRecommendation[]
  testing: SequenceTest[]
  lastOptimized: Date
}

export interface SequenceRecommendation {
  recommendation: string
  step: number
  expectedLift: number
  implementation: string
  priority: number
}

export interface SequenceTest {
  testId: string
  hypothesis: string
  variations: SequenceVariation[]
  results: SequenceTestResults
}

export interface SequenceVariation {
  name: string
  changes: SequenceChange[]
  allocation: number // % of traffic
}

export interface SequenceChange {
  step: number
  changeType: 'timing' | 'channel' | 'content' | 'condition'
  oldValue: any
  newValue: any
}

export interface SequenceTestResults {
  winner: string | null
  lift: number
  confidence: number
  recommendation: string
}

export interface CrossChannelRule {
  ruleId: string
  name: string
  trigger: CrossChannelTrigger
  action: CrossChannelAction
  priority: number
  performance: CrossChannelPerformance
}

export interface CrossChannelTrigger {
  event: 'no_response' | 'partial_engagement' | 'high_engagement' | 'conversion' | 'time_based'
  channel: string
  timeframe: number // hours
  conditions: TriggerCondition[]
}

export interface CrossChannelAction {
  action: 'switch_channel' | 'add_channel' | 'pause_sequence' | 'escalate' | 'personalize'
  targetChannel?: string
  modifications: ActionModification[]
}

export interface ActionModification {
  aspect: 'message' | 'timing' | 'frequency' | 'audience'
  change: string
  parameters: any
}

export interface CrossChannelPerformance {
  triggerRate: number
  successRate: number
  impact: number
  lastEvaluation: Date
}

export interface ChannelOptimization {
  enabled: boolean
  objectives: ChannelObjective[]
  constraints: ChannelConstraint[]
  algorithm: OptimizationAlgorithm
  performance: OptimizationPerformance
}

export interface ChannelObjective {
  objective: 'maximize_reach' | 'maximize_engagement' | 'maximize_conversion' | 'minimize_cost'
  weight: number
  constraints: ObjectiveConstraint[]
}

export interface ObjectiveConstraint {
  constraint: string
  value: number
  enforcement: 'hard' | 'soft'
}

export interface ChannelConstraint {
  constraint: string
  channels: string[]
  value: number
  rationale: string
}

export interface OptimizationPerformance {
  improvement: number // % improvement from baseline
  stability: number // consistency of results
  convergence: number // how quickly optimal solution is found
  lastOptimization: Date
}

export interface CampaignAutomation {
  triggers: CampaignTrigger[]
  workflows: CampaignWorkflow[]
  conditions: AutomationCondition[]
  actions: AutomationAction[]
  monitoring: AutomationMonitoring
}

export interface CampaignTrigger {
  triggerId: string
  name: string
  type: TriggerType
  conditions: TriggerCondition[]
  frequency: TriggerFrequency
  priority: number
}

export type TriggerType = 
  | 'behavioral'
  | 'temporal'
  | 'data_change'
  | 'external_event'
  | 'campaign_performance'
  | 'competitive'

export type TriggerFrequency = 
  | 'real_time'
  | 'every_minute'
  | 'hourly'
  | 'daily'
  | 'weekly'
  | 'on_event'

export interface CampaignWorkflow {
  workflowId: string
  name: string
  steps: WorkflowStep[]
  branching: WorkflowBranching[]
  errorHandling: ErrorHandling
  performance: WorkflowPerformance
}

export interface WorkflowStep {
  stepId: string
  name: string
  type: WorkflowStepType
  configuration: StepConfiguration
  dependencies: string[] // stepIds this step depends on
  timeout: number // minutes
  retryPolicy: RetryPolicy
}

export type WorkflowStepType = 
  | 'send_message'
  | 'wait'
  | 'condition_check'
  | 'data_update'
  | 'api_call'
  | 'ai_analysis'
  | 'human_task'

export interface StepConfiguration {
  [key: string]: any
}

export interface RetryPolicy {
  maxRetries: number
  backoffStrategy: 'linear' | 'exponential' | 'fixed'
  initialDelay: number // seconds
  maxDelay: number // seconds
}

export interface WorkflowBranching {
  condition: string
  trueStep: string
  falseStep: string
  defaultStep?: string
}

export interface ErrorHandling {
  strategy: 'fail_fast' | 'continue' | 'retry' | 'escalate'
  fallbackActions: FallbackAction[]
  notifications: ErrorNotification[]
}

export interface FallbackAction {
  trigger: string
  action: string
  parameters: any
}

export interface ErrorNotification {
  recipient: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  channel: 'email' | 'sms' | 'slack' | 'dashboard'
}

export interface WorkflowPerformance {
  executionTime: number // average minutes
  successRate: number
  errorRate: number
  bottlenecks: WorkflowBottleneck[]
  optimization: WorkflowOptimization
}

export interface WorkflowBottleneck {
  stepId: string
  avgDuration: number
  failureRate: number
  recommendation: string
}

export interface WorkflowOptimization {
  recommendations: WorkflowRecommendation[]
  automatedImprovements: AutomatedImprovement[]
  lastOptimized: Date
}

export interface WorkflowRecommendation {
  type: 'performance' | 'reliability' | 'cost' | 'user_experience'
  description: string
  expectedBenefit: string
  implementation: string
  priority: number
}

export interface AutomatedImprovement {
  improvement: string
  implementedAt: Date
  impact: string
  metrics: ImprovementMetrics
}

export interface ImprovementMetrics {
  performanceGain: number
  costReduction: number
  errorReduction: number
  userSatisfaction: number
}

export interface AutomationCondition {
  conditionId: string
  name: string
  logic: string
  variables: ConditionVariable[]
  evaluation: ConditionEvaluation
}

export interface ConditionVariable {
  name: string
  source: VariableSource
  type: 'boolean' | 'number' | 'string' | 'date' | 'array'
  transformation?: string
}

export interface ConditionEvaluation {
  lastEvaluated: Date
  result: boolean
  confidence: number
  factors: EvaluationFactor[]
}

export interface EvaluationFactor {
  factor: string
  weight: number
  value: any
  impact: 'positive' | 'negative' | 'neutral'
}

export interface AutomationAction {
  actionId: string
  name: string
  type: ActionType
  parameters: ActionParameters
  execution: ActionExecution
  performance: ActionPerformance
}

export type ActionType = 
  | 'send_communication'
  | 'update_lead_score'
  | 'assign_to_agent'
  | 'create_task'
  | 'trigger_workflow'
  | 'log_event'
  | 'api_webhook'

export interface ActionParameters {
  [key: string]: any
}

export interface ActionExecution {
  retries: number
  timeout: number
  async: boolean
  dependencies: string[]
  schedule?: ExecutionSchedule
}

export interface ExecutionSchedule {
  type: 'immediate' | 'delayed' | 'scheduled' | 'recurring'
  delay?: number // minutes if delayed
  schedule?: string // cron expression if scheduled/recurring
  timezone?: string
}

export interface ActionPerformance {
  executionCount: number
  successRate: number
  averageExecutionTime: number
  lastExecuted: Date
  errors: ActionError[]
}

export interface ActionError {
  timestamp: Date
  error: string
  context: any
  resolved: boolean
  resolution?: string
}

export interface AutomationMonitoring {
  metrics: MonitoringMetric[]
  alerts: MonitoringAlert[]
  dashboards: MonitoringDashboard[]
  reporting: MonitoringReporting
}

export interface MonitoringMetric {
  metricId: string
  name: string
  type: MetricType
  aggregation: 'sum' | 'average' | 'count' | 'min' | 'max' | 'percentile'
  thresholds: MetricThreshold[]
  collection: MetricCollection
}

export type MetricType = 
  | 'performance'
  | 'quality'
  | 'business'
  | 'technical'
  | 'user_experience'

export interface MetricThreshold {
  level: 'info' | 'warning' | 'error' | 'critical'
  operator: '>' | '<' | '>=' | '<=' | '=' | '!='
  value: number
  action: ThresholdAction
}

export interface ThresholdAction {
  type: 'alert' | 'auto_fix' | 'escalate' | 'log'
  parameters: any
}

export interface MetricCollection {
  frequency: 'real_time' | 'minute' | 'hourly' | 'daily'
  retention: number // days
  aggregationWindow: number // minutes
}

export interface MonitoringAlert {
  alertId: string
  name: string
  condition: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  channels: AlertChannel[]
  throttling: AlertThrottling
}

export interface AlertChannel {
  channel: 'email' | 'sms' | 'slack' | 'webhook' | 'dashboard'
  recipients: string[]
  template: string
}

export interface AlertThrottling {
  enabled: boolean
  window: number // minutes
  maxAlerts: number
}

export interface MonitoringDashboard {
  dashboardId: string
  name: string
  widgets: DashboardWidget[]
  filters: DashboardFilter[]
  refresh: number // seconds
}

export interface DashboardWidget {
  widgetId: string
  type: 'metric' | 'chart' | 'table' | 'gauge' | 'alert_list'
  configuration: WidgetConfiguration
  position: WidgetPosition
}

export interface WidgetConfiguration {
  title: string
  metrics: string[]
  timeRange: string
  visualization: VisualizationConfig
}

export interface VisualizationConfig {
  type: 'line' | 'bar' | 'pie' | 'gauge' | 'number' | 'table'
  options: any
}

export interface WidgetPosition {
  x: number
  y: number
  width: number
  height: number
}

export interface DashboardFilter {
  name: string
  type: 'select' | 'date_range' | 'text' | 'multi_select'
  options?: string[]
  defaultValue?: any
}

export interface MonitoringReporting {
  reports: AutomatedReport[]
  distribution: ReportDistribution[]
  schedule: ReportSchedule
}

export interface AutomatedReport {
  reportId: string
  name: string
  type: 'performance' | 'summary' | 'detailed' | 'executive'
  content: ReportContent[]
  format: 'pdf' | 'html' | 'csv' | 'json'
}

export interface ReportContent {
  section: string
  metrics: string[]
  visualization?: VisualizationConfig
  analysis?: string
}

export interface ReportDistribution {
  report: string
  recipients: ReportRecipient[]
  conditions?: DistributionCondition[]
}

export interface ReportRecipient {
  email: string
  role: string
  customization?: ReportCustomization
}

export interface ReportCustomization {
  sections: string[]
  filters: any
  format: string
}

export interface DistributionCondition {
  condition: string
  action: 'send' | 'skip' | 'modify'
  modification?: string
}

export interface ReportSchedule {
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly'
  time: string // HH:MM
  timezone: string
  weekday?: string // for weekly reports
  dayOfMonth?: number // for monthly reports
}

export interface CampaignPerformance {
  metrics: CampaignMetric[]
  kpis: CampaignKPI[]
  segments: SegmentPerformance[]
  attribution: AttributionAnalysis
  optimization: PerformanceOptimization
}

export interface CampaignMetric {
  metric: string
  value: number
  target?: number
  benchmark?: number
  trend: MetricTrend
}

export interface MetricTrend {
  direction: 'up' | 'down' | 'stable'
  magnitude: number // % change
  period: string
  significance: 'high' | 'medium' | 'low'
}

export interface CampaignKPI {
  kpi: string
  current: number
  target: number
  status: 'on_track' | 'at_risk' | 'off_track'
  forecast: KPIForecast
}

export interface KPIForecast {
  predicted: number
  confidence: number
  factors: ForecastFactor[]
}

export interface ForecastFactor {
  factor: string
  impact: number // -1 to 1
  confidence: number
}

export interface SegmentPerformance {
  segment: string
  size: number
  metrics: SegmentMetric[]
  comparison: SegmentComparison
}

export interface SegmentMetric {
  metric: string
  value: number
  rank: number // vs other segments
  percentile: number
}

export interface SegmentComparison {
  bestPerforming: string
  worstPerforming: string
  insights: string[]
  recommendations: string[]
}

export interface AttributionAnalysis {
  models: AttributionModel[]
  touchpoints: TouchpointAttribution[]
  journey: JourneyAttribution
  insights: AttributionInsight[]
}

export interface AttributionModel {
  model: 'first_touch' | 'last_touch' | 'linear' | 'time_decay' | 'data_driven'
  weight: number
  performance: ModelPerformance
}

export interface ModelPerformance {
  accuracy: number
  precision: number
  recall: number
  f1Score: number
}

export interface TouchpointAttribution {
  touchpoint: string
  attribution: number // 0-1
  influence: TouchpointInfluence
  optimization: TouchpointOptimization
}

export interface TouchpointInfluence {
  direct: number
  indirect: number
  assist: number
  total: number
}

export interface TouchpointOptimization {
  currentInvestment: number
  optimalInvestment: number
  expectedLift: number
  priority: number
}

export interface JourneyAttribution {
  paths: JourneyPath[]
  stages: StageAttribution[]
  optimization: JourneyOptimization
}

export interface JourneyPath {
  path: string[]
  frequency: number
  conversionRate: number
  value: number
  optimization: PathOptimization
}

export interface PathOptimization {
  bottlenecks: string[]
  improvements: PathImprovement[]
  expectedLift: number
}

export interface PathImprovement {
  stage: string
  improvement: string
  effort: 'low' | 'medium' | 'high'
  impact: number
}

export interface StageAttribution {
  stage: string
  attribution: number
  effectiveness: number
  cost: number
  roi: number
}

export interface JourneyOptimization {
  recommendations: JourneyRecommendation[]
  experiments: JourneyExperiment[]
  insights: JourneyInsight[]
}

export interface JourneyRecommendation {
  recommendation: string
  stage: string
  priority: number
  expectedImpact: number
  implementation: string
}

export interface JourneyExperiment {
  hypothesis: string
  design: ExperimentDesign
  results?: ExperimentResults
  status: 'planning' | 'running' | 'analyzing' | 'completed'
}

export interface ExperimentDesign {
  variations: ExperimentVariation[]
  allocation: number[] // % for each variation
  duration: number // days
  successMetrics: string[]
}

export interface ExperimentVariation {
  name: string
  changes: VariationChange[]
  hypothesis: string
}

export interface VariationChange {
  component: string
  change: string
  parameters: any
}

export interface ExperimentResults {
  winner: string
  lift: number
  confidence: number
  insights: string[]
  recommendation: string
}

export interface JourneyInsight {
  insight: string
  data: any
  confidence: number
  actionable: boolean
}

export interface AttributionInsight {
  insight: string
  model: string
  confidence: number
  recommendation: string
}

export interface PerformanceOptimization {
  enabled: boolean
  algorithms: OptimizationAlgorithm[]
  objectives: OptimizationObjective[]
  constraints: PerformanceConstraint[]
  results: OptimizationResult[]
}

export interface OptimizationObjective {
  objective: string
  weight: number
  target: number
  priority: 'primary' | 'secondary' | 'tertiary'
}

export interface PerformanceConstraint {
  constraint: string
  type: 'budget' | 'time' | 'resource' | 'quality' | 'compliance'
  value: number
  unit: string
}

export interface OptimizationResult {
  timestamp: Date
  objective: string
  improvement: number
  confidence: number
  changes: OptimizationChange[]
}

export interface OptimizationChange {
  component: string
  parameter: string
  oldValue: any
  newValue: any
  impact: number
}

export interface CampaignOptimization {
  autoOptimization: boolean
  optimizationRules: OptimizationRule[]
  learningAlgorithms: LearningAlgorithm[]
  humanOverrides: HumanOverride[]
  performance: OptimizationPerformance
}

export interface OptimizationRule {
  ruleId: string
  name: string
  trigger: OptimizationTrigger
  action: OptimizationAction
  constraints: RuleConstraint[]
  performance: RulePerformance
}

export interface OptimizationTrigger {
  metric: string
  threshold: number
  operator: string
  duration: number // minutes metric must meet condition
}

export interface OptimizationAction {
  action: string
  parameters: ActionParameters
  maxChange: number // maximum % change allowed
  rollback: RollbackConfig
}

export interface RollbackConfig {
  enabled: boolean
  trigger: string
  timeout: number // minutes before auto-rollback
}

export interface RuleConstraint {
  constraint: string
  value: any
  enforcement: 'hard' | 'soft'
}

export interface LearningAlgorithm {
  algorithm: 'reinforcement' | 'bandit' | 'gradient_descent' | 'evolutionary'
  configuration: AlgorithmConfiguration
  performance: LearningPerformance
  state: AlgorithmState
}

export interface AlgorithmConfiguration {
  learningRate: number
  explorationRate: number
  memorySize: number
  updateFrequency: number // minutes
  parameters: any
}

export interface LearningPerformance {
  accuracy: number
  convergenceRate: number
  stability: number
  generalization: number
}

export interface AlgorithmState {
  currentModel: any
  trainingData: TrainingDataPoint[]
  lastUpdate: Date
  version: number
}

export interface TrainingDataPoint {
  input: any
  output: any
  reward: number
  timestamp: Date
  context: any
}

export interface HumanOverride {
  overrideId: string
  timestamp: Date
  user: string
  component: string
  reason: string
  change: OverrideChange
  duration?: number // minutes override is active
  impact: OverrideImpact
}

export interface OverrideChange {
  parameter: string
  oldValue: any
  newValue: any
  automatic: boolean
}

export interface OverrideImpact {
  performance: number
  cost: number
  risk: 'low' | 'medium' | 'high'
  rationale: string
}

// Additional supporting types
export interface AutomationWorkflow {
  workflowId: string
  name: string
  type: WorkflowType
  triggers: WorkflowTrigger[]
  actions: WorkflowAction[]
  conditions: WorkflowCondition[]
  performance: WorkflowPerformance
  status: WorkflowStatus
}

export type WorkflowType = 
  | 'lead_qualification'
  | 'nurture_sequence'
  | 'follow_up_automation'
  | 'escalation_workflow'
  | 'onboarding_sequence'
  | 'retention_workflow'

export type WorkflowStatus = 
  | 'active'
  | 'paused'
  | 'testing'
  | 'archived'

export interface WorkflowTrigger {
  triggerId: string
  type: TriggerType
  condition: string
  parameters: any
}

export interface WorkflowAction {
  actionId: string
  type: ActionType
  configuration: any
  delay?: number // minutes
}

export interface WorkflowCondition {
  conditionId: string
  logic: string
  variables: string[]
  result?: boolean
}

export interface AutomationTrigger {
  triggerId: string
  name: string
  type: TriggerType
  conditions: TriggerCondition[]
  actions: string[] // actionIds
  performance: TriggerPerformance
  status: 'active' | 'paused' | 'disabled'
}

export interface TriggerPerformance {
  firings: number
  successRate: number
  averageExecutionTime: number
  lastFired: Date
  errors: TriggerError[]
}

export interface TriggerError {
  timestamp: Date
  error: string
  context: any
  resolved: boolean
}

export interface CommunicationSequence {
  sequenceId: string
  name: string
  type: SequenceType
  messages: SequenceMessage[]
  targeting: SequenceTargeting
  performance: CommunicationPerformance
  optimization: SequenceOptimization
  status: 'draft' | 'active' | 'paused' | 'completed'
}

export type SequenceType = 
  | 'welcome_series'
  | 'educational_series'
  | 'nurture_sequence'
  | 'reactivation_sequence'
  | 'onboarding_sequence'
  | 'retention_sequence'

export interface SequenceMessage {
  messageId: string
  order: number
  delay: number // hours from previous message or sequence start
  channel: string
  template: string
  conditions?: MessageCondition[]
  personalization: MessagePersonalization
}

export interface MessageCondition {
  condition: string
  action: 'send' | 'skip' | 'substitute' | 'delay'
  parameters?: any
}

export interface MessagePersonalization {
  level: 'basic' | 'advanced' | 'ai_generated'
  elements: PersonalizationElement[]
  rules: PersonalizationRule[]
}

export interface PersonalizationElement {
  element: PersonalizationType
  source: VariableSource
  fallback: string
  priority: number
}

export interface SequenceTargeting {
  segments: string[]
  exclusions: string[]
  dynamicCriteria: TargetingCriteria[]
  frequency: TargetingFrequency
}

export interface TargetingCriteria {
  field: string
  operator: string
  value: any
  weight: number
}

export interface TargetingFrequency {
  maxMessages: number
  timeframe: number // days
  priority: 'respect_global' | 'sequence_priority'
}

export interface CommunicationPerformance {
  sent: number
  delivered: number
  opened: number
  clicked: number
  converted: number
  unsubscribed: number
  complained: number
  rates: CommunicationRates
}

export interface CommunicationRates {
  deliveryRate: number
  openRate: number
  clickRate: number
  conversionRate: number
  unsubscribeRate: number
  complaintRate: number
}

export interface AutomationRule {
  ruleId: string
  name: string
  priority: number
  conditions: RuleCondition[]
  actions: RuleAction[]
  schedule: RuleSchedule
  performance: RulePerformance
  status: 'active' | 'inactive' | 'testing'
}

export interface RuleCondition {
  field: string
  operator: string
  value: any
  logic: 'and' | 'or'
}

export interface RuleAction {
  action: string
  parameters: any
  delay?: number // minutes
  conditions?: ActionCondition[]
}

export interface ActionCondition {
  condition: string
  requirement: 'met' | 'not_met'
}

export interface RuleSchedule {
  type: 'immediate' | 'scheduled' | 'recurring'
  schedule?: string // cron expression
  timezone?: string
  enabled: boolean
}

export interface AutomationAnalytics {
  overview: AnalyticsOverview
  campaigns: CampaignAnalytics[]
  workflows: WorkflowAnalytics[]
  performance: PerformanceAnalytics
  insights: AnalyticsInsight[]
}

export interface AnalyticsOverview {
  totalCampaigns: number
  activeCampaigns: number
  totalContacts: number
  totalRevenue: number
  averageROI: number
  trends: OverviewTrend[]
}

export interface OverviewTrend {
  metric: string
  period: string
  value: number
  change: number
  forecast: number
}

export interface CampaignAnalytics {
  campaignId: string
  metrics: AnalyticsMetric[]
  segments: SegmentAnalytics[]
  attribution: CampaignAttribution
  recommendations: AnalyticsRecommendation[]
}

export interface AnalyticsMetric {
  name: string
  value: number
  target?: number
  benchmark?: number
  trend: AnalyticsTrend
}

export interface AnalyticsTrend {
  direction: 'up' | 'down' | 'stable'
  magnitude: number
  period: string
  significance: number
}

export interface SegmentAnalytics {
  segment: string
  performance: SegmentMetric[]
  insights: SegmentInsight[]
}

export interface SegmentInsight {
  insight: string
  confidence: number
  recommendation: string
}

export interface CampaignAttribution {
  channels: ChannelAttribution[]
  touchpoints: TouchpointAttribution[]
  conversion: ConversionAttribution
}

export interface ChannelAttribution {
  channel: string
  attribution: number
  cost: number
  roi: number
  efficiency: number
}

export interface ConversionAttribution {
  direct: number
  assisted: number
  influencer: number
  total: number
}

export interface AnalyticsRecommendation {
  type: 'optimization' | 'expansion' | 'budget' | 'targeting'
  recommendation: string
  confidence: number
  impact: number
  effort: 'low' | 'medium' | 'high'
}

export interface WorkflowAnalytics {
  workflowId: string
  executions: ExecutionAnalytics
  performance: WorkflowPerformanceAnalytics
  bottlenecks: WorkflowBottleneck[]
  optimization: WorkflowOptimization
}

export interface ExecutionAnalytics {
  total: number
  successful: number
  failed: number
  avgDuration: number
  trends: ExecutionTrend[]
}

export interface ExecutionTrend {
  period: string
  executions: number
  successRate: number
  avgDuration: number
}

export interface WorkflowPerformanceAnalytics {
  efficiency: number
  reliability: number
  cost: number
  userSatisfaction: number
  insights: WorkflowInsight[]
}

export interface WorkflowInsight {
  insight: string
  data: any
  confidence: number
  actionable: boolean
}

export interface PerformanceAnalytics {
  overall: OverallPerformance
  trends: PerformanceTrend[]
  comparisons: PerformanceComparison[]
  forecasts: PerformanceForecast[]
}

export interface OverallPerformance {
  efficiency: number
  effectiveness: number
  roi: number
  satisfaction: number
  growth: number
}

export interface PerformanceComparison {
  metric: string
  current: number
  previous: number
  benchmark: number
  industry: number
}

export interface PerformanceForecast {
  metric: string
  forecast: ForecastData[]
  confidence: number
  factors: ForecastFactor[]
}

export interface ForecastData {
  period: string
  value: number
  confidence: number
}

export interface AnalyticsInsight {
  insightId: string
  type: InsightType
  insight: string
  confidence: number
  impact: number
  data: any
  recommendations: InsightRecommendation[]
  created: Date
}

export type InsightType = 
  | 'performance'
  | 'optimization'
  | 'trend'
  | 'anomaly'
  | 'opportunity'
  | 'risk'

export interface InsightRecommendation {
  recommendation: string
  priority: number
  effort: 'low' | 'medium' | 'high'
  impact: number
  timeline: string
}

// Automation Engine Implementation
export class SmartAutomationEngine {
  private campaigns: Map<string, SmartCampaign> = new Map()
  private workflows: Map<string, AutomationWorkflow> = new Map()
  private rules: Map<string, AutomationRule> = new Map()
  private analytics: AutomationAnalytics

  constructor() {
    this.analytics = this.initializeAnalytics()
    this.initializeDefaultCampaigns()
    this.initializeDefaultWorkflows()
    this.initializeDefaultRules()
  }

  /**
   * Create and launch an intelligent campaign
   */
  async createSmartCampaign(
    config: CampaignConfig,
    leads: (EnhancedPersonCard | EnhancedCompanyCard)[],
    intelligence: {
      temporal?: TemporalIntelligence[]
      predictive?: PredictiveScore[]
      behavioral?: BehavioralProfile[]
      competitive?: CompetitiveIntelligence[]
    }
  ): Promise<SmartCampaign> {
    const campaignId = this.generateCampaignId()
    
    // Build smart targeting based on AI intelligence
    const targeting = await this.buildSmartTargeting(config, leads, intelligence)
    
    // Create dynamic messaging with AI personalization
    const messaging = await this.createDynamicMessaging(config, intelligence)
    
    // Set up channel orchestration
    const channels = this.setupChannelOrchestration(config, intelligence)
    
    // Configure automation rules
    const automation = this.configureAutomation(config, intelligence)
    
    // Initialize performance tracking
    const performance = this.initializeCampaignPerformance(campaignId)
    
    // Set up optimization
    const optimization = this.setupCampaignOptimization(config)
    
    const campaign: SmartCampaign = {
      campaignId,
      name: config.name,
      type: config.type,
      status: 'active',
      targeting,
      messaging,
      channels,
      automation,
      performance,
      optimization,
      created: new Date(),
      lastOptimized: new Date()
    }
    
    this.campaigns.set(campaignId, campaign)
    
    // Launch the campaign
    await this.launchCampaign(campaign)
    
    return campaign
  }

  /**
   * Process automation triggers
   */
  async processTriggers(
    lead: EnhancedPersonCard | EnhancedCompanyCard,
    event: AutomationEvent,
    context?: any
  ): Promise<TriggerResult[]> {
    const results: TriggerResult[] = []
    
    // Find matching triggers
    const matchingTriggers = this.findMatchingTriggers(lead, event, context)
    
    // Execute triggers in priority order
    for (const trigger of matchingTriggers) {
      try {
        const result = await this.executeTrigger(trigger, lead, event, context)
        results.push(result)
      } catch (error) {
        results.push({
          triggerId: trigger.triggerId,
          success: false,
          error: error.message,
          timestamp: new Date()
        })
      }
    }
    
    return results
  }

  /**
   * Optimize campaigns based on performance data
   */
  async optimizeCampaigns(): Promise<OptimizationResult[]> {
    const results: OptimizationResult[] = []
    
    for (const [campaignId, campaign] of this.campaigns) {
      if (campaign.status === 'active' && campaign.optimization.enabled) {
        const optimizationResult = await this.optimizeCampaign(campaign)
        results.push(optimizationResult)
      }
    }
    
    return results
  }

  // Helper methods (simplified implementations)
  private generateCampaignId(): string {
    return `campaign_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  private async buildSmartTargeting(
    config: CampaignConfig,
    leads: any[],
    intelligence: any
  ): Promise<SmartTargeting> {
    // Implementation for smart targeting logic
    return {
      segments: [],
      exclusions: [],
      dynamicFilters: [],
      aiRecommendations: [],
      targetSize: leads.length,
      refreshFrequency: 'daily'
    }
  }

  private async createDynamicMessaging(
    config: CampaignConfig,
    intelligence: any
  ): Promise<DynamicMessaging> {
    // Implementation for dynamic messaging
    return {
      templates: [],
      personalization: {
        rules: [],
        aiModels: [],
        dynamicContent: [],
        contextualAdaptation: []
      },
      aiGeneration: {
        enabled: true,
        models: [],
        generationRules: [],
        qualityControl: {
          enabled: true,
          checks: [],
          approvalThreshold: 0.8,
          humanReviewTriggers: []
        },
        humanReview: false
      },
      variations: [],
      optimization: {
        enabled: true,
        optimizationGoals: [],
        algorithms: [],
        constraints: [],
        schedule: {
          frequency: 'daily',
          minDataPoints: 100,
          cooldownPeriod: 24,
          maxChangesPerPeriod: 3
        }
      }
    }
  }

  private setupChannelOrchestration(config: CampaignConfig, intelligence: any): ChannelOrchestration {
    // Implementation for channel orchestration
    return {
      channels: [],
      sequencing: [],
      crossChannelRules: [],
      optimization: {
        enabled: true,
        objectives: [],
        constraints: [],
        algorithm: {
          algorithm: 'bayesian',
          parameters: {},
          performance: {
            convergenceRate: 0.85,
            stability: 0.92,
            generalization: 0.78,
            lastEvaluation: new Date()
          }
        },
        performance: {
          improvement: 15,
          stability: 0.88,
          convergence: 0.82,
          lastOptimization: new Date()
        }
      }
    }
  }

  private configureAutomation(config: CampaignConfig, intelligence: any): CampaignAutomation {
    // Implementation for automation configuration
    return {
      triggers: [],
      workflows: [],
      conditions: [],
      actions: [],
      monitoring: {
        metrics: [],
        alerts: [],
        dashboards: [],
        reporting: {
          reports: [],
          distribution: [],
          schedule: {
            frequency: 'weekly',
            time: '09:00',
            timezone: 'Europe/Rome'
          }
        }
      }
    }
  }

  private initializeCampaignPerformance(campaignId: string): CampaignPerformance {
    // Implementation for performance initialization
    return {
      metrics: [],
      kpis: [],
      segments: [],
      attribution: {
        models: [],
        touchpoints: [],
        journey: {
          paths: [],
          stages: [],
          optimization: {
            recommendations: [],
            experiments: [],
            insights: []
          }
        },
        insights: []
      },
      optimization: {
        enabled: true,
        algorithms: [],
        objectives: [],
        constraints: [],
        results: []
      }
    }
  }

  private setupCampaignOptimization(config: CampaignConfig): CampaignOptimization {
    // Implementation for optimization setup
    return {
      autoOptimization: true,
      optimizationRules: [],
      learningAlgorithms: [],
      humanOverrides: [],
      performance: {
        improvement: 0,
        stability: 1,
        convergence: 1,
        lastOptimization: new Date()
      }
    }
  }

  private async launchCampaign(campaign: SmartCampaign): Promise<void> {
    // Implementation for campaign launch
    console.log(`Launching campaign: ${campaign.name}`)
  }

  private findMatchingTriggers(lead: any, event: AutomationEvent, context?: any): AutomationTrigger[] {
    // Implementation for finding matching triggers
    return []
  }

  private async executeTrigger(
    trigger: AutomationTrigger,
    lead: any,
    event: AutomationEvent,
    context?: any
  ): Promise<TriggerResult> {
    // Implementation for trigger execution
    return {
      triggerId: trigger.triggerId,
      success: true,
      timestamp: new Date()
    }
  }

  private async optimizeCampaign(campaign: SmartCampaign): Promise<OptimizationResult> {
    // Implementation for campaign optimization
    return {
      timestamp: new Date(),
      objective: 'conversion_rate',
      improvement: 12.5,
      confidence: 0.85,
      changes: []
    }
  }

  private initializeAnalytics(): AutomationAnalytics {
    // Implementation for analytics initialization
    return {
      overview: {
        totalCampaigns: 0,
        activeCampaigns: 0,
        totalContacts: 0,
        totalRevenue: 0,
        averageROI: 0,
        trends: []
      },
      campaigns: [],
      workflows: [],
      performance: {
        overall: {
          efficiency: 0,
          effectiveness: 0,
          roi: 0,
          satisfaction: 0,
          growth: 0
        },
        trends: [],
        comparisons: [],
        forecasts: []
      },
      insights: []
    }
  }

  private initializeDefaultCampaigns(): void {
    // Implementation for default campaigns
  }

  private initializeDefaultWorkflows(): void {
    // Implementation for default workflows
  }

  private initializeDefaultRules(): void {
    // Implementation for default rules
  }
}

// Supporting interfaces
export interface CampaignConfig {
  name: string
  type: CampaignType
  objectives: string[]
  budget?: number
  duration?: number
  channels: string[]
  targeting?: any
  messaging?: any
  automation?: any
}

export interface AutomationEvent {
  eventId: string
  type: string
  timestamp: Date
  data: any
  source: string
}

export interface TriggerResult {
  triggerId: string
  success: boolean
  error?: string
  data?: any
  timestamp: Date
}

// Export singleton instance
export const automationEngine = new SmartAutomationEngine()

// Utility functions
export const createCampaign = async (
  config: CampaignConfig,
  leads: (EnhancedPersonCard | EnhancedCompanyCard)[],
  intelligence?: any
): Promise<SmartCampaign> => {
  return automationEngine.createSmartCampaign(config, leads, intelligence || {})
}

export const triggerAutomation = async (
  lead: EnhancedPersonCard | EnhancedCompanyCard,
  eventType: string,
  data: any
): Promise<TriggerResult[]> => {
  const event: AutomationEvent = {
    eventId: `event_${Date.now()}`,
    type: eventType,
    timestamp: new Date(),
    data,
    source: 'manual'
  }
  return automationEngine.processTriggers(lead, event)
}

// Campaign type configurations
export const CAMPAIGN_TEMPLATES = {
  lead_nurturing: {
    duration: 90, // days
    touchpoints: 8,
    channels: ['email', 'linkedin'],
    goals: ['engagement', 'education', 'conversion']
  },
  competitor_intercept: {
    duration: 30,
    touchpoints: 5,
    channels: ['phone', 'email'],
    goals: ['urgency', 'comparison', 'switching']
  },
  life_event_trigger: {
    duration: 14,
    touchpoints: 3,
    channels: ['phone', 'email'],
    goals: ['relevance', 'timing', 'immediate_need']
  }
} as const