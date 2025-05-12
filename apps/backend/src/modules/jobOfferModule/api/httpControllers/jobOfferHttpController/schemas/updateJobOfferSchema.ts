import { type Static, Type } from '@sinclair/typebox';

import { type HttpRouteSchema } from '../../../../../../common/http/httpRoute.ts';
import { httpStatusCodes } from '../../../../../../common/http/httpStatusCode.ts';

import { jobOfferDescriptionSchema, jobOfferNameSchema, jobOfferSchema } from './jobOfferSchema.ts';

const updateJobOfferPathParamsSchema = Type.Object({
  jobOfferId: Type.String({ format: 'uuid' }),
});

export type UpdateJobOfferPathParams = Static<typeof updateJobOfferPathParamsSchema>;

const updateJobOfferRequestBodySchema = Type.Object({
  name: Type.Optional(jobOfferNameSchema),
  description: Type.Optional(jobOfferDescriptionSchema),
  categoryId: Type.Optional(Type.String({ format: 'uuid' })),
  isHidden: Type.Optional(Type.Boolean()),
  isRemote: Type.Optional(Type.Boolean()),
  employmentType: Type.Optional(Type.String()),
  workingTime: Type.Optional(Type.String()),
  experienceLevel: Type.Optional(Type.String()),
  minSalary: Type.Optional(Type.Number()),
  maxSalary: Type.Optional(Type.Number()),
  skillIds: Type.Optional(Type.Array(Type.String({ format: 'uuid' }))),
  locationId: Type.Optional(Type.String({ format: 'uuid' })),
});

export type UpdateJobOfferRequestBody = Static<typeof updateJobOfferRequestBodySchema>;

const updateJobOfferResponseBodySchema = jobOfferSchema;

export type UpdateJobOfferResponseBody = Static<typeof updateJobOfferResponseBodySchema>;

export const updateJobOfferSchema = {
  request: {
    pathParams: updateJobOfferPathParamsSchema,
    body: updateJobOfferRequestBodySchema,
  },
  response: {
    [httpStatusCodes.ok]: {
      schema: updateJobOfferResponseBodySchema,
      description: 'JobOffer updated',
    },
  },
} satisfies HttpRouteSchema;
