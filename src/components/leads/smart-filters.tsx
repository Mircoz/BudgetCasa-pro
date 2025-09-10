'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  X, 
  Filter, 
  Sparkles, 
  Target, 
  Clock, 
  TrendingUp,
  AlertTriangle,
  Zap,
  ChevronDown,
  ChevronUp,
  Star,
  Calendar,
  DollarSign
} from 'lucide-react'
import type { PersonFilters } from '@/lib/types'

interface SmartFiltersProps {
  filters: PersonFilters
  onChange: (filters: PersonFilters) => void
  onReset: () => void
  totalResults?: number
}

// Smart Filter Presets
const SMART_PRESETS = {
  ready_to_close: {
    name: '🎯 Ready to Close',
    description: 'Lead con alta probabilità conversione immediata',
    icon: Target,
    color: 'bg-green-600',
    filters: {
      min_lead_score: 85,
      urgency_level: 'high' as const,
      policy_temperature: 'hot' as const,
      engagement_level: 'high' as const
    }
  },
  competitor_expiring: {
    name: '⏰ Competitor Expiring',
    description: 'Polizze competitor in scadenza <90 giorni',
    icon: Clock,
    color: 'bg-orange-600',
    filters: {
      min_lead_score: 70,
      urgency_level: 'medium' as const,
      next_action: 'competitive_intercept'
    }
  },
  life_events: {
    name: '👶 Life Events',
    description: 'Eventi vita recenti (matrimonio, nascita, lavoro)',
    icon: Sparkles,
    color: 'bg-purple-600',
    filters: {
      life_event: 'recent' as const,
      min_lead_score: 75,
      engagement_level: 'medium' as const
    }
  },
  high_value: {
    name: '💎 High Value',
    description: 'Opportunità revenue >€5K annuali',
    icon: TrendingUp,
    color: 'bg-blue-600',
    filters: {
      revenue_opportunity_min: 5000,
      min_lead_score: 80
    }
  },
  urgent_action: {
    name: '🚨 Urgent Action',
    description: 'Richiede azione immediata (<24h)',
    icon: AlertTriangle,
    color: 'bg-red-600',
    filters: {
      urgency_level: 'high' as const,
      next_action: 'call_immediate'
    }
  },
  nurture_ready: {
    name: '🌱 Nurture Ready',
    description: 'Lead in fase educativa, alto potenziale',
    icon: Star,
    color: 'bg-indigo-600',
    filters: {
      min_lead_score: 60,
      urgency_level: 'low' as const,
      engagement_level: 'high' as const
    }
  }
}

const ITALIAN_CITIES = [
  'Milano', 'Roma', 'Napoli', 'Torino', 'Palermo', 'Genova', 'Bologna', 
  'Firenze', 'Bari', 'Catania', 'Venezia', 'Verona', 'Messina', 'Padova'
]

const URGENCY_LEVELS = [
  { value: 'low', label: '🟢 Bassa', description: 'Può aspettare' },
  { value: 'medium', label: '🟡 Media', description: 'Questa settimana' },
  { value: 'high', label: '🔴 Alta', description: 'Oggi/domani' }
]

const ENGAGEMENT_LEVELS = [
  { value: 'low', label: 'Basso', description: '<3 interazioni' },
  { value: 'medium', label: 'Medio', description: '3-8 interazioni' },
  { value: 'high', label: 'Alto', description: '>8 interazioni' }
]

const NEXT_ACTIONS = [
  { value: 'call_immediate', label: '📞 Chiama Subito' },
  { value: 'call_scheduled', label: '📅 Chiama Programmata' },
  { value: 'email_personalized', label: '✉️ Email Personalizzata' },
  { value: 'meeting_request', label: '🤝 Richiesta Meeting' },
  { value: 'competitive_intercept', label: '⚡ Intercetta Competitor' },
  { value: 'life_event_follow', label: '🎉 Follow Life Event' }
]

export function SmartFilters({ filters, onChange, onReset, totalResults }: SmartFiltersProps) {
  const [activeTab, setActiveTab] = useState('smart')
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false)

  const updateFilter = (key: keyof PersonFilters, value: any) => {
    onChange({ ...filters, [key]: value })
  }

  const applyPreset = (presetKey: string) => {
    const preset = SMART_PRESETS[presetKey as keyof typeof SMART_PRESETS]
    onChange({ ...filters, ...preset.filters })
  }

  const clearPreset = () => {
    const basicFilters = {
      q: filters.q,
      city: filters.city,
      hot_policy: filters.hot_policy,
      policy_temperature: filters.policy_temperature
    }
    onChange(basicFilters)
  }

  const getActiveFiltersCount = () => {
    return Object.values(filters).filter(value => 
      value !== undefined && value !== null && value !== ''
    ).length
  }

  const getActivePreset = () => {
    return Object.keys(SMART_PRESETS).find(key => {
      const preset = SMART_PRESETS[key as keyof typeof SMART_PRESETS]
      return Object.entries(preset.filters).every(([k, v]) => 
        filters[k as keyof PersonFilters] === v
      )
    })
  }

  const activeCount = getActiveFiltersCount()
  const activePreset = getActivePreset()

  return (
    <Card className="mb-6">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CardTitle className="text-lg flex items-center">
              <Filter className="h-5 w-5 mr-2" />
              Filtri Intelligenti
            </CardTitle>
            {activeCount > 0 && (
              <Badge variant="secondary" className="flex items-center space-x-1">
                <span>{activeCount} attivi</span>
                {totalResults !== undefined && (
                  <span className="text-green-600 font-medium">• {totalResults} risultati</span>
                )}
              </Badge>
            )}
            {activePreset && (
              <Badge className={`${SMART_PRESETS[activePreset as keyof typeof SMART_PRESETS].color} text-white`}>
                {SMART_PRESETS[activePreset as keyof typeof SMART_PRESETS].name}
              </Badge>
            )}
          </div>
          <div className="flex space-x-2">
            {activeCount > 0 && (
              <Button variant="outline" size="sm" onClick={onReset}>
                <X className="h-4 w-4 mr-1" />
                Reset All
              </Button>
            )}
            {activePreset && (
              <Button variant="outline" size="sm" onClick={clearPreset}>
                Clear Preset
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="smart" className="flex items-center space-x-1">
              <Sparkles className="h-4 w-4" />
              <span>Smart Presets</span>
            </TabsTrigger>
            <TabsTrigger value="basic" className="flex items-center space-x-1">
              <Filter className="h-4 w-4" />
              <span>Basic</span>
            </TabsTrigger>
            <TabsTrigger value="advanced" className="flex items-center space-x-1">
              <Target className="h-4 w-4" />
              <span>Advanced</span>
            </TabsTrigger>
          </TabsList>

          {/* Smart Presets Tab */}
          <TabsContent value="smart" className="space-y-4">
            <div className="text-sm text-muted-foreground mb-4">
              Filtri pre-configurati basati su scenari comuni e best practices
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {Object.entries(SMART_PRESETS).map(([key, preset]) => {
                const Icon = preset.icon
                const isActive = activePreset === key
                
                return (
                  <Button
                    key={key}
                    variant={isActive ? "default" : "outline"}
                    className={`h-auto p-4 flex flex-col items-start text-left ${
                      isActive ? `${preset.color} text-white hover:${preset.color}/90` : ''
                    }`}
                    onClick={() => applyPreset(key)}
                  >
                    <div className="flex items-center space-x-2 mb-2">
                      <Icon className="h-5 w-5" />
                      <span className="font-medium">{preset.name}</span>
                    </div>
                    <div className="text-xs opacity-90">
                      {preset.description}
                    </div>
                  </Button>
                )
              })}
            </div>

            {/* Quick Stats for Smart Filters */}
            {activePreset && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium mb-2">📊 Questo preset include:</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  {Object.entries(SMART_PRESETS[activePreset as keyof typeof SMART_PRESETS].filters).map(([key, value]) => (
                    <div key={key} className="flex justify-between">
                      <span className="text-gray-600 capitalize">
                        {key.replace('_', ' ')}:
                      </span>
                      <span className="font-medium">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>

          {/* Basic Filters Tab */}
          <TabsContent value="basic" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">🌍 Città</Label>
                <Select 
                  value={filters.city || 'all'} 
                  onValueChange={(value) => updateFilter('city', value === 'all' ? undefined : value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Tutte le città" />
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
                <Label htmlFor="hot_policy">🎯 Polizza Interessante</Label>
                <Select 
                  value={filters.hot_policy || 'all'} 
                  onValueChange={(value) => updateFilter('hot_policy', value === 'all' ? undefined : value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Tutte" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tutte le polizze</SelectItem>
                    <SelectItem value="prima_casa">🏠 Prima Casa</SelectItem>
                    <SelectItem value="rc_auto">🚗 RC Auto</SelectItem>
                    <SelectItem value="vita">❤️ Vita</SelectItem>
                    <SelectItem value="sport">⚽ Sport</SelectItem>
                    <SelectItem value="salute">🏥 Salute</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="policy_temperature">🌡️ Temperatura</Label>
                <Select 
                  value={filters.policy_temperature || 'all'} 
                  onValueChange={(value) => updateFilter('policy_temperature', value === 'all' ? undefined : value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Tutte" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tutte</SelectItem>
                    <SelectItem value="hot">🔥 Hot</SelectItem>
                    <SelectItem value="warm">🌤️ Warm</SelectItem>
                    <SelectItem value="cold">❄️ Cold</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="min_income">💰 Reddito Min €/mese</Label>
                <Input
                  id="min_income"
                  type="number"
                  placeholder="3000"
                  value={filters.min_income || ''}
                  onChange={(e) => updateFilter('min_income', e.target.value ? Number(e.target.value) : undefined)}
                />
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="has_children"
                  checked={filters.has_children || false}
                  onCheckedChange={(checked) => updateFilter('has_children', checked ? true : undefined)}
                />
                <Label htmlFor="has_children">👶 Ha figli</Label>
              </div>
            </div>
          </TabsContent>

          {/* Advanced Filters Tab */}
          <TabsContent value="advanced" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="min_lead_score">🎯 Lead Score Min</Label>
                <div className="space-y-2">
                  <Input
                    type="range"
                    min="0"
                    max="100"
                    value={filters.min_lead_score || 0}
                    onChange={(e) => updateFilter('min_lead_score', Number(e.target.value))}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>0</span>
                    <Badge variant="outline" className="text-xs">
                      {filters.min_lead_score || 0}/100
                    </Badge>
                    <span>100</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>⚡ Urgency Level</Label>
                <Select 
                  value={filters.urgency_level || 'all'} 
                  onValueChange={(value) => updateFilter('urgency_level', value === 'all' ? undefined : value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Tutte" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tutte</SelectItem>
                    {URGENCY_LEVELS.map((level) => (
                      <SelectItem key={level.value} value={level.value}>
                        <div className="flex flex-col">
                          <span>{level.label}</span>
                          <span className="text-xs text-muted-foreground">{level.description}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>📊 Engagement Level</Label>
                <Select 
                  value={filters.engagement_level || 'all'} 
                  onValueChange={(value) => updateFilter('engagement_level', value === 'all' ? undefined : value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Tutti" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tutti</SelectItem>
                    {ENGAGEMENT_LEVELS.map((level) => (
                      <SelectItem key={level.value} value={level.value}>
                        <div className="flex flex-col">
                          <span>{level.label}</span>
                          <span className="text-xs text-muted-foreground">{level.description}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>🎯 Next Action</Label>
                <Select 
                  value={filters.next_action || 'all'} 
                  onValueChange={(value) => updateFilter('next_action', value === 'all' ? undefined : value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Tutte" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tutte le azioni</SelectItem>
                    {NEXT_ACTIONS.map((action) => (
                      <SelectItem key={action.value} value={action.value}>
                        {action.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="revenue_opportunity_min">💰 Revenue Min €</Label>
                <Input
                  id="revenue_opportunity_min"
                  type="number"
                  placeholder="5000"
                  value={filters.revenue_opportunity_min || ''}
                  onChange={(e) => updateFilter('revenue_opportunity_min', e.target.value ? Number(e.target.value) : undefined)}
                />
              </div>

              <div className="space-y-2">
                <Label>👶 Life Events</Label>
                <Select 
                  value={filters.life_event || 'all'} 
                  onValueChange={(value) => updateFilter('life_event', value === 'all' ? undefined : value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Tutti" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tutti</SelectItem>
                    <SelectItem value="recent">🆕 Eventi Recenti</SelectItem>
                    <SelectItem value="predicted">🔮 Eventi Previsti</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Advanced Range Filters */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>🏠 Opportunità Casa Min</Label>
                <div className="space-y-2">
                  <Input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={filters.opportunity_home_min || 0}
                    onChange={(e) => updateFilter('opportunity_home_min', Number(e.target.value))}
                  />
                  <div className="flex justify-between text-xs">
                    <span>0%</span>
                    <Badge variant="secondary">
                      {Math.round((filters.opportunity_home_min || 0) * 100)}%
                    </Badge>
                    <span>100%</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>⚠️ Rischio Casa Min</Label>
                <div className="space-y-2">
                  <Input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={filters.risk_home_min || 0}
                    onChange={(e) => updateFilter('risk_home_min', Number(e.target.value))}
                  />
                  <div className="flex justify-between text-xs">
                    <span>0%</span>
                    <Badge variant="secondary">
                      {Math.round((filters.risk_home_min || 0) * 100)}%
                    </Badge>
                    <span>100%</span>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Active Filters Summary */}
        {activeCount > 0 && (
          <div className="mt-4 pt-4 border-t">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Filtri attivi:</span>
              <Button variant="ghost" size="sm" onClick={onReset}>
                <X className="h-3 w-3 mr-1" />
                Pulisci tutto
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {Object.entries(filters).map(([key, value]) => {
                if (value === undefined || value === null || value === '') return null
                
                return (
                  <Badge key={key} variant="secondary" className="flex items-center space-x-1">
                    <span>{key}: {String(value)}</span>
                    <button 
                      onClick={() => updateFilter(key as keyof PersonFilters, undefined)}
                      className="ml-1 hover:bg-gray-300 rounded-full p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}