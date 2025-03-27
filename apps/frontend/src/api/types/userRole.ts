export const userRoles = {
  admin: 'admin',
  student: 'student',
  company: 'company',
} as const;

export type UserRole = (typeof userRoles)[keyof typeof userRoles];
