import { type Static, Type } from '@sinclair/typebox';

import { type HttpRouteSchema } from '../../../../../../common/http/httpRoute.ts';
import { httpStatusCodes } from '../../../../../../common/http/httpStatusCode.ts';

import { jobOfferDescriptionSchema, jobOfferNameSchema, jobOfferSchema } from './jobOfferSchema.ts';

const createJobOfferRequestBodySchema = Type.Object({
  name: jobOfferNameSchema,
  description: jobOfferDescriptionSchema,
  categoryId: Type.String({ format: 'uuid' }),
  companyId: Type.String({ format: 'uuid' }),
});

export type CreateJobOfferRequestBody = Static<typeof createJobOfferRequestBodySchema>;

const createJobOfferResponseBodySchema = jobOfferSchema;

export type CreateJobOfferResponseBody = Static<typeof createJobOfferResponseBodySchema>;

export const createJobOfferSchema = {
  request: {
    body: createJobOfferRequestBodySchema,
  },
  response: {
    [httpStatusCodes.created]: {
      schema: createJobOfferResponseBodySchema,
      description: 'JobOffer created',
    },
  },
} satisfies HttpRouteSchema;
