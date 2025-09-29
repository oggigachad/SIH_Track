"use client"

// Force dynamic rendering to avoid static generation issues with context
export const dynamic = 'force-dynamic'

import React from 'react'
import { useSettings } from '@/lib/settings-context'
import SettingsModal from '@/components/settings-modal'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Settings } from 'lucide-react'

export default function TestSettingsPage() {
  const settings = useSettings()

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Settings Test Page</h1>
        <p className="text-muted-foreground">Test the settings modal and context functionality</p>
      </div>

      {/* Settings Modal Trigger */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Settings Modal Test
          </CardTitle>
          <CardDescription>
            Click the button below to open the settings modal
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SettingsModal>
            <Button>
              Open Settings
            </Button>
          </SettingsModal>
        </CardContent>
      </Card>

      {/* Current Settings Display */}
      <Card>
        <CardHeader>
          <CardTitle>Current Settings</CardTitle>
          <CardDescription>
            Display of current settings values from the context
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Theme</label>
              <Badge variant="outline">{settings.theme}</Badge>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Translation</label>
              <Badge variant={settings.translationEnabled ? "default" : "secondary"}>
                {settings.translationEnabled ? 'Enabled' : 'Disabled'}
              </Badge>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Language</label>
              <Badge variant="outline">{settings.preferredLanguage}</Badge>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Show IP</label>
              <Badge variant={settings.showIpAddress ? "default" : "secondary"}>
                {settings.showIpAddress ? 'Yes' : 'No'}
              </Badge>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">IP Address</label>
              <Badge variant="outline" className="font-mono">
                {settings.ipAddress || 'Not loaded'}
              </Badge>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Notifications</label>
              <Badge variant={settings.notificationsEnabled ? "default" : "secondary"}>
                {settings.notificationsEnabled ? 'Enabled' : 'Disabled'}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Theme Test */}
      <Card>
        <CardHeader>
          <CardTitle>Theme Test</CardTitle>
          <CardDescription>
            Test theme switching functionality
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2 flex-wrap">
            <Button 
              size="sm" 
              variant={settings.theme === 'light' ? "default" : "outline"}
              onClick={() => settings.setTheme('light')}
            >
              Light
            </Button>
            <Button 
              size="sm" 
              variant={settings.theme === 'dark' ? "default" : "outline"}
              onClick={() => settings.setTheme('dark')}
            >
              Dark
            </Button>
            <Button 
              size="sm" 
              variant={settings.theme === 'system' ? "default" : "outline"}
              onClick={() => settings.setTheme('system')}
            >
              System
            </Button>
          </div>
          
          <div className="text-sm text-muted-foreground">
            Current browser prefers: {typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'} mode
          </div>
        </CardContent>
      </Card>
    </div>
  )
}