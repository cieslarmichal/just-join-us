import { type Static, Type } from '@sinclair/typebox';

import { userRoles, type UserRole } from '../../../../../../common/types/userRole.ts';

import { emailSchema } from './userSchema.ts';

export const firstNameSchema = Type.String({
  minLength: 1,
  maxLength: 64,
});

export const lastNameSchema = Type.String({
  minLength: 1,
  maxLength: 64,
});

export const studentPhoneSchema = Type.String({
  minLength: 1,
  maxLength: 20,
});

export const studentSchema = Type.Object({
  id: Type.String({ format: 'uuid' }),
  email: emailSchema,
  isEmailVerified: Type.Boolean(),
  isDeleted: Type.Boolean(),
  role: Type.Union([...Object.values(userRoles).map((role) => Type.Literal(role as UserRole))]),
  createdAt: Type.String({ format: 'date-time' }),
  firstName: firstNameSchema,
  lastName: lastNameSchema,
  birthDate: Type.String({ format: 'date' }),
  phone: studentPhoneSchema,
});

export type StudentDto = Static<typeof studentSchema>;
