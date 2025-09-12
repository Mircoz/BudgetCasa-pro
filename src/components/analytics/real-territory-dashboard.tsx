'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  TrendingUp, 
  Target, 
  Users, 
  Euro,
  MapPin,
  Database,
  BarChart3,
  PieChart
} from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RechartsPieChart, Cell } from 'recharts'
import { RealDataAnalyticsEngine } from '@/lib/real-data-analytics'
import type { RealTerritoryAnalytics, RealMarketSegmentation, RealPerformanceMetrics } from '@/lib/real-data-analytics'

export function RealTerritoryDashboard() {
  const [selectedZona, setSelectedZona] = useState<string>('all')
  const [territoryAnalytics, setTerritoryAnalytics] = useState<RealTerritoryAnalytics[]>([])
  const [marketSegments, setMarketSegments] = useState<RealMarketSegmentation[]>([])
  const [performanceMetrics, setPerformanceMetrics] = useState<RealPerformanceMetrics | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadRealData = async () => {
      try {
        const [territory, segments, performance] = await Promise.all([
          RealDataAnalyticsEngine.getTerritoryAnalytics(),
          RealDataAnalyticsEngine.getMarketSegmentation(),
          RealDataAnalyticsEngine.getPerformanceMetrics()
        ])
        
        setTerritoryAnalytics(territory)
        setMarketSegments(segments)
        setPerformanceMetrics(performance)
        setLoading(false)
      } catch (error) {
        console.error('Failed to load real analytics data:', error)
        setLoading(false)
      }
    }
    
    loadRealData()
  }, [selectedZona])

  const filteredTerritoryData = selectedZona === 'all' 
    ? territoryAnalytics 
    : territoryAnalytics.filter(t => t.zona === selectedZona)

  const totalLeads = performanceMetrics?.total_leads || 0
  const totalRevenue = territoryAnalytics.reduce((sum, t) => sum + t.total_revenue_opportunity, 0)
  const avgQuality = performanceMetrics?.avg_quality_score || 0

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8']

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="text-center">
          <Database className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-muted-foreground">Caricamento analytics dati reali Milano...</p>
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
            <Database className="mr-3 h-8 w-8 text-green-600" />
            Real Data Analytics Milano
          </h1>
          <p className="text-muted-foreground">Analisi basata su {totalLeads} lead reali dal database</p>
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
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-center">
          <Database className="h-5 w-5 text-green-600 mr-2" />
          <div>
            <h4 className="font-semibold text-green-800">Dati Reali Milano</h4>
            <p className="text-sm text-green-700 mt-1">
              Tutti i dati mostrati sono calcolati dai {totalLeads} lead reali presenti nel database Supabase.
              Propensity scores, income, zona e business types sono dati effettivi raccolti via scraping.
            </p>
          </div>
        </div>
      </div>

      {/* KPI Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Lead Totali Reali</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalLeads}</div>
            <p className="text-xs text-muted-foreground">
              Dal database Milano leads
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue Opportunity</CardTitle>
            <Euro className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">€{totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Calcolato da propensity reali
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Quality Score Medio</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgQuality}%</div>
            <p className="text-xs text-muted-foreground">
              Da data quality reale
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Zone Attive</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{territoryAnalytics.length}</div>
            <p className="text-xs text-muted-foreground">
              Zone geografiche Milano
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Territory Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <MapPin className="h-5 w-5 mr-2" />
              Analisi Territoriale Reale
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredTerritoryData.map((territory, idx) => (
                <div key={territory.zona} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                      idx === 0 ? 'bg-green-500' : idx === 1 ? 'bg-blue-500' : idx === 2 ? 'bg-yellow-500' : 'bg-gray-500'
                    }`}>
                      {idx + 1}
                    </div>
                    <div>
                      <div className="font-medium">{territory.zona}</div>
                      <div className="text-sm text-muted-foreground">
                        {territory.total_leads} leads • Density: {territory.lead_density_score}/km²
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">€{territory.avg_income.toLocaleString()}</div>
                    <div className="text-sm text-muted-foreground">income medio</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Target className="h-5 w-5 mr-2" />
              Market Segments Reali
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {marketSegments.map((segment, idx) => (
                <div key={segment.segment_name} className="p-3 border rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-medium">{segment.segment_name}</h4>
                      <p className="text-sm text-muted-foreground">{segment.criteria}</p>
                    </div>
                    <Badge variant="secondary">{segment.lead_count} leads</Badge>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div>
                      <span className="text-muted-foreground">Income: </span>
                      <span className="font-medium">€{segment.avg_income.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Quality: </span>
                      <span className="font-medium">{segment.avg_quality_score}%</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Revenue: </span>
                      <span className="font-medium">€{segment.revenue_opportunity.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Propensity Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BarChart3 className="h-5 w-5 mr-2" />
            Analisi Propensity per Zona (Dati Reali)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={filteredTerritoryData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="zona" />
              <YAxis />
              <Tooltip formatter={(value, name) => [`${value}%`, name]} />
              <Bar dataKey="avg_propensity_casa" fill="#8884d8" name="Casa" />
              <Bar dataKey="avg_propensity_auto" fill="#82ca9d" name="Auto" />
              <Bar dataKey="avg_propensity_vita" fill="#ffc658" name="Vita" />
              <Bar dataKey="avg_propensity_business" fill="#ff7300" name="Business" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Quality Score Distribution */}
      {performanceMetrics && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <PieChart className="h-5 w-5 mr-2" />
              Distribuzione Quality Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ResponsiveContainer width="100%" height={250}>
                <RechartsPieChart>
                  <Tooltip />
                  <RechartsPieChart
                    data={performanceMetrics.quality_distribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="count"
                  >
                    {performanceMetrics.quality_distribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </RechartsPieChart>
                </RechartsPieChart>
              </ResponsiveContainer>
              
              <div className="space-y-2">
                {performanceMetrics.quality_distribution.map((range, idx) => (
                  <div key={range.score_range} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: COLORS[idx % COLORS.length] }}
                      />
                      <span className="text-sm">{range.score_range}</span>
                    </div>
                    <div className="text-sm font-medium">
                      {range.count} leads ({range.percentage}%)
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Business Type Performance */}
      {performanceMetrics && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Database className="h-5 w-5 mr-2" />
              Performance per Business Type (Reale)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {performanceMetrics.business_type_performance.slice(0, 8).map((business, idx) => (
                <div key={business.business_type} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">{business.business_type}</div>
                    <div className="text-sm text-muted-foreground">{business.count} lead</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">€{business.avg_income.toLocaleString()}</div>
                    <div className="text-sm text-muted-foreground">{business.avg_propensity}% propensity</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}