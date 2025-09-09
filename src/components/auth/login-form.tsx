'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuth } from './auth-provider'

export function LoginForm() {
  const { signInWithGoogle } = useAuth()
  const [loading, setLoading] = useState(false)

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true)
      await signInWithGoogle()
    } catch (error) {
      console.error('Login error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">BudgetCasa Pro</CardTitle>
          <CardDescription className="text-center">
            Accedi alla piattaforma per agenti assicurativi
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            className="w-full" 
            onClick={handleGoogleSignIn}
            disabled={loading}
          >
            {loading ? 'Accesso in corso...' : 'Accedi con Google'}
          </Button>
          <p className="text-xs text-gray-600 text-center mt-4">
            Accedendo accetti i nostri termini di servizio e privacy policy.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}