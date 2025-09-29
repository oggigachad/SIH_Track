"use client"

// Force dynamic rendering to avoid static generation issues with context
export const dynamic = 'force-dynamic'

import RoleGuard from "@/components/role-guard"
import PortalLayout from "@/components/portal-layout"
import SharedDashboard from "@/components/shared-dashboard"
import { PortalType } from "@/lib/role-utils"

const RECYCLING_MODULES = ["recycling"] // Only recycling modules for this portal

export default function RecyclingDashboard() {
  return (
    <RoleGuard requiredPortal={PortalType.RECYCLING}>
      <PortalLayout portalType={PortalType.RECYCLING} modules={RECYCLING_MODULES}>
        <SharedDashboard 
          modules={RECYCLING_MODULES}
          welcomeMessage="Welcome to Recycling & EOL Portal"
        />
      </PortalLayout>
    </RoleGuard>
  )
}