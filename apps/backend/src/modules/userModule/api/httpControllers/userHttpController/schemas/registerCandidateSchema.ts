import { type Static, Type } from '@sinclair/typebox';

import { type HttpRouteSchema } from '../../../../../../common/http/httpRoute.ts';
import { httpStatusCodes } from '../../../../../../common/http/httpStatusCode.ts';

import { firstNameSchema, lastNameSchema, candidateSchema } from './candidateSchema.ts';
import { emailSchema, passwordSchema } from './userSchema.ts';

const registerCandidateRequestBodySchema = Type.Object({
  email: emailSchema,
  password: passwordSchema,
  firstName: firstNameSchema,
  lastName: lastNameSchema,
  resumeUrl: Type.Optional(Type.String({ minLength: 1 })),
  githubUrl: Type.Optional(Type.String({ minLength: 1 })),
  linkedinUrl: Type.Optional(Type.String({ minLength: 1 })),
});

export type RegisterCandidateRequestBody = Static<typeof registerCandidateRequestBodySchema>;

const registerCandidateResponseBodySchema = candidateSchema;

export type RegisterCandidateResponseBody = Static<typeof registerCandidateResponseBodySchema>;

export const registerCandidateSchema = {
  request: {
    body: registerCandidateRequestBodySchema,
  },
  response: {
    [httpStatusCodes.created]: {
      schema: registerCandidateResponseBodySchema,
      description: 'Candidate registered',
    },
  },
} satisfies HttpRouteSchema;
