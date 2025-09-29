export enum UserRole {
  VENDOR = "Vendor",
  QA_DEPOT = "QA Manager", 
  FIELD_CREW = "Field Engineer",
  INSPECTOR = "Inspector",
  ANALYTICS_MANAGER = "Analytics Manager",
  EOL_MANAGER = "EOL Manager"
}

export enum PortalType {
  VENDOR = "vendor",
  DEPOT = "depot", 
  FIELD = "field",
  INSPECTOR = "inspector",
  ANALYTICS = "analytics",
  RECYCLING = "recycling"
}

export interface ModuleConfig {
  id: string
  title: string
  description: string
  icon: any
  color: string
  stats: string
  component?: any
}

// Role to portal mapping
export const ROLE_PORTAL_MAP: Record<string, PortalType> = {
  // Role names from auth-page.tsx
  "Vendor": PortalType.VENDOR,
  "QA Manager": PortalType.DEPOT,
  "Inspector": PortalType.INSPECTOR, 
  "Engineer": PortalType.FIELD,
  "Authority": PortalType.ANALYTICS,
  "Recycler": PortalType.RECYCLING,
  // Legacy role names (if any exist)
  "Field Engineer": PortalType.FIELD,
  "Analytics Manager": PortalType.ANALYTICS,
  "EOL Manager": PortalType.RECYCLING,
  // Support ID-based mapping as well (from auth-page.tsx)
  "VN": PortalType.VENDOR,    // VN001234
  "IR": PortalType.INSPECTOR, // IR001234  
  "EN": PortalType.FIELD,     // EN001234
  "AU": PortalType.ANALYTICS, // AU001234
  "RC": PortalType.RECYCLING, // RC001234
  // Legacy ID prefixes
  "VND": PortalType.VENDOR,
  "QA": PortalType.DEPOT,
  "FC": PortalType.FIELD,
  "INS": PortalType.INSPECTOR,
  "AN": PortalType.ANALYTICS,
  "EOL": PortalType.RECYCLING
}

// Module permissions by portal
export const PORTAL_MODULE_MAP: Record<PortalType, string[]> = {
  [PortalType.VENDOR]: ["vendor"],
  [PortalType.DEPOT]: ["depot"],
  [PortalType.FIELD]: ["installation"],
  [PortalType.INSPECTOR]: ["inspection"],
  [PortalType.ANALYTICS]: ["vendor", "depot", "installation", "inspection", "analytics", "recycling"], // Authority can access everything
  [PortalType.RECYCLING]: ["recycling"]
}

/**
 * Get the portal type for a user based on their role
 */
export function getPortalForUser(userRole: string, userId?: string): PortalType | null {
  // First try by full role name
  if (ROLE_PORTAL_MAP[userRole]) {
    return ROLE_PORTAL_MAP[userRole]
  }
  
  // Then try by user ID prefix (e.g., VND-001, QA-002)
  if (userId) {
    const prefix = userId.split('-')[0]
    if (ROLE_PORTAL_MAP[prefix]) {
      return ROLE_PORTAL_MAP[prefix]
    }
  }
  
  return null
}

/**
 * Get the dashboard route for a user
 */
export function getDashboardRoute(userRole: string, userId?: string): string {
  const portal = getPortalForUser(userRole, userId)
  return portal ? `/${portal}/dashboard` : '/'
}

/**
 * Check if a user has access to a specific portal
 */
export function hasPortalAccess(userRole: string, userId: string, portalType: PortalType): boolean {
  const userPortal = getPortalForUser(userRole, userId)
  return userPortal === portalType
}

/**
 * Get allowed modules for a user's portal
 */
export function getAllowedModules(userRole: string, userId?: string): string[] {
  const portal = getPortalForUser(userRole, userId)
  return portal ? PORTAL_MODULE_MAP[portal] : []
}

/**
 * Get portal display name
 */
export function getPortalDisplayName(portalType: PortalType): string {
  const names: Record<PortalType, string> = {
    [PortalType.VENDOR]: "Vendor Portal",
    [PortalType.DEPOT]: "Depot QA Portal",
    [PortalType.FIELD]: "Field Crew Portal", 
    [PortalType.INSPECTOR]: "Inspector Portal",
    [PortalType.ANALYTICS]: "Analytics Portal",
    [PortalType.RECYCLING]: "Recycling & EOL Portal"
  }
  return names[portalType] || "Portal"
}