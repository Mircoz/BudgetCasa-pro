'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  TrendingUp, 
  Target, 
  Euro,
  Users,
  Database,
  BarChart3,
  ArrowRight,
  Zap
} from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ScatterChart, Scatter } from 'recharts'
import { RealDataAnalyticsEngine } from '@/lib/real-data-analytics'
import type { RealCrossSellOpportunities, RealTerritoryAnalytics } from '@/lib/real-data-analytics'

export function RealCrossSellMatrix() {
  const [selectedProduct, setSelectedProduct] = useState<string>('all')
  const [crossSellData, setCrossSellData] = useState<RealCrossSellOpportunities[]>([])
  const [territoryAnalytics, setTerritoryAnalytics] = useState<RealTerritoryAnalytics[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadRealCrossSellData = async () => {
      try {
        const [crossSell, territory] = await Promise.all([
          RealDataAnalyticsEngine.getCrossSellOpportunities(),
          RealDataAnalyticsEngine.getTerritoryAnalytics()
        ])
        
        setCrossSellData(crossSell)
        setTerritoryAnalytics(territory)
        setLoading(false)
      } catch (error) {
        console.error('Failed to load cross-sell data:', error)
        setLoading(false)
      }
    }
    
    loadRealCrossSellData()
  }, [])

  const filteredCrossSellData = selectedProduct === 'all' 
    ? crossSellData 
    : crossSellData.filter(c => c.primary_product === selectedProduct)

  const topOpportunities = filteredCrossSellData
    .sort((a, b) => b.estimated_revenue - a.estimated_revenue)
    .slice(0, 6)

  const totalRevenuePotential = filteredCrossSellData.reduce((sum, opp) => sum + opp.estimated_revenue, 0)
  const totalOpportunities = filteredCrossSellData.reduce((sum, opp) => sum + opp.opportunity_count, 0)
  const averageConfidence = filteredCrossSellData.reduce((sum, opp) => sum + opp.confidence_level, 0) / (filteredCrossSellData.length || 1)

  const matrixData = crossSellData.map(opp => ({
    x: opp.correlation_strength,
    y: opp.opportunity_count,
    z: opp.estimated_revenue,
    name: `${opp.primary_product} → ${opp.secondary_product}`,
    primary: opp.primary_product,
    secondary: opp.secondary_product
  }))

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="text-center">
          <Database className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-muted-foreground">Caricamento analisi cross-sell reale...</p>
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
            <Target className="mr-3 h-8 w-8 text-green-600" />
            Cross-Sell Intelligence Milano
          </h1>
          <p className="text-muted-foreground">
            Analisi opportunità basata su correlazioni propensity reali da {territoryAnalytics.reduce((sum, t) => sum + t.total_leads, 0)} lead
          </p>
        </div>
        
        <Select value={selectedProduct} onValueChange={setSelectedProduct}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">🎯 Tutti i Prodotti</SelectItem>
            <SelectItem value="casa">🏠 Casa</SelectItem>
            <SelectItem value="auto">🚗 Auto</SelectItem>
            <SelectItem value="vita">💼 Vita</SelectItem>
            <SelectItem value="business">🏢 Business</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Real Data Alert */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-center">
          <Database className="h-5 w-5 text-green-600 mr-2" />
          <div>
            <h4 className="font-semibold text-green-800">Correlazioni da Dati Reali</h4>
            <p className="text-sm text-green-700 mt-1">
              Tutte le correlazioni sono calcolate dai propensity score reali dei lead Milano. 
              Le opportunità sono identificate tramite analisi statistica dei comportamenti reali.
            </p>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue Potenziale</CardTitle>
            <Euro className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">€{totalRevenuePotential.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Da cross-sell opportunities
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Lead Qualificati</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalOpportunities}</div>
            <p className="text-xs text-muted-foreground">
              Con propensity multiple
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Confidence Media</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(averageConfidence)}%</div>
            <p className="text-xs text-muted-foreground">
              Accuratezza predizioni
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Correlazioni Top</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {crossSellData.filter(c => c.correlation_strength >= 70).length}
            </div>
            <p className="text-xs text-muted-foreground">
              Correlazione >70%
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Top Cross-Sell Opportunities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Zap className="h-5 w-5 mr-2" />
              Top Cross-Sell Opportunities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topOpportunities.map((opportunity, idx) => (
                <div key={`${opportunity.primary_product}-${opportunity.secondary_product}`} 
                     className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                      idx === 0 ? 'bg-green-500' : idx === 1 ? 'bg-blue-500' : 'bg-gray-500'
                    }`}>
                      {idx + 1}
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium capitalize">{opportunity.primary_product}</span>
                      <ArrowRight className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium capitalize">{opportunity.secondary_product}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">€{opportunity.estimated_revenue.toLocaleString()}</div>
                    <div className="text-sm text-muted-foreground">
                      {opportunity.opportunity_count} lead • {opportunity.correlation_strength}% corr.
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Trigger Profiles */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="h-5 w-5 mr-2" />
              Profili Trigger (Dati Reali)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topOpportunities.slice(0, 3).map((opportunity, idx) => (
                <div key={`${opportunity.primary_product}-${opportunity.secondary_product}-profiles`} 
                     className="p-3 border rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium capitalize">{opportunity.primary_product}</span>
                      <ArrowRight className="h-3 w-3 text-muted-foreground" />
                      <span className="text-sm capitalize">{opportunity.secondary_product}</span>
                    </div>
                    <Badge variant={opportunity.confidence_level >= 80 ? "default" : "secondary"}>
                      {opportunity.confidence_level}% confidence
                    </Badge>
                  </div>
                  <div className="space-y-1">
                    {opportunity.trigger_profiles.slice(0, 2).map((profile, profileIdx) => (
                      <div key={profileIdx} className="text-xs bg-gray-50 p-2 rounded">
                        {profile}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Cross-Sell Matrix Visualization */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BarChart3 className="h-5 w-5 mr-2" />
            Matrice Correlazioni (Propensity Reali)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <ScatterChart data={matrixData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="x" 
                name="Correlation Strength" 
                domain={[0, 100]} 
                label={{ value: 'Forza Correlazione %', position: 'insideBottom', offset: -5 }}
              />
              <YAxis 
                dataKey="y" 
                name="Opportunity Count" 
                label={{ value: 'Numero Opportunità', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip 
                formatter={(value, name) => {
                  if (name === 'x') return [`${value}%`, 'Correlazione']
                  if (name === 'y') return [value, 'Lead']
                  if (name === 'z') return [`€${value.toLocaleString()}`, 'Revenue']
                  return [value, name]
                }}
                labelFormatter={(label, payload) => {
                  if (payload && payload[0]) {
                    return payload[0].payload.name
                  }
                  return label
                }}
              />
              <Scatter name="Cross-Sell Opportunities" dataKey="y" fill="#8884d8" />
            </ScatterChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Revenue by Product Pair */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Euro className="h-5 w-5 mr-2" />
            Revenue Potenziale per Coppia Prodotti
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={topOpportunities}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="primary_product" 
                tickFormatter={(value) => value.charAt(0).toUpperCase() + value.slice(1)}
              />
              <YAxis />
              <Tooltip 
                formatter={(value) => [`€${value.toLocaleString()}`, 'Revenue']}
                labelFormatter={(label, payload) => {
                  if (payload && payload[0]) {
                    return `${payload[0].payload.primary_product} → ${payload[0].payload.secondary_product}`
                  }
                  return label
                }}
              />
              <Bar dataKey="estimated_revenue" fill="#82ca9d" name="Revenue Stimato" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}