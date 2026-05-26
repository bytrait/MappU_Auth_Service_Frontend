import DefaultLogin from "../../pages/Login"

import MapauLogin from "../../pages/overrides/mappu/auth/LoginPage"

export function resolveLoginPage(tenant) {
  const code = tenant?.code

  const registry = {
    mapau: MapauLogin,
  }

  return registry[code] || DefaultLogin
}