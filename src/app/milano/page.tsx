'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LeadsViewToggle } from '@/components/leads/leads-view-toggle';
import { MilanoDataService, type MilanoLead, supabase } from '@/lib/supabase/database-client';
import { 
  MapPin, 
  Building, 
  Users,
  TrendingUp,
  Phone,
  Mail,
  Filter,
  Loader2
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const MILANO_ZONES = ['Centro', 'Navigli', 'Porta Nuova', 'Sempione', 'Isola', 'Provincia', 'Brera'];
const MILANO_CAPS = ['20121', '20122', '20123', '20124', '20125', '20129', '20144', '20143', '20145', '20154'];

interface LeadStats {
  totalLeads: number;
  avgPropensityCasa: number;
  avgIncome: number;
  leadsWithEmail: number;
  leadsWithPhone: number;
}

export default function MilanoLeadsPage() {
  const [leads, setLeads] = useState<MilanoLead[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<LeadStats>({
    totalLeads: 0,
    avgPropensityCasa: 0,
    avgIncome: 0,
    leadsWithEmail: 0,
    leadsWithPhone: 0
  });

  // Filters
  const [selectedZona, setSelectedZona] = useState<string>('all');
  const [selectedCAP, setSelectedCAP] = useState<string>('all');
  const [minPropensity, setMinPropensity] = useState<string>('all');
  const [leadStatus, setLeadStatus] = useState<string>('all');

  useEffect(() => {
    loadMilanoLeads();
    loadStats();
  }, [selectedZona, selectedCAP, minPropensity, leadStatus]);

  async function loadMilanoLeads() {
    setLoading(true);
    console.log('🔍 Loading Milano leads...');
    
    try {
      // Direct Supabase query for MVP demo
      const { data, error, count } = await supabase
        .from('milano_leads')
        .select('*', { count: 'exact' })
        .limit(100);
      
      if (error) {
        console.error('❌ Direct query error:', error);
        setLeads([]);
        return;
      }
      
      console.log('📋 Direct query success:', data.length, 'leads, total:', count);
      setLeads(data || []);
      
    } catch (error) {
      console.error('❌ Error loading Milano leads:', error);
      setLeads([]);
    } finally {
      setLoading(false);
    }
  }

  async function loadStats() {
    try {
      const allLeads = await MilanoDataService.getLeads({ limit: 1000 });
      const leadsData = allLeads.data;
      
      const totalLeads = leadsData.length;
      const avgPropensityCasa = totalLeads > 0 
        ? Math.round(leadsData.reduce((sum, lead) => sum + lead.propensity_casa, 0) / totalLeads)
        : 0;
      const avgIncome = totalLeads > 0
        ? Math.round(leadsData.reduce((sum, lead) => sum + (lead.estimated_income || 0), 0) / totalLeads)
        : 0;
      const leadsWithEmail = leadsData.filter(lead => lead.email).length;
      const leadsWithPhone = leadsData.filter(lead => lead.phone).length;
      
      setStats({
        totalLeads,
        avgPropensityCasa,
        avgIncome,
        leadsWithEmail,
        leadsWithPhone
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  }

  const handleLeadAction = async (leadId: string, action: 'call' | 'email' | 'schedule') => {
    try {
      // Track activity in database
      await MilanoDataService.trackActivity({
        lead_id: leadId,
        agent_id: 'demo-agent-id', // In real app, get from auth
        activity_type: action === 'schedule' ? 'appointment_scheduled' : 
                      action === 'call' ? 'called' : 'emailed',
        notes: `Action performed via Milano dashboard`
      });
      
      // Update lead status
      const lead = leads.find(l => l.id === leadId);
      if (lead) {
        console.log(`${action} action performed for ${lead.first_name} ${lead.last_name}`);
        
        // Refresh the leads to show updated status
        await loadMilanoLeads();
      }
    } catch (error) {
      console.error(`Error performing ${action} action:`, error);
    }
  };

  const transformLeadsForTable = (milanoLeads: MilanoLead[]) => {
    return milanoLeads.map(lead => ({
      id: lead.id,
      name: `${lead.first_name} ${lead.last_name}`,
      email: lead.email || '',
      phone: lead.phone || '',
      city: `Milano (${lead.address_cap})`,
      region: lead.zona,
      leadScore: Math.round((lead.propensity_casa + lead.propensity_auto + lead.propensity_vita) / 3),
      revenueOpportunity: Math.round((lead.estimated_income || 45000) * 0.025), // 2.5% of income
      nextAction: getNextAction(lead),
      urgencyLevel: getUrgencyLevel(lead.propensity_casa),
      policyInterests: getPolicyInterests(lead),
      conversionProbability: lead.conversion_probability || Math.round((lead.propensity_casa + lead.propensity_auto) / 2),
      lastContact: lead.last_contacted_at,
      contactAttempts: lead.contact_attempts,
      agentNotes: lead.agent_notes || ''
    }));
  };

  const getNextAction = (lead: MilanoLead): string => {
    if (lead.lead_status === 'new') return 'First Contact Call';
    if (lead.lead_status === 'contacted') return 'Follow-up Email';
    if (lead.lead_status === 'interested') return 'Schedule Meeting';
    if (lead.propensity_casa > 80) return 'Home Insurance Quote';
    if (lead.propensity_auto > 70) return 'Auto Insurance Review';
    return 'General Insurance Consultation';
  };

  const getUrgencyLevel = (propensityCasa: number): 'high' | 'medium' | 'low' => {
    if (propensityCasa >= 80) return 'high';
    if (propensityCasa >= 60) return 'medium';
    return 'low';
  };

  const getPolicyInterests = (lead: MilanoLead): string[] => {
    const interests: string[] = [];
    if (lead.propensity_casa >= 50) interests.push('casa');
    if (lead.propensity_auto >= 50) interests.push('auto');
    if (lead.propensity_vita >= 50) interests.push('vita');
    if (lead.propensity_business >= 50) interests.push('business');
    return interests.length > 0 ? interests : ['casa'];
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center">
            <MapPin className="mr-3 h-8 w-8 text-green-600" />
            Milano Lead Database - MVP
          </h1>
          <p className="text-muted-foreground mt-2">
            Database qualificato di prospect assicurativi nella zona di Milano
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <Badge variant="outline" className="text-lg px-3 py-1">
            {stats.totalLeads} leads totali
          </Badge>
          <Badge variant="secondary" className="text-lg px-3 py-1">
            MVP Phase
          </Badge>
        </div>
      </div>

      {/* Key Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Users className="h-4 w-4 mr-2 text-blue-500" />
              Total Leads
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalLeads}</div>
            <p className="text-xs text-muted-foreground">Milano area</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <TrendingUp className="h-4 w-4 mr-2 text-green-500" />
              Avg Casa Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.avgPropensityCasa}</div>
            <p className="text-xs text-muted-foreground">Home insurance</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Building className="h-4 w-4 mr-2 text-purple-500" />
              Avg Income
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">€{(stats.avgIncome / 1000).toFixed(0)}K</div>
            <p className="text-xs text-muted-foreground">Estimated</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Mail className="h-4 w-4 mr-2 text-orange-500" />
              With Email
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round((stats.leadsWithEmail / stats.totalLeads) * 100) || 0}%</div>
            <p className="text-xs text-muted-foreground">{stats.leadsWithEmail} leads</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Phone className="h-4 w-4 mr-2 text-red-500" />
              With Phone
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round((stats.leadsWithPhone / stats.totalLeads) * 100) || 0}%</div>
            <p className="text-xs text-muted-foreground">{stats.leadsWithPhone} leads</p>
          </CardContent>
        </Card>
      </div>

      {/* Milano-Specific Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter className="h-5 w-5 mr-2" />
            Filtri Milano
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Zona Milano</label>
              <Select value={selectedZona} onValueChange={setSelectedZona}>
                <SelectTrigger>
                  <SelectValue placeholder="Tutte le zone" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tutte le zone</SelectItem>
                  {MILANO_ZONES.map(zona => (
                    <SelectItem key={zona} value={zona}>{zona}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">CAP Milano</label>
              <Select value={selectedCAP} onValueChange={setSelectedCAP}>
                <SelectTrigger>
                  <SelectValue placeholder="Tutti i CAP" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tutti i CAP</SelectItem>
                  {MILANO_CAPS.map(cap => (
                    <SelectItem key={cap} value={cap}>{cap}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Min Propensity Casa</label>
              <Select value={minPropensity} onValueChange={setMinPropensity}>
                <SelectTrigger>
                  <SelectValue placeholder="Qualsiasi" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Qualsiasi</SelectItem>
                  <SelectItem value="70">Alta (70+)</SelectItem>
                  <SelectItem value="50">Media (50+)</SelectItem>
                  <SelectItem value="30">Bassa (30+)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Status Lead</label>
              <Select value={leadStatus} onValueChange={setLeadStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Tutti" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tutti</SelectItem>
                  <SelectItem value="new">Nuovi</SelectItem>
                  <SelectItem value="contacted">Contattati</SelectItem>
                  <SelectItem value="interested">Interessati</SelectItem>
                  <SelectItem value="qualified">Qualificati</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Milano Leads Table */}
      {loading ? (
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-green-600" />
              <p className="text-muted-foreground">Caricamento leads Milano...</p>
            </div>
          </CardContent>
        </Card>
      ) : leads.length > 0 ? (
        <LeadsViewToggle
          leads={transformLeadsForTable(leads)}
          onLeadSelect={(leadIds) => {
            console.log('Selected Milano leads:', leadIds);
          }}
          onLeadAction={handleLeadAction}
        />
      ) : (
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <div className="text-center">
              <MapPin className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Nessun lead trovato</h3>
              <p className="text-muted-foreground mb-4">
                Prova a modificare i filtri o raccogliere nuovi dati Milano.
              </p>
              <Button variant="outline">
                Raccogli Dati Milano
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Milano Zone Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Distribuzione per Zona Milano</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {MILANO_ZONES.map(zona => {
              const zoneLeads = leads.filter(lead => lead.zona === zona).length;
              const percentage = leads.length > 0 ? Math.round((zoneLeads / leads.length) * 100) : 0;
              
              return (
                <div key={zona} className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-lg font-semibold">{zoneLeads}</div>
                  <div className="text-sm text-muted-foreground">{zona}</div>
                  <div className="text-xs text-muted-foreground">{percentage}%</div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}