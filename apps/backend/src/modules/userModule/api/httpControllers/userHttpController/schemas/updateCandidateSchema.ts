import { type Static, Type } from '@sinclair/typebox';

import { type HttpRouteSchema } from '../../../../../../common/http/httpRoute.ts';
import { httpStatusCodes } from '../../../../../../common/http/httpStatusCode.ts';

import { firstNameSchema, lastNameSchema, candidateSchema } from './candidateSchema.ts';

const updateCandidatePathParamsSchema = Type.Object({
  candidateId: Type.String({ format: 'uuid' }),
});

export type UpdateCandidatePathParams = Static<typeof updateCandidatePathParamsSchema>;

const updateCandidateRequestBodySchema = Type.Object({
  firstName: Type.Optional(firstNameSchema),
  lastName: Type.Optional(lastNameSchema),
  resumeUrl: Type.Optional(Type.String({ minLength: 1 })),
  githubUrl: Type.Optional(Type.String({ minLength: 1 })),
  linkedinUrl: Type.Optional(Type.String({ minLength: 1 })),
  isDeleted: Type.Optional(Type.Boolean()),
});

export type UpdateCandidateRequestBody = Static<typeof updateCandidateRequestBodySchema>;

const updateCandidateResponseBodySchema = candidateSchema;

export type UpdateCandidateResponseBody = Static<typeof updateCandidateResponseBodySchema>;

export const updateCandidateSchema = {
  request: {
    pathParams: updateCandidatePathParamsSchema,
    body: updateCandidateRequestBodySchema,
  },
  response: {
    [httpStatusCodes.ok]: {
      schema: updateCandidateResponseBodySchema,
      description: 'Candidate updated',
    },
  },
} satisfies HttpRouteSchema;
