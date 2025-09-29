"use client"

// Force dynamic rendering to avoid static generation issues with context
export const dynamic = 'force-dynamic'

import RoleGuard from "@/components/role-guard"
import PortalLayout from "@/components/portal-layout"
import SharedDashboard from "@/components/shared-dashboard"
import { PortalType } from "@/lib/role-utils"

const VENDOR_MODULES = ["vendor"] // Only vendor modules for this portal

export default function VendorDashboard() {
  return (
    <RoleGuard requiredPortal={PortalType.VENDOR}>
      <PortalLayout portalType={PortalType.VENDOR} modules={VENDOR_MODULES}>
        <SharedDashboard 
          modules={VENDOR_MODULES}
          welcomeMessage="Welcome to Vendor Portal"
        />
      </PortalLayout>
    </RoleGuard>
  )
}