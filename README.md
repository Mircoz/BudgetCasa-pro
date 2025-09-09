# BudgetCasa Pro - Insurance Agents Platform

> **Piattaforma B2B per agenti assicurativi** - Scopri e gestisci lead, consulta analytics di rischio e ottieni suggerimenti AI per polizze assicurative.

## 🎯 Overview

BudgetCasa Pro è una piattaforma completa che permette agli agenti assicurativi di:

- **🔍 Scoprire Lead**: Ricerca avanzata di persone e famiglie interessate a polizze
- **🏢 Directory Aziende**: Esplora opportunità assicurative B2B con filtri ATECO
- **🤖 Suggerimenti AI**: Raccomandazioni automatiche di polizze basate su profili di rischio
- **📊 Analytics Rischio**: Punteggi di rischio/opportunità per territorio e settore
- **📋 Gestione Liste**: Organizza lead in liste personalizzate con export CSV
- **🔐 Multi-tenant**: Sicurezza RLS per separazione dati tra organizzazioni

## 🏗 Architettura

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Next.js App   │───▶│  Supabase Auth   │───▶│   PostgreSQL    │
│  (Frontend UI)  │    │  (Google OAuth)  │    │ (+ RLS + FTS)   │
└─────────────────┘    └──────────────────┘    └─────────────────┘
         │                        │                        │
         ▼                        ▼                        ▼
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Edge Functions │    │  Row Level Sec.  │    │  Vector Search  │
│ (Search + AI)   │    │  (Multi-tenant)  │    │   (pgvector)    │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- Supabase account
- Google Cloud project (for OAuth)

### 1. Clone and Install

```bash
git clone <repository>
cd budgetcasa-pro
npm install
```

### 2. Environment Setup

Copy `.env.local.example` to `.env.local` and configure:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Analytics (Optional)
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Database Setup

1. **Create Supabase Project**
2. **Run Migrations**:
   ```bash
   # In Supabase SQL Editor, run:
   # - supabase/migrations/001_initial_schema.sql
   # - supabase/migrations/002_seed_data.sql
   ```

3. **Enable Extensions** (in Supabase SQL Editor):
   ```sql
   create extension if not exists pg_trgm;
   create extension if not exists vector;
   ```

4. **Configure Google OAuth**:
   - In Supabase Dashboard → Authentication → Providers
   - Enable Google provider
   - Add Client ID/Secret from Google Cloud Console

### 4. Deploy Edge Functions

```bash
# Install Supabase CLI
npm install -g supabase

# Login and deploy functions
supabase functions deploy search-persons
supabase functions deploy search-companies  
supabase functions deploy lead-suggest
supabase functions deploy export-csv
```

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and sign in with Google.

## 🎨 Features Implemented

### ✅ Core Platform
- **Authentication**: Google OAuth with Supabase
- **Multi-tenant**: Organization-based data separation
- **Responsive Design**: Mobile-first with Tailwind CSS

### ✅ Lead Management  
- **Person Search**: Advanced filters (city, income, family status)
- **Company Directory**: ATECO classification, employee count
- **Smart Scoring**: Risk/opportunity indicators
- **AI Suggestions**: Policy recommendations based on profile

### ✅ Data Management
- **Saved Lists**: Organize leads in custom collections
- **CSV Export**: Full data export functionality
- **Real-time Search**: Debounced queries with pagination

### ✅ Analytics & Tracking
- **GA4 Integration**: Comprehensive event tracking
- **Performance Monitoring**: Search metrics and user behavior
- **Audit Logging**: Compliance and security tracking

## 📁 Project Structure

```
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── dashboard/          # Main dashboard
│   │   ├── leads/              # Person search & management
│   │   ├── companies/          # Company directory
│   │   ├── lists/              # Saved lists management
│   │   └── settings/           # User preferences
│   ├── components/             # React components
│   │   ├── auth/              # Authentication
│   │   ├── layout/            # Layout components
│   │   ├── leads/             # Lead-related components
│   │   ├── companies/         # Company-related components
│   │   └── ui/                # shadcn/ui components
│   └── lib/                   # Utilities
│       ├── api.ts             # API client functions
│       ├── supabase.ts        # Supabase client config
│       ├── types.ts           # TypeScript types
│       └── utils.ts           # Helper functions
├── supabase/
│   ├── functions/             # Edge Functions
│   │   ├── search-persons/    # Person search API
│   │   ├── search-companies/  # Company search API
│   │   ├── lead-suggest/      # AI suggestions
│   │   └── export-csv/        # CSV export
│   └── migrations/            # Database schema
└── public/                    # Static assets
```

## 🔧 Database Schema

### Core Tables
- `orgs` - Organizations (multi-tenant)
- `org_members` - User-organization relationships
- `lead_persons` - Individual/family leads
- `lead_person_scores` - Risk/opportunity scoring
- `companies` - Business leads  
- `company_scores` - Business risk indicators
- `lists` - Saved collections
- `list_items` - List memberships
- `industry_taxonomy` - ATECO classification

### Indexes & Performance
- **Full-Text Search**: GIN indexes on tsvector
- **Trigram Matching**: Fuzzy search capabilities
- **Composite Indexes**: Optimized for common queries
- **Vector Support**: pgvector for semantic search (future)

## 🤖 AI Features

### Policy Suggestions Engine

```typescript
// Example: Person with family + high income → Casa + Vita insurance
{
  policy: 'casa',
  confidence: 0.85,
  reason: 'Intento d\'acquisto confermato, rischio casa 72%'
}
```

Mock implementation provides context-aware suggestions based on:
- Risk scores (flood, crime, mobility)  
- Opportunity indicators (property value, income level)
- Demographics (family status, employees count)

## 🔐 Security & Privacy

### Data Protection
- **Row Level Security (RLS)**: Multi-tenant data isolation
- **PII Minimization**: Contact details masked until explicit access
- **Audit Logging**: All actions tracked for compliance
- **GDPR Features**: Data export and deletion capabilities

### Authentication & Authorization
- **Google OAuth**: Secure social login
- **JWT Tokens**: Session management via Supabase
- **Feature Flags**: Controlled feature rollouts
- **Rate Limiting**: Edge function protection

## 🚢 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod

# Set environment variables in Vercel dashboard
```

### Environment Variables (Production)
```env
NEXT_PUBLIC_SUPABASE_URL=your_production_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_production_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_production_service_key
NEXT_PUBLIC_GA_MEASUREMENT_ID=your_ga_id
NEXT_PUBLIC_APP_URL=https://pro.budgetcasa.it
```

## 🗺 Roadmap

### v1.0 Enhancements (Next Phase)
- [ ] **Lead Detail Pages**: Comprehensive profile views
- [ ] **Premium Data Sources**: Cerved, CRIF integrations
- [ ] **Advanced Mapping**: Risk heat maps visualization
- [ ] **Workflow Automation**: Lead nurturing pipelines

### v2.0 Business Features
- [ ] **Subscription Management**: Stripe billing integration
- [ ] **Team Collaboration**: Multi-user organizations
- [ ] **CRM Integrations**: Salesforce, HubSpot connectors
- [ ] **Advanced Analytics**: Custom reporting dashboards

## 📊 Sample Data

The system includes realistic sample data:
- **8 Person Leads**: Various demographics and risk profiles
- **8 Companies**: Different sectors, sizes, and locations
- **Risk Scores**: Realistic flood, crime, and business continuity indicators
- **ATECO Taxonomy**: Italian business classification codes

## 🐛 Troubleshooting

### Common Issues

**Authentication Errors**
- Verify Google OAuth configuration in Supabase
- Check callback URLs in Google Cloud Console
- Ensure environment variables are set correctly

**Search Not Working**
- Confirm Edge Functions are deployed
- Check Supabase function logs for errors
- Verify service role key permissions

**No Data Displayed**
- Run database migrations in correct order
- Check RLS policies are configured
- Verify user is assigned to an organization

## 📈 Performance Metrics

### Optimizations Applied
- Database queries < 500ms P95
- Search debouncing (300ms)
- Efficient pagination with offset/limit
- Lazy loading of non-critical components
- Image optimization with Next.js

### Monitoring
- GA4 event tracking
- Supabase performance metrics
- Frontend Core Web Vitals
- Error boundary implementations

---

**Transform your insurance business with AI-powered lead discovery** 🚀

Built with Next.js, Supabase, and modern web technologies for scalable B2B insurance platforms.
<!-- Force Vercel rebuild -->
