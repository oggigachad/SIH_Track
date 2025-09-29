"use client"

// Force dynamic rendering to avoid static generation issues with context
export const dynamic = 'force-dynamic'

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function FieldPortalRoot() {
  const router = useRouter()
  
  useEffect(() => {
    router.push("/field/dashboard")
  }, [router])

  return null
}