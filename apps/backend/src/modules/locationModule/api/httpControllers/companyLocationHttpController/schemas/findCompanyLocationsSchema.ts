import { type Static, Type } from '@sinclair/typebox';

import { type HttpRouteSchema } from '../../../../../../common/http/httpRoute.ts';
import { httpStatusCodes } from '../../../../../../common/http/httpStatusCode.ts';

import { companyLocationSchema } from './companyLocationSchema.ts';

export const findCompanyLocationsPathParamsSchema = Type.Object({
  companyId: Type.String({ minLength: 1 }),
});

export type FindCompanyLocationsPathParams = Static<typeof findCompanyLocationsPathParamsSchema>;

export const findCompanyLocationsQueryParamsSchema = Type.Object({
  page: Type.Optional(Type.Integer({ minimum: 1 })),
  pageSize: Type.Optional(Type.Integer({ minimum: 1 })),
});

export type FindCompanyLocationsQueryParams = Static<typeof findCompanyLocationsQueryParamsSchema>;

const findCompanyLocationsResponseBodySchema = Type.Object({
  data: Type.Array(companyLocationSchema),
  metadata: Type.Object({
    page: Type.Integer({ minimum: 1 }),
    pageSize: Type.Integer({ minimum: 1 }),
    total: Type.Integer({ minimum: 0 }),
  }),
});

export type FindCompanyLocationsResponseBody = Static<typeof findCompanyLocationsResponseBodySchema>;

export const findCompanyLocationsSchema = {
  request: {
    queryParams: findCompanyLocationsQueryParamsSchema,
    pathParams: findCompanyLocationsPathParamsSchema,
  },
  response: {
    [httpStatusCodes.ok]: {
      schema: findCompanyLocationsResponseBodySchema,
      description: 'Company locations found',
    },
  },
} satisfies HttpRouteSchema;
