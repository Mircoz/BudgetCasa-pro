'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { 
  Download, 
  FileSpreadsheet, 
  FileText, 
  Loader2,
  Eye,
  Filter
} from 'lucide-react'
import { exportData, downloadFile, getExportPreview, type ExportFilters } from '@/lib/export-api'

interface ExportDialogProps {
  defaultType?: 'leads' | 'companies'
  trigger?: React.ReactNode
}

export function ExportDialog({ defaultType = 'leads', trigger }: ExportDialogProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [preview, setPreview] = useState<any>(null)
  const [previewLoading, setPreviewLoading] = useState(false)
  
  const [filters, setFilters] = useState<ExportFilters>({
    export_type: defaultType,
    format: 'xlsx',
    zona: undefined,
    industry: undefined,
    min_lead_score: undefined,
    max_lead_score: undefined,
    lead_status: undefined,
    assigned_agent_id: undefined,
    date_from: undefined,
    date_to: undefined
  })

  const handleExport = async () => {
    setLoading(true)
    try {
      const result = await exportData(filters)
      downloadFile(result)
      
      // Show success message
      alert(`Export completato! ${result.count} record esportati in ${result.filename}`)
      setOpen(false)
    } catch (error) {
      console.error('Export error:', error)
      alert('Errore durante l\'export. Riprova più tardi.')
    } finally {
      setLoading(false)
    }
  }

  const handlePreview = async () => {
    setPreviewLoading(true)
    try {
      const previewData = await getExportPreview(filters)
      setPreview(previewData)
    } catch (error) {
      console.error('Preview error:', error)
    } finally {
      setPreviewLoading(false)
    }
  }

  useEffect(() => {
    if (open) {
      handlePreview()
    }
  }, [open, filters.export_type, filters.zona, filters.industry])

  const updateFilter = (key: keyof ExportFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value === 'all' ? undefined : value
    }))
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Esporta
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <FileSpreadsheet className="h-5 w-5 mr-2" />
            Export Dati CRM
          </DialogTitle>
          <DialogDescription>
            Esporta lead e aziende in formato Excel o CSV per integrazione CRM
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Export Configuration */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-sm">
                <Filter className="h-4 w-4 mr-2" />
                Configurazione Export
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Type Selection */}
              <div className="space-y-2">
                <Label>Tipo Dati</Label>
                <Select value={filters.export_type} onValueChange={(value: 'leads' | 'companies') => updateFilter('export_type', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="leads">Lead Persone</SelectItem>
                    <SelectItem value="companies">Aziende</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Format Selection */}
              <div className="space-y-2">
                <Label>Formato File</Label>
                <Select value={filters.format} onValueChange={(value: 'xlsx' | 'csv') => updateFilter('format', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="xlsx">
                      <div className="flex items-center">
                        <FileSpreadsheet className="h-4 w-4 mr-2" />
                        Excel (.xlsx)
                      </div>
                    </SelectItem>
                    <SelectItem value="csv">
                      <div className="flex items-center">
                        <FileText className="h-4 w-4 mr-2" />
                        CSV (.csv)
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              {/* Filters */}
              <div className="space-y-4">
                <Label className="text-sm font-medium">Filtri (Opzionali)</Label>
                
                {/* Zone Filter */}
                <div className="space-y-2">
                  <Label className="text-xs">Zona Milano</Label>
                  <Select value={filters.zona || 'all'} onValueChange={(value) => updateFilter('zona', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Tutte le zone" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tutte le zone</SelectItem>
                      <SelectItem value="Centro">Centro</SelectItem>
                      <SelectItem value="Navigli">Navigli</SelectItem>
                      <SelectItem value="Porta Nuova">Porta Nuova</SelectItem>
                      <SelectItem value="Provincia">Provincia</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Industry Filter (for companies) */}
                {filters.export_type === 'companies' && (
                  <div className="space-y-2">
                    <Label className="text-xs">Settore</Label>
                    <Select value={filters.industry || 'all'} onValueChange={(value) => updateFilter('industry', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Tutti i settori" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tutti i settori</SelectItem>
                        <SelectItem value="Legal Services">Servizi Legali</SelectItem>
                        <SelectItem value="Accounting & Finance">Contabilità</SelectItem>
                        <SelectItem value="Architecture & Engineering">Architettura</SelectItem>
                        <SelectItem value="Healthcare">Sanità</SelectItem>
                        <SelectItem value="Business Consulting">Consulenza</SelectItem>
                        <SelectItem value="Technology">Tecnologia</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* Lead Score Range */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-2">
                    <Label className="text-xs">Score Min</Label>
                    <Input
                      type="number"
                      placeholder="0"
                      min="0"
                      max="100"
                      value={filters.min_lead_score || ''}
                      onChange={(e) => updateFilter('min_lead_score', e.target.value ? parseInt(e.target.value) : undefined)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs">Score Max</Label>
                    <Input
                      type="number"
                      placeholder="100"
                      min="0"
                      max="100"
                      value={filters.max_lead_score || ''}
                      onChange={(e) => updateFilter('max_lead_score', e.target.value ? parseInt(e.target.value) : undefined)}
                    />
                  </div>
                </div>

                {/* Status Filter */}
                <div className="space-y-2">
                  <Label className="text-xs">Status Lead</Label>
                  <Select value={filters.lead_status || 'all'} onValueChange={(value) => updateFilter('lead_status', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Tutti gli status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tutti gli status</SelectItem>
                      <SelectItem value="new">Nuovo</SelectItem>
                      <SelectItem value="contacted">Contattato</SelectItem>
                      <SelectItem value="qualified">Qualificato</SelectItem>
                      <SelectItem value="converted">Convertito</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Preview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-sm">
                <div className="flex items-center">
                  <Eye className="h-4 w-4 mr-2" />
                  Anteprima Dati
                </div>
                {preview && (
                  <Badge variant="secondary">
                    {preview.totalCount} record totali
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {previewLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin mr-2" />
                  <span>Caricamento anteprima...</span>
                </div>
              ) : preview && preview.rows.length > 0 ? (
                <div className="space-y-4">
                  <div className="text-xs text-muted-foreground">
                    Prime 5 righe di {preview.totalCount} record
                  </div>
                  <div className="border rounded-lg overflow-hidden">
                    <div className="overflow-x-auto max-h-60">
                      <table className="w-full text-xs">
                        <thead className="bg-gray-50">
                          <tr>
                            {preview.columns.slice(0, 4).map((col: string) => (
                              <th key={col} className="px-2 py-2 text-left font-medium">
                                {col}
                              </th>
                            ))}
                            {preview.columns.length > 4 && (
                              <th className="px-2 py-2 text-left font-medium text-muted-foreground">
                                +{preview.columns.length - 4} altre colonne
                              </th>
                            )}
                          </tr>
                        </thead>
                        <tbody>
                          {preview.rows.map((row: any, idx: number) => (
                            <tr key={idx} className="border-t">
                              {preview.columns.slice(0, 4).map((col: string) => (
                                <td key={col} className="px-2 py-2 truncate max-w-24">
                                  {String(row[col] || '').substring(0, 20)}
                                </td>
                              ))}
                              {preview.columns.length > 4 && (
                                <td className="px-2 py-2 text-muted-foreground">...</td>
                              )}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <FileSpreadsheet className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>Nessun dato trovato con i filtri selezionati</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Export Button */}
        <div className="flex justify-between items-center pt-4">
          <div className="text-sm text-muted-foreground">
            {preview && `Export di ${preview.totalCount} record in formato ${filters.format.toUpperCase()}`}
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Annulla
            </Button>
            <Button 
              onClick={handleExport}
              disabled={loading || !preview || preview.totalCount === 0}
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Esportazione...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4 mr-2" />
                  Esporta {filters.format.toUpperCase()}
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}