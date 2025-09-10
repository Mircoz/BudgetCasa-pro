'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { 
  MapPin, 
  User, 
  Plus,
  Eye,
  Sparkles,
  Phone,
  Mail,
  Calendar,
  Clock,
  AlertTriangle,
  TrendingUp,
  Euro,
  ChevronDown,
  ChevronUp,
  Target,
  Zap,
  Heart,
  Home,
  Car,
  Info,
  Shield,
  Activity,
  Brain
} from 'lucide-react'
import type { PersonCard as PersonCardType } from '@/lib/types'
import type { EnhancedPersonCard } from '@/lib/enhanced-types'
import { formatPercentage, getScoreColor, getScoreLabel, formatCurrency } from '@/lib/utils'
import { LIFESTYLE_LABELS, MOBILITY_LABELS, POLICY_LABELS, ACTION_LABELS } from '@/lib/types'

interface EnhancedPersonCardProps {
  person: PersonCardType & Partial<EnhancedPersonCard>
  onAddToList?: () => void
  onViewSuggestions?: () => void
  onTakeAction?: (actionType: string) => void
  defaultExpanded?: boolean
}

export function EnhancedPersonCard({ 
  person, 
  onAddToList, 
  onViewSuggestions,
  onTakeAction,
  defaultExpanded = false 
}: EnhancedPersonCardProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded)
  const { scores, criticalInfo, b2c_engagement, demographics } = person
  const isB2CLead = person.id.startsWith('b2c_')

  // Calculate urgency color based on score
  const getUrgencyColor = (score: number) => {
    if (score >= 90) return 'bg-red-500 text-white'
    if (score >= 70) return 'bg-orange-500 text-white'
    if (score >= 50) return 'bg-yellow-500 text-black'
    return 'bg-green-500 text-white'
  }

  // Get next action icon
  const getActionIcon = (actionType?: string) => {
    switch (actionType) {
      case 'call_immediate':
      case 'call_scheduled':
        return <Phone className="h-4 w-4" />
      case 'email_personalized':
        return <Mail className="h-4 w-4" />
      case 'meeting_request':
        return <Calendar className="h-4 w-4" />
      default:
        return <Target className="h-4 w-4" />
    }
  }

  // Format time until deadline
  const formatTimeRemaining = (dateString?: string) => {
    if (!dateString) return null
    const deadline = new Date(dateString)
    const now = new Date()
    const diffMs = deadline.getTime() - now.getTime()
    
    if (diffMs < 0) return 'SCADUTO'
    
    const hours = Math.floor(diffMs / (1000 * 60 * 60))
    if (hours < 24) {
      return `${hours}h`
    } else {
      const days = Math.floor(hours / 24)
      return `${days}g`
    }
  }

  return (
    <Card className={`hover:shadow-md transition-all duration-200 ${isB2CLead ? 'ring-2 ring-red-100 bg-red-50/30' : ''}`}>
      {/* LEVEL 1 - CRITICAL INFO (Always Visible) */}
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-full ${isB2CLead ? 'bg-red-100' : 'bg-blue-100'}`}>
              <User className={`h-5 w-5 ${isB2CLead ? 'text-red-600' : 'text-blue-600'}`} />
            </div>
            <div>
              <div className="flex items-center space-x-2 mb-1">
                <h3 className="font-semibold text-lg">
                  {person.name || 'Nome non disponibile'}
                </h3>
                {criticalInfo?.leadScore && (
                  <Badge className={getUrgencyColor(criticalInfo.leadScore)}>
                    {criticalInfo.leadScore}/100
                  </Badge>
                )}
                {isB2CLead && (
                  <Badge variant="destructive" className="text-xs animate-pulse">
                    🔥 B2C HOT
                  </Badge>
                )}
              </div>
              
              {/* Location & Key Context */}
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                {person.geo_city && (
                  <>
                    <MapPin className="h-3 w-3" />
                    <span>{person.geo_city}</span>
                  </>
                )}
                {demographics?.age && (
                  <span>• {demographics.age}anni</span>
                )}
                {demographics?.familySize && (
                  <span>• 👥 {demographics.familySize}</span>
                )}
                {demographics?.income && (
                  <span>• €{(demographics.income / 1000).toFixed(0)}K/mese</span>
                )}
              </div>
            </div>
          </div>

          {/* Critical Actions */}
          <div className="flex items-center space-x-2">
            {criticalInfo?.urgencyScore && criticalInfo.urgencyScore > 80 && (
              <div className="flex items-center space-x-1 text-red-600 bg-red-50 px-2 py-1 rounded-full text-xs">
                <Clock className="h-3 w-3" />
                <span>URGENTE</span>
              </div>
            )}
            <Button variant="outline" size="sm" onClick={onViewSuggestions}>
              <Eye className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={onAddToList}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Next Action & Revenue Opportunity */}
        {criticalInfo?.nextAction && (
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                {getActionIcon(criticalInfo.nextAction)}
                <span className="font-medium text-blue-800">
                  🎯 NEXT: {ACTION_LABELS[criticalInfo.nextAction as keyof typeof ACTION_LABELS] || criticalInfo.nextAction}
                </span>
              </div>
              {criticalInfo.revenueOpportunity && (
                <div className="flex items-center space-x-1 text-green-600">
                  <Euro className="h-4 w-4" />
                  <span className="font-bold">€{criticalInfo.revenueOpportunity.toLocaleString()}</span>
                </div>
              )}
            </div>
            
            {/* Action Timing */}
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                <span>Perché ora: </span>
                {person.hot_policy && (
                  <span>
                    {person.policy_temperature === 'hot' ? 'Alta temperatura' : 'Interesse attivo'} su {POLICY_LABELS[person.hot_policy as keyof typeof POLICY_LABELS]}
                  </span>
                )}
              </div>
              {criticalInfo.nextAction && onTakeAction && (
                <Button 
                  size="sm" 
                  className="bg-blue-600 hover:bg-blue-700"
                  onClick={() => onTakeAction(criticalInfo.nextAction!)}
                >
                  Esegui Azione
                </Button>
              )}
            </div>
          </div>
        )}
      </CardHeader>

      <CardContent>
        {/* LEVEL 2 - CONTEXT (Collapsible) */}
        <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-4">
              {/* Policy Interest */}
              {person.hot_policy && (
                <Badge 
                  variant={person.policy_temperature === 'hot' ? 'destructive' : 'default'} 
                  className="text-xs"
                >
                  {person.policy_temperature === 'hot' ? '🔥' : '🌡️'} 
                  {POLICY_LABELS[person.hot_policy as keyof typeof POLICY_LABELS]}
                </Badge>
              )}

              {/* B2C Engagement Score */}
              {b2c_engagement?.engagementScore && (
                <div className="flex items-center space-x-1 text-purple-600">
                  <Activity className="h-4 w-4" />
                  <span className="text-sm font-medium">{b2c_engagement.engagementScore}/100</span>
                </div>
              )}

              {/* Risk Profile Quick View */}
              {scores.risk_home !== undefined && (
                <div className="flex items-center space-x-1">
                  <Shield className="h-4 w-4 text-orange-500" />
                  <span className="text-sm">
                    Risk {(scores.risk_home * 100).toFixed(0)}%
                  </span>
                </div>
              )}
            </div>
            
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm" className="flex items-center space-x-1">
                <span className="text-sm">
                  {isExpanded ? 'Meno dettagli' : 'Più dettagli'}
                </span>
                {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </Button>
            </CollapsibleTrigger>
          </div>

          <CollapsibleContent className="space-y-4">
            {/* Lifestyle & Mobility */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {person.lifestyle && person.lifestyle.length > 0 && (
                <div>
                  <p className="text-xs text-muted-foreground mb-2 font-medium">🎯 Lifestyle</p>
                  <div className="flex flex-wrap gap-1">
                    {person.lifestyle.slice(0, 4).map((style) => (
                      <Badge key={style} variant="secondary" className="text-xs">
                        {LIFESTYLE_LABELS[style as keyof typeof LIFESTYLE_LABELS] || style}
                      </Badge>
                    ))}
                    {person.lifestyle.length > 4 && (
                      <Badge variant="outline" className="text-xs">
                        +{person.lifestyle.length - 4}
                      </Badge>
                    )}
                  </div>
                </div>
              )}

              {person.mobility && person.mobility.length > 0 && (
                <div>
                  <p className="text-xs text-muted-foreground mb-2 font-medium">🚗 Mobilità</p>
                  <div className="flex flex-wrap gap-1">
                    {person.mobility.map((mobility) => (
                      <Badge key={mobility} variant="outline" className="text-xs">
                        {MOBILITY_LABELS[mobility as keyof typeof MOBILITY_LABELS] || mobility}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* B2C Intelligence Section */}
            {(isB2CLead || b2c_engagement) && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <h4 className="font-medium text-red-800 mb-2 flex items-center">
                  <Brain className="h-4 w-4 mr-1" />
                  Intelligence B2C da BudgetCasa.it
                </h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  {b2c_engagement?.simulationCount && (
                    <div>
                      <span className="text-red-600 font-medium">{b2c_engagement.simulationCount}</span>
                      <span className="text-red-700 ml-1">simulazioni</span>
                    </div>
                  )}
                  {b2c_engagement?.lastActivity && (
                    <div>
                      <span className="text-red-600 font-medium">
                        {formatTimeRemaining(b2c_engagement.lastActivity) || 'Recente'}
                      </span>
                      <span className="text-red-700 ml-1">ultima attività</span>
                    </div>
                  )}
                </div>
                {isB2CLead && (
                  <div className="mt-2 p-2 bg-red-100 rounded text-xs text-red-800">
                    💡 Lead proveniente da simulazioni immobiliari - Alta propensione assicurazione casa
                  </div>
                )}
              </div>
            )}

            {/* LEVEL 3 - DETAILED SCORES */}
            <div className="grid grid-cols-2 gap-3 pt-3 border-t">
              {scores.risk_home !== undefined && (
                <div className="text-center p-3 bg-orange-50 rounded-lg">
                  <div className="flex items-center justify-center mb-1">
                    <Home className="h-4 w-4 text-orange-600 mr-1" />
                    <span className="text-sm font-medium text-orange-800">Casa</span>
                  </div>
                  <div className="text-lg font-bold text-orange-600">
                    {formatPercentage(scores.risk_home)}
                  </div>
                  <p className="text-xs text-orange-700">
                    Rischio {getScoreLabel(scores.risk_home, 'risk')}
                  </p>
                </div>
              )}

              {scores.opportunity_home !== undefined && (
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center justify-center mb-1">
                    <Sparkles className="h-4 w-4 text-green-600 mr-1" />
                    <span className="text-sm font-medium text-green-800">Opportunità</span>
                  </div>
                  <div className="text-lg font-bold text-green-600">
                    {formatPercentage(scores.opportunity_home)}
                  </div>
                  <p className="text-xs text-green-700">
                    {getScoreLabel(scores.opportunity_home, 'opportunity')}
                  </p>
                </div>
              )}

              {scores.risk_mobility !== undefined && (
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center justify-center mb-1">
                    <Car className="h-4 w-4 text-blue-600 mr-1" />
                    <span className="text-sm font-medium text-blue-800">Mobilità</span>
                  </div>
                  <div className="text-lg font-bold text-blue-600">
                    {formatPercentage(scores.risk_mobility)}
                  </div>
                  <p className="text-xs text-blue-700">
                    Rischio Auto
                  </p>
                </div>
              )}

              {scores.opportunity_life !== undefined && (
                <div className="text-center p-3 bg-purple-50 rounded-lg">
                  <div className="flex items-center justify-center mb-1">
                    <Heart className="h-4 w-4 text-purple-600 mr-1" />
                    <span className="text-sm font-medium text-purple-800">Vita</span>
                  </div>
                  <div className="text-lg font-bold text-purple-600">
                    {formatPercentage(scores.opportunity_life)}
                  </div>
                  <p className="text-xs text-purple-700">
                    Opportunità Life
                  </p>
                </div>
              )}
            </div>

            {/* Contact Information */}
            {(demographics?.email || demographics?.phone) && (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                <h4 className="text-sm font-medium text-gray-800 mb-2">📞 Contatti</h4>
                <div className="space-y-1 text-sm">
                  {demographics.phone && (
                    <div className="flex items-center space-x-2">
                      <Phone className="h-3 w-3 text-gray-500" />
                      <span>{demographics.phone}</span>
                      <Button size="sm" variant="ghost" className="ml-auto p-1 h-auto">
                        Chiama
                      </Button>
                    </div>
                  )}
                  {demographics.email && (
                    <div className="flex items-center space-x-2">
                      <Mail className="h-3 w-3 text-gray-500" />
                      <span>{demographics.email}</span>
                      <Button size="sm" variant="ghost" className="ml-auto p-1 h-auto">
                        Email
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  )
}