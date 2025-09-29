"use client"

// Force dynamic rendering to avoid static generation issues with context
export const dynamic = 'force-dynamic'

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function DepotPortalRoot() {
  const router = useRouter()
  
  useEffect(() => {
    router.push("/depot/dashboard")
  }, [router])

  return null
}