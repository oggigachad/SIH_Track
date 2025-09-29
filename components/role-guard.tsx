"use client"

import React, { useEffect, ReactNode } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { hasPortalAccess, getDashboardRoute, PortalType } from "@/lib/role-utils"

interface RoleGuardProps {
  children: ReactNode
  requiredPortal: PortalType
  redirectTo?: string
}

export default function RoleGuard({ children, requiredPortal, redirectTo }: RoleGuardProps) {
  const { isAuthenticated, currentUser, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (loading) return // Wait for auth to load

    if (!isAuthenticated || !currentUser) {
      // Redirect to login
      router.push("/")
      return
    }

    // Check if user has access to this portal
    const hasAccess = hasPortalAccess(currentUser.role, currentUser.id, requiredPortal)
    
    if (!hasAccess) {
      // Redirect to user's correct dashboard or fallback
      const userDashboard = getDashboardRoute(currentUser.role, currentUser.id)
      router.push(redirectTo || userDashboard)
      return
    }
  }, [isAuthenticated, currentUser, loading, requiredPortal, redirectTo, router])

  // Show loading while checking permissions
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  // Don't render anything while redirecting
  if (!isAuthenticated || !currentUser) {
    return null
  }

  // Check if user has access
  const hasAccess = hasPortalAccess(currentUser.role, currentUser.id, requiredPortal)
  if (!hasAccess) {
    return null // Will redirect via useEffect
  }

  return <>{children}</>
}

// Helper hook for checking portal access in components
export function usePortalAccess(portalType: PortalType): boolean {
  const { currentUser } = useAuth()
  
  if (!currentUser) return false
  
  return hasPortalAccess(currentUser.role, currentUser.id, portalType)
}