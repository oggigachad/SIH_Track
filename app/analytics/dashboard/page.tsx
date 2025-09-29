"use client"

// Force dynamic rendering to avoid static generation issues with context
export const dynamic = 'force-dynamic'

import RoleGuard from "@/components/role-guard"
import PortalLayout from "@/components/portal-layout"
import SharedDashboard from "@/components/shared-dashboard"
import { PortalType } from "@/lib/role-utils"

const ANALYTICS_MODULES = ["analytics"] // Only analytics modules for this portal

export default function AnalyticsDashboard() {
  return (
    <RoleGuard requiredPortal={PortalType.ANALYTICS}>
      <PortalLayout portalType={PortalType.ANALYTICS} modules={ANALYTICS_MODULES}>
        <SharedDashboard 
          modules={ANALYTICS_MODULES}
          welcomeMessage="Welcome to Analytics Portal"
        />
      </PortalLayout>
    </RoleGuard>
  )
}