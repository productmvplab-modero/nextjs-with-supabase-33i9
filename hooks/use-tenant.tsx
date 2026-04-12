"use client"

import React, { createContext, useContext, useEffect, useState } from "react"
import { parseTenantFromEmail, parseTenantFromUrl, mergeTenantInfo, TenantInfo } from "@/lib/tenant"

interface TenantContextType {
  tenant: TenantInfo | null
  loading: boolean
  setTenant: (tenant: TenantInfo | null) => void
  qualifyTenant: (email: string) => void
}

const TenantContext = createContext<TenantContextType | undefined>(undefined)

export function TenantProvider({ children }: { children: React.ReactNode }) {
  const [tenant, setTenant] = useState<TenantInfo | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Extract tenant from URL and localStorage
    const hostname = typeof window !== "undefined" ? window.location.hostname : ""
    const urlInfo = parseTenantFromUrl(hostname)

    // Try to restore from localStorage
    const stored = localStorage.getItem("tenant")
    if (stored) {
      try {
        const storedTenant = JSON.parse(stored)
        if (storedTenant && storedTenant.id) {
          setTenant(storedTenant)
          setLoading(false)
          return
        }
      } catch {
        // Continue if parse fails
      }
    }

    // If only URL info available, set partial tenant
    if (urlInfo.subdomain || urlInfo.domain) {
      const partial: TenantInfo = {
        id: urlInfo.subdomain ? `${urlInfo.subdomain}-${urlInfo.domain}` : urlInfo.domain || "",
        domain: urlInfo.domain || "",
        subdomain: urlInfo.subdomain,
        email: "",
        name: urlInfo.subdomain || urlInfo.domain || "Tenant",
      }
      setTenant(partial)
    }

    setLoading(false)
  }, [])

  const qualifyTenant = (email: string) => {
    const emailInfo = parseTenantFromEmail(email)
    const hostname = typeof window !== "undefined" ? window.location.hostname : ""
    const urlInfo = parseTenantFromUrl(hostname)

    const merged = mergeTenantInfo(emailInfo, urlInfo)
    setTenant(merged)

    // Persist to localStorage
    localStorage.setItem("tenant", JSON.stringify(merged))
  }

  return (
    <TenantContext.Provider value={{ tenant, loading, setTenant, qualifyTenant }}>
      {children}
    </TenantContext.Provider>
  )
}

export function useTenant() {
  const context = useContext(TenantContext)
  if (context === undefined) {
    throw new Error("useTenant must be used within a TenantProvider")
  }
  return context
}
