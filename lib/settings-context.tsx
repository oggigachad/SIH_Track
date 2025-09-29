"use client"

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'

interface SettingsContextType {
  // Theme settings
  theme: 'light' | 'dark' | 'system'
  setTheme: (theme: 'light' | 'dark' | 'system') => void
  
  // Translation settings
  translationEnabled: boolean
  setTranslationEnabled: (enabled: boolean) => void
  preferredLanguage: string
  setPreferredLanguage: (language: string) => void
  
  // Network settings
  showIpAddress: boolean
  setShowIpAddress: (show: boolean) => void
  ipAddress: string | null
  
  // Notification settings
  notificationsEnabled: boolean
  setNotificationsEnabled: (enabled: boolean) => void
  emailNotifications: boolean
  setEmailNotifications: (enabled: boolean) => void
  pushNotifications: boolean
  setPushNotifications: (enabled: boolean) => void
  soundEnabled: boolean
  setSoundEnabled: (enabled: boolean) => void
  
  // Privacy settings
  analyticsEnabled: boolean
  setAnalyticsEnabled: (enabled: boolean) => void
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined)

export function SettingsProvider({ children }: { children: ReactNode }) {
  // Theme settings
  const [theme, setThemeState] = useState<'light' | 'dark' | 'system'>('system')
  
  // Translation settings
  const [translationEnabled, setTranslationEnabled] = useState(false)
  const [preferredLanguage, setPreferredLanguage] = useState('en')
  
  // Network settings
  const [showIpAddress, setShowIpAddress] = useState(false)
  const [ipAddress, setIpAddress] = useState<string | null>(null)
  
  // Notification settings
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [pushNotifications, setPushNotifications] = useState(false)
  const [soundEnabled, setSoundEnabled] = useState(true)
  
  // Privacy settings
  const [analyticsEnabled, setAnalyticsEnabled] = useState(true)

  // Load settings from localStorage on mount
  useEffect(() => {
    if (typeof window === 'undefined') return

    try {
      const savedSettings = localStorage.getItem('railway-settings')
      if (savedSettings) {
        const settings = JSON.parse(savedSettings)
        setThemeState(settings.theme || 'system')
        setTranslationEnabled(settings.translationEnabled ?? false)
        setPreferredLanguage(settings.preferredLanguage || 'en')
        setShowIpAddress(settings.showIpAddress ?? false)
        setNotificationsEnabled(settings.notificationsEnabled ?? true)
        setEmailNotifications(settings.emailNotifications ?? true)
        setPushNotifications(settings.pushNotifications ?? false)
        setSoundEnabled(settings.soundEnabled ?? true)
        setAnalyticsEnabled(settings.analyticsEnabled ?? true)
      }
    } catch (error) {
      console.error('Error loading settings:', error)
    }
  }, [])

  // Save settings to localStorage whenever they change
  const saveSettings = () => {
    if (typeof window === 'undefined') return

    const settings = {
      theme,
      translationEnabled,
      preferredLanguage,
      showIpAddress,
      notificationsEnabled,
      emailNotifications,
      pushNotifications,
      soundEnabled,
      analyticsEnabled
    }

    localStorage.setItem('railway-settings', JSON.stringify(settings))
  }

  useEffect(() => {
    saveSettings()
  }, [
    theme,
    translationEnabled,
    preferredLanguage,
    showIpAddress,
    notificationsEnabled,
    emailNotifications,
    pushNotifications,
    soundEnabled,
    analyticsEnabled
  ])

  // Apply theme to document
  useEffect(() => {
    if (typeof window === 'undefined') return

    const applyTheme = (newTheme: 'light' | 'dark') => {
      const root = document.documentElement
      root.classList.remove('light', 'dark')
      root.classList.add(newTheme)
    }

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    
    if (theme === 'system') {
      applyTheme(mediaQuery.matches ? 'dark' : 'light')
      
      const handleChange = (e: MediaQueryListEvent) => {
        applyTheme(e.matches ? 'dark' : 'light')
      }
      
      mediaQuery.addEventListener('change', handleChange)
      return () => mediaQuery.removeEventListener('change', handleChange)
    } else {
      applyTheme(theme)
    }
  }, [theme])

  // Fetch IP address when showIpAddress is enabled
  useEffect(() => {
    if (!showIpAddress || ipAddress) return

    const fetchIpAddress = async () => {
      try {
        // Using a public IP API
        const response = await fetch('https://api.ipify.org?format=json')
        const data = await response.json()
        setIpAddress(data.ip)
      } catch (error) {
        console.error('Error fetching IP address:', error)
        // Fallback to a different service
        try {
          const response = await fetch('https://ipapi.co/ip/')
          const ip = await response.text()
          setIpAddress(ip.trim())
        } catch (fallbackError) {
          console.error('Error fetching IP from fallback:', fallbackError)
        }
      }
    }

    fetchIpAddress()
  }, [showIpAddress, ipAddress])

  const setTheme = (newTheme: 'light' | 'dark' | 'system') => {
    setThemeState(newTheme)
  }

  return (
    <SettingsContext.Provider
      value={{
        theme,
        setTheme,
        translationEnabled,
        setTranslationEnabled,
        preferredLanguage,
        setPreferredLanguage,
        showIpAddress,
        setShowIpAddress,
        ipAddress,
        notificationsEnabled,
        setNotificationsEnabled,
        emailNotifications,
        setEmailNotifications,
        pushNotifications,
        setPushNotifications,
        soundEnabled,
        setSoundEnabled,
        analyticsEnabled,
        setAnalyticsEnabled
      }}
    >
      {children}
    </SettingsContext.Provider>
  )
}

export function useSettings() {
  const context = useContext(SettingsContext)
  
  // Handle SSR case - return default values without throwing error
  if (typeof window === 'undefined') {
    return {
      theme: 'system' as const,
      setTheme: () => {},
      translationEnabled: false,
      setTranslationEnabled: () => {},
      preferredLanguage: 'en',
      setPreferredLanguage: () => {},
      showIpAddress: false,
      setShowIpAddress: () => {},
      ipAddress: null,
      notificationsEnabled: true,
      setNotificationsEnabled: () => {},
      emailNotifications: true,
      setEmailNotifications: () => {},
      pushNotifications: false,
      setPushNotifications: () => {},
      soundEnabled: true,
      setSoundEnabled: () => {},
      analyticsEnabled: true,
      setAnalyticsEnabled: () => {}
    }
  }
  
  // Handle client-side case where context might not be available
  if (context === undefined) {
    // During hydration or if provider is missing, return default values
    // This prevents the error during client-side rendering
    console.warn('useSettings: SettingsProvider not found, using default values')
    return {
      theme: 'system' as const,
      setTheme: () => {},
      translationEnabled: false,
      setTranslationEnabled: () => {},
      preferredLanguage: 'en',
      setPreferredLanguage: () => {},
      showIpAddress: false,
      setShowIpAddress: () => {},
      ipAddress: null,
      notificationsEnabled: true,
      setNotificationsEnabled: () => {},
      emailNotifications: true,
      setEmailNotifications: () => {},
      pushNotifications: false,
      setPushNotifications: () => {},
      soundEnabled: true,
      setSoundEnabled: () => {},
      analyticsEnabled: true,
      setAnalyticsEnabled: () => {}
    }
  }
  
  return context
}
