import { type Static, Type } from '@sinclair/typebox';

import { type HttpRouteSchema } from '../../../../../../common/http/httpRoute.ts';
import { httpStatusCodes } from '../../../../../../common/http/httpStatusCode.ts';

import { citySchema } from './citySchema.ts';

export const findCitiesQueryParamsSchema = Type.Object({
  name: Type.Optional(Type.String({ minLength: 1 })),
  type: Type.Optional(Type.String({ minLength: 1 })),
  page: Type.Optional(Type.Integer({ minimum: 1 })),
  pageSize: Type.Optional(Type.Integer({ minimum: 1 })),
});

export type FindCitiesQueryParams = Static<typeof findCitiesQueryParamsSchema>;

const findCitiesResponseBodySchema = Type.Object({
  data: Type.Array(citySchema),
  metadata: Type.Object({
    page: Type.Integer({ minimum: 1 }),
    pageSize: Type.Integer({ minimum: 1 }),
    total: Type.Integer({ minimum: 0 }),
  }),
});

export type FindCitiesResponseBody = Static<typeof findCitiesResponseBodySchema>;

export const findCitiesSchema = {
  request: {
    queryParams: findCitiesQueryParamsSchema,
  },
  response: {
    [httpStatusCodes.ok]: {
      schema: findCitiesResponseBodySchema,
      description: 'Cities found',
    },
  },
} satisfies HttpRouteSchema;
