"use client"

// Force dynamic rendering to avoid static generation issues with context
export const dynamic = 'force-dynamic'

import RoleGuard from "@/components/role-guard"
import PortalLayout from "@/components/portal-layout"
import SharedDashboard from "@/components/shared-dashboard"
import { PortalType } from "@/lib/role-utils"

const FIELD_MODULES = ["installation"] // Only field installation modules for this portal

export default function FieldDashboard() {
  return (
    <RoleGuard requiredPortal={PortalType.FIELD}>
      <PortalLayout portalType={PortalType.FIELD} modules={FIELD_MODULES}>
        <SharedDashboard 
          modules={FIELD_MODULES}
          welcomeMessage="Welcome to Field Crew Portal"
        />
      </PortalLayout>
    </RoleGuard>
  )
}