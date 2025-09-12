'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  TrendingUp,
  Target,
  Zap,
  ShoppingCart,
  Users,
  Euro,
  ArrowRight,
  Star,
  Gift,
  BarChart3,
  PieChart
} from 'lucide-react'
// import { HeatMapGrid } from 'react-grid-heatmap' // Not available
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ScatterChart, Scatter } from 'recharts'
import { INSURANCE_PRODUCTS, type InsuranceProductType } from '@/lib/insurance-propensity-engine'

interface CrossSellOpportunity {
  lead_id: string
  lead_name: string
  current_products: InsuranceProductType[]
  recommended_products: {
    product: InsuranceProductType
    probability: number
    revenue_potential: number
    confidence: number
    timing: 'immediate' | 'short_term' | 'medium_term' | 'long_term'
    trigger_event?: string
  }[]
  total_opportunity_value: number
  cross_sell_score: number // 0-100
  customer_segment: 'basic' | 'premium' | 'enterprise' | 'family'
  next_best_action: string
}

interface ProductAffinityMatrix {
  source_product: InsuranceProductType
  target_product: InsuranceProductType
  affinity_score: number // 0-100, likelihood of buying target after source
  avg_time_to_purchase: number // days
  bundle_discount_opportunity: number // percentage
}

interface CrossSellMetrics {
  total_opportunities: number
  total_potential_revenue: number
  avg_opportunity_value: number
  conversion_rate_estimate: number
  top_performing_combinations: {
    products: InsuranceProductType[]
    success_rate: number
    avg_revenue: number
  }[]
}

export function CrossSellOpportunityMatrix() {
  const [opportunities, setOpportunities] = useState<CrossSellOpportunity[]>([])
  const [affinityMatrix, setAffinityMatrix] = useState<ProductAffinityMatrix[]>([])
  const [metrics, setMetrics] = useState<CrossSellMetrics>({
    total_opportunities: 0,
    total_potential_revenue: 0,
    avg_opportunity_value: 0,
    conversion_rate_estimate: 0,
    top_performing_combinations: []
  })
  const [selectedSegment, setSelectedSegment] = useState<string>('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const generateCrossSellOpportunities = (): CrossSellOpportunity[] => {
      const segments: CrossSellOpportunity['customer_segment'][] = ['basic', 'premium', 'enterprise', 'family']
      const products = Object.keys(INSURANCE_PRODUCTS) as InsuranceProductType[]
      
      return Array.from({ length: 50 }, (_, i) => {
        const currentProducts = products.slice(0, 1 + Math.floor(Math.random() * 2)) // 1-3 current products
        const availableProducts = products.filter(p => !currentProducts.includes(p))
        
        const recommendedProducts = availableProducts
          .slice(0, 2 + Math.floor(Math.random() * 3)) // 2-5 recommendations
          .map(product => ({
            product,
            probability: Math.floor(20 + Math.random() * 60), // 20-80%
            revenue_potential: Math.floor(INSURANCE_PRODUCTS[product].avgPremium * (0.8 + Math.random() * 0.4)),
            confidence: Math.floor(60 + Math.random() * 35), // 60-95%
            timing: ['immediate', 'short_term', 'medium_term', 'long_term'][Math.floor(Math.random() * 4)] as any,
            trigger_event: Math.random() > 0.6 ? getTriggerEvent(product) : undefined
          }))
        
        const totalValue = recommendedProducts.reduce((sum, p) => sum + p.revenue_potential, 0)
        
        return {
          lead_id: `lead_${i.toString().padStart(3, '0')}`,
          lead_name: `Cliente ${i + 1}`,
          current_products: currentProducts,
          recommended_products: recommendedProducts.sort((a, b) => b.probability - a.probability),
          total_opportunity_value: totalValue,
          cross_sell_score: Math.floor(30 + Math.random() * 60), // 30-90
          customer_segment: segments[Math.floor(Math.random() * segments.length)],
          next_best_action: getNextBestAction(recommendedProducts[0]?.product)
        }
      })
    }

    const generateAffinityMatrix = (): ProductAffinityMatrix[] => {
      const products = Object.keys(INSURANCE_PRODUCTS) as InsuranceProductType[]
      const matrix: ProductAffinityMatrix[] = []
      
      // Define logical product affinities based on insurance industry knowledge
      const affinityRules: Record<InsuranceProductType, Partial<Record<InsuranceProductType, number>>> = {
        CASA: { AUTO: 85, VITA: 70, LIABILITY: 45, HEALTH: 60 },
        AUTO: { CASA: 80, VITA: 65, TRAVEL: 55, LIABILITY: 40 },
        VITA: { HEALTH: 75, PENSION: 80, INVESTMENT: 70, CASA: 60 },
        BUSINESS: { PROFESSIONAL: 90, LIABILITY: 85, CYBER: 70, PROPERTY_COMMERCIAL: 75, DIRECTORS_OFFICERS: 60 },
        HEALTH: { VITA: 70, TRAVEL: 50, PENSION: 45 },
        PROFESSIONAL: { BUSINESS: 85, LIABILITY: 70, CYBER: 65, DIRECTORS_OFFICERS: 55 },
        CYBER: { BUSINESS: 65, PROFESSIONAL: 60, LIABILITY: 50 },
        LIABILITY: { BUSINESS: 80, PROFESSIONAL: 65, PROPERTY_COMMERCIAL: 55 },
        PROPERTY_COMMERCIAL: { BUSINESS: 70, LIABILITY: 65, DIRECTORS_OFFICERS: 50 },
        DIRECTORS_OFFICERS: { BUSINESS: 70, PROFESSIONAL: 55, LIABILITY: 45 },
        MARINE: { BUSINESS: 40, LIABILITY: 35 },
        PENSION: { VITA: 85, INVESTMENT: 75, HEALTH: 40 },
        INVESTMENT: { PENSION: 80, VITA: 65 },
        TRAVEL: { AUTO: 45, HEALTH: 40, CASA: 25 }
      }
      
      products.forEach(source => {
        products.forEach(target => {
          if (source !== target) {
            const affinity = affinityRules[source]?.[target] || Math.floor(10 + Math.random() * 30)
            matrix.push({
              source_product: source,
              target_product: target,
              affinity_score: affinity,
              avg_time_to_purchase: Math.floor(30 + Math.random() * 150), // 30-180 days
              bundle_discount_opportunity: Math.floor(5 + Math.random() * 15) // 5-20%
            })
          }
        })
      })
      
      return matrix
    }

    const getTriggerEvent = (product: InsuranceProductType): string => {
      const triggers: Record<InsuranceProductType, string[]> = {
        CASA: ['Acquisto immobile', 'Ristrutturazione', 'Matrimonio'],
        AUTO: ['Acquisto veicolo', 'Rinnovo patente', 'Cambio residenza'],
        VITA: ['Nascita figlio', 'Matrimonio', 'Avanzamento carriera'],
        BUSINESS: ['Apertura nuova sede', 'Assunzione dipendenti', 'Espansione attività'],
        HEALTH: ['Cambio lavoro', 'Pensionamento', 'Famiglia numerosa'],
        PROFESSIONAL: ['Nuova professione', 'Partnership', 'Aumento responsabilità'],
        CYBER: ['Digitalizzazione', 'E-commerce launch', 'Data breach settore'],
        PENSION: ['40° compleanno', 'Aumento stipendio', 'Matrimonio'],
        TRAVEL: ['Ferie estive', 'Viaggio lavoro', 'Anno sabbatico'],
        INVESTMENT: ['Bonus annuale', 'Eredità', 'Vendita immobile'],
        LIABILITY: ['Nuovi clienti', 'Prodotti innovativi', 'Espansione mercato'],
        PROPERTY_COMMERCIAL: ['Nuovi immobili', 'Ristrutturazione', 'Cambio location'],
        DIRECTORS_OFFICERS: ['IPO', 'Nuovi soci', 'Espansione internazionale'],
        MARINE: ['Export/Import', 'Nuove rotte', 'Contratti internazionali']
      }
      
      const productTriggers = triggers[product] || ['Evento generico']
      return productTriggers[Math.floor(Math.random() * productTriggers.length)]
    }

    const getNextBestAction = (product?: InsuranceProductType): string => {
      if (!product) return 'Contattare per assessment completo'
      
      const actions: Record<InsuranceProductType, string> = {
        CASA: 'Proponi valutazione immobile gratuita',
        AUTO: 'Invia preventivo personalizzato veicolo',
        VITA: 'Offri consulenza pianificazione familiare',
        BUSINESS: 'Programma visita in azienda per audit',
        HEALTH: 'Proponi check-up sanitario gratuito',
        PROFESSIONAL: 'Analisi rischi specifici professione',
        CYBER: 'Assessment sicurezza IT gratuito',
        PENSION: 'Simulazione piano previdenziale',
        TRAVEL: 'Pacchetto famiglia scontato 30%',
        INVESTMENT: 'Consulenza portfolio investimenti',
        LIABILITY: 'Audit esposizione responsabilità',
        PROPERTY_COMMERCIAL: 'Valutazione immobili aziendali',
        DIRECTORS_OFFICERS: 'Assessment governance aziendale',
        MARINE: 'Analisi coperture trasporti'
      }
      
      return actions[product] || 'Contatto commerciale'
    }

    const calculateMetrics = (opps: CrossSellOpportunity[]): CrossSellMetrics => {
      const totalRevenue = opps.reduce((sum, opp) => sum + opp.total_opportunity_value, 0)
      
      return {
        total_opportunities: opps.length,
        total_potential_revenue: totalRevenue,
        avg_opportunity_value: Math.floor(totalRevenue / opps.length),
        conversion_rate_estimate: 28, // Estimated based on industry benchmarks
        top_performing_combinations: [
          { products: ['CASA', 'AUTO'], success_rate: 75, avg_revenue: 4200 },
          { products: ['VITA', 'PENSION'], success_rate: 68, avg_revenue: 4800 },
          { products: ['BUSINESS', 'PROFESSIONAL'], success_rate: 82, avg_revenue: 6200 },
          { products: ['HEALTH', 'VITA'], success_rate: 65, avg_revenue: 3700 }
        ]
      }
    }

    setTimeout(() => {
      const opps = generateCrossSellOpportunities()
      const matrix = generateAffinityMatrix()
      
      setOpportunities(opps)
      setAffinityMatrix(matrix)
      setMetrics(calculateMetrics(opps))
      setLoading(false)
    }, 1000)
  }, [])

  const filteredOpportunities = selectedSegment === 'all' 
    ? opportunities 
    : opportunities.filter(opp => opp.customer_segment === selectedSegment)

  const getTimingColor = (timing: string) => {
    switch (timing) {
      case 'immediate': return 'bg-red-100 text-red-800'
      case 'short_term': return 'bg-orange-100 text-orange-800'
      case 'medium_term': return 'bg-yellow-100 text-yellow-800'  
      case 'long_term': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getSegmentColor = (segment: string) => {
    switch (segment) {
      case 'basic': return 'bg-gray-100 text-gray-800'
      case 'premium': return 'bg-blue-100 text-blue-800'
      case 'enterprise': return 'bg-purple-100 text-purple-800'
      case 'family': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  // Prepare heatmap data for product affinity
  const productNames = Object.keys(INSURANCE_PRODUCTS) as InsuranceProductType[]
  const heatmapData = productNames.map(source => 
    productNames.map(target => {
      if (source === target) return 0
      const affinity = affinityMatrix.find(m => m.source_product === source && m.target_product === target)
      return affinity?.affinity_score || 0
    })
  )

  if (loading) {
    return <div className="p-6">Caricamento cross-sell matrix...</div>
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold flex items-center">
            <ShoppingCart className="mr-3 h-8 w-8 text-green-600" />
            Cross-Sell Opportunity Matrix
          </h1>
          <p className="text-muted-foreground">AI-powered sistema per identificare e prioritizzare opportunità cross-sell</p>
        </div>
        
        <Select value={selectedSegment} onValueChange={setSelectedSegment}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">📊 Tutti i Segmenti</SelectItem>
            <SelectItem value="basic">🏠 Basic</SelectItem>
            <SelectItem value="premium">💎 Premium</SelectItem>
            <SelectItem value="enterprise">🏢 Enterprise</SelectItem>
            <SelectItem value="family">👨‍👩‍👧‍👦 Family</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Opportunities</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredOpportunities.length}</div>
            <p className="text-xs text-muted-foreground">
              {metrics.conversion_rate_estimate}% conversion stimata
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue Potential</CardTitle>
            <Euro className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              €{filteredOpportunities.reduce((sum, opp) => sum + opp.total_opportunity_value, 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Pipeline totale cross-sell
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Opportunity</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              €{Math.floor(filteredOpportunities.reduce((sum, opp) => sum + opp.total_opportunity_value, 0) / filteredOpportunities.length || 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              Per cliente
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">High-Priority</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {filteredOpportunities.filter(opp => 
                opp.recommended_products.some(p => p.timing === 'immediate')
              ).length}
            </div>
            <p className="text-xs text-muted-foreground">
              Immediate action required
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Top Opportunities */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Star className="h-5 w-5 mr-2" />
            Top Cross-Sell Opportunities
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredOpportunities
              .sort((a, b) => b.cross_sell_score - a.cross_sell_score)
              .slice(0, 8)
              .map((opp, idx) => (
                <div key={idx} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                        idx === 0 ? 'bg-yellow-500' : idx === 1 ? 'bg-gray-400' : idx === 2 ? 'bg-orange-500' : 'bg-blue-500'
                      }`}>
                        {idx + 1}
                      </div>
                      <div>
                        <h4 className="font-semibold">{opp.lead_name}</h4>
                        <div className="flex space-x-2 mt-1">
                          <Badge className={getSegmentColor(opp.customer_segment)}>
                            {opp.customer_segment}
                          </Badge>
                          <Badge variant="outline">
                            Score: {opp.cross_sell_score}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-green-600">€{opp.total_opportunity_value.toLocaleString()}</div>
                      <div className="text-sm text-muted-foreground">Revenue potential</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm font-medium mb-2">Prodotti Attuali:</div>
                      <div className="flex flex-wrap gap-1">
                        {opp.current_products.map(product => (
                          <Badge key={product} variant="secondary" className="text-xs">
                            {INSURANCE_PRODUCTS[product].name}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-sm font-medium mb-2">Top Recommendation:</div>
                      <div className="flex items-center space-x-2">
                        <Badge className={getTimingColor(opp.recommended_products[0]?.timing)} >
                          {opp.recommended_products[0]?.timing.replace('_', ' ')}
                        </Badge>
                        <span className="text-sm font-medium">
                          {INSURANCE_PRODUCTS[opp.recommended_products[0]?.product]?.name}
                        </span>
                        <span className="text-sm text-green-600">
                          ({opp.recommended_products[0]?.probability}% prob.)
                        </span>
                      </div>
                      {opp.recommended_products[0]?.trigger_event && (
                        <div className="text-xs text-muted-foreground mt-1">
                          🎯 Trigger: {opp.recommended_products[0].trigger_event}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-between items-center mt-4 pt-3 border-t">
                    <span className="text-sm font-medium text-blue-600">
                      {opp.next_best_action}
                    </span>
                    <div className="space-x-2">
                      <Button size="sm" variant="outline">
                        View Details
                      </Button>
                      <Button size="sm" className="bg-green-600 hover:bg-green-700">
                        <Gift className="h-3 w-3 mr-1" />
                        Create Campaign
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>

      {/* Product Affinity Heatmap & Top Combinations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="h-5 w-5 mr-2" />
              Product Affinity Matrix
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground mb-4">
              Probabilità di acquisto prodotto (colonna) dopo acquisto prodotto (riga)
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr>
                    <th className="p-2"></th>
                    {productNames.slice(0, 6).map(product => (
                      <th key={product} className="p-2 text-center transform -rotate-45" style={{minWidth: '60px'}}>
                        {product}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {productNames.slice(0, 6).map((sourceProduct, i) => (
                    <tr key={sourceProduct}>
                      <td className="p-2 font-medium">{sourceProduct}</td>
                      {productNames.slice(0, 6).map((targetProduct, j) => {
                        const affinity = affinityMatrix.find(m => 
                          m.source_product === sourceProduct && m.target_product === targetProduct
                        )?.affinity_score || 0
                        
                        const intensity = sourceProduct === targetProduct ? 0 : affinity / 100
                        const bgColor = sourceProduct === targetProduct 
                          ? 'bg-gray-200' 
                          : `rgba(34, 197, 94, ${intensity})`
                        
                        return (
                          <td key={targetProduct} className="p-2 text-center" style={{backgroundColor: bgColor}}>
                            {sourceProduct === targetProduct ? '-' : affinity}
                          </td>
                        )
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="h-5 w-5 mr-2" />
              Top Performing Combinations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {metrics.top_performing_combinations.map((combo, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                      {idx + 1}
                    </div>
                    <div>
                      <div className="font-medium">
                        {combo.products.map(p => INSURANCE_PRODUCTS[p].name).join(' + ')}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Bundle opportunity
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-green-600">{combo.success_rate}%</div>
                    <div className="text-sm text-muted-foreground">€{combo.avg_revenue}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Projection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <PieChart className="h-5 w-5 mr-2" />
            Cross-Sell Revenue Projection (Next 12 Months)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="text-3xl font-bold text-green-600">
                €{Math.floor(metrics.total_potential_revenue * 0.28).toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground mt-1">Expected Revenue</div>
              <div className="text-xs text-green-600 mt-2">28% conversion rate</div>
            </div>
            
            <div className="text-center p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="text-3xl font-bold text-blue-600">
                {Math.floor(filteredOpportunities.length * 0.28)}
              </div>
              <div className="text-sm text-muted-foreground mt-1">Expected Conversions</div>
              <div className="text-xs text-blue-600 mt-2">New policies sold</div>
            </div>
            
            <div className="text-center p-4 bg-purple-50 border border-purple-200 rounded-lg">
              <div className="text-3xl font-bold text-purple-600">
                €{Math.floor(metrics.total_potential_revenue * 0.28 / 12).toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground mt-1">Monthly Revenue</div>
              <div className="text-xs text-purple-600 mt-2">Recurring income</div>
            </div>
            
            <div className="text-center p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="text-3xl font-bold text-yellow-600">
                {Math.floor((metrics.total_potential_revenue * 0.28 / filteredOpportunities.length) / 463 * 100)}%
              </div>
              <div className="text-sm text-muted-foreground mt-1">Portfolio Growth</div>
              <div className="text-xs text-yellow-600 mt-2">Customer base expansion</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}