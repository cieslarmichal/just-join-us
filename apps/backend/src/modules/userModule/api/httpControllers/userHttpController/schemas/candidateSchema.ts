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

export const candidateSchema = Type.Object({
  id: Type.String({ format: 'uuid' }),
  email: emailSchema,
  isEmailVerified: Type.Boolean(),
  isDeleted: Type.Boolean(),
  role: Type.Union(Object.values(userRoles).map((role) => Type.Literal(role as UserRole))),
  createdAt: Type.String({ format: 'date-time' }),
  firstName: firstNameSchema,
  lastName: lastNameSchema,
  resumeUrl: Type.Optional(Type.String({ minLength: 1 })),
  githubUrl: Type.Optional(Type.String({ minLength: 1 })),
  linkedinUrl: Type.Optional(Type.String({ minLength: 1 })),
});

export type CandidateDto = Static<typeof candidateSchema>;
