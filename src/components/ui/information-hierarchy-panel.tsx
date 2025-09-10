'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  ChevronDown,
  ChevronUp,
  Info,
  Eye,
  EyeOff,
  Filter,
  Settings,
  Star,
  Clock,
  TrendingUp,
  Shield,
  User,
  Building,
  Activity,
  Brain,
  Target
} from 'lucide-react'
import type { InformationLevel } from '@/lib/information-hierarchy'

interface InformationHierarchyPanelProps {
  data: {
    critical: InformationSection[]
    context: InformationSection[]
    detail: InformationSection[]
  }
  defaultLevel?: InformationLevel
  allowLevelToggle?: boolean
  compactMode?: boolean
  className?: string
}

interface InformationSection {
  id: string
  title: string
  icon?: React.ComponentType<any>
  priority: number
  category: 'action' | 'risk' | 'opportunity' | 'demographic' | 'behavioral'
  content: React.ReactNode | string
  badge?: {
    text: string
    variant: 'default' | 'secondary' | 'destructive' | 'outline'
  }
  expandable?: boolean
  defaultExpanded?: boolean
}

const LEVEL_CONFIG = {
  critical: {
    label: 'Informazioni Critiche',
    description: 'Sempre visibili - massima priorità',
    color: 'border-red-500 bg-red-50',
    icon: Star,
    badgeColor: 'bg-red-600 text-white'
  },
  context: {
    label: 'Contesto',
    description: 'Informazioni aggiuntive on-demand',
    color: 'border-blue-500 bg-blue-50',
    icon: Info,
    badgeColor: 'bg-blue-600 text-white'
  },
  detail: {
    label: 'Dettagli',
    description: 'Analisi approfondita e dati completi',
    color: 'border-gray-500 bg-gray-50',
    icon: Eye,
    badgeColor: 'bg-gray-600 text-white'
  }
}

const CATEGORY_CONFIG = {
  action: {
    icon: Target,
    color: 'text-red-600',
    label: 'Azione'
  },
  risk: {
    icon: Shield,
    color: 'text-orange-600',
    label: 'Rischio'
  },
  opportunity: {
    icon: TrendingUp,
    color: 'text-green-600',
    label: 'Opportunità'
  },
  demographic: {
    icon: User,
    color: 'text-blue-600',
    label: 'Demografia'
  },
  behavioral: {
    icon: Activity,
    color: 'text-purple-600',
    label: 'Comportamento'
  }
}

export function InformationHierarchyPanel({
  data,
  defaultLevel = 'critical',
  allowLevelToggle = true,
  compactMode = false,
  className
}: InformationHierarchyPanelProps) {
  const [currentLevel, setCurrentLevel] = useState<InformationLevel>(defaultLevel)
  const [hiddenSections, setHiddenSections] = useState<Set<string>>(new Set())
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set())

  // Initialize expanded sections based on defaults and priority
  useState(() => {
    const autoExpand = new Set<string>()
    Object.values(data).flat().forEach(section => {
      if (section.defaultExpanded || (section.priority >= 90 && currentLevel === 'critical')) {
        autoExpand.add(section.id)
      }
    })
    setExpandedSections(autoExpand)
  })

  const toggleSectionVisibility = (sectionId: string) => {
    const newHidden = new Set(hiddenSections)
    if (newHidden.has(sectionId)) {
      newHidden.delete(sectionId)
    } else {
      newHidden.add(sectionId)
    }
    setHiddenSections(newHidden)
  }

  const toggleSectionExpansion = (sectionId: string) => {
    const newExpanded = new Set(expandedSections)
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId)
    } else {
      newExpanded.add(sectionId)
    }
    setExpandedSections(newExpanded)
  }

  const getVisibleSections = (sections: InformationSection[]) => {
    return sections
      .filter(section => !hiddenSections.has(section.id))
      .sort((a, b) => b.priority - a.priority)
  }

  const renderSection = (section: InformationSection, level: InformationLevel) => {
    const categoryConfig = CATEGORY_CONFIG[section.category]
    const CategoryIcon = categoryConfig.icon
    const SectionIcon = section.icon
    const isExpanded = expandedSections.has(section.id)
    const isExpandable = section.expandable !== false

    return (
      <Card key={section.id} className={`${compactMode ? 'p-2' : 'p-4'} hover:shadow-sm transition-shadow`}>
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3 flex-1">
            {/* Category & Section Icons */}
            <div className="flex items-center space-x-1 mt-1">
              <CategoryIcon className={`h-4 w-4 ${categoryConfig.color}`} />
              {SectionIcon && <SectionIcon className="h-4 w-4 text-gray-500" />}
            </div>
            
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <h4 className={`font-medium ${compactMode ? 'text-sm' : 'text-base'}`}>
                  {section.title}
                </h4>
                
                {section.badge && (
                  <Badge variant={section.badge.variant} className="text-xs">
                    {section.badge.text}
                  </Badge>
                )}
                
                <Badge variant="outline" className="text-xs">
                  {categoryConfig.label}
                </Badge>
                
                <Badge variant="secondary" className="text-xs">
                  P{section.priority}
                </Badge>
              </div>
              
              {/* Content */}
              <div className={compactMode ? 'text-sm' : 'text-base'}>
                {isExpandable ? (
                  <Collapsible open={isExpanded} onOpenChange={() => toggleSectionExpansion(section.id)}>
                    <div className="space-y-2">
                      {/* Preview content (always visible) */}
                      <div>
                        {typeof section.content === 'string' ? (
                          <div className="text-gray-700">
                            {isExpanded ? section.content : `${section.content.slice(0, 100)}...`}
                          </div>
                        ) : (
                          section.content
                        )}
                      </div>
                      
                      {/* Collapsible trigger */}
                      <CollapsibleTrigger asChild>
                        <Button variant="ghost" size="sm" className="p-0 h-auto font-normal">
                          <span className="flex items-center space-x-1 text-blue-600">
                            <span>{isExpanded ? 'Mostra meno' : 'Mostra tutto'}</span>
                            {isExpanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                          </span>
                        </Button>
                      </CollapsibleTrigger>
                      
                      {/* Expanded content */}
                      <CollapsibleContent>
                        <div className="pt-2 text-gray-600">
                          {/* Additional detailed content would go here */}
                          <div className="text-sm">
                            Informazioni dettagliate aggiuntive per questa sezione...
                          </div>
                        </div>
                      </CollapsibleContent>
                    </div>
                  </Collapsible>
                ) : (
                  <div>
                    {typeof section.content === 'string' ? (
                      <div className="text-gray-700">{section.content}</div>
                    ) : (
                      section.content
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Section controls */}
          <div className="flex items-center space-x-1 ml-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => toggleSectionVisibility(section.id)}
              className="p-1 h-auto"
              title="Nascondi sezione"
            >
              <EyeOff className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </Card>
    )
  }

  return (
    <div className={className}>
      {allowLevelToggle && (
        <Card className="mb-4">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-2 text-lg">
              <Brain className="h-5 w-5" />
              <span>Information Hierarchy</span>
            </CardTitle>
            <CardDescription>
              Organizza le informazioni per livello di priorità e dettaglio
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={currentLevel} onValueChange={(value) => setCurrentLevel(value as InformationLevel)}>
              <TabsList className="grid w-full grid-cols-3">
                {Object.entries(LEVEL_CONFIG).map(([level, config]) => {
                  const Icon = config.icon
                  const sectionsCount = data[level as InformationLevel]?.length || 0
                  
                  return (
                    <TabsTrigger key={level} value={level} className="flex items-center space-x-2">
                      <Icon className="h-4 w-4" />
                      <span>{config.label}</span>
                      <Badge variant="secondary" className="text-xs">
                        {sectionsCount}
                      </Badge>
                    </TabsTrigger>
                  )
                })}
              </TabsList>
              
              {/* Level descriptions */}
              <div className="mt-3 text-sm text-muted-foreground">
                {LEVEL_CONFIG[currentLevel].description}
              </div>
            </Tabs>
          </CardContent>
        </Card>
      )}
      
      {/* Information sections by level */}
      <div className="space-y-4">
        {currentLevel === 'critical' && (
          <div className={`border-l-4 ${LEVEL_CONFIG.critical.color} pl-4`}>
            <div className="flex items-center space-x-2 mb-3">
              <Star className="h-5 w-5 text-red-600" />
              <h3 className="font-semibold text-red-800">Informazioni Critiche</h3>
              <Badge className={LEVEL_CONFIG.critical.badgeColor}>
                Sempre Visibili
              </Badge>
            </div>
            <div className={`space-y-3 ${compactMode ? 'space-y-2' : ''}`}>
              {getVisibleSections(data.critical).map(section => renderSection(section, 'critical'))}
            </div>
          </div>
        )}
        
        {currentLevel === 'context' && (
          <div className={`border-l-4 ${LEVEL_CONFIG.context.color} pl-4`}>
            <div className="flex items-center space-x-2 mb-3">
              <Info className="h-5 w-5 text-blue-600" />
              <h3 className="font-semibold text-blue-800">Informazioni Contestuali</h3>
              <Badge className={LEVEL_CONFIG.context.badgeColor}>
                On-Demand
              </Badge>
            </div>
            <div className={`space-y-3 ${compactMode ? 'space-y-2' : ''}`}>
              {getVisibleSections(data.context).map(section => renderSection(section, 'context'))}
            </div>
          </div>
        )}
        
        {currentLevel === 'detail' && (
          <div className={`border-l-4 ${LEVEL_CONFIG.detail.color} pl-4`}>
            <div className="flex items-center space-x-2 mb-3">
              <Eye className="h-5 w-5 text-gray-600" />
              <h3 className="font-semibold text-gray-800">Dettagli Completi</h3>
              <Badge className={LEVEL_CONFIG.detail.badgeColor}>
                Deep-Dive
              </Badge>
            </div>
            <div className={`space-y-3 ${compactMode ? 'space-y-2' : ''}`}>
              {getVisibleSections(data.detail).map(section => renderSection(section, 'detail'))}
            </div>
          </div>
        )}
      </div>
      
      {/* Hidden sections indicator */}
      {hiddenSections.size > 0 && (
        <div className="mt-4 p-3 bg-gray-50 rounded-lg border">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">
              {hiddenSections.size} sezione{hiddenSections.size !== 1 ? 'i' : ''} nascosta{hiddenSections.size !== 1 ? 'e' : ''}
            </span>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setHiddenSections(new Set())}
            >
              Mostra Tutte
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

// Utility function to create information sections
export const createInformationSection = (
  id: string,
  title: string,
  content: React.ReactNode | string,
  options: Partial<Omit<InformationSection, 'id' | 'title' | 'content'>> = {}
): InformationSection => ({
  id,
  title,
  content,
  priority: options.priority || 50,
  category: options.category || 'demographic',
  icon: options.icon,
  badge: options.badge,
  expandable: options.expandable,
  defaultExpanded: options.defaultExpanded
})

// Pre-built common sections
export const CommonSections = {
  nextAction: (action: string, priority: number) => createInformationSection(
    'next-action',
    'Prossima Azione',
    `Azione raccomandata: ${action}`,
    {
      category: 'action',
      priority: priority,
      icon: Target,
      badge: { text: 'URGENTE', variant: 'destructive' }
    }
  ),
  
  riskProfile: (riskLevel: string) => createInformationSection(
    'risk-profile',
    'Profilo Rischio',
    `Livello di rischio: ${riskLevel}`,
    {
      category: 'risk',
      priority: 80,
      icon: Shield,
      expandable: true
    }
  ),
  
  revenueOpportunity: (amount: number) => createInformationSection(
    'revenue-opportunity',
    'Opportunità Revenue',
    `Potenziale annuo: €${amount.toLocaleString()}`,
    {
      category: 'opportunity',
      priority: 85,
      icon: TrendingUp,
      badge: { text: `€${(amount/1000).toFixed(0)}K`, variant: 'default' }
    }
  )
}