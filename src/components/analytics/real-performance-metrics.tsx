'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  TrendingUp, 
  Target, 
  Users,
  Star,
  Database,
  BarChart3,
  PieChart,
  Calendar,
  MapPin
} from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RechartsPieChart, Cell, LineChart, Line } from 'recharts'
import { RealDataAnalyticsEngine } from '@/lib/real-data-analytics'
import type { RealPerformanceMetrics } from '@/lib/real-data-analytics'

export function RealPerformanceMetricsDashboard() {
  const [timeframe, setTimeframe] = useState<string>('all')
  const [performanceMetrics, setPerformanceMetrics] = useState<RealPerformanceMetrics | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadRealPerformanceData = async () => {
      try {
        const performance = await RealDataAnalyticsEngine.getPerformanceMetrics()
        setPerformanceMetrics(performance)
        setLoading(false)
      } catch (error) {
        console.error('Failed to load performance metrics:', error)
        setLoading(false)
      }
    }
    
    loadRealPerformanceData()
  }, [timeframe])

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="text-center">
          <Database className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-muted-foreground">Caricamento metriche performance reali...</p>
        </div>
      </div>
    )
  }

  if (!performanceMetrics) {
    return (
      <div className="p-6 text-center">
        <p className="text-muted-foreground">Nessuna metrica performance disponibile.</p>
      </div>
    )
  }

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8']

  const qualitySegments = [
    { name: 'Premium (80-100%)', count: performanceMetrics.quality_distribution.filter(d => d.score_range.includes('80')).reduce((sum, d) => sum + d.count, 0), color: '#10B981' },
    { name: 'Alta (60-79%)', count: performanceMetrics.quality_distribution.filter(d => d.score_range.includes('60')).reduce((sum, d) => sum + d.count, 0), color: '#3B82F6' },
    { name: 'Media (40-59%)', count: performanceMetrics.quality_distribution.filter(d => d.score_range.includes('40')).reduce((sum, d) => sum + d.count, 0), color: '#F59E0B' },
    { name: 'Bassa (<40%)', count: performanceMetrics.quality_distribution.filter(d => d.score_range.includes('20')).reduce((sum, d) => sum + d.count, 0), color: '#EF4444' }
  ]

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold flex items-center">
            <Star className="mr-3 h-8 w-8 text-purple-600" />
            Performance Metrics Milano
          </h1>
          <p className="text-muted-foreground">
            Analisi performance basata su {performanceMetrics.total_leads} lead reali con quality scoring
          </p>
        </div>
        
        <Select value={timeframe} onValueChange={setTimeframe}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">📅 Tutti i Periodi</SelectItem>
            <SelectItem value="30d">📅 Ultimi 30 giorni</SelectItem>
            <SelectItem value="90d">📅 Ultimi 3 mesi</SelectItem>
            <SelectItem value="1y">📅 Ultimo anno</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Real Data Alert */}
      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
        <div className="flex items-center">
          <Star className="h-5 w-5 text-purple-600 mr-2" />
          <div>
            <h4 className="font-semibold text-purple-800">Performance da Dati Quality Reali</h4>
            <p className="text-sm text-purple-700 mt-1">
              Tutte le metriche sono calcolate dai data quality score effettivi dei lead Milano. 
              Include distribuzione qualità, performance per zona e business type reali.
            </p>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Lead Reali</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{performanceMetrics.total_leads.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Lead nel database Milano
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Quality Score Medio</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(performanceMetrics.avg_quality_score)}%</div>
            <p className="text-xs text-muted-foreground">
              Qualità media database
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Lead Premium</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {performanceMetrics.quality_distribution
                .filter(d => d.score_range.includes('80'))
                .reduce((sum, d) => sum + d.count, 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              Quality score >80%
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Zone Attive</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{performanceMetrics.zona_performance.length}</div>
            <p className="text-xs text-muted-foreground">
              Zone geografiche Milano
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quality Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <PieChart className="h-5 w-5 mr-2" />
              Distribuzione Quality Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RechartsPieChart>
                <Tooltip formatter={(value, name) => [value, name]} />
                <RechartsPieChart
                  data={performanceMetrics.quality_distribution}
                  cx="50%"
                  cy="50%"
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
            <div className="mt-4 space-y-2">
              {performanceMetrics.quality_distribution.map((range, idx) => (
                <div key={range.score_range} className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: COLORS[idx % COLORS.length] }}
                    />
                    <span>{range.score_range}</span>
                  </div>
                  <div className="font-medium">
                    {range.count} leads ({range.percentage}%)
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
              Quality Segments Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {qualitySegments.map((segment, idx) => (
                <div key={segment.name} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm"
                      style={{ backgroundColor: segment.color }}
                    >
                      {idx + 1}
                    </div>
                    <div>
                      <div className="font-medium">{segment.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {segment.count} lead
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge 
                      variant={idx === 0 ? "default" : "secondary"}
                      style={{ backgroundColor: idx === 0 ? segment.color : undefined }}
                    >
                      {Math.round((segment.count / performanceMetrics.total_leads) * 100)}%
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Zona Performance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <MapPin className="h-5 w-5 mr-2" />
            Performance per Zona Milano (Dati Reali)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={performanceMetrics.zona_performance}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="zona" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip 
                formatter={(value, name) => {
                  if (name === 'avg_quality') return [`${value}%`, 'Quality Medio']
                  if (name === 'lead_count') return [value, 'Lead Count']
                  if (name === 'revenue_potential') return [`€${value.toLocaleString()}`, 'Revenue Potenziale']
                  return [value, name]
                }}
              />
              <Bar yAxisId="left" dataKey="lead_count" fill="#8884d8" name="lead_count" />
              <Bar yAxisId="right" dataKey="avg_quality" fill="#82ca9d" name="avg_quality" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Business Type Performance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BarChart3 className="h-5 w-5 mr-2" />
            Top Business Types per Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {performanceMetrics.business_type_performance.slice(0, 8).map((business, idx) => (
              <div key={business.business_type} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-6 h-6 rounded flex items-center justify-center text-white font-bold text-xs ${
                    idx < 3 ? 'bg-green-500' : 'bg-blue-500'
                  }`}>
                    {idx + 1}
                  </div>
                  <div>
                    <div className="font-medium">{business.business_type}</div>
                    <div className="text-sm text-muted-foreground">{business.count} lead</div>
                  </div>
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

      {/* Monthly Trends (if available) */}
      {performanceMetrics.monthly_trends.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              Trend Mensili Lead Quality
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={performanceMetrics.monthly_trends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Line 
                  yAxisId="left" 
                  type="monotone" 
                  dataKey="lead_count" 
                  stroke="#8884d8" 
                  name="Lead Count"
                />
                <Line 
                  yAxisId="right" 
                  type="monotone" 
                  dataKey="avg_quality" 
                  stroke="#82ca9d" 
                  name="Quality Media (%)"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Summary Insights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Insights Database</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600 mb-2">
              {Math.round((performanceMetrics.quality_distribution
                .filter(d => d.score_range.includes('80') || d.score_range.includes('60'))
                .reduce((sum, d) => sum + d.count, 0) / performanceMetrics.total_leads) * 100)}%
            </div>
            <p className="text-sm text-muted-foreground">
              Lead alta qualità (>60% quality score)
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Zona Top Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600 mb-2">
              {performanceMetrics.zona_performance
                .sort((a, b) => b.avg_quality - a.avg_quality)[0]?.zona || 'N/A'}
            </div>
            <p className="text-sm text-muted-foreground">
              Quality score più alto
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Business Type Leader</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600 mb-2">
              {performanceMetrics.business_type_performance[0]?.business_type.slice(0, 15) || 'N/A'}
            </div>
            <p className="text-sm text-muted-foreground">
              Maggior numero di lead
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}