import { useEffect } from "react"
import { useTenant } from "../TenantContext"
import {
  applyFavicon,
  applyTitle,
} from "./branding.utils"

export default function BrandingProvider({ children }) {
  const tenant = useTenant()

  useEffect(() => {
    if (!tenant) return

    applyTitle(tenant.name)
    applyFavicon(tenant.theme?.favicon)
  }, [tenant])

  return children
}