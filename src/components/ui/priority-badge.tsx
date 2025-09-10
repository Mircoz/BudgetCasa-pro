'use client'

import { Badge } from '@/components/ui/badge'
import { 
  AlertTriangle,
  Clock,
  Star,
  Target,
  Zap,
  TrendingUp,
  DollarSign,
  Users,
  Calendar,
  Activity
} from 'lucide-react'

interface PriorityBadgeProps {
  priority: 1 | 2 | 3 | 'low' | 'medium' | 'high' | 'critical'
  type?: 'action' | 'revenue' | 'time' | 'engagement' | 'risk'
  value?: number | string
  label?: string
  size?: 'sm' | 'md' | 'lg'
  showIcon?: boolean
  animated?: boolean
  className?: string
}

const PRIORITY_CONFIGS = {
  // Numeric priorities (1 = highest)
  1: {
    level: 'critical',
    label: 'CRITICA',
    color: 'bg-red-600 text-white border-red-600',
    bgColor: 'bg-red-50',
    textColor: 'text-red-800',
    borderColor: 'border-red-200',
    icon: AlertTriangle,
    pulseClass: 'animate-pulse'
  },
  2: {
    level: 'high',
    label: 'ALTA',
    color: 'bg-orange-600 text-white border-orange-600',
    bgColor: 'bg-orange-50',
    textColor: 'text-orange-800',
    borderColor: 'border-orange-200',
    icon: Zap
  },
  3: {
    level: 'medium',
    label: 'MEDIA',
    color: 'bg-blue-600 text-white border-blue-600',
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-800',
    borderColor: 'border-blue-200',
    icon: Target
  },
  
  // Named priorities
  critical: {
    level: 'critical',
    label: 'CRITICA',
    color: 'bg-red-600 text-white border-red-600',
    bgColor: 'bg-red-50',
    textColor: 'text-red-800',
    borderColor: 'border-red-200',
    icon: AlertTriangle,
    pulseClass: 'animate-pulse'
  },
  high: {
    level: 'high',
    label: 'ALTA',
    color: 'bg-orange-600 text-white border-orange-600',
    bgColor: 'bg-orange-50',
    textColor: 'text-orange-800',
    borderColor: 'border-orange-200',
    icon: Zap
  },
  medium: {
    level: 'medium',
    label: 'MEDIA',
    color: 'bg-blue-600 text-white border-blue-600',
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-800',
    borderColor: 'border-blue-200',
    icon: Target
  },
  low: {
    level: 'low',
    label: 'BASSA',
    color: 'bg-green-600 text-white border-green-600',
    bgColor: 'bg-green-50',
    textColor: 'text-green-800',
    borderColor: 'border-green-200',
    icon: Clock
  }
}

const TYPE_CONFIGS = {
  action: {
    prefix: '🎯',
    description: 'Azione richiesta'
  },
  revenue: {
    prefix: '💰',
    description: 'Opportunità revenue',
    icon: DollarSign
  },
  time: {
    prefix: '⏰',
    description: 'Urgenza temporale',
    icon: Calendar
  },
  engagement: {
    prefix: '👥',
    description: 'Livello engagement',
    icon: Users
  },
  risk: {
    prefix: '⚠️',
    description: 'Livello rischio',
    icon: AlertTriangle
  }
}

const SIZE_CONFIGS = {
  sm: {
    badge: 'text-xs px-2 py-1',
    icon: 'h-3 w-3',
    text: 'text-xs'
  },
  md: {
    badge: 'text-sm px-3 py-1.5',
    icon: 'h-4 w-4',
    text: 'text-sm'
  },
  lg: {
    badge: 'text-base px-4 py-2',
    icon: 'h-5 w-5',
    text: 'text-base'
  }
}

export function PriorityBadge({
  priority,
  type = 'action',
  value,
  label,
  size = 'md',
  showIcon = true,
  animated = false,
  className
}: PriorityBadgeProps) {
  const config = PRIORITY_CONFIGS[priority as keyof typeof PRIORITY_CONFIGS]
  const typeConfig = TYPE_CONFIGS[type]
  const sizeConfig = SIZE_CONFIGS[size]
  
  if (!config) {
    console.warn(`Unknown priority: ${priority}`)
    return null
  }

  const Icon = showIcon ? (typeConfig.icon || config.icon) : null
  const shouldAnimate = animated && config.level === 'critical'
  const pulseClass = shouldAnimate ? config.pulseClass : ''

  // Format value based on type
  const formatValue = (val: number | string) => {
    if (typeof val === 'number') {
      switch (type) {
        case 'revenue':
          return `€${val.toLocaleString()}`
        case 'time':
          return `${val}h`
        case 'engagement':
          return `${val}%`
        default:
          return val.toString()
      }
    }
    return val
  }

  return (
    <Badge 
      className={`
        ${config.color} 
        ${sizeConfig.badge} 
        flex items-center space-x-1 
        ${pulseClass || ''}
        ${className || ''}
      `}
      title={`${typeConfig.description}: ${config.label}${value ? ` (${formatValue(value)})` : ''}`}
    >
      {/* Type prefix emoji */}
      {typeConfig.prefix && size !== 'sm' && (
        <span>{typeConfig.prefix}</span>
      )}
      
      {/* Icon */}
      {Icon && showIcon && (
        <Icon className={sizeConfig.icon} />
      )}
      
      {/* Label */}
      <span>{label || config.label}</span>
      
      {/* Value */}
      {value && (
        <span className="font-medium">
          {size === 'sm' ? '' : '('}{formatValue(value)}{size === 'sm' ? '' : ')'}
        </span>
      )}
    </Badge>
  )
}

// Specialized priority badge variants
export function ActionPriorityBadge({ 
  priority, 
  deadline, 
  size = 'md' 
}: { 
  priority: 1 | 2 | 3, 
  deadline?: Date,
  size?: 'sm' | 'md' | 'lg' 
}) {
  let timeLabel = ''
  if (deadline) {
    const hoursUntil = Math.max(0, Math.floor((deadline.getTime() - Date.now()) / (1000 * 60 * 60)))
    timeLabel = hoursUntil < 24 ? `${hoursUntil}h` : `${Math.floor(hoursUntil / 24)}g`
  }

  return (
    <PriorityBadge
      priority={priority}
      type="time"
      value={timeLabel}
      size={size}
      animated={priority === 1}
    />
  )
}

export function RevenuePriorityBadge({ 
  amount, 
  size = 'md' 
}: { 
  amount: number, 
  size?: 'sm' | 'md' | 'lg' 
}) {
  const priority = amount >= 10000 ? 'high' : amount >= 5000 ? 'medium' : 'low'
  
  return (
    <PriorityBadge
      priority={priority}
      type="revenue"
      value={amount}
      size={size}
    />
  )
}

export function EngagementPriorityBadge({ 
  score, 
  size = 'md' 
}: { 
  score: number, // 0-100
  size?: 'sm' | 'md' | 'lg' 
}) {
  const priority = score >= 80 ? 'high' : score >= 60 ? 'medium' : 'low'
  
  return (
    <PriorityBadge
      priority={priority}
      type="engagement"
      value={score}
      size={size}
    />
  )
}

export function RiskPriorityBadge({ 
  riskLevel, 
  size = 'md' 
}: { 
  riskLevel: 'low' | 'medium' | 'high' | 'critical', 
  size?: 'sm' | 'md' | 'lg' 
}) {
  return (
    <PriorityBadge
      priority={riskLevel}
      type="risk"
      size={size}
      animated={riskLevel === 'critical'}
    />
  )
}

// Priority indicator with custom colors for specific contexts
export function CustomPriorityBadge({
  level,
  label,
  color,
  icon: IconComponent,
  value,
  size = 'md',
  animated = false,
  className
}: {
  level: 'low' | 'medium' | 'high' | 'critical'
  label: string
  color: string
  icon?: React.ComponentType<any>
  value?: string | number
  size?: 'sm' | 'md' | 'lg'
  animated?: boolean
  className?: string
}) {
  const sizeConfig = SIZE_CONFIGS[size]
  const shouldPulse = animated && level === 'critical'
  
  return (
    <Badge 
      className={`
        ${color} 
        ${sizeConfig.badge} 
        flex items-center space-x-1
        ${shouldPulse ? 'animate-pulse' : ''}
        ${className || ''}
      `}
    >
      {IconComponent && (
        <IconComponent className={sizeConfig.icon} />
      )}
      <span>{label}</span>
      {value && (
        <span className="font-medium">({value})</span>
      )}
    </Badge>
  )
}

// Priority level indicator (simple colored dot)
export function PriorityDot({ 
  priority, 
  size = 4, 
  animated = false,
  className 
}: { 
  priority: 1 | 2 | 3 | 'low' | 'medium' | 'high' | 'critical'
  size?: number
  animated?: boolean
  className?: string
}) {
  const config = PRIORITY_CONFIGS[priority as keyof typeof PRIORITY_CONFIGS]
  const shouldPulse = animated && config.level === 'critical'
  
  return (
    <div 
      className={`
        rounded-full 
        ${config.color.split(' ')[0]} 
        ${shouldPulse ? 'animate-pulse' : ''}
        ${className || ''}
      `}
      style={{ width: `${size * 0.25}rem`, height: `${size * 0.25}rem` }}
      title={`Priorità: ${config.label}`}
    />
  )
}