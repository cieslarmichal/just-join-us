import { type Static, Type } from '@sinclair/typebox';

import { userRoles, type UserRole } from '../../../../../../common/types/userRole.ts';

import { emailSchema } from './userSchema.ts';

export const companyNameSchema = Type.String({
  minLength: 1,
  maxLength: 128,
});

export const taxIdSchema = Type.String({
  minLength: 1,
  maxLength: 16,
});

export const logoUrlSchema = Type.String({
  minLength: 1,
  maxLength: 256,
});

export const companyPhoneSchema = Type.String({
  minLength: 1,
  maxLength: 20,
});

export const companySchema = Type.Object({
  id: Type.String({ format: 'uuid' }),
  email: emailSchema,
  isEmailVerified: Type.Boolean(),
  isDeleted: Type.Boolean(),
  role: Type.Union([...Object.values(userRoles).map((role) => Type.Literal(role as UserRole))]),
  createdAt: Type.String({ format: 'date-time' }),
  name: companyNameSchema,
  taxId: taxIdSchema,
  phone: companyPhoneSchema,
  isVerified: Type.Boolean(),
  logoUrl: logoUrlSchema,
});

export type CompanyDto = Static<typeof companySchema>;
