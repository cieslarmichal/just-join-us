import { type Static, Type } from '@sinclair/typebox';

import { type HttpRouteSchema } from '../../../../../../common/http/httpRoute.ts';
import { httpStatusCodes } from '../../../../../../common/http/httpStatusCode.ts';

import { jobOfferSchema } from './jobOfferSchema.ts';

export const findJobOffersQueryParamsSchema = Type.Object({
  name: Type.Optional(Type.String({ minLength: 1 })),
  companyId: Type.String({ format: 'uuid' }),
  page: Type.Optional(Type.Integer({ minimum: 1 })),
  pageSize: Type.Optional(Type.Integer({ minimum: 1 })),
});

export type FindJobOffersQueryParams = Static<typeof findJobOffersQueryParamsSchema>;

const findJobOffersResponseBodySchema = Type.Object({
  data: Type.Array(jobOfferSchema),
  metadata: Type.Object({
    page: Type.Integer({ minimum: 1 }),
    pageSize: Type.Integer({ minimum: 1 }),
    total: Type.Integer({ minimum: 0 }),
  }),
});

export type FindJobOffersResponseBody = Static<typeof findJobOffersResponseBodySchema>;

export const findJobOffersSchema = {
  request: {
    queryParams: findJobOffersQueryParamsSchema,
  },
  response: {
    [httpStatusCodes.ok]: {
      schema: findJobOffersResponseBodySchema,
      description: 'JobOffers found',
    },
  },
} satisfies HttpRouteSchema;
