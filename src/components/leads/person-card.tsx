'use client'

import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { 
  MapPin, 
  User, 
  Plus,
  Eye,
  Sparkles
} from 'lucide-react'
import type { PersonCard as PersonCardType } from '@/lib/types'
import { formatPercentage, getScoreColor, getScoreLabel, formatCurrency } from '@/lib/utils'
import { LIFESTYLE_LABELS, MOBILITY_LABELS, POLICY_LABELS } from '@/lib/types'

interface PersonCardProps {
  person: PersonCardType
  onAddToList?: () => void
  onViewSuggestions?: () => void
}

export function PersonCard({ person, onAddToList, onViewSuggestions }: PersonCardProps) {
  const { scores } = person
  const isB2CLead = person.id.startsWith('b2c_')

  return (
    <Card className={`hover:shadow-md transition-shadow ${isB2CLead ? 'ring-2 ring-red-100 bg-red-50/30' : ''}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-2">
            <User className={`h-5 w-5 ${isB2CLead ? 'text-red-600' : 'text-blue-600'}`} />
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-semibold text-lg">
                  {person.name || 'Nome non disponibile'}
                </h3>
                {isB2CLead && (
                  <Badge variant="destructive" className="text-xs">
                    🔥 B2C HOT
                  </Badge>
                )}
              </div>
              {person.geo_city && (
                <div className="flex items-center text-sm text-muted-foreground mt-1">
                  <MapPin className="h-3 w-3 mr-1" />
                  {person.geo_city}
                  {isB2CLead && (
                    <span className="ml-2 text-red-600 text-xs">
                      • Da BudgetCasa.it
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
          <div className="flex space-x-1">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onViewSuggestions}
              className="px-2"
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onAddToList}
              className="px-2"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Lifestyle & Mobility */}
        <div className="space-y-2">
          {person.lifestyle && person.lifestyle.length > 0 && (
            <div>
              <p className="text-xs text-muted-foreground mb-1">Lifestyle</p>
              <div className="flex flex-wrap gap-1">
                {person.lifestyle.slice(0, 3).map((style) => (
                  <Badge key={style} variant="secondary" className="text-xs">
                    {LIFESTYLE_LABELS[style as keyof typeof LIFESTYLE_LABELS] || style}
                  </Badge>
                ))}
                {person.lifestyle.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{person.lifestyle.length - 3}
                  </Badge>
                )}
              </div>
            </div>
          )}

          {person.mobility && person.mobility.length > 0 && (
            <div>
              <p className="text-xs text-muted-foreground mb-1">Mobilità</p>
              <div className="flex flex-wrap gap-1">
                {person.mobility.slice(0, 2).map((mobility) => (
                  <Badge key={mobility} variant="outline" className="text-xs">
                    {MOBILITY_LABELS[mobility as keyof typeof MOBILITY_LABELS] || mobility}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Policy Interest */}
          {person.hot_policy && (
            <div>
              <p className="text-xs text-muted-foreground mb-1">Polizza Calda</p>
              <div className="flex flex-wrap gap-1">
                <Badge 
                  variant={person.policy_temperature === 'hot' ? 'destructive' : person.policy_temperature === 'warm' ? 'default' : 'outline'} 
                  className="text-xs"
                >
                  🔥 {POLICY_LABELS[person.hot_policy as keyof typeof POLICY_LABELS] || person.hot_policy}
                </Badge>
                {person.policy_temperature && (
                  <Badge variant="secondary" className="text-xs">
                    {person.policy_temperature === 'hot' ? 'Caldissimo' : 
                     person.policy_temperature === 'warm' ? 'Tiepido' : 
                     'Freddo'}
                  </Badge>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Scores */}
        <div className="grid grid-cols-2 gap-2 pt-2 border-t">
          {scores.risk_home !== undefined && (
            <div className="text-center">
              <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getScoreColor(scores.risk_home, 'risk')}`}>
                Casa {formatPercentage(scores.risk_home)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Rischio {getScoreLabel(scores.risk_home, 'risk')}
              </p>
            </div>
          )}

          {scores.opportunity_home !== undefined && (
            <div className="text-center">
              <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getScoreColor(scores.opportunity_home, 'opportunity')}`}>
                <Sparkles className="h-3 w-3 mr-1" />
                {formatPercentage(scores.opportunity_home)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Opportunità {getScoreLabel(scores.opportunity_home, 'opportunity')}
              </p>
            </div>
          )}

          {scores.risk_mobility !== undefined && (
            <div className="text-center">
              <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getScoreColor(scores.risk_mobility, 'risk')}`}>
                Mobilità {formatPercentage(scores.risk_mobility)}
              </div>
            </div>
          )}

          {scores.opportunity_life !== undefined && (
            <div className="text-center">
              <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getScoreColor(scores.opportunity_life, 'opportunity')}`}>
                Vita {formatPercentage(scores.opportunity_life)}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}