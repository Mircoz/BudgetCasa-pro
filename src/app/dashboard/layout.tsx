'use client'

import { AuthProvider } from '@/components/auth/auth-provider'
import { DashboardLayout } from '@/components/layout/dashboard-layout'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <DashboardLayout>
        {children}
      </DashboardLayout>
    </AuthProvider>
  )
}