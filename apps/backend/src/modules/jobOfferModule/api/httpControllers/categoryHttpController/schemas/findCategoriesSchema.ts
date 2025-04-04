import { type Static, Type } from '@sinclair/typebox';

import { type HttpRouteSchema } from '../../../../../../common/http/httpRoute.ts';
import { httpStatusCodes } from '../../../../../../common/http/httpStatusCode.ts';

import { categorySchema } from './categorySchema.ts';

export const findCategoriesQueryParamsSchema = Type.Object({
  name: Type.Optional(Type.String({ minLength: 1 })),
  page: Type.Optional(Type.Integer({ minimum: 1 })),
  pageSize: Type.Optional(Type.Integer({ minimum: 1 })),
});

export type FindCategoriesQueryParams = Static<typeof findCategoriesQueryParamsSchema>;

const findCategoriesResponseBodySchema = Type.Object({
  data: Type.Array(categorySchema),
  metadata: Type.Object({
    page: Type.Integer({ minimum: 1 }),
    pageSize: Type.Integer({ minimum: 1 }),
    total: Type.Integer({ minimum: 0 }),
  }),
});

export type FindCategoriesResponseBody = Static<typeof findCategoriesResponseBodySchema>;

export const findCategoriesSchema = {
  request: {
    queryParams: findCategoriesQueryParamsSchema,
  },
  response: {
    [httpStatusCodes.ok]: {
      schema: findCategoriesResponseBodySchema,
      description: 'Categories found',
    },
  },
} satisfies HttpRouteSchema;
