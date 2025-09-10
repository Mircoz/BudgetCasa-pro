'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Brain, 
  Lightbulb, 
  TrendingUp, 
  AlertTriangle,
  Clock,
  Target,
  Zap,
  ChevronRight,
  Star
} from 'lucide-react'

interface IntelligentSuggestionsProps {
  suggestions?: AISuggestion[]
  className?: string
}

interface AISuggestion {
  id: string
  type: 'opportunity' | 'risk' | 'optimization' | 'timing' | 'competitive'
  title: string
  description: string
  impact: 'high' | 'medium' | 'low'
  urgency: 'immediate' | 'this_week' | 'this_month'
  confidence: number // 0-100
  revenueImpact?: number
  actionRequired: string
  reasoning: string[]
  relatedLeads?: string[]
  implementationTime?: string
  difficulty: 'easy' | 'medium' | 'hard'
}

// Mock intelligent suggestions
const mockSuggestions: AISuggestion[] = [
  {
    id: '1',
    type: 'opportunity',
    title: 'Intercettare Clienti Generali Insoddisfatti',
    description: 'AI ha identificato 342 clienti Generali con pattern di insoddisfazione nel quartiere Navigli',
    impact: 'high',
    urgency: 'immediate',
    confidence: 91,
    revenueImpact: 128000,
    actionRequired: 'Campagna outreach mirata entro 48h',
    reasoning: [
      'Social listening mostra lamentele su claims processing',
      'Competitor vulnerability window aperto per 15 giorni',
      'Tasso successo storico 84% su questo target'
    ],
    relatedLeads: ['Maria Rossi', 'Giuseppe Bianchi', '+340 altri'],
    implementationTime: '2-3 giorni',
    difficulty: 'easy'
  },
  {
    id: '2',
    type: 'timing',
    title: 'Life Event Window - Nascite Q4',
    description: 'Spike nascite previsto novembre-dicembre basato su trend demografici',
    impact: 'high',
    urgency: 'this_week',
    confidence: 87,
    revenueImpact: 89000,
    actionRequired: 'Pre-build nurture campaign per neo-genitori',
    reasoning: [
      'Correlazione nascite +9 mesi da febbraio (lockdown end)',
      'Life insurance sales peak 2-4 settimane post nascita',
      'Competitor prep ancora limitata'
    ],
    implementationTime: '1 settimana',
    difficulty: 'medium'
  },
  {
    id: '3',
    type: 'risk',
    title: 'Allianz Aggressive Pricing Milano',
    description: 'Competitor pricing 15% sotto market rate per auto insurance in Milano',
    impact: 'medium',
    urgency: 'this_week',
    confidence: 82,
    revenueImpact: -45000,
    actionRequired: 'Adjust pricing strategy o focus su value-add services',
    reasoning: [
      'Price war iniziata 10 giorni fa',
      'Customer churn rate +23% su auto insurance',
      'Margini nostri ancora sostenibili per 6 settimane'
    ],
    implementationTime: '3-5 giorni',
    difficulty: 'medium'
  },
  {
    id: '4',
    type: 'optimization',
    title: 'Email Timing Optimization',
    description: 'Martedì 10:30 ha 43% response rate vs media 18%',
    impact: 'medium',
    urgency: 'this_month',
    confidence: 94,
    revenueImpact: 23000,
    actionRequired: 'Reschedule email campaigns su timing ottimale',
    reasoning: [
      'A/B test su 2,400 emails mostra pattern chiaro',
      'Venerdì pomeriggio worst performance (4% response)',
      'Implementation facile, impatto immediato'
    ],
    implementationTime: '1 giorno',
    difficulty: 'easy'
  },
  {
    id: '5',
    type: 'competitive',
    title: 'UnipolSai Vuln Window',
    description: 'Servizio clienti UnipolSai in crisi, finestra opportunità aperta',
    impact: 'high',
    urgency: 'immediate',
    confidence: 88,
    revenueImpact: 156000,
    actionRequired: 'Campaign "switch assicuratore" immediata',
    reasoning: [
      'Sentiment analysis mostra -34% satisfaction vs 3 mesi fa',
      'Call center wait times aumentati 400%',
      'Switch rate competitor verso noi +67% ultimi 30gg'
    ],
    relatedLeads: ['TechStart SRL', 'Costruzioni Italia'],
    implementationTime: '1-2 giorni',
    difficulty: 'easy'
  }
]

const TYPE_CONFIG = {
  opportunity: {
    icon: TrendingUp,
    color: 'bg-green-500',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    label: 'Opportunità',
    textColor: 'text-green-700'
  },
  risk: {
    icon: AlertTriangle,
    color: 'bg-red-500',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    label: 'Rischio',
    textColor: 'text-red-700'
  },
  optimization: {
    icon: Target,
    color: 'bg-blue-500',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    label: 'Ottimizzazione',
    textColor: 'text-blue-700'
  },
  timing: {
    icon: Clock,
    color: 'bg-purple-500',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
    label: 'Timing',
    textColor: 'text-purple-700'
  },
  competitive: {
    icon: Zap,
    color: 'bg-orange-500',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200',
    label: 'Competitivo',
    textColor: 'text-orange-700'
  }
}

const URGENCY_CONFIG = {
  immediate: { label: 'IMMEDIATO', color: 'destructive' },
  this_week: { label: 'SETTIMANA', color: 'secondary' },
  this_month: { label: 'MESE', color: 'outline' }
}

const IMPACT_CONFIG = {
  high: { label: 'ALTO', color: 'bg-red-600 text-white' },
  medium: { label: 'MEDIO', color: 'bg-yellow-600 text-white' },
  low: { label: 'BASSO', color: 'bg-green-600 text-white' }
}

const DIFFICULTY_ICONS = {
  easy: '🟢',
  medium: '🟡', 
  hard: '🔴'
}

export function IntelligentSuggestions({ suggestions = mockSuggestions, className }: IntelligentSuggestionsProps) {
  // Sort by impact and urgency
  const sortedSuggestions = suggestions.sort((a, b) => {
    const impactScore = { high: 3, medium: 2, low: 1 }
    const urgencyScore = { immediate: 3, this_week: 2, this_month: 1 }
    
    const scoreA = impactScore[a.impact] + urgencyScore[a.urgency] + a.confidence / 100
    const scoreB = impactScore[b.impact] + urgencyScore[b.urgency] + b.confidence / 100
    
    return scoreB - scoreA
  })

  const highImpactCount = suggestions.filter(s => s.impact === 'high').length
  const immediateCount = suggestions.filter(s => s.urgency === 'immediate').length
  const totalRevenue = suggestions.reduce((sum, s) => sum + (s.revenueImpact || 0), 0)
  const avgConfidence = Math.round(suggestions.reduce((sum, s) => sum + s.confidence, 0) / suggestions.length)

  return (
    <div className={className}>
      {/* AI Intelligence Summary */}
      <Card className="mb-6 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Brain className="h-6 w-6 text-blue-600" />
            <span>🧠 AI INTELLIGENCE ENGINE</span>
          </CardTitle>
          <CardDescription className="flex items-center space-x-4">
            <span className="flex items-center space-x-1">
              <Star className="h-4 w-4 text-yellow-500" />
              <span>{highImpactCount} high-impact</span>
            </span>
            <span className="flex items-center space-x-1">
              <AlertTriangle className="h-4 w-4 text-red-500" />
              <span>{immediateCount} urgenti</span>
            </span>
            <span>Confidenza media: {avgConfidence}%</span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                €{(totalRevenue / 1000).toFixed(0)}K
              </div>
              <div className="text-sm text-muted-foreground">Revenue Impact Totale</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {suggestions.length}
              </div>
              <div className="text-sm text-muted-foreground">Suggerimenti Attivi</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Suggestions List */}
      <div className="space-y-4">
        {sortedSuggestions.map((suggestion) => {
          const config = TYPE_CONFIG[suggestion.type]
          const Icon = config.icon
          const urgencyConfig = URGENCY_CONFIG[suggestion.urgency]
          const impactConfig = IMPACT_CONFIG[suggestion.impact]
          
          return (
            <Card 
              key={suggestion.id} 
              className={`${config.bgColor} ${config.borderColor} hover:shadow-md transition-shadow cursor-pointer`}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start space-x-3">
                    <div className={`p-2 rounded-full ${config.color} text-white`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="font-semibold text-lg">{suggestion.title}</h3>
                        <Badge variant={urgencyConfig.color} className="text-xs">
                          {urgencyConfig.label}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {suggestion.description}
                      </p>
                      <div className="text-sm font-medium text-gray-700">
                        🎯 {suggestion.actionRequired}
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right space-y-2">
                    <div className="flex items-center space-x-2">
                      <Badge className={impactConfig.color} variant="secondary">
                        {impactConfig.label}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {suggestion.confidence}%
                      </Badge>
                    </div>
                    {suggestion.revenueImpact && (
                      <div className={`text-sm font-bold ${suggestion.revenueImpact > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {suggestion.revenueImpact > 0 ? '+' : ''}€{(Math.abs(suggestion.revenueImpact) / 1000).toFixed(0)}K
                      </div>
                    )}
                  </div>
                </div>

                {/* AI Reasoning */}
                <div className="mb-4 p-3 bg-white rounded-lg border border-gray-200">
                  <h4 className="text-sm font-medium mb-2 flex items-center">
                    <Lightbulb className="h-4 w-4 mr-1 text-yellow-500" />
                    AI Reasoning
                  </h4>
                  <ul className="space-y-1">
                    {suggestion.reasoning.map((reason, index) => (
                      <li key={index} className="text-xs text-gray-600">
                        • {reason}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Implementation Details */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    {suggestion.implementationTime && (
                      <span className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>{suggestion.implementationTime}</span>
                      </span>
                    )}
                    <span className="flex items-center space-x-1">
                      <span>{DIFFICULTY_ICONS[suggestion.difficulty]}</span>
                      <span className="capitalize">{suggestion.difficulty}</span>
                    </span>
                    {suggestion.relatedLeads && (
                      <span className="text-xs">
                        👥 {suggestion.relatedLeads.length} lead correlati
                      </span>
                    )}
                  </div>
                  
                  <Button size="sm" variant="default" className="group">
                    <span className="mr-2">Implementa</span>
                    <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>

                {/* Related Leads Preview */}
                {suggestion.relatedLeads && suggestion.relatedLeads.length > 0 && (
                  <div className="mt-3 p-2 bg-gray-50 rounded text-xs">
                    <span className="font-medium">Lead correlati: </span>
                    <span className="text-gray-600">
                      {suggestion.relatedLeads.slice(0, 2).join(', ')}
                      {suggestion.relatedLeads.length > 2 && ` +${suggestion.relatedLeads.length - 2} altri`}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}