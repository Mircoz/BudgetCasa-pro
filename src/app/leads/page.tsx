'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { SearchInput } from '@/components/ui/search-input'
import { PersonCard } from '@/components/leads/person-card'
import { PersonFilters } from '@/components/leads/person-filters'
import { Badge } from '@/components/ui/badge'
import { 
  ChevronLeft, 
  ChevronRight,
  Users,
  BookmarkPlus,
  Sparkles,
  Loader2
} from 'lucide-react'
import { searchPersons, getLeadSuggestions, getLists, addToList, createList, trackEvent } from '@/lib/api-mock'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { PersonCard as PersonCardType, PersonFilters as PersonFiltersType, PolicySuggestion } from '@/lib/types'
import { POLICY_LABELS } from '@/lib/types'

const INITIAL_FILTERS: PersonFiltersType = {}

export default function LeadsPage() {
  const [persons, setPersons] = useState<PersonCardType[]>([])
  const [loading, setLoading] = useState(false)
  const [filters, setFilters] = useState<PersonFiltersType>(INITIAL_FILTERS)
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalResults, setTotalResults] = useState(0)

  // Suggestions dialog
  const [suggestionsOpen, setSuggestionsOpen] = useState(false)
  const [selectedPerson, setSelectedPerson] = useState<PersonCardType | null>(null)
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

      const response = await searchPersons(searchFilters)
      setPersons(response.items)
      setCurrentPage(response.page)
      setTotalPages(response.total_pages)
      setTotalResults(response.total)

      // Track search event
      trackEvent('pro_search_person', {
        q: searchQuery,
        city: filters.city,
        has_children: filters.has_children,
        min_income: filters.min_income,
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

  const handleFiltersChange = (newFilters: PersonFiltersType) => {
    setFilters(newFilters)
    setCurrentPage(1)
  }

  const handleViewSuggestions = async (person: PersonCardType) => {
    setSelectedPerson(person)
    setSuggestionsOpen(true)
    setSuggestionsLoading(true)
    
    try {
      const response = await getLeadSuggestions('person', person.id)
      setSuggestions(response.suggestions)

      trackEvent('pro_view_lead', { type: 'person', id: person.id })
    } catch (error) {
      console.error('Suggestions error:', error)
      setSuggestions([])
    } finally {
      setSuggestionsLoading(false)
    }
  }

  const handleAddToList = async (person: PersonCardType) => {
    setSelectedPerson(person)
    
    try {
      const userLists = await getLists('person')
      setLists(userLists)
      setAddToListOpen(true)
    } catch (error) {
      console.error('Lists error:', error)
    }
  }

  const handleSaveToList = async () => {
    if (!selectedPerson) return

    try {
      let listId = selectedList

      if (!listId && newListName) {
        const newList = await createList(newListName, 'person')
        listId = newList.id
      }

      if (listId) {
        await addToList(listId, 'person', selectedPerson.id)
        trackEvent('pro_add_to_list', { list_id: listId, entity_type: 'person' })
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
            <Users className="mr-3 h-8 w-8 text-blue-600" />
            Lead Persone
          </h1>
          <p className="text-muted-foreground">
            Scopri persone e famiglie interessate a polizze assicurative
          </p>
        </div>
        <div className="flex items-center space-x-4">
          {totalResults > 0 && (
            <Badge variant="outline" className="text-lg px-3 py-1">
              {totalResults} risultati
            </Badge>
          )}
        </div>
      </div>

      {/* Search Bar */}
      <Card>
        <CardContent className="pt-6">
          <SearchInput
            placeholder="Cerca per nome, città, caratteristiche..."
            value={searchQuery}
            onChange={setSearchQuery}
            className="w-full"
          />
        </CardContent>
      </Card>

      {/* Filters */}
      {/* AI Lead Hunter Dashboard */}
      <Card className="bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200 mb-6">
        <CardHeader>
          <CardTitle className="flex items-center text-purple-800">
            🤖 AI LEAD HUNTER - Behavioral Intelligence
          </CardTitle>
          <div className="text-sm text-purple-600">
            Machine Learning identifica lead con highest conversion probability in tempo reale
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            {/* Disaster-Driven Leads */}
            <div className="bg-red-100 p-4 rounded-lg border border-red-200">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-red-800 text-sm">🌪️ Disaster-Driven</span>
                <Badge variant="destructive" className="text-xs">HOT</Badge>
              </div>
              <div className="text-2xl font-bold text-red-600 mb-1">127</div>
              <div className="text-xs text-red-700 space-y-1">
                <div>Emilia-Romagna flood zone residents</div>
                <div>📈 Conversion: +340% vs normale</div>
                <div>💰 Avg premium: €1,850</div>
                <div>⏰ Strike window: 18 giorni left</div>
              </div>
            </div>

            {/* AI Psychological Profiling */}
            <div className="bg-purple-100 p-4 rounded-lg border border-purple-200">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-purple-800 text-sm">🧠 Psych Profiling</span>
                <Badge className="bg-purple-100 text-purple-800 text-xs">ACTIVE</Badge>
              </div>
              <div className="text-2xl font-bold text-purple-600 mb-1">89</div>
              <div className="text-xs text-purple-700 space-y-1">
                <div>High anxiety personality traits</div>
                <div>📊 Loss aversion trigger: 91%</div>
                <div>🎯 Fear-based messaging optimal</div>
                <div>💬 AI scripts generated: 34</div>
              </div>
            </div>

            {/* Competitor Poaching */}
            <div className="bg-blue-100 p-4 rounded-lg border border-blue-200">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-blue-800 text-sm">🎣 Competitor Poaching</span>
                <Badge className="bg-blue-100 text-blue-800 text-xs">HUNTING</Badge>
              </div>
              <div className="text-2xl font-bold text-blue-600 mb-1">203</div>
              <div className="text-xs text-blue-700 space-y-1">
                <div>Generali clients dissatisfied</div>
                <div>🔍 Social sentiment: negative</div>
                <div>💰 Total LTV: €4.2M</div>
                <div>🎯 Undercut pricing ready</div>
              </div>
            </div>
          </div>

          {/* AI-Generated Leads Today */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg border border-green-200">
            <div className="flex items-center justify-between mb-3">
              <span className="font-medium text-green-800">🚀 AI-Generated High-Value Leads Today</span>
              <Badge className="bg-green-100 text-green-800">FRESH</Badge>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="bg-white p-3 rounded border border-green-200">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-sm">Marco Rossi</span>
                  <Badge className="bg-red-100 text-red-800 text-xs">VOLCANIC</Badge>
                </div>
                <div className="text-xs space-y-1">
                  <div>📍 Milano, zona alluvione risk +67%</div>
                  <div>💰 Budget: €450K casa + €2.5K annual premium</div>
                  <div>🧠 AI Trigger: "protezione famiglia"</div>
                  <div>📞 Optimal call time: 19:30 (post-cena anxiety)</div>
                  <div>🎯 Script: Fear-based + social proof neighbors</div>
                </div>
              </div>
              <div className="bg-white p-3 rounded border border-green-200">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-sm">Laura Bianchi</span>
                  <Badge className="bg-orange-100 text-orange-800 text-xs">HOT</Badge>
                </div>
                <div className="text-xs space-y-1">
                  <div>📍 Roma, ex-cliente Generali insoddisfatta</div>
                  <div>💰 Previous premium: €1,200 → Our offer: €980</div>
                  <div>🧠 AI Trigger: "risparmio" + "servizio migliore"</div>
                  <div>📞 Best approach: WhatsApp + comparison table</div>
                  <div>🎯 Script: Competitive advantage + testimonials</div>
                </div>
              </div>
            </div>
          </div>

          {/* AI Behavioral Manipulation Tactics */}
          <div className="mt-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
            <div className="flex items-center mb-2">
              <Sparkles className="h-4 w-4 text-yellow-600 mr-2" />
              <span className="font-medium text-yellow-800 text-sm">🎭 Active Behavioral Manipulation Tactics</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
                <span>Fear Factor: 83% active</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                <span>Social Proof: 76% deployed</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                <span>Scarcity Timer: 91% effective</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                <span>Authority Proof: 87% trust</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <PersonFilters
        filters={filters}
        onChange={handleFiltersChange}
        onReset={() => setFilters(INITIAL_FILTERS)}
      />

      {/* Results */}
      {loading ? (
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
              <p className="text-muted-foreground">Ricerca in corso...</p>
            </div>
          </CardContent>
        </Card>
      ) : persons.length > 0 ? (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {persons.map((person) => (
              <PersonCard
                key={person.id}
                person={person}
                onViewSuggestions={() => handleViewSuggestions(person)}
                onAddToList={() => handleAddToList(person)}
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
              <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Nessun risultato</h3>
              <p className="text-muted-foreground">
                Prova a modificare i filtri di ricerca per trovare più lead.
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
              Suggerimenti AI per {selectedPerson?.name}
            </DialogTitle>
            <DialogDescription>
              Polizze consigliate in base al profilo del lead
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
                Nessun suggerimento disponibile per questo lead.
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
              Aggiungi {selectedPerson?.name} a Lista
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