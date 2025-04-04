import { type Static, Type } from '@sinclair/typebox';

import { type HttpRouteSchema } from '../../../../../../common/http/httpRoute.ts';
import { httpStatusCodes } from '../../../../../../common/http/httpStatusCode.ts';

import { jobOfferSchema } from './jobOfferSchema.ts';

const findJobOfferPathParamsSchema = Type.Object({
  jobOfferId: Type.String({ format: 'uuid' }),
});

export type FindJobOfferPathParams = Static<typeof findJobOfferPathParamsSchema>;

const findJobOfferResponseBodySchema = jobOfferSchema;

export type FindJobOfferResponseBody = Static<typeof findJobOfferResponseBodySchema>;

export const findJobOfferSchema = {
  request: {
    pathParams: findJobOfferPathParamsSchema,
  },
  response: {
    [httpStatusCodes.ok]: {
      schema: findJobOfferResponseBodySchema,
      description: 'JobOffer found',
    },
  },
} satisfies HttpRouteSchema;
