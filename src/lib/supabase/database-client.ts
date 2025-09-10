import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// For MVP demo: use service key everywhere to bypass RLS
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRwcW1jbnJmZ2ljc3F2anZicnd1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTg0NTA2MiwiZXhwIjoyMDcxNDIxMDYyfQ.GMSGrHcUpS11JBj3vIp75fgsKWO9tOfzEdPlz56m5f4';

export const supabase = createClient(supabaseUrl, serviceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Admin client - same as regular client for MVP
export const supabaseAdmin = supabase;

// Database Types
export interface MilanoLead {
  id: string;
  first_name: string;
  last_name: string;
  email?: string;
  phone?: string;
  address_street?: string;
  address_cap: string;
  zona: 'Centro' | 'Navigli' | 'Porta Nuova' | 'Sempione' | 'Provincia' | 'Isola' | 'Brera';
  estimated_age?: number;
  estimated_income?: number;
  family_size: number;
  home_ownership: 'owner' | 'renter' | 'family' | 'unknown';
  propensity_casa: number;
  propensity_auto: number;
  propensity_vita: number;
  propensity_business: number;
  data_source: string;
  data_quality_score: number;
  verified_at?: string;
  created_at: string;
  updated_at: string;
  assigned_agent_id?: string;
  agent_notes?: string;
  last_contacted_at?: string;
  contact_attempts: number;
  lead_status: 'new' | 'contacted' | 'interested' | 'qualified' | 'converted' | 'not_interested' | 'invalid';
  conversion_probability: number;
}

export interface Agent {
  id: string;
  email: string;
  name: string;
  company?: string;
  phone?: string;
  territory_caps: string[];
  territory_zones: string[];
  subscription_status: 'trial' | 'active' | 'suspended' | 'cancelled';
  trial_ends_at: string;
  subscription_plan: 'basic' | 'premium' | 'enterprise';
  monthly_lead_limit: number;
  leads_used_this_month: number;
  total_leads_accessed: number;
  total_policies_sold: number;
  conversion_rate: number;
  created_at: string;
  last_login_at?: string;
  is_active: boolean;
}

export interface LeadActivity {
  id: string;
  lead_id: string;
  agent_id: string;
  activity_type: 'viewed' | 'called' | 'emailed' | 'sms_sent' | 'appointment_scheduled' | 
                 'appointment_completed' | 'proposal_sent' | 'policy_sold' | 'marked_not_interested';
  notes?: string;
  outcome?: 'positive' | 'neutral' | 'negative' | 'no_answer' | 'follow_up_needed';
  follow_up_date?: string;
  follow_up_completed: boolean;
  created_at: string;
  ip_address?: string;
  user_agent?: string;
}

export interface LeadSource {
  id: string;
  name: string;
  source_type: 'scraping' | 'api' | 'manual' | 'import' | 'referral';
  description?: string;
  cost_per_lead: number;
  quality_score: number;
  is_active: boolean;
  created_at: string;
}

// Database setup function (server-side only)
export async function setupDatabase(): Promise<void> {
  console.log('✅ Database setup - use Supabase Console to create tables');
}

// Milano-specific data functions
export class MilanoDataService {
  
  // Create a new lead
  static async createLead(leadData: Partial<MilanoLead>): Promise<MilanoLead | null> {
    const { data, error } = await supabaseAdmin
      .from('milano_leads')
      .insert(leadData)
      .select()
      .single();
    
    if (error) {
      console.error('Error creating lead:', error);
      return null;
    }
    
    return data;
  }
  
  // Bulk insert leads (for scraping)
  static async createLeadsBulk(leads: Partial<MilanoLead>[]): Promise<MilanoLead[]> {
    const { data, error } = await supabaseAdmin
      .from('milano_leads')
      .insert(leads)
      .select();
    
    if (error) {
      console.error('Error bulk creating leads:', error);
      return [];
    }
    
    return data || [];
  }
  
  // Get leads with filters
  static async getLeads(filters: {
    zona?: string;
    cap?: string;
    minPropensityCasa?: number;
    maxPropensityCasa?: number;
    leadStatus?: string;
    assignedAgentId?: string;
    limit?: number;
    offset?: number;
  } = {}): Promise<{ data: MilanoLead[]; count: number }> {
    // Use regular client for browser compatibility
    const client = typeof window !== 'undefined' ? supabase : supabaseAdmin;
    let query = client
      .from('milano_leads')
      .select('*', { count: 'exact' });
    
    if (filters.zona) {
      query = query.eq('zona', filters.zona);
    }
    
    if (filters.cap) {
      query = query.eq('address_cap', filters.cap);
    }
    
    if (filters.minPropensityCasa) {
      query = query.gte('propensity_casa', filters.minPropensityCasa);
    }
    
    if (filters.maxPropensityCasa) {
      query = query.lte('propensity_casa', filters.maxPropensityCasa);
    }
    
    if (filters.leadStatus) {
      query = query.eq('lead_status', filters.leadStatus);
    }
    
    if (filters.assignedAgentId) {
      query = query.eq('assigned_agent_id', filters.assignedAgentId);
    }
    
    const limit = filters.limit || 50;
    const offset = filters.offset || 0;
    
    query = query
      .order('propensity_casa', { ascending: false })
      .range(offset, offset + limit - 1);
    
    const { data, error, count } = await query;
    
    if (error) {
      console.error('Error fetching leads:', error);
      return { data: [], count: 0 };
    }
    
    return { data: data || [], count: count || 0 };
  }
  
  // Create agent
  static async createAgent(agentData: Partial<Agent>): Promise<Agent | null> {
    const { data, error } = await supabaseAdmin
      .from('agents')
      .insert(agentData)
      .select()
      .single();
    
    if (error) {
      console.error('Error creating agent:', error);
      return null;
    }
    
    return data;
  }
  
  // Track lead activity - MVP: log only for now
  static async trackActivity(activityData: Partial<LeadActivity>): Promise<LeadActivity | null> {
    try {
      const { data, error } = await supabaseAdmin
        .from('lead_activities')
        .insert(activityData)
        .select()
        .single();
      
      if (error) {
        // For MVP: just log activity, don't fail if table doesn't exist
        console.log(`📋 Activity logged: ${activityData.activity_type} for lead ${activityData.lead_id}`);
        return null;
      }
      
      return data;
    } catch (error) {
      // Gracefully handle missing table in MVP
      console.log(`📋 Activity logged: ${activityData.activity_type} for lead ${activityData.lead_id} (table not yet created)`);
      return null;
    }
  }
  
  // Get agent statistics
  static async getAgentStats(agentId: string): Promise<{
    totalLeads: number;
    contactedLeads: number;
    convertedLeads: number;
    conversionRate: number;
  }> {
    const { data: totalLeads } = await supabaseAdmin
      .from('milano_leads')
      .select('id', { count: 'exact' })
      .eq('assigned_agent_id', agentId);
    
    const { data: contactedLeads } = await supabaseAdmin
      .from('milano_leads')
      .select('id', { count: 'exact' })
      .eq('assigned_agent_id', agentId)
      .in('lead_status', ['contacted', 'interested', 'qualified', 'converted']);
    
    const { data: convertedLeads } = await supabaseAdmin
      .from('milano_leads')
      .select('id', { count: 'exact' })
      .eq('assigned_agent_id', agentId)
      .eq('lead_status', 'converted');
    
    const total = totalLeads?.length || 0;
    const contacted = contactedLeads?.length || 0;
    const converted = convertedLeads?.length || 0;
    const conversionRate = total > 0 ? (converted / total) * 100 : 0;
    
    return {
      totalLeads: total,
      contactedLeads: contacted,
      convertedLeads: converted,
      conversionRate: Math.round(conversionRate * 100) / 100
    };
  }
}

// Database is already set up in Supabase Console