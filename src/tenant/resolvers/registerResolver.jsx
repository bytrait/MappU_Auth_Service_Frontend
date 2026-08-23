import DefaultRegistration from '../../pages/StudentRegistration';
import MappuStudentRegistration from '../../pages/overrides/mappu/auth/StudentRegistration';

export function resolveStudentRegistration(tenant) {
  const code = tenant?.code;

  const registry = {
    mappu: MappuStudentRegistration,
  };

  return registry[code] || DefaultRegistration;
}
