"use client"

// Force dynamic rendering to avoid static generation issues with context
export const dynamic = 'force-dynamic'

import RoleGuard from "@/components/role-guard"
import PortalLayout from "@/components/portal-layout"
import SharedDashboard from "@/components/shared-dashboard"
import { PortalType } from "@/lib/role-utils"

const DEPOT_MODULES = ["depot"] // Only depot modules for this portal

export default function DepotDashboard() {
  return (
    <RoleGuard requiredPortal={PortalType.DEPOT}>
      <PortalLayout portalType={PortalType.DEPOT} modules={DEPOT_MODULES}>
        <SharedDashboard 
          modules={DEPOT_MODULES}
          welcomeMessage="Welcome to Depot QA Portal"
        />
      </PortalLayout>
    </RoleGuard>
  )
}