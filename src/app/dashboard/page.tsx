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
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b pb-4">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Panoramica delle tue attività e opportunità.
        </p>
      </div>

      {/* KPIs Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi) => (
          <Card key={kpi.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {kpi.title}
              </CardTitle>
              <kpi.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{kpi.value}</div>
              <p className="text-xs text-muted-foreground">
                {kpi.change}
                {kpi.trend === 'up' && (
                  <TrendingUp className="inline ml-1 h-3 w-3 text-green-600" />
                )}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Suggested Leads */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Suggeriti per Te
              <Button variant="outline" size="sm" asChild>
                <Link href="/leads">
                  <Plus className="mr-2 h-4 w-4" />
                  Vedi Tutti
                </Link>
              </Button>
            </CardTitle>
            <CardDescription>
              Lead con alte probabilità di conversione
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {suggestedLeads.map((lead) => (
              <div
                key={lead.id}
                className="flex items-center justify-between p-3 rounded-lg border"
              >
                <div className="flex items-center space-x-3">
                  {lead.type === 'person' ? (
                    <Users className="h-5 w-5 text-blue-600" />
                  ) : (
                    <Building className="h-5 w-5 text-green-600" />
                  )}
                  <div>
                    <p className="font-medium">{lead.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {lead.location} • {lead.reason}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary">
                    {Math.round(lead.score * 100)}%
                  </Badge>
                  <Button variant="ghost" size="sm">
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Azioni Rapide</CardTitle>
            <CardDescription>
              Operazioni comuni per velocizzare il tuo lavoro
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start" asChild>
              <Link href="/leads">
                <Users className="mr-2 h-4 w-4" />
                Cerca Lead Persone
              </Link>
            </Button>
            <Button className="w-full justify-start" variant="outline" asChild>
              <Link href="/companies">
                <Building className="mr-2 h-4 w-4" />
                Directory Aziende
              </Link>
            </Button>
            <Button className="w-full justify-start" variant="outline" asChild>
              <Link href="/lists">
                <Plus className="mr-2 h-4 w-4" />
                Nuova Lista
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity Placeholder */}
      <Card>
        <CardHeader>
          <CardTitle>Attività Recente</CardTitle>
          <CardDescription>
            Le tue ultime azioni sulla piattaforma
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <p>Nessuna attività recente da visualizzare.</p>
            <p className="text-sm">
              Inizia cercando lead o aziende per vedere l'attività qui.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}