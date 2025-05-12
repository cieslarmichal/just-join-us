import { type Static, Type } from '@sinclair/typebox';

import { type HttpRouteSchema } from '../../../../../../common/http/httpRoute.ts';
import { httpStatusCodes } from '../../../../../../common/http/httpStatusCode.ts';

import {
  companyLocationNameSchema,
  companyLocationAddressSchema,
  companyLocationSchema,
} from './companyLocationSchema.ts';

const createCompanyLocationPathParamsSchema = Type.Object({
  companyId: Type.String({ format: 'uuid' }),
});

export type CreateCompanyLocationPathParams = Static<typeof createCompanyLocationPathParamsSchema>;

const createCompanyLocationRequestBodySchema = Type.Object({
  name: companyLocationNameSchema,
  cityId: Type.String({ format: 'uuid' }),
  address: companyLocationAddressSchema,
  latitude: Type.Number(),
  longitude: Type.Number(),
});
export type CreateCompanyLocationRequestBody = Static<typeof createCompanyLocationRequestBodySchema>;

const createCompanyLocationResponseBodySchema = companyLocationSchema;

export type CreateCompanyLocationResponseBody = Static<typeof createCompanyLocationResponseBodySchema>;

export const createCompanyLocationSchema = {
  request: {
    pathParams: createCompanyLocationPathParamsSchema,
    body: createCompanyLocationRequestBodySchema,
  },
  response: {
    [httpStatusCodes.created]: {
      schema: createCompanyLocationResponseBodySchema,
      description: 'Company location created',
    },
  },
} satisfies HttpRouteSchema;
