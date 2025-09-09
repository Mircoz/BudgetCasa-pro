'use client'

import { DashboardLayout } from '@/components/layout/dashboard-layout'

export const dynamic = 'force-dynamic'

export default function Layout({ children }: { children: React.ReactNode }) {
  // Authentication removed during development - direct dashboard access
  return (
    <DashboardLayout>
      {children}
    </DashboardLayout>
  )
}