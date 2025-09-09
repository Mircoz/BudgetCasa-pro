'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  BookmarkCheck, 
  Plus,
  Users,
  Building,
  Download,
  Edit,
  Trash2,
  Loader2,
  FileText
} from 'lucide-react'
import { getLists, createList, exportListToCSV, trackEvent } from '@/lib/api-mock'
import type { List } from '@/lib/types'

export default function ListsPage() {
  const [lists, setLists] = useState<List[]>([])
  const [loading, setLoading] = useState(true)
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [newListName, setNewListName] = useState('')
  const [newListType, setNewListType] = useState<'person' | 'company'>('person')
  const [listCounts, setListCounts] = useState<Record<string, number>>({})

  useEffect(() => {
    loadLists()
  }, [])

  const loadLists = async () => {
    setLoading(true)
    try {
      const userLists = await getLists()
      setLists(userLists)
      
      // Mock counts for each list
      const counts: Record<string, number> = {}
      for (const list of userLists) {
        counts[list.id] = Math.floor(Math.random() * 20) + 1 // Mock count between 1-20
      }
      setListCounts(counts)
    } catch (error) {
      console.error('Load lists error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateList = async () => {
    if (!newListName.trim()) return

    try {
      await createList(newListName, newListType)
      setCreateDialogOpen(false)
      setNewListName('')
      setNewListType('person')
      loadLists() // Reload lists
    } catch (error) {
      console.error('Create list error:', error)
    }
  }

  const handleExportList = async (list: List) => {
    try {
      const csvContent = await exportListToCSV(list.id)
      
      // Create download link
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      const link = document.createElement('a')
      const url = URL.createObjectURL(blob)
      link.setAttribute('href', url)
      link.setAttribute('download', `${list.name.replace(/[^a-zA-Z0-9]/g, '_')}.csv`)
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      trackEvent('pro_export_csv', { list_id: list.id, size: listCounts[list.id] })
    } catch (error) {
      console.error('Export list error:', error)
    }
  }

  const handleDeleteList = async (listId: string) => {
    if (!confirm('Sei sicuro di voler eliminare questa lista?')) return

    try {
      // Mock delete - in reality would delete from Supabase
      loadLists() // Reload lists
    } catch (error) {
      console.error('Delete list error:', error)
    }
  }

  const getListIcon = (type: string) => {
    return type === 'person' ? Users : Building
  }

  const getListTypeLabel = (type: string) => {
    return type === 'person' ? 'Persone' : 'Aziende'
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight flex items-center">
            <BookmarkCheck className="mr-3 h-8 w-8 text-purple-600" />
            Liste Salvate
          </h1>
        </div>
        
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-purple-600" />
              <p className="text-muted-foreground">Caricamento liste...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center">
            <BookmarkCheck className="mr-3 h-8 w-8 text-purple-600" />
            Liste Salvate
          </h1>
          <p className="text-muted-foreground">
            Gestisci le tue collezioni di lead e aziende
          </p>
        </div>
        <Button onClick={() => setCreateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Nuova Lista
        </Button>
      </div>

      {/* AI-Powered List Recommendations */}
      <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200 mb-6">
        <CardHeader>
          <CardTitle className="flex items-center text-indigo-800">
            🧠 AI LIST RECOMMENDATIONS
          </CardTitle>
          <div className="text-sm text-indigo-600">
            Machine Learning suggerisce liste ad alta conversione basate su behavioral patterns
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-lg border border-indigo-200">
              <div className="flex items-center justify-between mb-3">
                <span className="font-medium text-indigo-800">🔥 Post-Disaster Strike List</span>
                <Badge className="bg-red-100 text-red-800">URGENT</Badge>
              </div>
              <div className="text-sm space-y-2 mb-3">
                <div>🎯 <strong>Target</strong>: Emilia-Romagna flood zone residents</div>
                <div>📊 <strong>Size</strong>: 8,340 leads qualificati</div>
                <div>💰 <strong>Value</strong>: €18.2M potential revenue</div>
                <div>⏰ <strong>Window</strong>: 18 giorni remaining</div>
              </div>
              <Button size="sm" className="w-full bg-red-600 hover:bg-red-700 text-white">
                Crea Lista AI "Disaster Opportunity"
              </Button>
            </div>

            <div className="bg-white p-4 rounded-lg border border-indigo-200">
              <div className="flex items-center justify-between mb-3">
                <span className="font-medium text-indigo-800">🎣 Competitor Poaching List</span>
                <Badge className="bg-blue-100 text-blue-800">HIGH ROI</Badge>
              </div>
              <div className="text-sm space-y-2 mb-3">
                <div>🎯 <strong>Target</strong>: Generali dissatisfied customers</div>
                <div>📊 <strong>Size</strong>: 1,250 leads verified</div>
                <div>💰 <strong>Value</strong>: €3.2M steal potential</div>
                <div>⚡ <strong>Success Rate</strong>: 91% conversion</div>
              </div>
              <Button size="sm" className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                Crea Lista AI "Competitive Conquest"
              </Button>
            </div>
          </div>

          <div className="mt-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
            <div className="flex items-center mb-2">
              <BookmarkCheck className="h-4 w-4 text-yellow-600 mr-2" />
              <span className="font-medium text-yellow-800 text-sm">💡 AI Smart Suggestions</span>
            </div>
            <div className="text-xs text-yellow-700 space-y-1">
              <div>• <strong>High Anxiety Profiles</strong>: 2,340 leads con personality traits "protection-oriented" → +73% conversion</div>
              <div>• <strong>Climate Change Worried</strong>: 1,890 social media signals "climate anxiety" → premium products acceptance</div>
              <div>• <strong>New Homeowners</strong>: 3,456 recent property purchases → first-time insurance buyers, high LTV</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lists Grid */}
      {lists.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {lists.map((list) => {
            const Icon = getListIcon(list.type)
            const count = listCounts[list.id] || 0
            
            return (
              <Card key={list.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <Icon className={`h-6 w-6 ${list.type === 'person' ? 'text-blue-600' : 'text-green-600'}`} />
                      <div>
                        <CardTitle className="text-lg">{list.name}</CardTitle>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge variant="secondary" className="text-xs">
                            {getListTypeLabel(list.type)}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {count} elementi
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">
                      Creata il {new Date(list.created_at).toLocaleDateString('it-IT')}
                    </div>
                    <div className="flex space-x-1">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleExportList(list)}
                        disabled={count === 0}
                        title="Esporta CSV"
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleDeleteList(list.id)}
                        title="Elimina Lista"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      ) : (
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <div className="text-center">
              <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Nessuna lista creata</h3>
              <p className="text-muted-foreground mb-4">
                Crea la tua prima lista per organizzare lead e aziende.
              </p>
              <Button onClick={() => setCreateDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Crea Prima Lista
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Create List Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Plus className="h-5 w-5 mr-2" />
              Crea Nuova Lista
            </DialogTitle>
            <DialogDescription>
              Organizza i tuoi lead in liste personalizzate per un migliore follow-up.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Nome Lista</label>
              <Input
                type="text"
                placeholder="es. Lead Q1 2024, Aziende Tech Milano..."
                value={newListName}
                onChange={(e) => setNewListName(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleCreateList()}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Tipo di Lista</label>
              <Select 
                value={newListType} 
                onValueChange={(value: 'person' | 'company') => setNewListType(value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="person">
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-2" />
                      Lista Persone/Famiglie
                    </div>
                  </SelectItem>
                  <SelectItem value="company">
                    <div className="flex items-center">
                      <Building className="h-4 w-4 mr-2" />
                      Lista Aziende
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex space-x-2 pt-4">
              <Button 
                onClick={handleCreateList}
                disabled={!newListName.trim()}
                className="flex-1"
              >
                Crea Lista
              </Button>
              <Button 
                variant="outline" 
                onClick={() => {
                  setCreateDialogOpen(false)
                  setNewListName('')
                  setNewListType('person')
                }}
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