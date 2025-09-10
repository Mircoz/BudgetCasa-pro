'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { 
  Phone, 
  Mail, 
  Calendar, 
  Clock, 
  Target,
  User,
  Building,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  Euro,
  Send,
  Copy,
  Edit,
  Play,
  Pause,
  X
} from 'lucide-react'
import type { ActionIntelligence } from '@/lib/action-intelligence'
import type { PersonCard, CompanyCard } from '@/lib/types'

interface NextActionPanelProps {
  lead: (PersonCard | CompanyCard) & {
    criticalInfo?: {
      leadScore?: number
      nextAction?: string
      revenueOpportunity?: number
      urgencyScore?: number
    }
  }
  actionIntelligence?: ActionIntelligence
  onExecuteAction?: (actionType: string, notes?: string) => void
  onScheduleAction?: (actionType: string, scheduledFor: Date, notes?: string) => void
  onDismiss?: () => void
  className?: string
}

// Mock action intelligence for demonstration
const getMockActionIntelligence = (lead: any): ActionIntelligence => {
  const isCompany = 'ateco' in lead
  const leadScore = lead.criticalInfo?.leadScore || 75
  const urgencyScore = lead.criticalInfo?.urgencyScore || 70
  
  return {
    recommendedAction: {
      type: urgencyScore > 80 ? 'call_immediate' : leadScore > 85 ? 'call_scheduled' : 'email_personalized',
      priority: urgencyScore > 80 ? 1 : leadScore > 80 ? 2 : 3,
      confidence: Math.min(95, leadScore + 10),
      reasoning: [
        urgencyScore > 80 ? 'Time-sensitive opportunity window' : 'High engagement signals',
        isCompany ? 'Business decision maker identified' : 'Personal life event trigger',
        'Competitive advantage window open'
      ],
      expectedOutcome: [{
        outcome: 'Initial meeting scheduled',
        probability: leadScore,
        timeline: '3-7 days',
        value: lead.criticalInfo?.revenueOpportunity || 2500,
        requirements: ['Decision maker contact', 'Value proposition presentation']
      }],
      alternatives: []
    },
    timing: {
      recommended: urgencyScore > 80 ? 'immediate' : 'this_week',
      urgencyScore: urgencyScore,
      seasonalFactors: [],
      competitivePressure: 65
    },
    approach: {
      primaryChannel: urgencyScore > 80 ? 'phone_warm' : 'email_personalized',
      backupChannels: ['linkedin_message'],
      personalizedMessage: {
        opening: isCompany 
          ? `Ciao ${lead.name}, ho notato la crescita della vostra azienda` 
          : `Ciao ${lead.name || 'Lead'}, congratulazioni per il recente cambiamento`,
        valueProposition: isCompany
          ? 'Possiamo ottimizzare i vostri costi assicurativi business del 25%'
          : 'Posso aiutarti a risparmiare sui premi assicurativi mantenendo la stessa copertura',
        callToAction: 'Ti va una chiamata di 15 minuti questa settimana?',
        personalElements: [],
        urgencyTriggers: []
      },
      timing: {
        preferredDays: ['Monday', 'Tuesday', 'Wednesday'],
        preferredHours: ['10:00-12:00', '14:00-17:00'],
        timeZone: 'Europe/Rome',
        avoidPeriods: [],
        bestTimeScore: 85
      },
      followUpStrategy: {
        sequence: [],
        totalDuration: 14,
        escalationTriggers: [],
        fallbackStrategy: 'Move to nurture campaign'
      }
    },
    successPrediction: {
      conversionProbability: leadScore,
      timeToConversion: 14,
      expectedRevenue: {
        immediate: lead.criticalInfo?.revenueOpportunity || 2500,
        lifetime: (lead.criticalInfo?.revenueOpportunity || 2500) * 5,
        additionalProducts: [],
        referralPotential: 800
      },
      confidenceInterval: { min: leadScore - 15, max: Math.min(95, leadScore + 10) },
      keySuccessFactors: [],
      riskFactors: []
    },
    riskAssessment: {
      overallRisk: 'low',
      specificRisks: [],
      mitigationStrategies: [],
      contingencyPlans: []
    }
  }
}

const ACTION_CONFIG = {
  call_immediate: {
    icon: Phone,
    label: 'Chiama Subito',
    color: 'bg-red-600 hover:bg-red-700',
    description: 'Chiamata immediata alta priorità'
  },
  call_scheduled: {
    icon: Calendar,
    label: 'Pianifica Chiamata',
    color: 'bg-blue-600 hover:bg-blue-700',
    description: 'Programma chiamata nel timing ottimale'
  },
  email_personalized: {
    icon: Mail,
    label: 'Email Personalizzata',
    color: 'bg-green-600 hover:bg-green-700',
    description: 'Email mirata con elementi personali'
  },
  meeting_request: {
    icon: Calendar,
    label: 'Richiesta Meeting',
    color: 'bg-purple-600 hover:bg-purple-700',
    description: 'Meeting face-to-face o videoconferenza'
  }
}

const PRIORITY_LABELS = {
  1: { label: 'CRITICA', color: 'bg-red-600 text-white' },
  2: { label: 'ALTA', color: 'bg-orange-600 text-white' },
  3: { label: 'MEDIA', color: 'bg-blue-600 text-white' }
}

export function NextActionPanel({ 
  lead, 
  actionIntelligence, 
  onExecuteAction, 
  onScheduleAction,
  onDismiss,
  className 
}: NextActionPanelProps) {
  const [isExecuting, setIsExecuting] = useState(false)
  const [notes, setNotes] = useState('')
  const [scheduledFor, setScheduledFor] = useState('')
  const [customMessage, setCustomMessage] = useState('')
  const [showCustomization, setShowCustomization] = useState(false)

  const intelligence = actionIntelligence || getMockActionIntelligence(lead)
  const isCompany = 'ateco' in lead
  const actionConfig = ACTION_CONFIG[intelligence.recommendedAction.type as keyof typeof ACTION_CONFIG]
  const ActionIcon = actionConfig.icon
  const priorityConfig = PRIORITY_LABELS[intelligence.recommendedAction.priority]

  // Initialize custom message with AI-generated suggestion
  if (!customMessage && intelligence.approach.personalizedMessage) {
    const msg = intelligence.approach.personalizedMessage
    setCustomMessage(`${msg.opening}\n\n${msg.valueProposition}\n\n${msg.callToAction}`)
  }

  const handleExecuteAction = async () => {
    setIsExecuting(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API call
      onExecuteAction?.(intelligence.recommendedAction.type, notes)
    } finally {
      setIsExecuting(false)
    }
  }

  const handleScheduleAction = () => {
    if (!scheduledFor) return
    onScheduleAction?.(intelligence.recommendedAction.type, new Date(scheduledFor), notes)
  }

  const copyMessage = () => {
    navigator.clipboard.writeText(customMessage)
  }

  const formatTimeRemaining = (urgencyScore: number) => {
    if (urgencyScore >= 90) return 'Entro 2 ore'
    if (urgencyScore >= 80) return 'Entro oggi'
    if (urgencyScore >= 70) return 'Entro 2 giorni'
    return 'Questa settimana'
  }

  return (
    <div className={className}>
      <Card className="border-l-4 border-l-blue-500">
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <div className={`p-3 rounded-full ${actionConfig.color} text-white`}>
                <ActionIcon className="h-6 w-6" />
              </div>
              <div>
                <CardTitle className="flex items-center space-x-2">
                  <span>🎯 Next Action: {actionConfig.label}</span>
                  <Badge className={priorityConfig.color}>
                    Priorità {priorityConfig.label}
                  </Badge>
                </CardTitle>
                <CardDescription className="flex items-center space-x-4 mt-1">
                  <span className="flex items-center space-x-1">
                    {isCompany ? <Building className="h-4 w-4" /> : <User className="h-4 w-4" />}
                    <span>{lead.name}</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>{formatTimeRemaining(intelligence.timing.urgencyScore)}</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <Euro className="h-4 w-4 text-green-600" />
                    <span className="font-medium">€{intelligence.successPrediction.expectedRevenue.immediate.toLocaleString()}</span>
                  </span>
                </CardDescription>
              </div>
            </div>
            {onDismiss && (
              <Button variant="ghost" size="sm" onClick={onDismiss}>
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* AI Reasoning */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-800 mb-2 flex items-center">
              <Target className="h-4 w-4 mr-1" />
              Perché Questa Azione ({intelligence.recommendedAction.confidence}% confidenza)
            </h4>
            <ul className="space-y-1">
              {intelligence.recommendedAction.reasoning.map((reason, index) => (
                <li key={index} className="text-sm text-blue-700 flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  <span>{reason}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Success Prediction */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {intelligence.successPrediction.conversionProbability}%
              </div>
              <div className="text-sm text-green-700">Success Rate</div>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {intelligence.successPrediction.timeToConversion}
              </div>
              <div className="text-sm text-purple-700">Giorni a Conversione</div>
            </div>
            <div className="text-center p-3 bg-yellow-50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">
                €{(intelligence.successPrediction.expectedRevenue.lifetime / 1000).toFixed(0)}K
              </div>
              <div className="text-sm text-yellow-700">Lifetime Value</div>
            </div>
          </div>

          {/* Personalized Message */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-base font-medium">📝 Messaggio Personalizzato AI</Label>
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={copyMessage}
                  className="flex items-center space-x-1"
                >
                  <Copy className="h-4 w-4" />
                  <span>Copia</span>
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setShowCustomization(!showCustomization)}
                  className="flex items-center space-x-1"
                >
                  <Edit className="h-4 w-4" />
                  <span>{showCustomization ? 'Nascondi' : 'Modifica'}</span>
                </Button>
              </div>
            </div>
            
            {showCustomization ? (
              <Textarea
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                placeholder="Personalizza il messaggio..."
                rows={6}
                className="text-sm"
              />
            ) : (
              <div className="p-3 bg-gray-50 rounded-lg border text-sm whitespace-pre-line">
                {customMessage}
              </div>
            )}
          </div>

          {/* Timing & Notes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="notes">📋 Note Interne</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Aggiungi note per il follow-up..."
                rows={3}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="schedule">📅 Programma per (opzionale)</Label>
              <Input
                id="schedule"
                type="datetime-local"
                value={scheduledFor}
                onChange={(e) => setScheduledFor(e.target.value)}
                min={new Date().toISOString().slice(0, 16)}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-3 pt-4 border-t">
            <Button 
              className={`${actionConfig.color} text-white flex-1`}
              onClick={handleExecuteAction}
              disabled={isExecuting}
            >
              {isExecuting ? (
                <>
                  <Pause className="h-4 w-4 mr-2 animate-spin" />
                  Eseguendo...
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-2" />
                  Esegui Ora
                </>
              )}
            </Button>
            
            {scheduledFor && (
              <Button 
                variant="outline"
                onClick={handleScheduleAction}
                className="flex items-center space-x-2"
              >
                <Calendar className="h-4 w-4" />
                <span>Programma</span>
              </Button>
            )}

            <Button 
              variant="outline"
              onClick={onDismiss}
              className="flex items-center space-x-2"
            >
              <X className="h-4 w-4" />
              <span>Più tardi</span>
            </Button>
          </div>

          {/* Optimal Timing Hint */}
          {intelligence.approach.timing && (
            <div className="text-xs text-muted-foreground bg-yellow-50 border border-yellow-200 rounded p-2">
              💡 <strong>Timing ottimale:</strong> {intelligence.approach.timing.preferredDays.join(', ')} alle {intelligence.approach.timing.preferredHours.join(', ')}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}