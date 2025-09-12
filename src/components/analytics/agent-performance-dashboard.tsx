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
  Calendar,
  MapPin,
  Award,
  Zap,
  BarChart3,
  PieChart
} from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RechartsPieChart, Cell } from 'recharts'

interface AgentPerformanceMetrics {
  agent_id: string
  agent_name: string
  territory: string
  
  // Lead Metrics
  total_leads: number
  qualified_leads: number
  conversion_rate: number
  lead_velocity: number // leads per week
  
  // Revenue Metrics
  total_pipeline_value: number
  closed_revenue: number
  average_policy_value: number
  revenue_per_lead: number
  
  // Product Mix Performance
  product_performance: {
    casa: { leads: number, conversions: number, revenue: number }
    auto: { leads: number, conversions: number, revenue: number }
    vita: { leads: number, conversions: number, revenue: number }
    business: { leads: number, conversions: number, revenue: number }
    health: { leads: number, conversions: number, revenue: number }
    professional: { leads: number, conversions: number, revenue: number }
    cyber: { leads: number, conversions: number, revenue: number }
  }
  
  // Territory Intelligence
  territory_penetration: number // % of territory covered
  competitor_pressure: number // 0-100 scale
  market_opportunity: number // total addressable market in territory
  
  // Performance Rankings
  rank_conversion: number // rank among all agents
  rank_revenue: number
  rank_lead_volume: number
  performance_score: number // overall score 0-100
}

interface TerritoryHeatmapData {
  zona: string
  lead_count: number
  conversion_rate: number
  avg_premium: number
  market_saturation: number
  opportunity_score: number
}

export function AgentPerformanceDashboard() {
  const [selectedAgent, setSelectedAgent] = useState<string>('all')
  const [timeframe, setTimeframe] = useState<string>('30d')
  const [metrics, setMetrics] = useState<AgentPerformanceMetrics[]>([])
  const [territoryData, setTerritoryData] = useState<TerritoryHeatmapData[]>([])
  const [loading, setLoading] = useState(true)

  // Mock data generation for demo
  useEffect(() => {
    const generateMockAgentData = (): AgentPerformanceMetrics[] => {
      const agents = [
        { id: 'agent_001', name: 'Marco Rossi', territory: 'Centro' },
        { id: 'agent_002', name: 'Laura Bianchi', territory: 'Navigli' }, 
        { id: 'agent_003', name: 'Giuseppe Verdi', territory: 'Porta Nuova' },
        { id: 'agent_004', name: 'Francesca Romano', territory: 'Provincia' }
      ]

      return agents.map((agent, idx) => ({
        agent_id: agent.id,
        agent_name: agent.name,
        territory: agent.territory,
        
        total_leads: 180 - (idx * 30),
        qualified_leads: 95 - (idx * 15),
        conversion_rate: 28 - (idx * 3),
        lead_velocity: 12 - (idx * 2),
        
        total_pipeline_value: 450000 - (idx * 80000),
        closed_revenue: 125000 - (idx * 20000),
        average_policy_value: 2800 - (idx * 300),
        revenue_per_lead: 850 - (idx * 100),
        
        product_performance: {
          casa: { leads: 45 - (idx * 8), conversions: 12 - (idx * 2), revenue: 28000 - (idx * 4000) },
          auto: { leads: 38 - (idx * 6), conversions: 15 - (idx * 2), revenue: 35000 - (idx * 5000) },
          vita: { leads: 32 - (idx * 5), conversions: 8 - (idx * 1), revenue: 22000 - (idx * 3000) },
          business: { leads: 28 - (idx * 4), conversions: 9 - (idx * 1), revenue: 45000 - (idx * 7000) },
          health: { leads: 22 - (idx * 3), conversions: 6 - (idx * 1), revenue: 18000 - (idx * 2500) },
          professional: { leads: 15 - (idx * 2), conversions: 4 - idx, revenue: 32000 - (idx * 5000) },
          cyber: { leads: 8 - idx, conversions: 2, revenue: 15000 - (idx * 2000) }
        },
        
        territory_penetration: 75 - (idx * 15),
        competitor_pressure: 35 + (idx * 10),
        market_opportunity: 2500000 - (idx * 400000),
        
        rank_conversion: idx + 1,
        rank_revenue: idx + 1,
        rank_lead_volume: idx + 1,
        performance_score: 92 - (idx * 8)
      }))
    }

    const generateTerritoryData = (): TerritoryHeatmapData[] => {
      return [
        { zona: 'Centro', lead_count: 156, conversion_rate: 32, avg_premium: 3200, market_saturation: 25, opportunity_score: 88 },
        { zona: 'Navigli', lead_count: 134, conversion_rate: 28, avg_premium: 2950, market_saturation: 35, opportunity_score: 75 },
        { zona: 'Porta Nuova', lead_count: 98, conversion_rate: 35, avg_premium: 3800, market_saturation: 15, opportunity_score: 95 },
        { zona: 'Provincia', lead_count: 187, conversion_rate: 22, avg_premium: 2100, market_saturation: 45, opportunity_score: 60 }
      ]
    }

    setTimeout(() => {
      setMetrics(generateMockAgentData())
      setTerritoryData(generateTerritoryData())
      setLoading(false)
    }, 1000)
  }, [selectedAgent, timeframe])

  const selectedMetrics = selectedAgent === 'all' ? metrics : metrics.filter(m => m.agent_id === selectedAgent)
  const aggregatedMetrics = selectedAgent === 'all' 
    ? {
        total_leads: metrics.reduce((sum, m) => sum + m.total_leads, 0),
        total_revenue: metrics.reduce((sum, m) => sum + m.closed_revenue, 0),
        avg_conversion: metrics.reduce((sum, m) => sum + m.conversion_rate, 0) / metrics.length,
        total_pipeline: metrics.reduce((sum, m) => sum + m.total_pipeline_value, 0)
      }
    : selectedMetrics[0]

  const productPerformanceChart = selectedAgent === 'all' 
    ? Object.keys(metrics[0]?.product_performance || {}).map(product => ({
        product,
        leads: metrics.reduce((sum, m) => sum + m.product_performance[product as keyof typeof m.product_performance].leads, 0),
        conversions: metrics.reduce((sum, m) => sum + m.product_performance[product as keyof typeof m.product_performance].conversions, 0),
        revenue: metrics.reduce((sum, m) => sum + m.product_performance[product as keyof typeof m.product_performance].revenue, 0)
      }))
    : Object.entries(selectedMetrics[0]?.product_performance || {}).map(([product, data]) => ({
        product,
        ...data
      }))

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FFC658']

  if (loading) {
    return <div className="p-6">Caricamento analytics...</div>
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header Controls */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Agent Performance Analytics</h1>
          <p className="text-muted-foreground">Intelligence dashboard per performance agenti e territorio</p>
        </div>
        <div className="flex space-x-4">
          <Select value={selectedAgent} onValueChange={setSelectedAgent}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">📊 Tutti gli Agenti</SelectItem>
              {metrics.map(agent => (
                <SelectItem key={agent.agent_id} value={agent.agent_id}>
                  👤 {agent.agent_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={timeframe} onValueChange={setTimeframe}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">7 giorni</SelectItem>
              <SelectItem value="30d">30 giorni</SelectItem>
              <SelectItem value="90d">90 giorni</SelectItem>
              <SelectItem value="1y">1 anno</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* KPI Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Lead Pipeline</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{aggregatedMetrics.total_leads || 0}</div>
            <p className="text-xs text-muted-foreground">
              +12% vs mese precedente
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue Chiuso</CardTitle>
            <Euro className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">€{(aggregatedMetrics.total_revenue || 0).toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              +23% vs mese precedente
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(aggregatedMetrics.avg_conversion || 0).toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              +5.2% vs mese precedente
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pipeline Value</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">€{(aggregatedMetrics.total_pipeline || 0).toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Opportunità totale
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Agent Rankings & Territory Heat Map */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Agent Rankings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Award className="h-5 w-5 mr-2" />
              Agent Performance Ranking
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {metrics.slice(0, 4).map((agent, idx) => (
                <div key={agent.agent_id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                      idx === 0 ? 'bg-yellow-500' : idx === 1 ? 'bg-gray-400' : idx === 2 ? 'bg-orange-500' : 'bg-blue-500'
                    }`}>
                      {idx + 1}
                    </div>
                    <div>
                      <div className="font-medium">{agent.agent_name}</div>
                      <div className="text-sm text-muted-foreground">{agent.territory}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">€{agent.closed_revenue.toLocaleString()}</div>
                    <div className="text-sm text-muted-foreground">{agent.conversion_rate}% conv.</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Territory Heat Map */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <MapPin className="h-5 w-5 mr-2" />
              Territory Opportunity Map
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {territoryData.map((territory, idx) => (
                <div key={territory.zona} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${
                      territory.opportunity_score >= 90 ? 'bg-green-500' :
                      territory.opportunity_score >= 75 ? 'bg-yellow-500' : 
                      territory.opportunity_score >= 60 ? 'bg-orange-500' : 'bg-red-500'
                    }`} />
                    <div>
                      <div className="font-medium">{territory.zona}</div>
                      <div className="text-sm text-muted-foreground">{territory.lead_count} leads attivi</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant={territory.opportunity_score >= 80 ? "default" : "secondary"}>
                      {territory.opportunity_score}% opportunity
                    </Badge>
                    <div className="text-sm text-muted-foreground mt-1">
                      {territory.market_saturation}% saturazione
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Product Performance Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BarChart3 className="h-5 w-5 mr-2" />
            Product Line Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={productPerformanceChart}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="product" />
              <YAxis />
              <Tooltip formatter={(value, name) => {
                if (name === 'revenue') return [`€${value.toLocaleString()}`, 'Revenue']
                return [value, name === 'leads' ? 'Leads' : 'Conversions']
              }} />
              <Bar dataKey="leads" fill="#8884d8" name="leads" />
              <Bar dataKey="conversions" fill="#82ca9d" name="conversions" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Pipeline Forecast */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="h-5 w-5 mr-2" />
            Pipeline Forecast & Revenue Predictions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-green-600">€{(aggregatedMetrics.total_pipeline * 0.3 || 0).toFixed(0)}</div>
              <div className="text-sm text-muted-foreground mt-1">Q1 Forecast</div>
              <div className="text-xs text-green-600 mt-2">85% confidence</div>
            </div>
            
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-blue-600">€{(aggregatedMetrics.total_pipeline * 0.5 || 0).toFixed(0)}</div>
              <div className="text-sm text-muted-foreground mt-1">Q2 Forecast</div>
              <div className="text-xs text-blue-600 mt-2">72% confidence</div>
            </div>
            
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-purple-600">€{(aggregatedMetrics.total_pipeline * 0.7 || 0).toFixed(0)}</div>
              <div className="text-sm text-muted-foreground mt-1">Annual Projection</div>
              <div className="text-xs text-purple-600 mt-2">65% confidence</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}