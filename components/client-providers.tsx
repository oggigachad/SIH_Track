"use client"

import { ReactNode } from 'react'
import { AuthProvider } from '@/lib/auth-context'
import { SettingsProvider } from '@/lib/settings-context'
import NotificationCenter from './notification-center'

interface ClientProvidersProps {
  children: ReactNode
}

export function ClientProviders({ children }: ClientProvidersProps) {
  return (
    <SettingsProvider>
      <AuthProvider>
        {children}
        <NotificationCenter />
      </AuthProvider>
    </SettingsProvider>
  )
}
