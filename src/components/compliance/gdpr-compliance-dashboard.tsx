'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { 
  Shield,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Eye,
  Download,
  Trash,
  Clock,
  Users,
  FileText,
  Lock,
  Key,
  Database
} from 'lucide-react'
import { Progress } from '@/components/ui/progress'

interface ConsentRecord {
  lead_id: string
  lead_name: string
  consent_type: 'marketing' | 'processing' | 'profiling' | 'transfer' | 'retention'
  consent_given: boolean
  consent_date: string
  expiry_date?: string
  source: 'web_form' | 'phone_call' | 'email' | 'agent_visit' | 'third_party'
  ip_address?: string
  user_agent?: string
  withdrawal_date?: string
  legal_basis: 'consent' | 'legitimate_interest' | 'contract' | 'legal_obligation'
}

interface DataProcessingActivity {
  activity_id: string
  activity_name: string
  data_types: string[]
  processing_purposes: string[]
  legal_basis: string
  data_subjects: number
  retention_period: string
  risk_level: 'low' | 'medium' | 'high'
  last_assessment: string
  compliance_status: 'compliant' | 'needs_review' | 'non_compliant'
}

interface ComplianceMetrics {
  total_data_subjects: number
  consent_coverage: number // percentage
  data_retention_compliance: number
  security_score: number
  audit_readiness: number
  gdpr_risk_score: number
}

export function GDPRComplianceDashboard() {
  const [consentRecords, setConsentRecords] = useState<ConsentRecord[]>([])
  const [processingActivities, setProcessingActivities] = useState<DataProcessingActivity[]>([])
  const [complianceMetrics, setComplianceMetrics] = useState<ComplianceMetrics>({
    total_data_subjects: 0,
    consent_coverage: 0,
    data_retention_compliance: 0,
    security_score: 0,
    audit_readiness: 0,
    gdpr_risk_score: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Generate mock compliance data
    const generateConsentRecords = (): ConsentRecord[] => {
      const records: ConsentRecord[] = []
      const consentTypes: ConsentRecord['consent_type'][] = ['marketing', 'processing', 'profiling', 'transfer', 'retention']
      const sources: ConsentRecord['source'][] = ['web_form', 'phone_call', 'email', 'agent_visit', 'third_party']
      const legalBases: ConsentRecord['legal_basis'][] = ['consent', 'legitimate_interest', 'contract', 'legal_obligation']
      
      for (let i = 0; i < 50; i++) {
        const consentDate = new Date(2024, Math.floor(Math.random() * 3), Math.floor(Math.random() * 28))
        const expiryDate = new Date(consentDate)
        expiryDate.setFullYear(expiryDate.getFullYear() + 2) // 2 year consent
        
        records.push({
          lead_id: `lead_${i.toString().padStart(3, '0')}`,
          lead_name: `Lead ${i + 1}`,
          consent_type: consentTypes[Math.floor(Math.random() * consentTypes.length)],
          consent_given: Math.random() > 0.1, // 90% consent rate
          consent_date: consentDate.toISOString(),
          expiry_date: expiryDate.toISOString(),
          source: sources[Math.floor(Math.random() * sources.length)],
          ip_address: `192.168.1.${Math.floor(Math.random() * 255)}`,
          user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          withdrawal_date: Math.random() > 0.95 ? new Date().toISOString() : undefined, // 5% withdrawal rate
          legal_basis: legalBases[Math.floor(Math.random() * legalBases.length)]
        })
      }
      
      return records
    }

    const generateProcessingActivities = (): DataProcessingActivity[] => {
      return [
        {
          activity_id: 'PA_001',
          activity_name: 'Lead Generation & Scoring',
          data_types: ['Nome', 'Cognome', 'Email', 'Telefono', 'Indirizzo', 'Reddito stimato', 'Propensity scores'],
          processing_purposes: ['Generazione lead', 'Scoring propensity', 'Segmentazione mercato', 'Marketing diretto'],
          legal_basis: 'Legitimate Interest + Consent',
          data_subjects: 463,
          retention_period: '24 mesi',
          risk_level: 'medium',
          last_assessment: '2024-01-15',
          compliance_status: 'compliant'
        },
        {
          activity_id: 'PA_002',
          activity_name: 'Customer Profiling & Analytics',
          data_types: ['Dati demografici', 'Comportamento online', 'Preferenze assicurative', 'Financial data'],
          processing_purposes: ['Profilazione cliente', 'Personalizzazione offerte', 'Analytics predittive'],
          legal_basis: 'Consent',
          data_subjects: 463,
          retention_period: '36 mesi',
          risk_level: 'high',
          last_assessment: '2024-01-10',
          compliance_status: 'needs_review'
        },
        {
          activity_id: 'PA_003',
          activity_name: 'Marketing Automation',
          data_types: ['Email', 'Telefono', 'Preferenze comunicazione', 'Storico interazioni'],
          processing_purposes: ['Email marketing', 'SMS marketing', 'Retargeting', 'Communication optimization'],
          legal_basis: 'Consent',
          data_subjects: 387,
          retention_period: '12 mesi',
          risk_level: 'low',
          last_assessment: '2024-01-20',
          compliance_status: 'compliant'
        },
        {
          activity_id: 'PA_004',
          activity_name: 'Third-party Data Enrichment',
          data_types: ['Business data', 'LinkedIn profiles', 'Hunter.io emails', 'Financial indicators'],
          processing_purposes: ['Data enrichment', 'Lead qualification', 'Contact information verification'],
          legal_basis: 'Legitimate Interest',
          data_subjects: 125,
          retention_period: '18 mesi',
          risk_level: 'high',
          last_assessment: '2024-01-05',
          compliance_status: 'non_compliant'
        }
      ]
    }

    const calculateMetrics = (consents: ConsentRecord[], activities: DataProcessingActivity[]): ComplianceMetrics => {
      const totalSubjects = 463
      const consentGiven = consents.filter(c => c.consent_given).length
      const consentCoverage = Math.floor((consentGiven / consents.length) * 100)
      
      const compliantActivities = activities.filter(a => a.compliance_status === 'compliant').length
      const retentionCompliance = Math.floor((compliantActivities / activities.length) * 100)
      
      return {
        total_data_subjects: totalSubjects,
        consent_coverage: consentCoverage,
        data_retention_compliance: retentionCompliance,
        security_score: 87,
        audit_readiness: 78,
        gdpr_risk_score: 23 // lower is better
      }
    }

    setTimeout(() => {
      const consents = generateConsentRecords()
      const activities = generateProcessingActivities()
      
      setConsentRecords(consents)
      setProcessingActivities(activities)
      setComplianceMetrics(calculateMetrics(consents, activities))
      setLoading(false)
    }, 1000)
  }, [])

  const getComplianceStatusColor = (status: DataProcessingActivity['compliance_status']) => {
    switch (status) {
      case 'compliant': return 'text-green-600 bg-green-100'
      case 'needs_review': return 'text-yellow-600 bg-yellow-100'
      case 'non_compliant': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getRiskLevelColor = (risk: DataProcessingActivity['risk_level']) => {
    switch (risk) {
      case 'low': return 'text-green-600'
      case 'medium': return 'text-yellow-600'
      case 'high': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  if (loading) {
    return <div className="p-6">Caricamento compliance dashboard...</div>
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold flex items-center">
            <Shield className="mr-3 h-8 w-8 text-blue-600" />
            GDPR Compliance Dashboard
          </h1>
          <p className="text-muted-foreground">Sistema di monitoring compliance per data protection regulations</p>
        </div>
        
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Download className="h-4 w-4 mr-2" />
          Export Compliance Report
        </Button>
      </div>

      {/* Risk Alert */}
      {complianceMetrics.gdpr_risk_score > 20 && (
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertTitle className="text-red-800">GDPR Risk Alert</AlertTitle>
          <AlertDescription className="text-red-700">
            Risk score elevato ({complianceMetrics.gdpr_risk_score}/100). 
            Attività "Third-party Data Enrichment" non compliant. Azione richiesta entro 7 giorni.
          </AlertDescription>
        </Alert>
      )}

      {/* Compliance Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Data Subjects</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{complianceMetrics.total_data_subjects}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Lead processati totali
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Consent Coverage</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold flex items-center">
              {complianceMetrics.consent_coverage}%
              {complianceMetrics.consent_coverage >= 85 ? 
                <CheckCircle className="h-5 w-5 text-green-500 ml-2" /> :
                <AlertTriangle className="h-5 w-5 text-yellow-500 ml-2" />
              }
            </div>
            <Progress value={complianceMetrics.consent_coverage} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">GDPR Risk Score</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold flex items-center">
              {complianceMetrics.gdpr_risk_score}/100
              {complianceMetrics.gdpr_risk_score <= 15 ? 
                <CheckCircle className="h-5 w-5 text-green-500 ml-2" /> :
                complianceMetrics.gdpr_risk_score <= 30 ?
                <AlertTriangle className="h-5 w-5 text-yellow-500 ml-2" /> :
                <XCircle className="h-5 w-5 text-red-500 ml-2" />
              }
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Lower is better (Target: &lt;15)
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Compliance Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Database className="h-5 w-5 mr-2" />
              Compliance Health Check
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm">Data Retention Compliance</span>
              <div className="flex items-center">
                <span className="text-sm font-medium mr-2">{complianceMetrics.data_retention_compliance}%</span>
                <Progress value={complianceMetrics.data_retention_compliance} className="w-20" />
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm">Security Score</span>
              <div className="flex items-center">
                <span className="text-sm font-medium mr-2">{complianceMetrics.security_score}%</span>
                <Progress value={complianceMetrics.security_score} className="w-20" />
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm">Audit Readiness</span>
              <div className="flex items-center">
                <span className="text-sm font-medium mr-2">{complianceMetrics.audit_readiness}%</span>
                <Progress value={complianceMetrics.audit_readiness} className="w-20" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Key className="h-5 w-5 mr-2" />
              Recent Consent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {consentRecords.slice(0, 5).map((record, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 border rounded">
                  <div className="flex items-center space-x-3">
                    {record.consent_given ? 
                      <CheckCircle className="h-4 w-4 text-green-500" /> :
                      <XCircle className="h-4 w-4 text-red-500" />
                    }
                    <div>
                      <div className="text-sm font-medium">{record.lead_name}</div>
                      <div className="text-xs text-muted-foreground">{record.consent_type}</div>
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(record.consent_date).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Data Processing Activities */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="h-5 w-5 mr-2" />
            Data Processing Activities Register
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {processingActivities.map((activity) => (
              <div key={activity.activity_id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-semibold">{activity.activity_name}</h4>
                    <p className="text-sm text-muted-foreground">ID: {activity.activity_id}</p>
                  </div>
                  <div className="flex space-x-2">
                    <Badge className={getRiskLevelColor(activity.risk_level)}>
                      {activity.risk_level.toUpperCase()} RISK
                    </Badge>
                    <Badge className={getComplianceStatusColor(activity.compliance_status)}>
                      {activity.compliance_status.replace('_', ' ').toUpperCase()}
                    </Badge>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="font-medium text-gray-700 mb-1">Data Types:</div>
                    <div className="text-muted-foreground">
                      {activity.data_types.join(', ')}
                    </div>
                  </div>
                  
                  <div>
                    <div className="font-medium text-gray-700 mb-1">Processing Purposes:</div>
                    <div className="text-muted-foreground">
                      {activity.processing_purposes.join(', ')}
                    </div>
                  </div>
                  
                  <div>
                    <div className="font-medium text-gray-700 mb-1">Legal Basis:</div>
                    <div className="text-muted-foreground">{activity.legal_basis}</div>
                  </div>
                  
                  <div>
                    <div className="font-medium text-gray-700 mb-1">Data Subjects & Retention:</div>
                    <div className="text-muted-foreground">
                      {activity.data_subjects} subjects • {activity.retention_period}
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-between items-center mt-3 pt-3 border-t">
                  <span className="text-xs text-muted-foreground">
                    Last assessment: {new Date(activity.last_assessment).toLocaleDateString()}
                  </span>
                  <div className="space-x-2">
                    <Button size="sm" variant="outline">
                      <Eye className="h-3 w-3 mr-1" />
                      View Details
                    </Button>
                    {activity.compliance_status !== 'compliant' && (
                      <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Review
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Action Items */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Clock className="h-5 w-5 mr-2" />
            Action Items & Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start space-x-3 p-3 bg-red-50 border border-red-200 rounded-lg">
              <XCircle className="h-5 w-5 text-red-600 mt-0.5" />
              <div className="flex-1">
                <div className="font-medium text-red-800">HIGH PRIORITY: Third-party Data Enrichment non-compliant</div>
                <div className="text-sm text-red-700 mt-1">
                  Rivedere legal basis per Hunter.io integration. Consent esplicito richiesto per data enrichment.
                </div>
                <div className="text-xs text-red-600 mt-2">Deadline: 7 giorni</div>
              </div>
            </div>
            
            <div className="flex items-start space-x-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
              <div className="flex-1">
                <div className="font-medium text-yellow-800">MEDIUM: Customer Profiling review needed</div>
                <div className="text-sm text-yellow-700 mt-1">
                  Assessment data profiling activities da 30 giorni. Verificare retention periods.
                </div>
                <div className="text-xs text-yellow-600 mt-2">Deadline: 14 giorni</div>
              </div>
            </div>
            
            <div className="flex items-start space-x-3 p-3 bg-green-50 border border-green-200 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
              <div className="flex-1">
                <div className="font-medium text-green-800">COMPLETED: Marketing consent audit</div>
                <div className="text-sm text-green-700 mt-1">
                  Consent coverage 90%+ raggiunto per marketing activities. Documentazione aggiornata.
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}