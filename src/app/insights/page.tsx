'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Building, 
  MapPin, 
  School,
  ShoppingCart,
  Home,
  Car,
  Heart,
  Shield,
  Zap,
  AlertTriangle,
  CheckCircle,
  LineChart,
  Calendar
} from 'lucide-react'
import { LineChart as ReLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'
// Simplified interfaces for Market Insights page
interface SimpleTerritoryProfile {
  city: string
  quarter: string
  demographic: {
    population: number
    averageAge: number
    familiesWithChildren: number
    averageIncome: number
    educationLevel: 'low' | 'medium' | 'high'
    employmentRate: number
  }
  infrastructure: {
    schools: number
    hospitals: number
    publicTransport: 'excellent' | 'good' | 'poor'
    commercialCenters: number
    parks: number
    criminalityIndex: number
  }
  economicIndicators: {
    averageRent: number
    averagePropertyPrice: number
    businessDensity: number
    tourismIndex: number
    developmentIndex: number
  }
}

interface SimpleInsuranceOpportunity {
  type: string
  name: string
  score: number
  reason: string
  targetAudience: number
}

const ITALIAN_CITIES = [
  'Milano', 'Roma', 'Napoli', 'Torino', 'Palermo', 'Genova', 'Bologna', 
  'Firenze', 'Bari', 'Catania', 'Venezia', 'Verona', 'Messina', 'Padova'
]

// Mock data for price trends (€/mq)
const mockPriceTrends = [
  { year: '2019', milano: 4200, roma: 3800, napoli: 2100, torino: 2400 },
  { year: '2020', milano: 4100, roma: 3700, napoli: 2050, torino: 2350 },
  { year: '2021', milano: 4400, roma: 3950, napoli: 2200, torino: 2500 },
  { year: '2022', milano: 4800, roma: 4200, napoli: 2350, torino: 2700 },
  { year: '2023', milano: 5200, roma: 4500, napoli: 2500, torino: 2900 },
  { year: '2024', milano: 5600, roma: 4800, napoli: 2650, torino: 3100 }
]

// Mock demographic trends
const mockDemographicTrends = [
  { year: '2019', popolazione: 23500, eta_media: 36, reddito_medio: 58000, famiglie_figli: 32 },
  { year: '2020', popolazione: 23800, eta_media: 35, reddito_medio: 59500, famiglie_figli: 33 },
  { year: '2021', popolazione: 24200, eta_media: 35, reddito_medio: 61000, famiglie_figli: 34 },
  { year: '2022', popolazione: 24600, eta_media: 34, reddito_medio: 63000, famiglie_figli: 35 },
  { year: '2023', popolazione: 24900, eta_media: 34, reddito_medio: 64500, famiglie_figli: 35 },
  { year: '2024', popolazione: 25000, eta_media: 34, reddito_medio: 65000, famiglie_figli: 35 }
]

// Mock data for neighborhood price trends (Milano example)
const mockNeighborhoodPrices = {
  'Milano': {
    'Brera': [
      { year: '2019', price: 12000 }, { year: '2020', price: 11800 }, { year: '2021', price: 12500 },
      { year: '2022', price: 13200 }, { year: '2023', price: 14000 }, { year: '2024', price: 14800 }
    ],
    'Isola': [
      { year: '2019', price: 6500 }, { year: '2020', price: 6300 }, { year: '2021', price: 6800 },
      { year: '2022', price: 7200 }, { year: '2023', price: 7800 }, { year: '2024', price: 8400 }
    ],
    'Navigli': [
      { year: '2019', price: 7200 }, { year: '2020', price: 7000 }, { year: '2021', price: 7600 },
      { year: '2022', price: 8100 }, { year: '2023', price: 8700 }, { year: '2024', price: 9300 }
    ],
    'Porta Garibaldi': [
      { year: '2019', price: 8500 }, { year: '2020', price: 8200 }, { year: '2021', price: 8900 },
      { year: '2022', price: 9500 }, { year: '2023', price: 10200 }, { year: '2024', price: 11000 }
    ]
  },
  'Roma': {
    'Centro Storico': [
      { year: '2019', price: 8500 }, { year: '2020', price: 8200 }, { year: '2021', price: 8900 },
      { year: '2022', price: 9400 }, { year: '2023', price: 10000 }, { year: '2024', price: 10600 }
    ],
    'Parioli': [
      { year: '2019', price: 7000 }, { year: '2020', price: 6800 }, { year: '2021', price: 7300 },
      { year: '2022', price: 7800 }, { year: '2023', price: 8300 }, { year: '2024', price: 8900 }
    ],
    'Trastevere': [
      { year: '2019', price: 5500 }, { year: '2020', price: 5300 }, { year: '2021', price: 5800 },
      { year: '2022', price: 6200 }, { year: '2023', price: 6700 }, { year: '2024', price: 7200 }
    ],
    'EUR': [
      { year: '2019', price: 4200 }, { year: '2020', price: 4000 }, { year: '2021', price: 4400 },
      { year: '2022', price: 4700 }, { year: '2023', price: 5100 }, { year: '2024', price: 5500 }
    ]
  }
}

// Mock competitor data
const mockCompetitors = [
  {
    name: 'Generali',
    marketShare: 18.5,
    presenceScore: 85,
    products: ['Casa', 'Auto', 'Vita', 'Salute'],
    strengths: ['Brand consolidato', 'Rete agenziale capillare', 'Prodotti premium'],
    weaknesses: ['Prezzi alti', 'Processi lenti', 'Scarsa digitalizzazione'],
    avgPremium: 1200,
    customerSatisfaction: 7.2
  },
  {
    name: 'UnipolSai',
    marketShare: 15.3,
    presenceScore: 78,
    products: ['Casa', 'Auto', 'Infortuni'],
    strengths: ['Prezzi competitivi', 'Servizio clienti', 'Presenza locale forte'],
    weaknesses: ['Portfolio limitato', 'Innovazione lenta'],
    avgPremium: 950,
    customerSatisfaction: 7.8
  },
  {
    name: 'Allianz',
    marketShare: 12.7,
    presenceScore: 72,
    products: ['Casa', 'Auto', 'Vita', 'Business'],
    strengths: ['Tecnologia avanzata', 'Processi digitali', 'Prodotti innovativi'],
    weaknesses: ['Presenza locale limitata', 'Brand awareness bassa'],
    avgPremium: 1100,
    customerSatisfaction: 7.5
  },
  {
    name: 'Zurich',
    marketShare: 8.9,
    presenceScore: 65,
    products: ['Casa', 'Auto', 'Business'],
    strengths: ['Specializzazione business', 'Consulenza qualificata'],
    weaknesses: ['Mercato consumer limitato', 'Costi elevati'],
    avgPremium: 1350,
    customerSatisfaction: 7.0
  }
]

const cityNeighborhoods = {
  'Milano': ['Brera', 'Isola', 'Navigli', 'Porta Garibaldi'],
  'Roma': ['Centro Storico', 'Parioli', 'Trastevere', 'EUR'],
  'Torino': ['Centro', 'Crocetta', 'San Salvario', 'Borgo Po'],
  'Napoli': ['Centro Storico', 'Vomero', 'Posillipo', 'Chiaia']
}

// Mock data per demonstration
const mockTerritoryData: SimpleTerritoryProfile = {
  city: 'Milano',
  quarter: 'Isola',
  demographic: {
    population: 25000,
    averageAge: 34,
    familiesWithChildren: 0.35,
    averageIncome: 65000,
    educationLevel: 'high',
    employmentRate: 0.92
  },
  infrastructure: {
    schools: 12,
    hospitals: 2,
    publicTransport: 'excellent',
    commercialCenters: 8,
    parks: 5,
    criminalityIndex: 0.15
  },
  economicIndicators: {
    averageRent: 2800,
    averagePropertyPrice: 8500,
    businessDensity: 0.25,
    tourismIndex: 0.8,
    developmentIndex: 0.85
  }
}

export default function InsightsPage() {
  const [selectedCity, setSelectedCity] = useState('Milano')
  const [selectedView, setSelectedView] = useState<'city' | 'neighborhood'>('city')
  const [selectedNeighborhoods, setSelectedNeighborhoods] = useState<string[]>(['Brera', 'Isola'])
  const [territoryProfile, setTerritoryProfile] = useState<SimpleTerritoryProfile>(mockTerritoryData)
  const [insuranceOpportunities, setInsuranceOpportunities] = useState<SimpleInsuranceOpportunity[]>([])
  const [loading, setLoading] = useState(false)

  // Simple insurance opportunity generator
  const generateInsuranceOpportunities = (profile: SimpleTerritoryProfile): SimpleInsuranceOpportunity[] => {
    const opportunities: SimpleInsuranceOpportunity[] = []
    
    // Home insurance opportunities
    if (profile.demographic.averageIncome > 50000 && profile.infrastructure.criminalityIndex < 0.3) {
      opportunities.push({
        type: 'home',
        name: 'Assicurazione Casa Premium',
        score: 0.85,
        reason: 'Alto reddito medio e basso tasso di criminalità rendono questo territorio ideale per polizze casa premium.',
        targetAudience: 0.4
      })
    }

    // Auto insurance 
    if (profile.infrastructure.publicTransport !== 'excellent' && profile.demographic.population > 15000) {
      opportunities.push({
        type: 'auto',
        name: 'RC Auto e Kasko',
        score: 0.75,
        reason: 'Trasporti pubblici limitati aumentano la dipendenza dalle auto private.',
        targetAudience: 0.6
      })
    }

    // Life insurance
    if (profile.demographic.familiesWithChildren > 0.3 && profile.demographic.averageAge < 40) {
      opportunities.push({
        type: 'life',
        name: 'Assicurazione Vita Famiglia',
        score: 0.8,
        reason: 'Alta percentuale di famiglie giovani con figli richiede protezione finanziaria.',
        targetAudience: 0.35
      })
    }

    // Health insurance
    if (profile.infrastructure.hospitals < 3 && profile.demographic.averageIncome > 45000) {
      opportunities.push({
        type: 'health',
        name: 'Assicurazione Sanitaria Integrativa',
        score: 0.7,
        reason: 'Pochi ospedali nella zona e alto reddito creano domanda per sanità privata.',
        targetAudience: 0.25
      })
    }

    return opportunities
  }

  useEffect(() => {
    // Simulate API call for territory analysis
    setLoading(true)
    setTimeout(() => {
      const opportunities = generateInsuranceOpportunities(territoryProfile)
      setInsuranceOpportunities(opportunities)
      setLoading(false)
    }, 1000)
  }, [selectedCity])

  const getOpportunityIcon = (type: string) => {
    switch (type) {
      case 'home': return <Home className="h-4 w-4" />
      case 'auto': return <Car className="h-4 w-4" />
      case 'life': return <Heart className="h-4 w-4" />
      case 'health': return <Shield className="h-4 w-4" />
      default: return <Zap className="h-4 w-4" />
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 0.8) return 'bg-green-100 text-green-800'
    if (score >= 0.6) return 'bg-yellow-100 text-yellow-800'
    return 'bg-red-100 text-red-800'
  }

  // Function to combine neighborhood data for chart
  const getCombinedNeighborhoodData = () => {
    if (!mockNeighborhoodPrices[selectedCity as keyof typeof mockNeighborhoodPrices]) return []
    
    const neighborhood1Data = mockNeighborhoodPrices[selectedCity as keyof typeof mockNeighborhoodPrices][selectedNeighborhoods[0]] || []
    const neighborhood2Data = mockNeighborhoodPrices[selectedCity as keyof typeof mockNeighborhoodPrices][selectedNeighborhoods[1]] || []
    
    return neighborhood1Data.map((item, index) => ({
      year: item.year,
      [selectedNeighborhoods[0]]: item.price,
      [selectedNeighborhoods[1]]: neighborhood2Data[index]?.price || 0
    }))
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Market Insights & Territory Research</h1>
          <p className="text-muted-foreground">
            Analisi del territorio e opportunità assicurative per la tua zona
          </p>
        </div>
        <Select value={selectedCity} onValueChange={setSelectedCity}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Seleziona città" />
          </SelectTrigger>
          <SelectContent>
            {ITALIAN_CITIES.map((city) => (
              <SelectItem key={city} value={city}>
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2" />
                  {city}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Panoramica</TabsTrigger>
          <TabsTrigger value="demographics">Demografia</TabsTrigger>
          <TabsTrigger value="trends">Andamenti</TabsTrigger>
          <TabsTrigger value="opportunities">Opportunità</TabsTrigger>
          <TabsTrigger value="competition">Competizione</TabsTrigger>
          <TabsTrigger value="ai-extrema" className="bg-gradient-to-r from-purple-600 to-red-600 text-white">🤖 AI Extrema</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Popolazione</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{territoryProfile.demographic.population.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  Età media: {territoryProfile.demographic.averageAge} anni
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Reddito Medio</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">€{territoryProfile.demographic.averageIncome.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  Tasso occupazione: {Math.round(territoryProfile.demographic.employmentRate * 100)}%
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Famiglie con Figli</CardTitle>
                <Home className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{Math.round(territoryProfile.demographic.familiesWithChildren * 100)}%</div>
                <p className="text-xs text-muted-foreground">
                  Alta domanda assicurazioni famiglia
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Sicurezza</CardTitle>
                <Shield className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {territoryProfile.infrastructure.criminalityIndex < 0.2 ? 'Alta' : 'Media'}
                </div>
                <p className="text-xs text-muted-foreground">
                  Indice criminalità: {Math.round(territoryProfile.infrastructure.criminalityIndex * 100)}%
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Territory Score Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="h-5 w-5 mr-2" />
                Valutazione Territorio: {selectedCity}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Potenziale Assicurativo</span>
                    <Badge className={getScoreColor(territoryProfile.economicIndicators.developmentIndex)}>
                      {Math.round(territoryProfile.economicIndicators.developmentIndex * 100)}/100
                    </Badge>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{width: `${territoryProfile.economicIndicators.developmentIndex * 100}%`}}
                    ></div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Crescita Economica</span>
                    <Badge className={getScoreColor(territoryProfile.economicIndicators.businessDensity)}>
                      {Math.round(territoryProfile.economicIndicators.businessDensity * 100)}/100
                    </Badge>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full" 
                      style={{width: `${territoryProfile.economicIndicators.businessDensity * 100}%`}}
                    ></div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Qualità Servizi</span>
                    <Badge className={getScoreColor(0.85)}>
                      85/100
                    </Badge>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-purple-600 h-2 rounded-full" style={{width: '85%'}}></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="demographics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Demographic Profile */}
            <Card>
              <CardHeader>
                <CardTitle>Profilo Demografico</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Popolazione totale</span>
                  <strong>{territoryProfile.demographic.population.toLocaleString()}</strong>
                </div>
                <div className="flex items-center justify-between">
                  <span>Età media</span>
                  <strong>{territoryProfile.demographic.averageAge} anni</strong>
                </div>
                <div className="flex items-center justify-between">
                  <span>Famiglie con figli</span>
                  <strong>{Math.round(territoryProfile.demographic.familiesWithChildren * 100)}%</strong>
                </div>
                <div className="flex items-center justify-between">
                  <span>Livello educazione</span>
                  <Badge variant="secondary">
                    {territoryProfile.demographic.educationLevel === 'high' ? 'Alto' : 'Medio'}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Tasso occupazione</span>
                  <strong>{Math.round(territoryProfile.demographic.employmentRate * 100)}%</strong>
                </div>
              </CardContent>
            </Card>

            {/* Infrastructure */}
            <Card>
              <CardHeader>
                <CardTitle>Infrastrutture</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <School className="h-4 w-4 mr-2" />
                    <span>Scuole</span>
                  </div>
                  <strong>{territoryProfile.infrastructure.schools}</strong>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Shield className="h-4 w-4 mr-2" />
                    <span>Ospedali</span>
                  </div>
                  <strong>{territoryProfile.infrastructure.hospitals}</strong>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    <span>Centri commerciali</span>
                  </div>
                  <strong>{territoryProfile.infrastructure.commercialCenters}</strong>
                </div>
                <div className="flex items-center justify-between">
                  <span>Trasporti pubblici</span>
                  <Badge variant="secondary">
                    {territoryProfile.infrastructure.publicTransport === 'excellent' ? 'Eccellenti' : 'Buoni'}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Indice criminalità</span>
                  <Badge className={territoryProfile.infrastructure.criminalityIndex < 0.2 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                    {territoryProfile.infrastructure.criminalityIndex < 0.2 ? 'Basso' : 'Medio'}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          {/* Price Trends */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center">
                    <LineChart className="h-5 w-5 mr-2" />
                    Andamento Prezzi Immobiliari (€/mq)
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {selectedView === 'city' 
                      ? 'Confronto year-on-year dei prezzi al metro quadro nelle principali città'
                      : `Confronto quartieri - ${selectedCity}`
                    }
                  </p>
                </div>
                <div className="flex space-x-2">
                  <Select value={selectedView} onValueChange={(value: 'city' | 'neighborhood') => setSelectedView(value)}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="city">Per Città</SelectItem>
                      <SelectItem value="neighborhood">Per Quartiere</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              {selectedView === 'neighborhood' && (
                <div className="flex space-x-2 mt-4">
                  <Select 
                    value={selectedNeighborhoods[0]} 
                    onValueChange={(value) => setSelectedNeighborhoods([value, selectedNeighborhoods[1]])}
                  >
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Quartiere 1" />
                    </SelectTrigger>
                    <SelectContent>
                      {cityNeighborhoods[selectedCity as keyof typeof cityNeighborhoods]?.map((neighborhood) => (
                        <SelectItem key={neighborhood} value={neighborhood}>
                          {neighborhood}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select 
                    value={selectedNeighborhoods[1]} 
                    onValueChange={(value) => setSelectedNeighborhoods([selectedNeighborhoods[0], value])}
                  >
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Quartiere 2" />
                    </SelectTrigger>
                    <SelectContent>
                      {cityNeighborhoods[selectedCity as keyof typeof cityNeighborhoods]?.map((neighborhood) => (
                        <SelectItem key={neighborhood} value={neighborhood}>
                          {neighborhood}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </CardHeader>
            <CardContent>
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  {selectedView === 'city' ? (
                    <ReLineChart data={mockPriceTrends}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="year" />
                      <YAxis />
                      <Tooltip 
                        formatter={(value, name) => [`€${value}/mq`, name.charAt(0).toUpperCase() + name.slice(1)]}
                        labelFormatter={(label) => `Anno ${label}`}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="milano" 
                        stroke="#2563eb" 
                        strokeWidth={3}
                        dot={{ r: 5 }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="roma" 
                        stroke="#dc2626" 
                        strokeWidth={2}
                        dot={{ r: 4 }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="torino" 
                        stroke="#16a34a" 
                        strokeWidth={2}
                        dot={{ r: 4 }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="napoli" 
                        stroke="#ca8a04" 
                        strokeWidth={2}
                        dot={{ r: 4 }}
                      />
                    </ReLineChart>
                  ) : (
                    <ReLineChart data={getCombinedNeighborhoodData()}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="year" />
                      <YAxis />
                      <Tooltip 
                        formatter={(value, name) => [`€${value}/mq`, name]}
                        labelFormatter={(label) => `Anno ${label}`}
                      />
                      <Line 
                        type="monotone" 
                        dataKey={selectedNeighborhoods[0]}
                        stroke="#2563eb" 
                        strokeWidth={3}
                        dot={{ r: 5 }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey={selectedNeighborhoods[1]}
                        stroke="#dc2626" 
                        strokeWidth={2}
                        dot={{ r: 4 }}
                      />
                    </ReLineChart>
                  )}
                </ResponsiveContainer>
              </div>
              
              {/* Price Growth Summary */}
              {selectedView === 'city' ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">+33%</div>
                    <div className="text-sm text-muted-foreground">Milano (2019-2024)</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">+26%</div>
                    <div className="text-sm text-muted-foreground">Roma (2019-2024)</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">+29%</div>
                    <div className="text-sm text-muted-foreground">Torino (2019-2024)</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-600">+26%</div>
                    <div className="text-sm text-muted-foreground">Napoli (2019-2024)</div>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {selectedNeighborhoods[0] === 'Brera' ? '+23%' : 
                       selectedNeighborhoods[0] === 'Isola' ? '+29%' :
                       selectedNeighborhoods[0] === 'Navigli' ? '+29%' : '+29%'}
                    </div>
                    <div className="text-sm text-muted-foreground">{selectedNeighborhoods[0]} (2019-2024)</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">
                      {selectedNeighborhoods[1] === 'Brera' ? '+23%' : 
                       selectedNeighborhoods[1] === 'Isola' ? '+29%' :
                       selectedNeighborhoods[1] === 'Navigli' ? '+29%' : '+29%'}
                    </div>
                    <div className="text-sm text-muted-foreground">{selectedNeighborhoods[1]} (2019-2024)</div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Demographic Trends */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  Andamento Demografico - {selectedCity}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <ReLineChart data={mockDemographicTrends}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="year" />
                      <YAxis />
                      <Tooltip />
                      <Line 
                        type="monotone" 
                        dataKey="popolazione" 
                        stroke="#8884d8" 
                        strokeWidth={2}
                      />
                    </ReLineChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 text-center">
                  <div className="text-lg font-semibold text-green-600">+6.4%</div>
                  <div className="text-sm text-muted-foreground">Crescita popolazione (2019-2024)</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2" />
                  Reddito Medio Annuale
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={mockDemographicTrends}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="year" />
                      <YAxis />
                      <Tooltip 
                        formatter={(value) => [`€${value.toLocaleString()}`, 'Reddito Medio']}
                      />
                      <Bar dataKey="reddito_medio" fill="#3b82f6" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 text-center">
                  <div className="text-lg font-semibold text-blue-600">+12.1%</div>
                  <div className="text-sm text-muted-foreground">Crescita reddito (2019-2024)</div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Market Analysis */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                Analisi di Mercato - Insights Assicurativi
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <div className="flex items-center mb-2">
                    <TrendingUp className="h-5 w-5 text-green-600 mr-2" />
                    <h3 className="font-semibold text-green-800">Crescita Sostenuta</h3>
                  </div>
                  <p className="text-sm text-green-700">
                    I prezzi immobiliari in crescita del 26-33% dal 2019 indicano un mercato immobiliare forte. 
                    Ottima opportunità per assicurazioni casa premium.
                  </p>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <div className="flex items-center mb-2">
                    <Users className="h-5 w-5 text-blue-600 mr-2" />
                    <h3 className="font-semibold text-blue-800">Demografia Positiva</h3>
                  </div>
                  <p className="text-sm text-blue-700">
                    Popolazione in crescita (+6.4%) e redditi in aumento (+12.1%) creano una base 
                    clientelare sempre più solida per prodotti assicurativi.
                  </p>
                </div>

                <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                  <div className="flex items-center mb-2">
                    <Shield className="h-5 w-5 text-purple-600 mr-2" />
                    <h3 className="font-semibold text-purple-800">Protezione Patrimoniale</h3>
                  </div>
                  <p className="text-sm text-purple-700">
                    Con valori immobiliari elevati, cresce la necessità di protezione patrimoniale. 
                    Focus su polizze casa e responsabilità civile.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="opportunities" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Opportunità Assicurative nel Territorio</CardTitle>
              <p className="text-sm text-muted-foreground">
                Analisi basata sui dati demografici e caratteristiche del territorio
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {insuranceOpportunities.map((opportunity, index) => (
                  <Card key={index} className="border-l-4 border-l-blue-500">
                    <CardContent className="pt-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                          {getOpportunityIcon(opportunity.type)}
                          <h3 className="font-semibold ml-2">{opportunity.name}</h3>
                        </div>
                        <Badge className={getScoreColor(opportunity.score)}>
                          {Math.round(opportunity.score * 100)}%
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        {opportunity.reason}
                      </p>
                      <div className="space-y-2">
                        <div className="text-xs text-muted-foreground">Target potenziale</div>
                        <div className="text-sm font-medium">
                          {Math.round(opportunity.targetAudience * territoryProfile.demographic.population)} persone
                        </div>
                      </div>
                      <div className="flex items-center mt-3 text-xs text-green-600">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Opportunità elevata
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="competition" className="space-y-6">
          {/* Market Share Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="h-5 w-5 mr-2" />
                Panoramica Quote di Mercato - {selectedCity}
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Analisi dei principali competitor assicurativi nel territorio
              </p>
            </CardHeader>
            <CardContent>
              <div className="h-64 w-full mb-6">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={mockCompetitors}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`${value}%`, 'Quota di Mercato']} />
                    <Bar dataKey="marketShare" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {mockCompetitors.map((competitor, index) => (
                  <div key={competitor.name} className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{competitor.marketShare}%</div>
                    <div className="text-sm text-muted-foreground">{competitor.name}</div>
                    <div className="text-xs text-green-600">
                      €{competitor.avgPremium} premio medio
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Competitor Analysis Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {mockCompetitors.map((competitor, index) => (
              <Card key={competitor.name} className="border-l-4 border-l-blue-500">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{competitor.name}</CardTitle>
                    <div className="flex space-x-2">
                      <Badge variant="secondary">{competitor.marketShare}% quota</Badge>
                      <Badge 
                        className={competitor.presenceScore >= 80 ? 'bg-green-100 text-green-800' : 
                                  competitor.presenceScore >= 60 ? 'bg-yellow-100 text-yellow-800' : 
                                  'bg-red-100 text-red-800'}
                      >
                        Presenza: {competitor.presenceScore}/100
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Products */}
                  <div>
                    <h4 className="font-medium text-sm mb-2">Prodotti Principali</h4>
                    <div className="flex flex-wrap gap-1">
                      {competitor.products.map((product) => (
                        <Badge key={product} variant="outline" className="text-xs">
                          {product}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Key Metrics */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-lg font-semibold text-green-600">
                        €{competitor.avgPremium.toLocaleString()}
                      </div>
                      <div className="text-xs text-muted-foreground">Premio Medio</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-semibold text-blue-600">
                        {competitor.customerSatisfaction}/10
                      </div>
                      <div className="text-xs text-muted-foreground">Soddisfazione</div>
                    </div>
                  </div>

                  {/* Strengths */}
                  <div>
                    <h4 className="font-medium text-sm mb-2 text-green-700">Punti di Forza</h4>
                    <ul className="text-xs space-y-1">
                      {competitor.strengths.map((strength, i) => (
                        <li key={i} className="flex items-center">
                          <CheckCircle className="h-3 w-3 text-green-500 mr-1" />
                          {strength}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Weaknesses */}
                  <div>
                    <h4 className="font-medium text-sm mb-2 text-red-700">Debolezze</h4>
                    <ul className="text-xs space-y-1">
                      {competitor.weaknesses.map((weakness, i) => (
                        <li key={i} className="flex items-center">
                          <AlertTriangle className="h-3 w-3 text-red-500 mr-1" />
                          {weakness}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Competitive Opportunities */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Zap className="h-5 w-5 mr-2" />
                Opportunità Competitive
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <div className="flex items-center mb-2">
                    <TrendingUp className="h-5 w-5 text-green-600 mr-2" />
                    <h3 className="font-semibold text-green-800">Pricing Competitivo</h3>
                  </div>
                  <p className="text-sm text-green-700 mb-2">
                    UnipolSai offre premi più bassi (€950 vs €1200 Generali). 
                    Opportunità per posizionamento intermedio.
                  </p>
                  <Badge className="bg-green-100 text-green-800">
                    Gap €250 premio medio
                  </Badge>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <div className="flex items-center mb-2">
                    <Zap className="h-5 w-5 text-blue-600 mr-2" />
                    <h3 className="font-semibold text-blue-800">Innovazione Digitale</h3>
                  </div>
                  <p className="text-sm text-blue-700 mb-2">
                    Solo Allianz investe in processi digitali. 
                    Mercato aperto per soluzioni innovative.
                  </p>
                  <Badge className="bg-blue-100 text-blue-800">
                    72% presenza digitale
                  </Badge>
                </div>

                <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                  <div className="flex items-center mb-2">
                    <Users className="h-5 w-5 text-purple-600 mr-2" />
                    <h3 className="font-semibold text-purple-800">Servizio Clienti</h3>
                  </div>
                  <p className="text-sm text-purple-700 mb-2">
                    UnipolSai leader soddisfazione (7.8/10). 
                    Focus su esperienza cliente può differenziare.
                  </p>
                  <Badge className="bg-purple-100 text-purple-800">
                    7.4 media settore
                  </Badge>
                </div>
              </div>

              {/* Strategic Recommendations */}
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold mb-3">Raccomandazioni Strategiche</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-sm mb-2">🎯 Targeting Ottimale</h4>
                    <ul className="text-xs space-y-1">
                      <li>• Famiglie giovani (gap Generali)</li>
                      <li>• Piccole imprese (debole presenza Zurich)</li>
                      <li>• Segmento digitale (solo Allianz presente)</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-sm mb-2">💡 Positioning Consigliato</h4>
                    <ul className="text-xs space-y-1">
                      <li>• Premio intermedio (€1000-1100)</li>
                      <li>• Servizio clienti premium</li>
                      <li>• Processi digitali avanzati</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ai-extrema" className="space-y-6">
          {/* AI System Status Dashboard */}
          <Card className="bg-gradient-to-br from-purple-50 to-red-50 border-purple-200">
            <CardHeader>
              <CardTitle className="flex items-center text-purple-800">
                🧠 AI EXTREMA - Sistema di Intelligenza Predittiva
              </CardTitle>
              <p className="text-sm text-purple-600">
                Algoritmi di Machine Learning avanzati per dominare il mercato assicurativo
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white rounded-lg p-4 border border-purple-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Catastrophic AI</span>
                    <Badge className="bg-red-100 text-red-800">ACTIVE</Badge>
                  </div>
                  <div className="text-2xl font-bold text-red-600">87%</div>
                  <p className="text-xs text-muted-foreground">Accuracy Rate</p>
                </div>
                
                <div className="bg-white rounded-lg p-4 border border-purple-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Vision AI</span>
                    <Badge className="bg-blue-100 text-blue-800">LEARNING</Badge>
                  </div>
                  <div className="text-2xl font-bold text-blue-600">94%</div>
                  <p className="text-xs text-muted-foreground">Property Risk Detection</p>
                </div>

                <div className="bg-white rounded-lg p-4 border border-purple-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Behavioral AI</span>
                    <Badge className="bg-green-100 text-green-800">OPTIMIZED</Badge>
                  </div>
                  <div className="text-2xl font-bold text-green-600">73%</div>
                  <p className="text-xs text-muted-foreground">Conversion Boost</p>
                </div>

                <div className="bg-white rounded-lg p-4 border border-purple-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Pricing AI</span>
                    <Badge className="bg-yellow-100 text-yellow-800">DYNAMIC</Badge>
                  </div>
                  <div className="text-2xl font-bold text-yellow-600">+€2.3M</div>
                  <p className="text-xs text-muted-foreground">Revenue Impact</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Disaster Prediction Engine */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-red-200">
              <CardHeader>
                <CardTitle className="flex items-center text-red-700">
                  🌪️ DISASTER PREDICTION ENGINE
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-red-800">🚨 ALLERTA EMILIA-ROMAGNA</span>
                      <Badge variant="destructive">CRITICO</Badge>
                    </div>
                    <p className="text-sm text-red-700 mb-2">
                      Probabilità alluvione nei prossimi 30 giorni: <strong>78%</strong>
                    </p>
                    <div className="text-xs space-y-1">
                      <div>💰 Mercato stimato: €8.5M</div>
                      <div>🎯 Target popolazione: 280,000</div>
                      <div>⏰ Finestra ottimale: 45 giorni post-evento</div>
                    </div>
                  </div>

                  <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-orange-800">🔥 RISCHIO INCENDI SICILIA</span>
                      <Badge className="bg-orange-100 text-orange-800">ALTO</Badge>
                    </div>
                    <p className="text-sm text-orange-700 mb-2">
                      Pattern meteo anomali rilevati: <strong>85%</strong>
                    </p>
                    <div className="text-xs space-y-1">
                      <div>💰 Opportunità: €450K</div>
                      <div>🎯 Zone calde: Palermo, Catania</div>
                      <div>📈 Conversione stimata: +28%</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-purple-200">
              <CardHeader>
                <CardTitle className="flex items-center text-purple-700">
                  🎭 BEHAVIORAL MANIPULATION ENGINE
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                    <h4 className="font-medium text-purple-800 mb-2">🧠 Psychological Triggers Active</h4>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                        Loss Aversion: 89%
                      </div>
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                        Social Proof: 76%
                      </div>
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></div>
                        Scarcity: 91%
                      </div>
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
                        Fear Factor: 83%
                      </div>
                    </div>
                  </div>

                  <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-200">
                    <h4 className="font-medium text-indigo-800 mb-2">💬 AI-Generated Scripts</h4>
                    <div className="text-xs space-y-2">
                      <div className="bg-white p-2 rounded border">
                        <span className="font-medium">Milano Target:</span> "I tuoi vicini in Brera hanno già protetto case da €2M..."
                      </div>
                      <div className="bg-white p-2 rounded border">
                        <span className="font-medium">Post-Disaster:</span> "280,000 colpiti in Emilia-Romagna. Chi aveva protezione ora sta ricostruendo..."
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Real-Time Market Intelligence */}
          <Card className="border-blue-200">
            <CardHeader>
              <CardTitle className="flex items-center text-blue-700">
                🕷️ COMPETITIVE INTELLIGENCE NETWORK
              </CardTitle>
              <p className="text-sm text-blue-600">
                Monitoraggio real-time di competitor, pricing e sentiment di mercato
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">💰 Price Wars Intelligence</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Generali Casa:</span>
                      <span className="text-red-600">↑ +5.2%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Allianz Base:</span>
                      <span className="text-green-600">↓ -2.1%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>UnipolSai:</span>
                      <span className="text-gray-600">→ stabile</span>
                    </div>
                    <Badge className="w-full justify-center bg-blue-100 text-blue-800 mt-2">
                      Opportunity: -€85 vs competitors
                    </Badge>
                  </div>
                </div>

                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">📱 Social Sentiment AI</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Our Brand:</span>
                      <Badge className="bg-green-100 text-green-800">+0.73</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Generali:</span>
                      <Badge className="bg-yellow-100 text-yellow-800">+0.45</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Allianz:</span>
                      <Badge className="bg-orange-100 text-orange-800">+0.38</Badge>
                    </div>
                    <div className="text-xs text-green-700 mt-2">
                      🔥 Trending: #climateAnxiety (+78% engagement)
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">⚡ Dynamic Pricing Engine</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Current Multiplier:</span>
                      <Badge className="bg-yellow-100 text-yellow-800">1.34x</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Demand Signal:</span>
                      <span className="text-red-600">🔥 HIGH</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Optimal Window:</span>
                      <span className="text-blue-600">6h remaining</span>
                    </div>
                    <div className="text-xs text-yellow-700 mt-2">
                      💡 Revenue boost: +€2.3M projected
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* AI-Powered Revenue Opportunities */}
          <Card className="border-green-200 bg-gradient-to-r from-green-50 to-emerald-50">
            <CardHeader>
              <CardTitle className="flex items-center text-green-700">
                💎 AI-GENERATED REVENUE OPPORTUNITIES
              </CardTitle>
              <p className="text-sm text-green-600">
                Machine Learning identifica opportunità ad alto ROI in tempo reale
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-4 text-green-800">🎯 Immediate Strike Opportunities</h4>
                  <div className="space-y-3">
                    <div className="bg-white p-3 rounded-lg border border-green-200">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium">Climate Premium Products</span>
                        <Badge className="bg-green-100 text-green-800">ROI: 3.4x</Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        Target zones ad alto rischio climatico con prodotti premium
                      </p>
                      <div className="flex justify-between text-xs">
                        <span>💰 €15M potential</span>
                        <span>📊 78% probability</span>
                        <span>⏰ 12 months</span>
                      </div>
                    </div>

                    <div className="bg-white p-3 rounded-lg border border-blue-200">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium">Competitor Customer Poaching</span>
                        <Badge className="bg-blue-100 text-blue-800">ROI: 2.8x</Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        1,250 clienti Generali insoddisfatti identificati
                      </p>
                      <div className="flex justify-between text-xs">
                        <span>💰 €3.2M potential</span>
                        <span>📊 91% probability</span>
                        <span>⏰ 6 months</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-4 text-purple-800">🚀 Market Domination Strategy</h4>
                  <div className="space-y-3">
                    <div className="bg-purple-100 p-3 rounded-lg">
                      <div className="font-medium mb-2">Phase 1: AI Surge Pricing</div>
                      <ul className="text-xs space-y-1">
                        <li>• Deploy dynamic pricing in disaster zones</li>
                        <li>• Exploit competitor pricing gaps</li>
                        <li>• Behavioral psychology campaigns</li>
                      </ul>
                    </div>

                    <div className="bg-red-100 p-3 rounded-lg">
                      <div className="font-medium mb-2">Phase 2: Viral Fear Marketing</div>
                      <ul className="text-xs space-y-1">
                        <li>• AI-generated viral content campaigns</li>
                        <li>• Social media panic amplification</li>
                        <li>• Influencer disaster testimonials</li>
                      </ul>
                    </div>

                    <div className="bg-yellow-100 p-3 rounded-lg">
                      <div className="font-medium mb-2">Phase 3: Total Market Control</div>
                      <ul className="text-xs space-y-1">
                        <li>• Predictive claims fraud elimination</li>
                        <li>• AI-powered referral networks</li>
                        <li>• Corner climate insurance market</li>
                      </ul>
                      <Badge className="mt-2 bg-yellow-600 text-white">
                        Target: 87% Market Domination
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}