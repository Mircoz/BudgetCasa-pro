'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Phone, 
  Mail, 
  Calendar, 
  Clock, 
  AlertTriangle,
  TrendingUp,
  Euro,
  ArrowRight,
  Zap,
  Target
} from 'lucide-react'
import { ActionIntelligence } from '@/lib/action-intelligence'

interface ActionPriorityWidgetProps {
  priorities: PriorityAction[]
  className?: string
}

interface PriorityAction {
  id: string
  leadName: string
  leadType: 'person' | 'company'
  leadScore: number
  urgencyScore: number
  revenueOpportunity: number
  nextAction: {
    type: 'call_immediate' | 'call_scheduled' | 'email_personalized' | 'meeting_request'
    priority: 1 | 2 | 3
    timing: 'immediate' | 'same_day' | 'this_week'
    reason: string
    dueDate?: Date
  }
  location: string
  riskFactors?: string[]
  successProbability: number
  deadline?: Date
}

const ACTION_ICONS = {
  call_immediate: Phone,
  call_scheduled: Phone,
  email_personalized: Mail,
  meeting_request: Calendar
}

const ACTION_COLORS = {
  call_immediate: 'bg-red-500 text-white',
  call_scheduled: 'bg-blue-500 text-white', 
  email_personalized: 'bg-green-500 text-white',
  meeting_request: 'bg-purple-500 text-white'
}

const PRIORITY_COLORS = {
  1: 'border-red-500 bg-red-50',
  2: 'border-orange-500 bg-orange-50',
  3: 'border-yellow-500 bg-yellow-50'
}

const URGENCY_LABELS = {
  immediate: { label: 'ORA', color: 'destructive' },
  same_day: { label: 'OGGI', color: 'destructive' },
  this_week: { label: 'SETTIMANA', color: 'secondary' }
}

// Mock data for demonstration
const mockPriorities: PriorityAction[] = [
  {
    id: '1',
    leadName: 'Maria Rossi',
    leadType: 'person',
    leadScore: 94,
    urgencyScore: 95,
    revenueOpportunity: 3200,
    nextAction: {
      type: 'call_immediate',
      priority: 1,
      timing: 'immediate',
      reason: 'Neonato nato, acquisto casa in corso',
      dueDate: new Date(Date.now() + 2 * 60 * 60 * 1000) // 2 hours from now
    },
    location: 'Milano, Navigli',
    riskFactors: ['Competitor Generali contatto previsto'],
    successProbability: 87,
    deadline: new Date(Date.now() + 2 * 60 * 60 * 1000)
  },
  {
    id: '2',
    leadName: 'TechStart SRL',
    leadType: 'company',
    leadScore: 89,
    urgencyScore: 82,
    revenueOpportunity: 12500,
    nextAction: {
      type: 'meeting_request',
      priority: 1,
      timing: 'same_day',
      reason: '25 dipendenti, ufficio nuovo, growth rapida',
      dueDate: new Date(Date.now() + 8 * 60 * 60 * 1000)
    },
    location: 'Roma, EUR',
    successProbability: 76,
    deadline: new Date(Date.now() + 24 * 60 * 60 * 1000)
  },
  {
    id: '3',
    leadName: 'Giuseppe Bianchi',
    leadType: 'person',
    leadScore: 85,
    urgencyScore: 78,
    revenueOpportunity: 2800,
    nextAction: {
      type: 'call_scheduled',
      priority: 2,
      timing: 'same_day',
      reason: 'Cambio lavoro, nuove esigenze assicurative',
      dueDate: new Date(Date.now() + 6 * 60 * 60 * 1000)
    },
    location: 'Napoli, Vomero',
    successProbability: 82
  },
  {
    id: '4',
    leadName: 'Laura Verdi',
    leadType: 'person',
    leadScore: 78,
    urgencyScore: 72,
    revenueOpportunity: 1900,
    nextAction: {
      type: 'email_personalized',
      priority: 2,
      timing: 'this_week',
      reason: 'Travel lifestyle, sport attività',
      dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
    },
    location: 'Torino, Centro',
    successProbability: 65
  },
  {
    id: '5',
    leadName: 'Costruzioni Italia',
    leadType: 'company',
    leadScore: 82,
    urgencyScore: 68,
    revenueOpportunity: 8900,
    nextAction: {
      type: 'call_scheduled',
      priority: 3,
      timing: 'this_week',
      reason: 'Cantieri multipli, risk assessment richiesto'
    },
    location: 'Milano, Porta Nuova',
    successProbability: 71
  }
]

const formatTimeRemaining = (deadline: Date): string => {
  const now = new Date()
  const diffMs = deadline.getTime() - now.getTime()
  
  if (diffMs < 0) return 'SCADUTO'
  
  const hours = Math.floor(diffMs / (1000 * 60 * 60))
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))
  
  if (hours < 1) {
    return `${minutes}min`
  } else if (hours < 24) {
    return `${hours}h ${minutes}min`
  } else {
    const days = Math.floor(hours / 24)
    return `${days}g ${hours % 24}h`
  }
}

export function ActionPriorityWidget({ priorities = mockPriorities, className }: ActionPriorityWidgetProps) {
  // Sort by urgency score and priority
  const sortedPriorities = priorities
    .sort((a, b) => {
      if (a.nextAction.priority !== b.nextAction.priority) {
        return a.nextAction.priority - b.nextAction.priority
      }
      return b.urgencyScore - a.urgencyScore
    })
    .slice(0, 5) // Show top 5

  const totalRevenue = priorities.reduce((sum, p) => sum + p.revenueOpportunity, 0)
  const immediateActions = priorities.filter(p => p.nextAction.timing === 'immediate').length
  const avgSuccessRate = priorities.reduce((sum, p) => sum + p.successProbability, 0) / priorities.length

  return (
    <div className={className}>
      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <Card className="bg-red-50 border-red-200">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <div>
                <div className="text-2xl font-bold text-red-700">{immediateActions}</div>
                <div className="text-sm text-red-600">Azioni Immediate</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Euro className="h-5 w-5 text-green-600" />
              <div>
                <div className="text-2xl font-bold text-green-700">€{(totalRevenue / 1000).toFixed(0)}K</div>
                <div className="text-sm text-green-600">Revenue Oggi</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Target className="h-5 w-5 text-blue-600" />
              <div>
                <div className="text-2xl font-bold text-blue-700">{Math.round(avgSuccessRate)}%</div>
                <div className="text-sm text-blue-600">Success Rate</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Priority Actions List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center space-x-2">
              <Zap className="h-5 w-5 text-yellow-500" />
              <span>🎯 PRIORITÀ OGGI</span>
            </span>
            <Badge variant="destructive" className="font-normal">
              {immediateActions} urgenti
            </Badge>
          </CardTitle>
          <CardDescription>
            Azioni prioritarie basate su AI intelligence e timing ottimale
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {sortedPriorities.map((priority) => {
            const ActionIcon = ACTION_ICONS[priority.nextAction.type]
            const urgencyLabel = URGENCY_LABELS[priority.nextAction.timing]
            
            return (
              <div
                key={priority.id}
                className={`p-4 rounded-lg border-l-4 ${PRIORITY_COLORS[priority.nextAction.priority]} hover:shadow-md transition-shadow cursor-pointer`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-full ${ACTION_COLORS[priority.nextAction.type]}`}>
                      <ActionIcon className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="font-semibold text-lg">
                        {priority.leadName}
                        <Badge variant="outline" className="ml-2 text-xs">
                          {priority.leadType === 'person' ? '👤' : '🏢'}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        📍 {priority.location}
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right space-y-1">
                    <div className="flex items-center space-x-2">
                      <Badge className={`text-xs ${urgencyLabel.color === 'destructive' ? 'bg-red-500 text-white' : 'bg-gray-500 text-white'}`}>
                        {urgencyLabel.label}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {priority.leadScore}/100
                      </Badge>
                    </div>
                    {priority.deadline && (
                      <div className="text-xs text-red-600 font-medium">
                        ⏰ {formatTimeRemaining(priority.deadline)}
                      </div>
                    )}
                  </div>
                </div>

                <div className="mb-3">
                  <div className="text-sm font-medium text-gray-700 mb-1">
                    🎯 {priority.nextAction.reason}
                  </div>
                  {priority.riskFactors && priority.riskFactors.length > 0 && (
                    <div className="text-xs text-orange-600 bg-orange-50 p-2 rounded">
                      ⚠️ {priority.riskFactors[0]}
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-sm">
                    <span className="flex items-center space-x-1">
                      <Euro className="h-4 w-4 text-green-600" />
                      <span className="font-medium text-green-700">€{priority.revenueOpportunity.toLocaleString()}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <TrendingUp className="h-4 w-4 text-blue-600" />
                      <span className="font-medium">{priority.successProbability}%</span>
                    </span>
                  </div>
                  
                  <Button size="sm" variant="default" className="group">
                    <span className="mr-2">
                      {priority.nextAction.type === 'call_immediate' && 'Chiama'}
                      {priority.nextAction.type === 'call_scheduled' && 'Pianifica'}
                      {priority.nextAction.type === 'email_personalized' && 'Email'}
                      {priority.nextAction.type === 'meeting_request' && 'Meeting'}
                    </span>
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </div>
            )
          })}
        </CardContent>
      </Card>
    </div>
  )
}