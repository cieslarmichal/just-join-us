import { type Static, Type } from '@sinclair/typebox';

import { userRoles, type UserRole } from '../../../../../../common/types/userRole.ts';

export const emailSchema = Type.String({
  format: 'email',
  maxLength: 254,
});

export const passwordSchema = Type.String({
  minLength: 8,
  maxLength: 64,
});

export const userSchema = Type.Object({
  id: Type.String({ format: 'uuid' }),
  email: emailSchema,
  isEmailVerified: Type.Boolean(),
  isDeleted: Type.Boolean(),
  role: Type.Union([...Object.values(userRoles).map((role) => Type.Literal(role as UserRole))]),
  createdAt: Type.String({ format: 'date-time' }),
});

export type UserDto = Static<typeof userSchema>;
