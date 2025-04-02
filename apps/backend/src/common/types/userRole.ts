export const userRoles = {
  admin: 'admin',
  candidate: 'candidate',
  company: 'company',
} as const;

export type UserRole = (typeof userRoles)[keyof typeof userRoles];
