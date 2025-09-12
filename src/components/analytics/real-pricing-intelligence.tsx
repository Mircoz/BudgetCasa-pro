'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  TrendingUp, 
  Target, 
  Euro,
  MapPin,
  Database,
  BarChart3,
  Zap
} from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { RealDataAnalyticsEngine } from '@/lib/real-data-analytics'
import type { RealPricingIntelligence, RealTerritoryAnalytics } from '@/lib/real-data-analytics'

export function RealPricingIntelligenceDashboard() {
  const [selectedZona, setSelectedZona] = useState<string>('all')
  const [pricingData, setPricingData] = useState<RealPricingIntelligence[]>([])
  const [territoryAnalytics, setTerritoryAnalytics] = useState<RealTerritoryAnalytics[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadRealPricingData = async () => {
      try {
        const [pricing, territory] = await Promise.all([
          RealDataAnalyticsEngine.getPricingIntelligence(),
          RealDataAnalyticsEngine.getTerritoryAnalytics()
        ])
        
        setPricingData(pricing)
        setTerritoryAnalytics(territory)
        setLoading(false)
      } catch (error) {
        console.error('Failed to load pricing intelligence:', error)
        setLoading(false)
      }
    }
    
    loadRealPricingData()
  }, [selectedZona])

  const filteredPricingData = selectedZona === 'all' 
    ? pricingData 
    : pricingData.filter(p => p.zona === selectedZona)

  const averagePremiums = {
    casa: Math.round(filteredPricingData.reduce((sum, p) => sum + p.suggested_premium_casa, 0) / (filteredPricingData.length || 1)),
    auto: Math.round(filteredPricingData.reduce((sum, p) => sum + p.suggested_premium_auto, 0) / (filteredPricingData.length || 1)),
    vita: Math.round(filteredPricingData.reduce((sum, p) => sum + p.suggested_premium_vita, 0) / (filteredPricingData.length || 1)),
    business: Math.round(filteredPricingData.reduce((sum, p) => sum + p.suggested_premium_business, 0) / (filteredPricingData.length || 1))
  }

  const chartData = filteredPricingData.map(p => ({
    zona: p.zona,
    casa: p.suggested_premium_casa,
    auto: p.suggested_premium_auto,
    vita: p.suggested_premium_vita,
    business: p.suggested_premium_business,
    confidence: p.confidence_score
  }))

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="text-center">
          <Database className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-muted-foreground">Caricamento pricing intelligence reale...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold flex items-center">
            <Zap className="mr-3 h-8 w-8 text-yellow-500" />
            Pricing Intelligence Milano
          </h1>
          <p className="text-muted-foreground">
            Prezzi ottimali basati su {territoryAnalytics.reduce((sum, t) => sum + t.total_leads, 0)} lead reali
          </p>
        </div>
        
        <Select value={selectedZona} onValueChange={setSelectedZona}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">📊 Tutte le Zone</SelectItem>
            {territoryAnalytics.map(territory => (
              <SelectItem key={territory.zona} value={territory.zona}>
                📍 {territory.zona}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Real Data Alert */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-center">
          <Zap className="h-5 w-5 text-yellow-600 mr-2" />
          <div>
            <h4 className="font-semibold text-yellow-800">Pricing Intelligence Reale</h4>
            <p className="text-sm text-yellow-700 mt-1">
              Prezzi calcolati algoritmicamente dai dati reali: income per zona, propensity scores, qualità lead.
              Algoritmo basato su ricerca mercato assicurativo Milano 2024.
            </p>
          </div>
        </div>
      </div>

      {/* Average Premium Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Premio Medio Casa</CardTitle>
            <Euro className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">€{averagePremiums.casa}</div>
            <p className="text-xs text-muted-foreground">
              Calcolato da income reale
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Premio Medio Auto</CardTitle>
            <Euro className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">€{averagePremiums.auto}</div>
            <p className="text-xs text-muted-foreground">
              Ottimizzato per zona
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Premio Medio Vita</CardTitle>
            <Euro className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">€{averagePremiums.vita}</div>
            <p className="text-xs text-muted-foreground">
              Basato su propensity
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Premio Medio Business</CardTitle>
            <Euro className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">€{averagePremiums.business}</div>
            <p className="text-xs text-muted-foreground">
              Per settore business
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Zone-specific Pricing */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <MapPin className="h-5 w-5 mr-2" />
              Pricing per Zona Milano
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredPricingData.map((pricing, idx) => (
                <div key={pricing.zona} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                      pricing.market_positioning === 'premium' ? 'bg-purple-500' : 
                      pricing.market_positioning === 'competitive' ? 'bg-blue-500' : 'bg-green-500'
                    }`}>
                      {idx + 1}
                    </div>
                    <div>
                      <div className="font-medium">{pricing.zona}</div>
                      <div className="text-sm text-muted-foreground">
                        {pricing.income_bracket} income • {pricing.market_positioning}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant={pricing.confidence_score >= 80 ? "default" : "secondary"}>
                      {pricing.confidence_score}% confidence
                    </Badge>
                    <div className="text-sm text-muted-foreground mt-1">
                      Casa: €{pricing.suggested_premium_casa}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Pricing Strategy Insights */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Target className="h-5 w-5 mr-2" />
              Strategy Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredPricingData.slice(0, 3).map((pricing, idx) => (
                <div key={pricing.zona} className="p-3 border rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-medium">{pricing.zona}</h4>
                      <p className="text-xs text-muted-foreground capitalize">
                        {pricing.market_positioning} positioning
                      </p>
                    </div>
                    <Badge variant={pricing.market_positioning === 'premium' ? "default" : "secondary"}>
                      {pricing.market_positioning}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-600">{pricing.reasoning}</p>
                  <div className="grid grid-cols-2 gap-1 text-xs mt-2">
                    <div>Casa: €{pricing.suggested_premium_casa}</div>
                    <div>Auto: €{pricing.suggested_premium_auto}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Premium Comparison Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BarChart3 className="h-5 w-5 mr-2" />
            Confronto Premi per Zona (Dati Reali)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="zona" />
              <YAxis />
              <Tooltip formatter={(value, name) => [`€${value}`, name]} />
              <Bar dataKey="casa" fill="#8884d8" name="Casa" />
              <Bar dataKey="auto" fill="#82ca9d" name="Auto" />
              <Bar dataKey="vita" fill="#ffc658" name="Vita" />
              <Bar dataKey="business" fill="#ff7300" name="Business" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Confidence & Quality Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Confidence Media</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              {Math.round(filteredPricingData.reduce((sum, p) => sum + p.confidence_score, 0) / (filteredPricingData.length || 1))}%
            </div>
            <p className="text-sm text-muted-foreground">
              Basato su qualità dati reali
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Zone Premium</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600">
              {filteredPricingData.filter(p => p.market_positioning === 'premium').length}
            </div>
            <p className="text-sm text-muted-foreground">
              Zone ad alto reddito
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Revenue Potenziale</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">
              €{Math.round(filteredPricingData.reduce((sum, p) => sum + p.suggested_premium_casa + p.suggested_premium_auto, 0) / 1000)}k
            </div>
            <p className="text-sm text-muted-foreground">
              Per cliente medio
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}