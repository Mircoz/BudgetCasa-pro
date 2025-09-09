'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { X, Filter } from 'lucide-react'
import type { CompanyFilters } from '@/lib/types'
import { createClient } from '@/lib/supabase'

interface CompanyFiltersProps {
  filters: CompanyFilters
  onChange: (filters: CompanyFilters) => void
  onReset: () => void
}

const ITALIAN_CITIES = [
  'Milano', 'Roma', 'Napoli', 'Torino', 'Palermo', 'Genova', 'Bologna', 
  'Firenze', 'Bari', 'Catania', 'Venezia', 'Verona', 'Messina', 'Padova',
  'Trieste', 'Brescia', 'Parma', 'Modena', 'Bergamo'
]

const EMPLOYEE_RANGES = [
  { value: 1, label: '1+' },
  { value: 10, label: '10+' },
  { value: 25, label: '25+' },
  { value: 50, label: '50+' },
  { value: 100, label: '100+' },
  { value: 250, label: '250+' }
]

export function CompanyFilters({ filters, onChange, onReset }: CompanyFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [atecoOptions, setAtecoOptions] = useState<Array<{ code: string; label: string }>>([])

  useEffect(() => {
    // Load ATECO options from database
    const loadAtecoOptions = async () => {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('industry_taxonomy')
        .select('code, label')
        .order('code')
        .limit(50)

      if (!error && data) {
        setAtecoOptions(data)
      }
    }

    loadAtecoOptions()
  }, [])

  const updateFilter = (key: keyof CompanyFilters, value: any) => {
    onChange({ ...filters, [key]: value })
  }

  const getActiveFiltersCount = () => {
    return Object.values(filters).filter(value => 
      value !== undefined && value !== null && value !== ''
    ).length
  }

  const activeCount = getActiveFiltersCount()

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CardTitle className="text-lg flex items-center">
              <Filter className="h-5 w-5 mr-2" />
              Filtri Directory Aziende
            </CardTitle>
            {activeCount > 0 && (
              <Badge variant="secondary">
                {activeCount} attivo{activeCount !== 1 ? 'i' : ''}
              </Badge>
            )}
          </div>
          <div className="flex space-x-2">
            {activeCount > 0 && (
              <Button variant="outline" size="sm" onClick={onReset}>
                <X className="h-4 w-4 mr-1" />
                Reset
              </Button>
            )}
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? 'Nascondi' : 'Espandi'}
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Basic Filters - Always Visible */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="city">Città</Label>
            <Select 
              value={filters.city || ''} 
              onValueChange={(value) => updateFilter('city', value || undefined)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleziona città" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Tutte le città</SelectItem>
                {ITALIAN_CITIES.map((city) => (
                  <SelectItem key={city} value={city}>
                    {city}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="ateco">Settore ATECO</Label>
            <Select 
              value={filters.ateco || ''} 
              onValueChange={(value) => updateFilter('ateco', value || undefined)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleziona settore" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Tutti i settori</SelectItem>
                {atecoOptions.map((option) => (
                  <SelectItem key={option.code} value={option.code}>
                    {option.code} - {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="min_employees">Dipendenti Minimi</Label>
            <Select 
              value={filters.min_employees?.toString() || ''} 
              onValueChange={(value) => updateFilter('min_employees', value ? Number(value) : undefined)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Qualsiasi" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Qualsiasi</SelectItem>
                {EMPLOYEE_RANGES.map((range) => (
                  <SelectItem key={range.value} value={range.value.toString()}>
                    {range.label} dipendenti
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Advanced Filters - Expandable */}
        {isExpanded && (
          <div className="space-y-4 pt-4 border-t">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="risk_flood_min">Rischio Alluvione Minimo</Label>
                <div className="space-y-2">
                  <Input
                    id="risk_flood_min"
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={filters.risk_flood_min || 0}
                    onChange={(e) => updateFilter('risk_flood_min', Number(e.target.value))}
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>0%</span>
                    <span className="font-medium">
                      {Math.round((filters.risk_flood_min || 0) * 100)}%
                    </span>
                    <span>100%</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="opportunity_property_min">Opportunità Property Minima</Label>
                <div className="space-y-2">
                  <Input
                    id="opportunity_property_min"
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={filters.opportunity_property_min || 0}
                    onChange={(e) => updateFilter('opportunity_property_min', Number(e.target.value))}
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>0%</span>
                    <span className="font-medium">
                      {Math.round((filters.opportunity_property_min || 0) * 100)}%
                    </span>
                    <span>100%</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Filtri Rapidi</Label>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={filters.min_employees && filters.min_employees >= 50 && filters.opportunity_property_min && filters.opportunity_property_min >= 0.7 ? "default" : "outline"}
                  size="sm"
                  onClick={() => {
                    onChange({
                      ...filters,
                      min_employees: 50,
                      opportunity_property_min: 0.7
                    })
                  }}
                >
                  Grandi Aziende Premium
                </Button>
                
                <Button
                  variant={filters.ateco === '62.01' || filters.ateco === '62.02' ? "default" : "outline"}
                  size="sm"
                  onClick={() => {
                    onChange({
                      ...filters,
                      ateco: '62.01',
                      min_employees: 10
                    })
                  }}
                >
                  Tech Companies
                </Button>
                
                <Button
                  variant={filters.risk_flood_min && filters.risk_flood_min >= 0.6 ? "default" : "outline"}
                  size="sm"
                  onClick={() => {
                    onChange({
                      ...filters,
                      risk_flood_min: 0.6,
                      opportunity_property_min: 0.5
                    })
                  }}
                >
                  Alto Rischio Alluvione
                </Button>

                <Button
                  variant={filters.min_employees && filters.min_employees >= 25 && filters.opportunity_property_min && filters.opportunity_property_min >= 0.6 ? "default" : "outline"}
                  size="sm"
                  onClick={() => {
                    onChange({
                      ...filters,
                      min_employees: 25,
                      opportunity_property_min: 0.6
                    })
                  }}
                >
                  PMI Interessanti
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}