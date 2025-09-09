'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { 
  LayoutDashboard, 
  Users, 
  Building, 
  BookmarkCheck,
  Settings,
  LogOut,
  BarChart3,
  MapPin
} from 'lucide-react'
import { Button } from '@/components/ui/button'
const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Lead Persone', href: '/leads', icon: Users },
  { name: 'Directory Aziende', href: '/companies', icon: Building },
  { name: 'Market Insights', href: '/insights', icon: BarChart3 },
  { name: 'Liste Salvate', href: '/lists', icon: BookmarkCheck },
  { name: 'Impostazioni', href: '/settings', icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="flex flex-col h-full bg-gray-900 text-white w-64">
      {/* Header */}
      <div className="flex items-center px-6 py-4 border-b border-gray-700">
        <h1 className="text-xl font-semibold">BudgetCasa Pro</h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-4 space-y-2">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link key={item.name} href={item.href}>
              <div
                className={cn(
                  'flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                  isActive 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-300 hover:text-white hover:bg-gray-700'
                )}
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.name}
              </div>
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-700">
        <div className="text-xs text-gray-500 text-center">
          Modalità Sviluppo
        </div>
      </div>
    </div>
  )
}