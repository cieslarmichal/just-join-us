import { type Static, Type } from '@sinclair/typebox';

import { type HttpRouteSchema } from '../../../../../../common/http/httpRoute.ts';
import { httpStatusCodes } from '../../../../../../common/http/httpStatusCode.ts';

import {
  companyLocationNameSchema,
  companyLocationAddressSchema,
  companyLocationSchema,
} from './companyLocationSchema.ts';

const updateCompanyLocationPathParamsSchema = Type.Object({
  companyId: Type.String({ format: 'uuid' }),
  locationId: Type.String({ format: 'uuid' }),
});

export type UpdateCompanyLocationPathParams = Static<typeof updateCompanyLocationPathParamsSchema>;

const updateCompanyLocationRequestBodySchema = Type.Object({
  name: Type.Optional(companyLocationNameSchema),
  cityId: Type.Optional(Type.String({ format: 'uuid' })),
  address: Type.Optional(companyLocationAddressSchema),
  latitude: Type.Optional(Type.Number()),
  longitude: Type.Optional(Type.Number()),
});

export type UpdateCompanyLocationRequestBody = Static<typeof updateCompanyLocationRequestBodySchema>;

const updateCompanyLocationResponseBodySchema = companyLocationSchema;

export type UpdateCompanyLocationResponseBody = Static<typeof updateCompanyLocationResponseBodySchema>;

export const updateCompanyLocationSchema = {
  request: {
    pathParams: updateCompanyLocationPathParamsSchema,
    body: updateCompanyLocationRequestBodySchema,
  },
  response: {
    [httpStatusCodes.ok]: {
      schema: updateCompanyLocationResponseBodySchema,
      description: 'Company location updated',
    },
  },
} satisfies HttpRouteSchema;
