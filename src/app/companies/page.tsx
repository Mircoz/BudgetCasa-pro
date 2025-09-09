'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { SearchInput } from '@/components/ui/search-input'
import { CompanyCard } from '@/components/companies/company-card'
import { CompanyFilters } from '@/components/companies/company-filters'
import { Badge } from '@/components/ui/badge'
import { 
  ChevronLeft, 
  ChevronRight,
  Building,
  BookmarkPlus,
  Sparkles,
  Loader2
} from 'lucide-react'
import { searchCompanies, getLeadSuggestions, getLists, addToList, createList, trackEvent } from '@/lib/api-mock'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { CompanyCard as CompanyCardType, CompanyFilters as CompanyFiltersType, PolicySuggestion } from '@/lib/types'
import { POLICY_LABELS } from '@/lib/types'

const INITIAL_FILTERS: CompanyFiltersType = {}

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<CompanyCardType[]>([])
  const [loading, setLoading] = useState(false)
  const [filters, setFilters] = useState<CompanyFiltersType>(INITIAL_FILTERS)
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalResults, setTotalResults] = useState(0)

  // Suggestions dialog
  const [suggestionsOpen, setSuggestionsOpen] = useState(false)
  const [selectedCompany, setSelectedCompany] = useState<CompanyCardType | null>(null)
  const [suggestions, setSuggestions] = useState<PolicySuggestion[]>([])
  const [suggestionsLoading, setSuggestionsLoading] = useState(false)

  // Add to list dialog
  const [addToListOpen, setAddToListOpen] = useState(false)
  const [lists, setLists] = useState<any[]>([])
  const [selectedList, setSelectedList] = useState<string>('')
  const [newListName, setNewListName] = useState('')

  const pageSize = 12

  const performSearch = async (page = 1) => {
    setLoading(true)
    try {
      const searchFilters = {
        ...filters,
        q: searchQuery,
        page,
        page_size: pageSize
      }

      const response = await searchCompanies(searchFilters)
      setCompanies(response.items)
      setCurrentPage(response.page)
      setTotalPages(response.total_pages)
      setTotalResults(response.total)

      // Track search event
      trackEvent('pro_search_company', {
        q: searchQuery,
        city: filters.city,
        ateco: filters.ateco,
        min_employees: filters.min_employees,
        results: response.total
      })
    } catch (error) {
      console.error('Search error:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    performSearch(1)
  }, [filters, searchQuery])

  const handleFiltersChange = (newFilters: CompanyFiltersType) => {
    setFilters(newFilters)
    setCurrentPage(1)
  }

  const handleViewSuggestions = async (company: CompanyCardType) => {
    setSelectedCompany(company)
    setSuggestionsOpen(true)
    setSuggestionsLoading(true)
    
    try {
      const response = await getLeadSuggestions('company', company.id)
      setSuggestions(response.suggestions)

      trackEvent('pro_view_lead', { type: 'company', id: company.id })
    } catch (error) {
      console.error('Suggestions error:', error)
      setSuggestions([])
    } finally {
      setSuggestionsLoading(false)
    }
  }

  const handleAddToList = async (company: CompanyCardType) => {
    setSelectedCompany(company)
    
    try {
      const userLists = await getLists('company')
      setLists(userLists)
      setAddToListOpen(true)
    } catch (error) {
      console.error('Lists error:', error)
    }
  }

  const handleSaveToList = async () => {
    if (!selectedCompany) return

    try {
      let listId = selectedList

      if (!listId && newListName) {
        const newList = await createList(newListName, 'company')
        listId = newList.id
      }

      if (listId) {
        await addToList(listId, 'company', selectedCompany.id)
        trackEvent('pro_add_to_list', { list_id: listId, entity_type: 'company' })
        setAddToListOpen(false)
        setSelectedList('')
        setNewListName('')
      }
    } catch (error) {
      console.error('Add to list error:', error)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center">
            <Building className="mr-3 h-8 w-8 text-green-600" />
            Directory Aziende
          </h1>
          <p className="text-muted-foreground">
            Esplora aziende per opportunità assicurative B2B
          </p>
        </div>
        <div className="flex items-center space-x-4">
          {totalResults > 0 && (
            <Badge variant="outline" className="text-lg px-3 py-1">
              {totalResults} aziende
            </Badge>
          )}
        </div>
      </div>

      {/* Search Bar */}
      <Card>
        <CardContent className="pt-6">
          <SearchInput
            placeholder="Cerca per nome azienda, settore, P.IVA..."
            value={searchQuery}
            onChange={setSearchQuery}
            className="w-full"
          />
        </CardContent>
      </Card>

      {/* Filters */}
      {/* AI-Powered Growth Companies Ranking */}
      <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 mb-6">
        <CardHeader>
          <CardTitle className="flex items-center text-green-700">
            📈 AI GROWTH COMPANIES RANKING
          </CardTitle>
          <div className="text-sm text-green-600">
            Aziende in rapida crescita identificate da ML algorithms - Filtrabili per regione
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <Select defaultValue="all-regions">
              <SelectTrigger>
                <SelectValue placeholder="Filtra per Regione" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-regions">🌍 Tutte le Regioni</SelectItem>
                <SelectItem value="lombardia">🏭 Lombardia</SelectItem>
                <SelectItem value="lazio">🏛️ Lazio</SelectItem>
                <SelectItem value="veneto">🚢 Veneto</SelectItem>
                <SelectItem value="emilia-romagna">🍝 Emilia-Romagna</SelectItem>
                <SelectItem value="piemonte">🏔️ Piemonte</SelectItem>
                <SelectItem value="toscana">🍷 Toscana</SelectItem>
              </SelectContent>
            </Select>
            
            <Select defaultValue="all-provinces">
              <SelectTrigger>
                <SelectValue placeholder="Filtra per Provincia" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-provinces">🏙️ Tutte le Province</SelectItem>
                <SelectItem value="milano">Milano</SelectItem>
                <SelectItem value="roma">Roma</SelectItem>
                <SelectItem value="torino">Torino</SelectItem>
                <SelectItem value="napoli">Napoli</SelectItem>
                <SelectItem value="bologna">Bologna</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Top Growing Company 1 */}
            <div className="bg-white p-4 rounded-lg border border-green-200">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center text-white font-bold text-sm mr-2">1</div>
                  <span className="font-medium">TechCorp Milano</span>
                </div>
                <Badge className="bg-green-100 text-green-800">+847%</Badge>
              </div>
              <div className="text-xs space-y-1 text-gray-600">
                <div>💰 Fatturato: €12.5M → €118.4M</div>
                <div>👥 Dipendenti: 25 → 340</div>
                <div>🎯 Settore: Software Development</div>
                <div>📍 Milano, Lombardia</div>
                <div className="flex items-center mt-2">
                  <div className="text-xs text-green-700 font-medium">🚀 AI Score: 94/100</div>
                </div>
              </div>
            </div>

            {/* Top Growing Company 2 */}
            <div className="bg-white p-4 rounded-lg border border-green-200">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center text-white font-bold text-sm mr-2">2</div>
                  <span className="font-medium">BioMed Ventures</span>
                </div>
                <Badge className="bg-green-100 text-green-800">+523%</Badge>
              </div>
              <div className="text-xs space-y-1 text-gray-600">
                <div>💰 Fatturato: €8.2M → €51.1M</div>
                <div>👥 Dipendenti: 18 → 156</div>
                <div>🎯 Settore: Biotecnologie</div>
                <div>📍 Roma, Lazio</div>
                <div className="flex items-center mt-2">
                  <div className="text-xs text-green-700 font-medium">🚀 AI Score: 89/100</div>
                </div>
              </div>
            </div>

            {/* Top Growing Company 3 */}
            <div className="bg-white p-4 rounded-lg border border-green-200">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-sm mr-2">3</div>
                  <span className="font-medium">Green Energy Spa</span>
                </div>
                <Badge className="bg-green-100 text-green-800">+412%</Badge>
              </div>
              <div className="text-xs space-y-1 text-gray-600">
                <div>💰 Fatturato: €15.3M → €78.3M</div>
                <div>👥 Dipendenti: 45 → 289</div>
                <div>🎯 Settore: Energie Rinnovabili</div>
                <div>📍 Torino, Piemonte</div>
                <div className="flex items-center mt-2">
                  <div className="text-xs text-green-700 font-medium">🚀 AI Score: 87/100</div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
            <div className="flex items-center mb-2">
              <Sparkles className="h-4 w-4 text-yellow-600 mr-2" />
              <span className="font-medium text-yellow-800 text-sm">💡 AI Intelligence Report</span>
            </div>
            <div className="text-xs text-yellow-700 space-y-1">
              <div>• <strong>TechCorp Milano</strong>: Acquisizioni strategiche + espansione EU = polizze business premium €2.3M potential</div>
              <div>• <strong>BioMed Ventures</strong>: IPO planned 2025 = copertura D&O directors €1.8M opportunity</div>
              <div>• <strong>Green Energy</strong>: Nuovi impianti = polizze property/construction €3.2M market</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <CompanyFilters
        filters={filters}
        onChange={handleFiltersChange}
        onReset={() => setFilters(INITIAL_FILTERS)}
      />

      {/* Results */}
      {loading ? (
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-green-600" />
              <p className="text-muted-foreground">Ricerca in corso...</p>
            </div>
          </CardContent>
        </Card>
      ) : companies.length > 0 ? (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {companies.map((company) => (
              <CompanyCard
                key={company.id}
                company={company}
                onViewSuggestions={() => handleViewSuggestions(company)}
                onAddToList={() => handleAddToList(company)}
              />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    Pagina {currentPage} di {totalPages}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => performSearch(currentPage - 1)}
                      disabled={currentPage <= 1 || loading}
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Precedente
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => performSearch(currentPage + 1)}
                      disabled={currentPage >= totalPages || loading}
                    >
                      Successiva
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </>
      ) : (
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <div className="text-center">
              <Building className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Nessun risultato</h3>
              <p className="text-muted-foreground">
                Prova a modificare i filtri di ricerca per trovare più aziende.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Suggestions Dialog */}
      <Dialog open={suggestionsOpen} onOpenChange={setSuggestionsOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Sparkles className="h-5 w-5 mr-2 text-yellow-500" />
              Suggerimenti AI per {selectedCompany?.name}
            </DialogTitle>
            <DialogDescription>
              Polizze business consigliate in base al profilo aziendale
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {suggestionsLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin mr-2" />
                <span>Generazione suggerimenti...</span>
              </div>
            ) : suggestions.length > 0 ? (
              suggestions.map((suggestion, index) => (
                <Card key={index}>
                  <CardContent className="pt-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold">
                          {POLICY_LABELS[suggestion.policy]}
                        </h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          {suggestion.reason}
                        </p>
                      </div>
                      <Badge 
                        variant={suggestion.confidence >= 0.8 ? "default" : suggestion.confidence >= 0.6 ? "secondary" : "outline"}
                        className="ml-4"
                      >
                        {Math.round(suggestion.confidence * 100)}%
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                Nessun suggerimento disponibile per questa azienda.
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Add to List Dialog */}
      <Dialog open={addToListOpen} onOpenChange={setAddToListOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <BookmarkPlus className="h-5 w-5 mr-2" />
              Aggiungi {selectedCompany?.name} a Lista
            </DialogTitle>
            <DialogDescription>
              Seleziona una lista esistente o creane una nuova
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {lists.length > 0 && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Lista esistente</label>
                <Select value={selectedList} onValueChange={setSelectedList}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleziona una lista" />
                  </SelectTrigger>
                  <SelectContent>
                    {lists.map((list) => (
                      <SelectItem key={list.id} value={list.id}>
                        {list.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium">O crea nuova lista</label>
              <input
                type="text"
                placeholder="Nome della nuova lista"
                value={newListName}
                onChange={(e) => setNewListName(e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>

            <div className="flex space-x-2 pt-4">
              <Button 
                onClick={handleSaveToList}
                disabled={!selectedList && !newListName}
                className="flex-1"
              >
                Aggiungi alla Lista
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setAddToListOpen(false)}
              >
                Annulla
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}