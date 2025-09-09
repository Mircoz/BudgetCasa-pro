'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { 
  MapPin, 
  Building, 
  Users,
  Plus,
  Eye,
  Sparkles,
  TrendingUp,
  Shield
} from 'lucide-react'
import type { CompanyCard as CompanyCardType } from '@/lib/types'
import { formatPercentage, getScoreColor, getScoreLabel } from '@/lib/utils'

interface CompanyCardProps {
  company: CompanyCardType
  onAddToList?: () => void
  onViewSuggestions?: () => void
}

export function CompanyCard({ company, onAddToList, onViewSuggestions }: CompanyCardProps) {
  const { scores } = company

  const getAtecoLabel = (ateco?: string) => {
    if (!ateco) return null
    
    // Basic ATECO mapping - in real app this would come from database
    const atecoLabels: Record<string, string> = {
      '62.01': 'Software non connesso all\'edizione',
      '62.02': 'Consulenza informatica', 
      '70.22': 'Consulenza gestionale',
      '69.10': 'Attività legali',
      '10.13': 'Industrie alimentari',
      '35.11': 'Energia elettrica',
      '25.62': 'Lavorazione metalli',
      '64.19': 'Servizi finanziari'
    }
    
    return atecoLabels[ateco] || `ATECO ${ateco}`
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-2">
            <Building className="h-5 w-5 text-green-600" />
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-lg truncate">
                {company.name}
              </h3>
              <div className="flex items-center text-sm text-muted-foreground mt-1">
                {company.geo_city && (
                  <>
                    <MapPin className="h-3 w-3 mr-1" />
                    <span className="mr-3">{company.geo_city}</span>
                  </>
                )}
                {company.employees && (
                  <>
                    <Users className="h-3 w-3 mr-1" />
                    <span>{company.employees} dip.</span>
                  </>
                )}
              </div>
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
        {/* ATECO Category */}
        {company.ateco && (
          <div>
            <Badge variant="outline" className="text-xs">
              {getAtecoLabel(company.ateco)}
            </Badge>
          </div>
        )}

        {/* Risk & Opportunity Scores */}
        <div className="grid grid-cols-2 gap-2 pt-2 border-t">
          {/* Primary Scores */}
          {scores.opportunity_property !== undefined && (
            <div className="text-center">
              <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getScoreColor(scores.opportunity_property, 'opportunity')}`}>
                <TrendingUp className="h-3 w-3 mr-1" />
                {formatPercentage(scores.opportunity_property)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Property {getScoreLabel(scores.opportunity_property, 'opportunity')}
              </p>
            </div>
          )}

          {scores.risk_flood !== undefined && (
            <div className="text-center">
              <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getScoreColor(scores.risk_flood, 'risk')}`}>
                <Shield className="h-3 w-3 mr-1" />
                {formatPercentage(scores.risk_flood)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Alluvione {getScoreLabel(scores.risk_flood, 'risk')}
              </p>
            </div>
          )}

          {/* Secondary Scores */}
          {scores.risk_business_continuity !== undefined && (
            <div className="text-center">
              <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getScoreColor(scores.risk_business_continuity, 'risk')}`}>
                Continuità {formatPercentage(scores.risk_business_continuity)}
              </div>
            </div>
          )}

          {scores.opportunity_employee_benefits !== undefined && (
            <div className="text-center">
              <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getScoreColor(scores.opportunity_employee_benefits, 'opportunity')}`}>
                <Sparkles className="h-3 w-3 mr-1" />
                Benefit {formatPercentage(scores.opportunity_employee_benefits)}
              </div>
            </div>
          )}

          {scores.risk_crime !== undefined && (
            <div className="text-center">
              <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getScoreColor(scores.risk_crime, 'risk')}`}>
                Crime {formatPercentage(scores.risk_crime)}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}