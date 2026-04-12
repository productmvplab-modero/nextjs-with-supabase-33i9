/**
 * Tenant utilities for parsing and managing tenant context
 */

export interface TenantInfo {
  id: string
  domain: string
  subdomain?: string
  email: string
  name: string
}

/**
 * Extract tenant info from email address
 * Supports: user@company.com or user@subdomain.company.com
 */
export function parseTenantFromEmail(email: string): Partial<TenantInfo> {
  const [localPart, domain] = email.split("@")
  if (!domain) return {}

  const domainParts = domain.split(".")
  const baseDomain = domainParts.slice(-2).join(".")

  return {
    email,
    domain: baseDomain,
    subdomain: domainParts.length > 2 ? domainParts[0] : undefined,
    name: localPart.split(".").map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(" "),
  }
}

/**
 * Extract tenant from URL subdomain
 * Supports: subdomain.localhost:3000 or subdomain.example.com
 */
export function parseTenantFromUrl(hostname: string): Partial<TenantInfo> {
  const parts = hostname.split(":")[0].split(".")

  // localhost or IP
  if (parts.length <= 1 || hostname.includes("localhost") || hostname.match(/^\d+\.\d+\.\d+\.\d+/)) {
    return {}
  }

  // Extract subdomain if present
  if (parts.length > 2) {
    return {
      subdomain: parts[0],
      domain: parts.slice(1).join("."),
    }
  }

  return {
    domain: hostname.split(":")[0],
  }
}

/**
 * Generate tenant ID from domain or subdomain
 */
export function generateTenantId(info: Partial<TenantInfo>): string {
  if (info.subdomain) {
    return `${info.subdomain.toLowerCase()}-${(info.domain || "").toLowerCase()}`
  }
  return (info.domain || "").toLowerCase()
}

/**
 * Combine email and URL tenant info
 */
export function mergeTenantInfo(
  emailInfo: Partial<TenantInfo>,
  urlInfo: Partial<TenantInfo>
): TenantInfo {
  const merged = {
    ...emailInfo,
    ...urlInfo,
    email: emailInfo.email || "",
    name: emailInfo.name || "Tenant",
  }

  const id = generateTenantId(merged)

  return {
    id,
    email: merged.email,
    name: merged.name,
    domain: merged.domain || "",
    subdomain: merged.subdomain,
  }
}

/**
 * Verify tenant matches across email and URL
 */
export function verifyTenantMatch(
  emailDomain: string,
  urlDomain: string,
  allowMismatch: boolean = false
): boolean {
  if (allowMismatch) return true

  const emailBase = emailDomain.split(".").slice(-2).join(".")
  const urlBase = urlDomain.split(".").slice(-2).join(".")

  return emailBase === urlBase
}
