import DefaultLogin from '../../pages/Login';
import MappuLogin from '../../pages/overrides/mappu/auth/LoginPage';

export function resolveLoginPage(tenant) {
  const code = tenant?.code;

  const registry = {
    mappu: MappuLogin,
  };

  return registry[code] || DefaultLogin;
}
