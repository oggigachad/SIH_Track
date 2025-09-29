"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

// Force dynamic rendering to avoid static generation issues with context
export const dynamic = 'force-dynamic'

export default function VendorPortalRoot() {
  const router = useRouter()
  
  useEffect(() => {
    router.push("/vendor/dashboard")
  }, [router])

  return null
}