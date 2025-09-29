"use client"

// Force dynamic rendering to avoid static generation issues with context
export const dynamic = 'force-dynamic'

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function AnalyticsPortalRoot() {
  const router = useRouter()
  
  useEffect(() => {
    router.push("/analytics/dashboard")
  }, [router])

  return null
}