import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('it-IT', {
    style: 'currency',
    currency: 'EUR'
  }).format(amount)
}

export function formatPercentage(value: number): string {
  return `${Math.round(value * 100)}%`
}

export function getScoreColor(score: number, type: 'risk' | 'opportunity'): string {
  if (type === 'risk') {
    if (score >= 0.7) return 'bg-red-100 text-red-800'
    if (score >= 0.5) return 'bg-yellow-100 text-yellow-800'
    return 'bg-green-100 text-green-800'
  } else {
    if (score >= 0.7) return 'bg-green-100 text-green-800'
    if (score >= 0.5) return 'bg-yellow-100 text-yellow-800'
    return 'bg-gray-100 text-gray-800'
  }
}

export function getScoreLabel(score: number, type: 'risk' | 'opportunity'): string {
  if (type === 'risk') {
    if (score >= 0.7) return 'Alto'
    if (score >= 0.5) return 'Medio'
    return 'Basso'
  } else {
    if (score >= 0.7) return 'Alta'
    if (score >= 0.5) return 'Media'
    return 'Bassa'
  }
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}
