"use client"

import React, { ReactNode } from "react"
import { useAuth } from "@/lib/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import SettingsModal from "@/components/settings-modal"
import {
  Database,
  QrCode,
  Wrench,
  Search,
  BarChart3,
  Recycle,
  Shield,
  Wifi,
  WifiOff,
  User,
  Settings,
  LogOut,
} from "lucide-react"
import Image from "next/image"
import { PortalType, getPortalDisplayName, type ModuleConfig } from "@/lib/role-utils"

interface PortalLayoutProps {
  children: ReactNode
  portalType: PortalType
  modules: ModuleConfig[]
}

export default function PortalLayout({ children, portalType, modules }: PortalLayoutProps) {
  const { currentUser, logout } = useAuth()

  const handleLogout = () => {
    logout()
    // Redirect to login will happen automatically via auth context
  }

  const portalDisplayName = getPortalDisplayName(portalType)

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-white shadow-sm border">
                  <Image
                    src="/images/track-logo.png"
                    alt="Track Railway Management System Logo"
                    width={40}
                    height={40}
                    className="h-10 w-10 object-contain"
                    priority
                  />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
                    Track
                    <Badge variant="outline" className="text-xs font-normal">
                      v2.0
                    </Badge>
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    {portalDisplayName}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className={`status-indicator ${currentUser?.isOnline ? "status-online" : "status-offline"}`}>
                {currentUser?.isOnline ? <Wifi className="h-3 w-3" /> : <WifiOff className="h-3 w-3" />}
                {currentUser?.isOnline ? "Online" : "Offline"}
              </div>

              <div className="flex items-center gap-2 px-3 py-2 bg-muted rounded-lg">
                <User className="h-4 w-4 text-muted-foreground" />
                <div className="text-sm">
                  <div className="font-medium text-foreground">{currentUser?.name}</div>
                  <div className="text-muted-foreground">
                    {currentUser?.role} • {currentUser?.id}
                  </div>
                </div>
              </div>

              <SettingsModal>
                <Button variant="ghost" size="icon" title="Settings">
                  <Settings className="h-4 w-4" />
                </Button>
              </SettingsModal>
              
              <Button variant="ghost" size="icon" onClick={handleLogout} title="Logout">
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  )
}