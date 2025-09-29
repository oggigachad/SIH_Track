"use client"

// Force dynamic rendering to avoid static generation issues with context
export const dynamic = 'force-dynamic'

import RoleGuard from "@/components/role-guard"
import PortalLayout from "@/components/portal-layout"
import SharedDashboard from "@/components/shared-dashboard"
import { PortalType } from "@/lib/role-utils"

const INSPECTOR_MODULES = ["inspection"] // Only inspection modules for this portal

export default function InspectorDashboard() {
  return (
    <RoleGuard requiredPortal={PortalType.INSPECTOR}>
      <PortalLayout portalType={PortalType.INSPECTOR} modules={INSPECTOR_MODULES}>
        <SharedDashboard 
          modules={INSPECTOR_MODULES}
          welcomeMessage="Welcome to Inspector Portal"
        />
      </PortalLayout>
    </RoleGuard>
  )
}