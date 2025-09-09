'use client'

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
import { searchPersons, getLeadSuggestions, getLists, addToList, createList, trackEvent } from '@/lib/api'
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