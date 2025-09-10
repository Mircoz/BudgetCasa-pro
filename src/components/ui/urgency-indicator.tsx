'use client'

import { Badge } from '@/components/ui/badge'
import { 
  Clock, 
  AlertTriangle, 
  Zap, 
  Timer,
  Calendar,
  Flame
} from 'lucide-react'

interface UrgencyIndicatorProps {
  urgencyScore: number // 0-100
  deadline?: Date
  label?: string
  size?: 'sm' | 'md' | 'lg'
  showIcon?: boolean
  showCountdown?: boolean
  variant?: 'default' | 'compact' | 'detailed'
}

interface UrgencyConfig {
  level: 'low' | 'medium' | 'high' | 'critical'
  label: string
  color: string
  bgColor: string
  textColor: string
  icon: React.ComponentType<any>
  pulseClass?: string
}

const getUrgencyConfig = (score: number): UrgencyConfig => {
  if (score >= 90) {
    return {
      level: 'critical',
      label: 'CRITICO',
      color: 'bg-red-600',
      bgColor: 'bg-red-100',
      textColor: 'text-red-800',
      icon: AlertTriangle,
      pulseClass: 'animate-pulse'
    }
  } else if (score >= 75) {
    return {
      level: 'high',
      label: 'ALTO',
      color: 'bg-orange-600',
      bgColor: 'bg-orange-100',
      textColor: 'text-orange-800',
      icon: Flame
    }
  } else if (score >= 50) {
    return {
      level: 'medium',
      label: 'MEDIO',
      color: 'bg-yellow-600',
      bgColor: 'bg-yellow-100',
      textColor: 'text-yellow-800',
      icon: Clock
    }
  } else {
    return {
      level: 'low',
      label: 'BASSO',
      color: 'bg-green-600',
      bgColor: 'bg-green-100',
      textColor: 'text-green-800',
      icon: Timer
    }
  }
}

const formatTimeRemaining = (deadline: Date): { text: string, isOverdue: boolean, isUrgent: boolean } => {
  const now = new Date()
  const diffMs = deadline.getTime() - now.getTime()
  
  if (diffMs < 0) {
    const hoursOverdue = Math.abs(Math.floor(diffMs / (1000 * 60 * 60)))
    return { 
      text: `SCADUTO ${hoursOverdue}h fa`, 
      isOverdue: true, 
      isUrgent: false 
    }
  }
  
  const minutes = Math.floor(diffMs / (1000 * 60))
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)
  
  if (minutes < 60) {
    return { 
      text: `${minutes}min`, 
      isOverdue: false, 
      isUrgent: true 
    }
  } else if (hours < 24) {
    return { 
      text: `${hours}h ${minutes % 60}min`, 
      isOverdue: false, 
      isUrgent: hours < 4 
    }
  } else if (days < 7) {
    return { 
      text: `${days}g ${hours % 24}h`, 
      isOverdue: false, 
      isUrgent: days < 2 
    }
  } else {
    return { 
      text: `${days} giorni`, 
      isOverdue: false, 
      isUrgent: false 
    }
  }
}

const getSizeClasses = (size: 'sm' | 'md' | 'lg') => {
  switch (size) {
    case 'sm':
      return {
        badge: 'text-xs px-2 py-1',
        icon: 'h-3 w-3',
        text: 'text-xs'
      }
    case 'lg':
      return {
        badge: 'text-base px-4 py-2',
        icon: 'h-5 w-5',
        text: 'text-base'
      }
    default: // md
      return {
        badge: 'text-sm px-3 py-1.5',
        icon: 'h-4 w-4',
        text: 'text-sm'
      }
  }
}

export function UrgencyIndicator({
  urgencyScore,
  deadline,
  label,
  size = 'md',
  showIcon = true,
  showCountdown = true,
  variant = 'default'
}: UrgencyIndicatorProps) {
  const config = getUrgencyConfig(urgencyScore)
  const sizeClasses = getSizeClasses(size)
  const Icon = config.icon
  
  let timeInfo: { text: string, isOverdue: boolean, isUrgent: boolean } | null = null
  if (deadline && showCountdown) {
    timeInfo = formatTimeRemaining(deadline)
  }

  // Compact variant - just a small colored badge
  if (variant === 'compact') {
    return (
      <div className="flex items-center space-x-1">
        <Badge 
          className={`${config.color} text-white ${sizeClasses.badge} ${config.pulseClass || ''}`}
        >
          {showIcon && <Icon className={`${sizeClasses.icon} ${size === 'sm' ? 'mr-1' : 'mr-1.5'}`} />}
          {urgencyScore}
        </Badge>
        {timeInfo && (
          <span className={`${sizeClasses.text} ${
            timeInfo.isOverdue ? 'text-red-600 font-bold' : 
            timeInfo.isUrgent ? 'text-orange-600 font-medium' : 
            'text-gray-600'
          }`}>
            {timeInfo.text}
          </span>
        )}
      </div>
    )
  }

  // Detailed variant - full breakdown
  if (variant === 'detailed') {
    return (
      <div className={`p-3 rounded-lg ${config.bgColor} border border-gray-200`}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            {showIcon && <Icon className={`${sizeClasses.icon} ${config.textColor}`} />}
            <span className={`font-medium ${config.textColor}`}>
              {label || `Urgenza ${config.label}`}
            </span>
          </div>
          <Badge className={`${config.color} text-white ${config.pulseClass || ''}`}>
            {urgencyScore}/100
          </Badge>
        </div>
        
        <div className="space-y-1">
          <div className={`${sizeClasses.text} ${config.textColor}`}>
            {getUrgencyDescription(urgencyScore)}
          </div>
          
          {timeInfo && (
            <div className="flex items-center space-x-1">
              <Calendar className="h-3 w-3 text-gray-500" />
              <span className={`text-xs ${
                timeInfo.isOverdue ? 'text-red-600 font-bold' : 
                timeInfo.isUrgent ? 'text-orange-600' : 
                'text-gray-600'
              }`}>
                {timeInfo.isOverdue ? '⚠️ ' : '⏰ '}
                {timeInfo.text}
              </span>
            </div>
          )}
        </div>
      </div>
    )
  }

  // Default variant - balanced info display
  return (
    <div className="flex items-center space-x-2">
      <Badge 
        className={`${config.color} text-white ${sizeClasses.badge} flex items-center space-x-1 ${config.pulseClass || ''}`}
      >
        {showIcon && <Icon className={sizeClasses.icon} />}
        <span>{config.label}</span>
        {size !== 'sm' && <span>({urgencyScore})</span>}
      </Badge>
      
      {timeInfo && (
        <div className="flex items-center space-x-1">
          <Clock className="h-3 w-3 text-gray-400" />
          <span className={`${sizeClasses.text} ${
            timeInfo.isOverdue ? 'text-red-600 font-bold' : 
            timeInfo.isUrgent ? 'text-orange-600 font-medium' : 
            'text-gray-600'
          }`}>
            {timeInfo.text}
          </span>
        </div>
      )}
      
      {label && size === 'lg' && (
        <span className={`${sizeClasses.text} text-gray-600`}>
          {label}
        </span>
      )}
    </div>
  )
}

const getUrgencyDescription = (score: number): string => {
  if (score >= 90) {
    return 'Richiede azione immediata - entro 2 ore'
  } else if (score >= 75) {
    return 'Alta priorità - entro oggi'
  } else if (score >= 50) {
    return 'Media priorità - entro 2-3 giorni'
  } else {
    return 'Bassa priorità - può aspettare'
  }
}

// Additional utility components
export function UrgencyDot({ urgencyScore, className }: { urgencyScore: number, className?: string }) {
  const config = getUrgencyConfig(urgencyScore)
  
  return (
    <div 
      className={`w-3 h-3 rounded-full ${config.color} ${config.pulseClass || ''} ${className || ''}`} 
      title={`Urgenza: ${config.label} (${urgencyScore}/100)`}
    />
  )
}

export function UrgencyBar({ urgencyScore, className }: { urgencyScore: number, className?: string }) {
  const config = getUrgencyConfig(urgencyScore)
  
  return (
    <div className={`w-full bg-gray-200 rounded-full h-2 ${className || ''}`}>
      <div 
        className={`${config.color} h-2 rounded-full transition-all duration-300 ${config.pulseClass || ''}`}
        style={{ width: `${urgencyScore}%` }}
      />
    </div>
  )
}