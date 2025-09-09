'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { X, Filter } from 'lucide-react'
import type { PersonFilters } from '@/lib/types'
import { POLICY_LABELS } from '@/lib/types'

interface PersonFiltersProps {
  filters: PersonFilters
  onChange: (filters: PersonFilters) => void
  onReset: () => void
}

const ITALIAN_CITIES = [
  'Milano', 'Roma', 'Napoli', 'Torino', 'Palermo', 'Genova', 'Bologna', 
  'Firenze', 'Bari', 'Catania', 'Venezia', 'Verona', 'Messina', 'Padova',
  'Trieste', 'Brescia', 'Parma', 'Modena', 'Reggio Calabria', 'Salerno'
]

const MOBILITY_OPTIONS = [
  { value: 'car', label: 'Auto' },
  { value: 'bike', label: 'Bici' },
  { value: 'scooter', label: 'Scooter' },
  { value: 'public_transport', label: 'Trasporti Pubblici' },
  { value: 'walk', label: 'A Piedi' }
]

export function PersonFilters({ filters, onChange, onReset }: PersonFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const updateFilter = (key: keyof PersonFilters, value: any) => {
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
              Filtri di Ricerca
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-2">
            <Label htmlFor="city">Città</Label>
            <Select 
              value={filters.city || 'all'} 
              onValueChange={(value) => updateFilter('city', value === 'all' ? undefined : value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleziona città" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tutte le città</SelectItem>
                {ITALIAN_CITIES.map((city) => (
                  <SelectItem key={city} value={city}>
                    {city}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="hot_policy">Polizza Calda</Label>
            <Select 
              value={filters.hot_policy || 'all'} 
              onValueChange={(value) => updateFilter('hot_policy', value === 'all' ? undefined : value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Tutte le polizze" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tutte le polizze</SelectItem>
                <SelectItem value="prima_casa">🏠 Prima Casa</SelectItem>
                <SelectItem value="rc_auto">🚗 RC Auto</SelectItem>
                <SelectItem value="cane">🐕 Assicurazione Animali</SelectItem>
                <SelectItem value="sport">⚽ Sport</SelectItem>
                <SelectItem value="vita">❤️ Vita</SelectItem>
                <SelectItem value="salute">🏥 Salute</SelectItem>
                <SelectItem value="infortuni">🚑 Infortuni</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="policy_temperature">Temperatura Lead</Label>
            <Select 
              value={filters.policy_temperature || 'all'} 
              onValueChange={(value) => updateFilter('policy_temperature', value === 'all' ? undefined : value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Tutti i livelli" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tutti i livelli</SelectItem>
                <SelectItem value="hot">🔥 Caldissimo</SelectItem>
                <SelectItem value="warm">🌤️ Tiepido</SelectItem>
                <SelectItem value="cold">❄️ Freddo</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="min_income">Reddito Min (€/mese)</Label>
            <Input
              id="min_income"
              type="number"
              placeholder="es. 3000"
              value={filters.min_income || ''}
              onChange={(e) => updateFilter('min_income', e.target.value ? Number(e.target.value) : undefined)}
            />
          </div>
        </div>

        {/* Secondary row for additional basic filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="has_children">Ha Figli</Label>
            <div className="flex items-center space-x-2 pt-2">
              <Switch
                id="has_children"
                checked={filters.has_children || false}
                onCheckedChange={(checked) => updateFilter('has_children', checked)}
              />
              <Label htmlFor="has_children" className="text-sm">
                {filters.has_children ? 'Sì' : 'Qualsiasi'}
              </Label>
            </div>
          </div>
        </div>

        {/* Advanced Filters - Expandable */}
        {isExpanded && (
          <div className="space-y-4 pt-4 border-t">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="risk_home_min">Rischio Casa Minimo</Label>
                <div className="space-y-2">
                  <Input
                    id="risk_home_min"
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={filters.risk_home_min || 0}
                    onChange={(e) => updateFilter('risk_home_min', Number(e.target.value))}
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>0%</span>
                    <span className="font-medium">
                      {Math.round((filters.risk_home_min || 0) * 100)}%
                    </span>
                    <span>100%</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="opportunity_home_min">Opportunità Casa Minima</Label>
                <div className="space-y-2">
                  <Input
                    id="opportunity_home_min"
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={filters.opportunity_home_min || 0}
                    onChange={(e) => updateFilter('opportunity_home_min', Number(e.target.value))}
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>0%</span>
                    <span className="font-medium">
                      {Math.round((filters.opportunity_home_min || 0) * 100)}%
                    </span>
                    <span>100%</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Filtro Rapido</Label>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={filters.policy_temperature === 'hot' ? "default" : "outline"}
                  size="sm"
                  onClick={() => {
                    onChange({
                      ...filters,
                      policy_temperature: 'hot'
                    })
                  }}
                >
                  🔥 Lead Caldissimi
                </Button>
                <Button
                  variant={filters.hot_policy === 'prima_casa' ? "default" : "outline"}
                  size="sm"
                  onClick={() => {
                    onChange({
                      ...filters,
                      hot_policy: 'prima_casa',
                      policy_temperature: 'hot'
                    })
                  }}
                >
                  🏠 Prima Casa Hot
                </Button>
                <Button
                  variant={filters.hot_policy === 'sport' ? "default" : "outline"}
                  size="sm"
                  onClick={() => {
                    onChange({
                      ...filters,
                      hot_policy: 'sport',
                      policy_temperature: 'hot'
                    })
                  }}
                >
                  ⚽ Sport Hot
                </Button>
                <Button
                  variant={filters.has_children && filters.min_income && filters.min_income >= 4000 ? "default" : "outline"}
                  size="sm"
                  onClick={() => {
                    onChange({
                      ...filters,
                      has_children: true,
                      min_income: 4000,
                      opportunity_home_min: 0.7
                    })
                  }}
                >
                  Famiglie Benestanti
                </Button>
                <Button
                  variant={!filters.has_children && filters.min_income && filters.min_income >= 5000 ? "default" : "outline"}
                  size="sm"
                  onClick={() => {
                    onChange({
                      ...filters,
                      has_children: false,
                      min_income: 5000,
                      risk_home_min: 0.6
                    })
                  }}
                >
                  Professionisti Alto Rischio
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}