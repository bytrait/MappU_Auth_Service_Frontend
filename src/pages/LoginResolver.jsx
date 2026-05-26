import { resolveLoginPage } from "../tenant/resolvers/authResolver"
import { resolveStudentRegistration } from "../tenant/resolvers/registerResolver"
import { useTenant } from "../tenant/TenantContext"

export  function LoginResolver() {
  const tenant = useTenant()

  const Component = resolveLoginPage(tenant)

  return <Component />
}

export function StudentRegistrationResolver() {
  const tenant = useTenant()

  const Component = resolveStudentRegistration(tenant)

  return <Component />
}