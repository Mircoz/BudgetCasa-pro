'use client'

export const dynamic = 'force-dynamic'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { 
  Settings as SettingsIcon,
  User,
  Bell,
  Shield,
  Database,
  CreditCard
} from 'lucide-react'
import { useAuth } from '@/components/auth/auth-provider'

export default function SettingsPage() {
  const { user } = useAuth()
  const [notifications, setNotifications] = useState({
    email: true,
    newLeads: false,
    weeklyReports: true
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b pb-4">
        <h1 className="text-3xl font-bold tracking-tight flex items-center">
          <SettingsIcon className="mr-3 h-8 w-8 text-gray-600" />
          Impostazioni
        </h1>
        <p className="text-muted-foreground">
          Gestisci le preferenze del tuo account e della piattaforma
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Profile Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="h-5 w-5 mr-2" />
              Profilo Utente
            </CardTitle>
            <CardDescription>
              Informazioni del tuo account Google
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Email</Label>
              <Input value={user?.email || ''} disabled />
            </div>
            
            <div className="space-y-2">
              <Label>Nome Completo</Label>
              <Input 
                value={user?.user_metadata?.full_name || ''} 
                disabled 
                placeholder="Nome non disponibile"
              />
            </div>

            <Badge variant="secondary" className="w-fit">
              Account Google Verificato
            </Badge>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Bell className="h-5 w-5 mr-2" />
              Notifiche
            </CardTitle>
            <CardDescription>
              Configura quando ricevere aggiornamenti
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Notifiche Email</Label>
                <p className="text-sm text-muted-foreground">
                  Ricevi email per aggiornamenti importanti
                </p>
              </div>
              <Switch 
                checked={notifications.email}
                onCheckedChange={(checked) => 
                  setNotifications(prev => ({ ...prev, email: checked }))
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Nuovi Lead</Label>
                <p className="text-sm text-muted-foreground">
                  Notifiche per lead ad alto potenziale
                </p>
              </div>
              <Switch 
                checked={notifications.newLeads}
                onCheckedChange={(checked) => 
                  setNotifications(prev => ({ ...prev, newLeads: checked }))
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Report Settimanali</Label>
                <p className="text-sm text-muted-foreground">
                  Riepilogo attività ogni lunedì
                </p>
              </div>
              <Switch 
                checked={notifications.weeklyReports}
                onCheckedChange={(checked) => 
                  setNotifications(prev => ({ ...prev, weeklyReports: checked }))
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Data & Privacy */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="h-5 w-5 mr-2" />
              Privacy & Sicurezza
            </CardTitle>
            <CardDescription>
              Gestione dei tuoi dati personali
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-sm space-y-2">
              <p><strong>Ultimo accesso:</strong> {new Date().toLocaleDateString('it-IT')}</p>
              <p><strong>Dati condivisi:</strong> Solo con la tua organizzazione</p>
              <p><strong>Crittografia:</strong> TLS 1.3, dati a riposo crittografati</p>
            </div>
            
            <div className="pt-2 border-t space-y-2">
              <Button variant="outline" size="sm" className="w-full">
                Esporta Dati Personali
              </Button>
              <Button variant="outline" size="sm" className="w-full text-red-600">
                Richiedi Cancellazione Account
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Data Sources */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Database className="h-5 w-5 mr-2" />
              Fonti Dati
            </CardTitle>
            <CardDescription>
              Connessioni a servizi esterni (future)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">Open Data Italia</p>
                  <p className="text-sm text-muted-foreground">Rischi territoriali e POI</p>
                </div>
                <Badge variant="default">Attivo</Badge>
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg opacity-60">
                <div>
                  <p className="font-medium">Cerved Business</p>
                  <p className="text-sm text-muted-foreground">Dati aziende premium</p>
                </div>
                <Badge variant="secondary">Prossimamente</Badge>
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg opacity-60">
                <div>
                  <p className="font-medium">CRIF</p>
                  <p className="text-sm text-muted-foreground">Scoring creditizio</p>
                </div>
                <Badge variant="secondary">Prossimamente</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Plan & Billing (Future) */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <CreditCard className="h-5 w-5 mr-2" />
            Piano & Fatturazione
          </CardTitle>
          <CardDescription>
            Gestione abbonamento e fatturazione (prossimamente)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Badge variant="outline" className="text-lg px-4 py-2">
              Piano Demo Gratuito
            </Badge>
            <p className="text-muted-foreground mt-4">
              Accesso completo a tutte le funzionalità durante il periodo beta.
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              La fatturazione verrà attivata nelle prossime versioni.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}