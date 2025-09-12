'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Calculator,
  TrendingUp,
  DollarSign,
  Target,
  AlertTriangle,
  CheckCircle,
  Zap,
  Brain,
  BarChart,
  PieChart
} from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart as RechartsBarChart, Bar } from 'recharts'
import { INSURANCE_PRODUCTS, type InsuranceProductType } from '@/lib/insurance-propensity-engine'

interface PremiumRecommendation {
  product: InsuranceProductType
  recommended_premium: number
  confidence: number // 0-100
  market_range: {
    min: number
    max: number
    avg: number
  }
  risk_factors: string[]
  competitive_position: 'aggressive' | 'market' | 'premium'
  expected_conversion_rate: number
  justification: string
}

interface CompetitorAnalysis {
  competitor: string
  market_share: number
  avg_premium: number
  positioning: string
  strengths: string[]
  weaknesses: string[]
}

interface PricingSensitivityAnalysis {
  price_point: number
  conversion_probability: number
  expected_revenue: number
  market_penetration: number
}

export function PremiumIntelligenceSystem() {
  const [selectedLead, setSelectedLead] = useState<any>(null)
  const [selectedProduct, setSelectedProduct] = useState<InsuranceProductType>('CASA')
  const [premiumRecommendations, setPremiumRecommendations] = useState<PremiumRecommendation[]>([])
  const [competitorAnalysis, setCompetitorAnalysis] = useState<CompetitorAnalysis[]>([])
  const [pricingSensitivity, setPricingSensitivity] = useState<PricingSensitivityAnalysis[]>([])
  const [loading, setLoading] = useState(false)

  // Mock data generation
  useEffect(() => {
    const generatePremiumRecommendations = (): PremiumRecommendation[] => {
      const products: InsuranceProductType[] = ['CASA', 'AUTO', 'VITA', 'BUSINESS', 'HEALTH', 'PROFESSIONAL', 'CYBER']
      
      return products.map(product => {
        const basePrice = INSURANCE_PRODUCTS[product].avgPremium
        const riskMultiplier = 0.8 + (Math.random() * 0.4) // 0.8 - 1.2
        const recommended = Math.floor(basePrice * riskMultiplier)
        
        return {
          product,
          recommended_premium: recommended,
          confidence: Math.floor(75 + Math.random() * 20), // 75-95%
          market_range: {
            min: Math.floor(basePrice * 0.7),
            max: Math.floor(basePrice * 1.4),
            avg: basePrice
          },
          risk_factors: generateRiskFactors(product),
          competitive_position: riskMultiplier < 0.9 ? 'aggressive' : riskMultiplier > 1.1 ? 'premium' : 'market',
          expected_conversion_rate: Math.floor(20 + (1.2 - riskMultiplier) * 30), // inverse relationship
          justification: generateJustification(product, riskMultiplier)
        }
      })
    }

    const generateCompetitorAnalysis = (): CompetitorAnalysis[] => {
      return [
        {
          competitor: 'UnipolSai',
          market_share: 28,
          avg_premium: 2850,
          positioning: 'Market Leader',
          strengths: ['Brand riconosciuto', 'Rete agenziale estesa', 'Prodotti completi'],
          weaknesses: ['Prezzi elevati', 'Digitalizzazione lenta', 'Flessibilità limitata']
        },
        {
          competitor: 'Generali',
          market_share: 22,
          avg_premium: 3200,
          positioning: 'Premium Player',
          strengths: ['Prestigio internazionale', 'Prodotti sofisticati', 'Servizi premium'],
          weaknesses: ['Target limitato', 'Complessità processi', 'Prezzi molto alti']
        },
        {
          competitor: 'Allianz',
          market_share: 18,
          avg_premium: 2950,
          positioning: 'Innovation Leader', 
          strengths: ['Tecnologia avanzata', 'Processi digitali', 'Customer experience'],
          weaknesses: ['Percezione straniera', 'Rete limitata', 'Prezzi medio-alti']
        },
        {
          competitor: 'Direct Line',
          market_share: 12,
          avg_premium: 2100,
          positioning: 'Digital Disruptor',
          strengths: ['Prezzi competitivi', 'Processo veloce', 'Digital first'],
          weaknesses: ['Brand giovane', 'Servizi limitati', 'Solo online']
        }
      ]
    }

    const generatePricingSensitivity = (): PricingSensitivityAnalysis[] => {
      const basePrice = INSURANCE_PRODUCTS[selectedProduct].avgPremium
      const pricePoints = []
      
      for (let i = 0.7; i <= 1.4; i += 0.1) {
        const price = Math.floor(basePrice * i)
        const conversionProb = Math.max(5, Math.min(45, 50 - (i - 0.9) * 60)) // peak around 0.9x
        
        pricePoints.push({
          price_point: price,
          conversion_probability: Math.floor(conversionProb),
          expected_revenue: Math.floor(price * conversionProb / 100 * 100), // per 100 leads
          market_penetration: Math.floor(Math.max(5, 35 - (i - 0.8) * 25))
        })
      }
      
      return pricePoints
    }

    setTimeout(() => {
      setPremiumRecommendations(generatePremiumRecommendations())
      setCompetitorAnalysis(generateCompetitorAnalysis())
      setPricingSensitivity(generatePricingSensitivity())
      setLoading(false)
    }, 800)
  }, [selectedProduct])

  const generateRiskFactors = (product: InsuranceProductType): string[] => {
    const factors: Record<InsuranceProductType, string[]> = {
      CASA: ['Zona sismica Milano', 'Età immobile', 'Valore immobile alto', 'Installazioni sicurezza'],
      AUTO: ['Sinistralità zona', 'Età guidatore', 'Tipo veicolo', 'Km annui stimati'],
      VITA: ['Età anagrafica', 'Condizioni salute', 'Professione rischiosa', 'Fumatore'],
      BUSINESS: ['Settore attività', 'Fatturato aziendale', 'Numero dipendenti', 'Storico sinistri'],
      HEALTH: ['Età famiglie', 'Condizioni preesistenti', 'Coverage richiesta', 'Provider preferiti'],
      PROFESSIONAL: ['Tipo professione', 'Esperienza settore', 'Valore cause potenziali', 'Certificazioni'],
      CYBER: ['Tipo business', 'Dati sensibili', 'Infrastruttura IT', 'Training sicurezza'],
      LIABILITY: ['Settore attività', 'Interazione pubblico', 'Prodotti venduti', 'Territori operativi'],
      PROPERTY_COMMERCIAL: ['Tipo immobile', 'Ubicazione', 'Valore beni', 'Sistemi sicurezza'],
      DIRECTORS_OFFICERS: ['Settore aziendale', 'Dimensioni azienda', 'Listing status', 'Governance'],
      MARINE: ['Tipo merci', 'Rotte trasporto', 'Modalità trasporto', 'Valore merci'],
      PENSION: ['Età pensionamento', 'Contributi attuali', 'Rendimento atteso', 'Rischio investimento'],
      INVESTMENT: ['Profilo rischio', 'Orizzonte temporale', 'Capitale disponibile', 'Obiettivi rendimento'],
      TRAVEL: ['Destinazioni', 'Frequenza viaggi', 'Tipo attività', 'Durata media']
    }
    
    return factors[product] || ['Fattore generico']
  }

  const generateJustification = (product: InsuranceProductType, multiplier: number): string => {
    if (multiplier < 0.9) {
      return `Premio aggressivo per penetrare il mercato Milano. Competitivo vs leader market ma mantiene marginalità.`
    } else if (multiplier > 1.1) {
      return `Premium pricing giustificato da servizi superiori e coperture estese. Target clientela high-value.`
    } else {
      return `Prezzo allineato al mercato con piccoli vantaggi competitivi. Bilancia competitività e profittabilità.`
    }
  }

  const currentRecommendation = premiumRecommendations.find(r => r.product === selectedProduct)

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold flex items-center">
            <Calculator className="mr-3 h-8 w-8 text-blue-600" />
            Premium Intelligence System
          </h1>
          <p className="text-muted-foreground">AI-powered pricing optimization per massimizzare conversion e profitabilità</p>
        </div>
        
        <Select value={selectedProduct} onValueChange={(value: InsuranceProductType) => setSelectedProduct(value)}>
          <SelectTrigger className="w-64">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(INSURANCE_PRODUCTS).map(([key, product]) => (
              <SelectItem key={key} value={key}>
                {product.name} (€{product.avgPremium} avg)
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Premium Recommendation Card */}
      {currentRecommendation && (
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center">
                <Brain className="h-5 w-5 mr-2 text-blue-600" />
                AI Premium Recommendation
              </span>
              <Badge variant={
                currentRecommendation.competitive_position === 'aggressive' ? 'destructive' :
                currentRecommendation.competitive_position === 'premium' ? 'default' : 'secondary'
              }>
                {currentRecommendation.competitive_position.toUpperCase()}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-white rounded-lg border">
                <div className="text-3xl font-bold text-blue-600">€{currentRecommendation.recommended_premium}</div>
                <div className="text-sm text-muted-foreground mt-1">Premio Consigliato</div>
                <div className="flex items-center justify-center mt-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-600">{currentRecommendation.confidence}% confidence</span>
                </div>
              </div>
              
              <div className="text-center p-4 bg-white rounded-lg border">
                <div className="text-3xl font-bold text-green-600">{currentRecommendation.expected_conversion_rate}%</div>
                <div className="text-sm text-muted-foreground mt-1">Conversion Rate Attesa</div>
                <div className="text-xs text-green-600 mt-2">
                  vs {Math.floor(currentRecommendation.expected_conversion_rate * 0.8)}% media mercato
                </div>
              </div>
              
              <div className="text-center p-4 bg-white rounded-lg border">
                <div className="text-lg text-muted-foreground">Market Range</div>
                <div className="text-sm font-medium">
                  €{currentRecommendation.market_range.min} - €{currentRecommendation.market_range.max}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  Media: €{currentRecommendation.market_range.avg}
                </div>
              </div>
            </div>
            
            <div className="mt-4 p-4 bg-white rounded-lg border">
              <h4 className="font-semibold mb-2">Giustificazione AI:</h4>
              <p className="text-sm text-muted-foreground">{currentRecommendation.justification}</p>
            </div>
            
            <div className="mt-4">
              <h4 className="font-semibold mb-2">Fattori di Rischio Considerati:</h4>
              <div className="flex flex-wrap gap-2">
                {currentRecommendation.risk_factors.map((factor, idx) => (
                  <Badge key={idx} variant="outline" className="text-xs">
                    {factor}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Competitor Analysis & Pricing Sensitivity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Competitor Analysis */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Target className="h-5 w-5 mr-2" />
              Competitive Intelligence
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {competitorAnalysis.map((comp, idx) => (
                <div key={idx} className="p-4 border rounded-lg">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-semibold">{comp.competitor}</h4>
                      <p className="text-sm text-muted-foreground">{comp.positioning}</p>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">€{comp.avg_premium}</div>
                      <div className="text-sm text-muted-foreground">{comp.market_share}% share</div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <div className="text-green-600 font-medium mb-1">Strengths:</div>
                      {comp.strengths.map((strength, i) => (
                        <div key={i} className="text-muted-foreground">• {strength}</div>
                      ))}
                    </div>
                    <div>
                      <div className="text-red-600 font-medium mb-1">Weaknesses:</div>
                      {comp.weaknesses.map((weakness, i) => (
                        <div key={i} className="text-muted-foreground">• {weakness}</div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Pricing Sensitivity Analysis */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart className="h-5 w-5 mr-2" />
              Price Sensitivity Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RechartsBarChart data={pricingSensitivity}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="price_point" 
                  tickFormatter={(value) => `€${value}`}
                />
                <YAxis />
                <Tooltip 
                  formatter={(value, name) => {
                    if (name === 'conversion_probability') return [`${value}%`, 'Conversion Rate']
                    if (name === 'expected_revenue') return [`€${value}`, 'Expected Revenue']
                    return [value, name]
                  }}
                />
                <Bar dataKey="conversion_probability" fill="#8884d8" name="conversion_probability" />
                <Bar dataKey="market_penetration" fill="#82ca9d" name="market_penetration" />
              </RechartsBarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Optimization Matrix */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="h-5 w-5 mr-2" />
            Revenue Optimization Matrix
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-center">
              <div className="text-2xl font-bold text-green-600">
                €{Math.floor((currentRecommendation?.recommended_premium || 0) * (currentRecommendation?.expected_conversion_rate || 0) / 100)}
              </div>
              <div className="text-sm text-muted-foreground mt-1">Revenue per 100 Lead</div>
              <div className="text-xs text-green-600 mt-2">AI Optimized</div>
            </div>
            
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg text-center">
              <div className="text-2xl font-bold text-blue-600">
                €{Math.floor((currentRecommendation?.market_range.avg || 0) * 0.25)}
              </div>
              <div className="text-sm text-muted-foreground mt-1">Market Average Revenue</div>
              <div className="text-xs text-blue-600 mt-2">25% conversion</div>
            </div>
            
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-center">
              <div className="text-2xl font-bold text-yellow-600">
                +{Math.floor(((currentRecommendation?.recommended_premium || 0) * (currentRecommendation?.expected_conversion_rate || 0) / 100) - ((currentRecommendation?.market_range.avg || 0) * 0.25))}
              </div>
              <div className="text-sm text-muted-foreground mt-1">Revenue Uplift</div>
              <div className="text-xs text-yellow-600 mt-2">vs Market</div>
            </div>
            
            <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg text-center">
              <div className="text-2xl font-bold text-purple-600">
                {Math.floor(((currentRecommendation?.recommended_premium || 0) * (currentRecommendation?.expected_conversion_rate || 0) / 100) / ((currentRecommendation?.market_range.avg || 0) * 0.25) * 100 - 100)}%
              </div>
              <div className="text-sm text-muted-foreground mt-1">Performance Gain</div>
              <div className="text-xs text-purple-600 mt-2">AI vs Market</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Zap className="h-5 w-5 mr-2" />
            Recommended Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-3 text-green-600">Immediate Actions:</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                  Implementa pricing a €{currentRecommendation?.recommended_premium} per {INSURANCE_PRODUCTS[selectedProduct].name}
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                  Enfatizza value proposition vs competitor pricing più alto
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                  Monitor conversion rate per validation pricing strategy
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-3 text-blue-600">Strategic Opportunities:</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start">
                  <AlertTriangle className="h-4 w-4 text-blue-500 mr-2 mt-0.5" />
                  Bundle opportunity con altri prodotti per aumentare CLV
                </li>
                <li className="flex items-start">
                  <AlertTriangle className="h-4 w-4 text-blue-500 mr-2 mt-0.5" />
                  Segment pricing per zona Milano (Centro vs Provincia)
                </li>
                <li className="flex items-start">
                  <AlertTriangle className="h-4 w-4 text-blue-500 mr-2 mt-0.5" />
                  A/B test pricing variations per ottimizzazione
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}