"use client"

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { getDashboardRoute } from './role-utils'

interface User {
  name: string
  role: string
  id: string
  email: string
  department: string
  zone: string
  isOnline: boolean
}

interface AuthContextType {
  isAuthenticated: boolean
  currentUser: User | null
  login: (user: User, redirectTo?: string) => void
  logout: () => void
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  // Load auth state from localStorage on mount
  useEffect(() => {
    if (typeof window === 'undefined') {
      setLoading(false)
      return
    }

    try {
      const savedUser = localStorage.getItem('railway-auth-user')
      const savedAuth = localStorage.getItem('railway-auth-status')
      
      if (savedUser && savedAuth === 'true') {
        const user = JSON.parse(savedUser)
        setCurrentUser(user)
        setIsAuthenticated(true)
      }
    } catch (error) {
      console.error('Error loading auth state:', error)
      // Clear corrupted data
      localStorage.removeItem('railway-auth-user')
      localStorage.removeItem('railway-auth-status')
    } finally {
      setLoading(false)
    }
  }, [])

  const login = (user: User, redirectTo?: string) => {
    setCurrentUser(user)
    setIsAuthenticated(true)
    
    // Persist to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('railway-auth-user', JSON.stringify(user))
      localStorage.setItem('railway-auth-status', 'true')
    }
    
    // Redirect to appropriate portal after successful login
    const dashboardRoute = redirectTo || getDashboardRoute(user.role, user.id)
    if (typeof window !== 'undefined') {
      // Immediate redirect for faster user experience
      router.push(dashboardRoute)
    }
  }

  const logout = () => {
    setCurrentUser(null)
    setIsAuthenticated(false)
    
    // Clear from localStorage
    if (typeof window !== 'undefined') {
      localStorage.removeItem('railway-auth-user')
      localStorage.removeItem('railway-auth-status')
    }
    
    // Redirect to login page
    if (typeof window !== 'undefined') {
      router.push('/')
    }
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, currentUser, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (typeof window === 'undefined') {
    // Return default values during SSR
    return {
      isAuthenticated: false,
      currentUser: null,
      login: () => {},
      logout: () => {},
      loading: false
    }
  }
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
