'use client'

export const dynamic = 'force-dynamic'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Users, 
  Building, 
  TrendingUp,
  MapPin,
  ArrowRight,
  Plus
} from 'lucide-react'
import Link from 'next/link'

import { getB2CAnalytics, getB2CLeads } from '@/lib/api-mock'
import { useState, useEffect } from 'react'

// Mock data for demonstration
const kpis = [
  {
    title: 'Nuovi Lead Settimana',
    value: '24',
    change: '+12%',
    trend: 'up' as const,
    icon: Users
  },
  {
    title: 'Conversione Stimata',
    value: '€45.200',
    change: '+8%', 
    trend: 'up' as const,
    icon: TrendingUp
  },
  {
    title: 'Aziende Monitorate',
    value: '156',
    change: '+3%',
    trend: 'up' as const,
    icon: Building
  },
  {
    title: 'Aree Calde',
    value: '7',
    change: 'Milano, Roma',
    trend: 'neutral' as const,
    icon: MapPin
  }
]

const suggestedLeads = [
  {
    id: '1',
    type: 'person' as const,
    name: 'Mario Rossi',
    location: 'Milano',
    score: 0.85,
    reason: 'Alto interesse acquisto casa + famiglia'
  },
  {
    id: '2', 
    type: 'company' as const,
    name: 'TechCorp Italia',
    location: 'Milano',
    score: 0.78,
    reason: '25 dipendenti, property ad alto valore'
  },
  {
    id: '3',
    type: 'person' as const,
    name: 'Laura Bianchi',
    location: 'Roma', 
    score: 0.72,
    reason: 'Professionista travel-oriented'
  }
]

export default function DashboardPage() {
  const [b2cAnalytics, setB2cAnalytics] = useState<any>(null)
  const [hotB2cLeads, setHotB2cLeads] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [analytics, hotLeads] = await Promise.all([
          getB2CAnalytics(),
          getB2CLeads({ temperature: 'hot', maxDaysOld: 7 })
        ])
        setB2cAnalytics(analytics)
        setHotB2cLeads(hotLeads.slice(0, 5))
      } catch (error) {
        console.error('Error loading dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadDashboardData()
  }, [])

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="border-b pb-4">
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b pb-4">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Lead qualificati da BudgetCasa.it e analytics assicurative.
        </p>
      </div>

      {/* B2C Analytics KPIs */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Lead B2C Totali
            </CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{b2cAnalytics?.totalLeads}</div>
            <p className="text-xs text-muted-foreground">
              Da simulazioni BudgetCasa.it
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Lead Caldi
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{b2cAnalytics?.hotLeads}</div>
            <p className="text-xs text-muted-foreground">
              Attività recente alta
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Valore Stimato
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">€{(b2cAnalytics?.conversionFunnel.estimatedValue / 1000).toFixed(0)}K</div>
            <p className="text-xs text-muted-foreground">
              Commissioni potenziali
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Engagement Score
            </CardTitle>
            <MapPin className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{b2cAnalytics?.avgEngagementScore}/100</div>
            <p className="text-xs text-muted-foreground">
              Qualità media lead
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Hot B2C Leads */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              🔥 Lead Caldi da BudgetCasa.it
              <Button variant="outline" size="sm" asChild>
                <Link href="/leads">
                  <Plus className="mr-2 h-4 w-4" />
                  Vedi Tutti
                </Link>
              </Button>
            </CardTitle>
            <CardDescription>
              Utenti con alta attività recente e budget elevato
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {hotB2cLeads.map((lead) => (
              <div
                key={lead.id}
                className="flex items-center justify-between p-3 rounded-lg border bg-red-50"
              >
                <div className="flex items-center space-x-3">
                  <Users className="h-5 w-5 text-red-600" />
                  <div>
                    <p className="font-medium">{lead.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {lead.geo_city} • Budget {lead.budget_range} • {lead.simulation_count} simulazioni
                    </p>
                    <p className="text-xs text-red-600">
                      🏠 {lead.favorite_neighborhoods[0]} • 📅 {new Date(lead.last_simulation_date).toLocaleDateString('it-IT')}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="destructive">
                    {lead.b2c_engagement_score}/100
                  </Badge>
                  <Button variant="ghost" size="sm">
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* AI-Powered Alerts & Quick Actions */}
        <Card className="bg-gradient-to-br from-purple-50 to-red-50 border-purple-200">
          <CardHeader>
            <CardTitle className="flex items-center text-purple-800">
              🚨 AI ALERTS & AZIONI RAPIDE
            </CardTitle>
            <CardDescription>
              Intelligence AI in tempo reale + operazioni per dominare il mercato
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {/* AI Disaster Alert */}
            <div className="bg-red-100 p-3 rounded-lg border border-red-200 mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-red-800 text-sm">🌪️ DISASTER AI ALERT</span>
                <Badge variant="destructive" className="text-xs">URGENT</Badge>
              </div>
              <p className="text-xs text-red-700 mb-2">
                Emilia-Romagna: 78% probabilità alluvione prossimi 30gg
              </p>
              <div className="flex justify-between text-xs">
                <span>💰 €8.5M opportunity</span>
                <span>⏰ 45 giorni window</span>
              </div>
            </div>

            {/* AI Competitor Alert */}
            <div className="bg-blue-100 p-3 rounded-lg border border-blue-200 mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-blue-800 text-sm">🎯 COMPETITOR AI INTEL</span>
                <Badge className="bg-blue-100 text-blue-800 text-xs">HOT</Badge>
              </div>
              <p className="text-xs text-blue-700 mb-2">
                1,250 clienti Generali insoddisfatti identificati via AI
              </p>
              <div className="flex justify-between text-xs">
                <span>💰 €3.2M poaching potential</span>
                <span>📊 91% success rate</span>
              </div>
            </div>

            <Button className="w-full justify-start bg-purple-600 hover:bg-purple-700 text-white" asChild>
              <Link href="/leads">
                <Users className="mr-2 h-4 w-4" />
                🤖 AI Lead Hunter
              </Link>
            </Button>
            <Button className="w-full justify-start bg-red-600 hover:bg-red-700 text-white" asChild>
              <Link href="/companies">
                <Building className="mr-2 h-4 w-4" />
                📈 Growth Companies Ranking
              </Link>
            </Button>
            <Button className="w-full justify-start bg-blue-600 hover:bg-blue-700 text-white" asChild>
              <Link href="/insights">
                <TrendingUp className="mr-2 h-4 w-4" />
                🧠 AI Extrema Intelligence
              </Link>
            </Button>
            <Button className="w-full justify-start" variant="outline" asChild>
              <Link href="/lists">
                <Plus className="mr-2 h-4 w-4" />
                Nuova Lista Targeting
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* B2C Conversion Funnel */}
      <Card>
        <CardHeader>
          <CardTitle>Funnel Conversione B2C → Assicurazioni</CardTitle>
          <CardDescription>
            Pipeline da simulazioni BudgetCasa.it a opportunità assicurative
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {b2cAnalytics?.conversionFunnel.simulations}
              </div>
              <p className="text-sm text-muted-foreground">Simulazioni Totali</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {b2cAnalytics?.conversionFunnel.completedSimulations}
              </div>
              <p className="text-sm text-muted-foreground">Completate</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {b2cAnalytics?.conversionFunnel.qualifiedLeads}
              </div>
              <p className="text-sm text-muted-foreground">Lead Qualificati</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">
                €{(b2cAnalytics?.conversionFunnel.estimatedValue / 1000).toFixed(0)}K
              </div>
              <p className="text-sm text-muted-foreground">Valore Potenziale</p>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t">
            <h4 className="font-semibold mb-3">Attività Recente da BudgetCasa.it</h4>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-lg font-bold text-green-600">
                  +{b2cAnalytics?.recentActivity.last24h}
                </div>
                <p className="text-sm text-muted-foreground">Ultime 24h</p>
              </div>
              <div>
                <div className="text-lg font-bold text-blue-600">
                  +{b2cAnalytics?.recentActivity.last7days}
                </div>
                <p className="text-sm text-muted-foreground">Ultima settimana</p>
              </div>
              <div>
                <div className="text-lg font-bold text-purple-600">
                  {b2cAnalytics?.recentActivity.last30days}
                </div>
                <p className="text-sm text-muted-foreground">Ultimo mese</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Premium AI Systems - €50,000/month Value */}
      <Card className="bg-gradient-to-r from-yellow-50 via-orange-50 to-red-50 border-yellow-300 mb-6">
        <CardHeader>
          <CardTitle className="flex items-center text-yellow-800">
            👑 PREMIUM AI SYSTEMS - €50,000/MONTH VALUE TIER
          </CardTitle>
          <CardDescription className="text-yellow-700">
            Sistema di dominazione mercato completo con garanzie ROI e controllo territoriale totale
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white p-4 rounded-lg border border-yellow-300">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-yellow-800">🎯 Territory Control</span>
                <Badge className="bg-yellow-100 text-yellow-800">87% DOMINATION</Badge>
              </div>
              <div className="text-2xl font-bold text-yellow-600 mb-1">18 months</div>
              <div className="text-xs text-yellow-700 space-y-1">
                <div>Complete market domination timeline</div>
                <div>💰 Monthly profit: €2.8M guaranteed</div>
                <div>🎯 ROI multiplier: 9.4x in 24 months</div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg border border-orange-300">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-orange-800">⚡ Profit Optimization</span>
                <Badge className="bg-orange-100 text-orange-800">REAL-TIME</Badge>
              </div>
              <div className="text-2xl font-bold text-orange-600 mb-1">€125K</div>
              <div className="text-xs text-orange-700 space-y-1">
                <div>Daily revenue potential guarantee</div>
                <div>🧠 Every decision AI-optimized</div>
                <div>📊 77.6% operational cost reduction</div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg border border-red-300">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-red-800">🧠 Mind Control</span>
                <Badge className="bg-red-100 text-red-800">87% CONVERSION</Badge>
              </div>
              <div className="text-2xl font-bold text-red-600 mb-1">GUARANTEED</div>
              <div className="text-xs text-red-700 space-y-1">
                <div>Customer manipulation success rate</div>
                <div>💀 Competitor elimination systematic</div>
                <div>🌪️ Disaster goldmine 48h advantage</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg border border-green-200">
              <h4 className="font-medium text-green-800 mb-2">💎 IMMEDIATE VALUE UNLOCKED</h4>
              <div className="text-sm space-y-1 text-green-700">
                <div>• <strong>Territory Dominance</strong>: Milano market 87% control in 18 months</div>
                <div>• <strong>Competitor Destruction</strong>: Systematic Generali/Allianz elimination</div>
                <div>• <strong>Customer Poaching</strong>: 8,400 competitors' customers stolen (91% success)</div>
                <div>• <strong>Behavioral Scripts</strong>: AI-generated mind control with 87% conversion</div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-4 rounded-lg border border-purple-200">
              <h4 className="font-medium text-purple-800 mb-2">🚀 DISASTER GOLDMINE ACCESS</h4>
              <div className="text-sm space-y-1 text-purple-700">
                <div>• <strong>Prediction Advantage</strong>: 48h head start vs competitors</div>
                <div>• <strong>Emilia-Romagna Alert</strong>: €12.5M immediate opportunity identified</div>
                <div>• <strong>Sicily Wildfire</strong>: €6.8M market ready for capture</div>
                <div>• <strong>ROI Guarantee</strong>: 8.4x return on disaster campaigns</div>
              </div>
            </div>
          </div>

          <div className="bg-yellow-100 p-4 rounded-lg border border-yellow-300">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-yellow-800">💰 INVESTMENT vs RETURN GUARANTEE</span>
              <Badge className="bg-yellow-600 text-white">RISK-FREE</Badge>
            </div>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div className="text-center">
                <div className="font-bold text-yellow-800">€50K/month</div>
                <div className="text-yellow-700">Investment</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-green-600">€500K/month</div>
                <div className="text-yellow-700">Guaranteed Return</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-blue-600">10:1 ROI</div>
                <div className="text-yellow-700">Profit Multiple</div>
              </div>
            </div>
            <div className="text-xs text-yellow-700 mt-2 text-center">
              💡 "If this system doesn't generate €500K+ monthly profit within 9 months, we refund €150K penalty"
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Top Cities from B2C */}
      <Card>
        <CardHeader>
          <CardTitle>🎯 Territori Caldi</CardTitle>
          <CardDescription>
            Zone con maggior attività di acquisto casa da BudgetCasa.it
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {b2cAnalytics?.topCities.map((city: any, index: number) => (
              <div key={city.city} className="text-center p-4 rounded-lg bg-gray-50">
                <div className="text-2xl font-bold text-blue-600">
                  {city.count}
                </div>
                <p className="font-medium">{city.city}</p>
                <p className="text-sm text-muted-foreground">
                  Lead attivi #{index + 1}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}