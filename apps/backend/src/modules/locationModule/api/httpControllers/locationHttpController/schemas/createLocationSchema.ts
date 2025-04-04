import { type Static, Type } from '@sinclair/typebox';

import { type HttpRouteSchema } from '../../../../../../common/http/httpRoute.ts';
import { httpStatusCodes } from '../../../../../../common/http/httpStatusCode.ts';

import { locationAddressSchema, locationNameSchema, locationSchema } from './locationSchema.ts';

const createLocationPathParamsSchema = Type.Object({
  companyId: Type.String({ format: 'uuid' }),
  locationId: Type.String({ format: 'uuid' }),
});

export type CreateLocationPathParams = Static<typeof createLocationPathParamsSchema>;

const createLocationRequestBodySchema = Type.Union([
  Type.Object({
    name: locationNameSchema,
    isRemote: Type.Literal(true),
  }),
  Type.Object({
    name: locationNameSchema,
    isRemote: Type.Literal(false),
    cityId: Type.String({ format: 'uuid' }),
    address: locationAddressSchema,
    latitude: Type.Number(),
    longitude: Type.Number(),
  }),
]);
export type CreateLocationRequestBody = Static<typeof createLocationRequestBodySchema>;

const createLocationResponseBodySchema = locationSchema;

export type CreateLocationResponseBody = Static<typeof createLocationResponseBodySchema>;

export const createLocationSchema = {
  request: {
    pathParams: createLocationPathParamsSchema,
    body: createLocationRequestBodySchema,
  },
  response: {
    [httpStatusCodes.created]: {
      schema: createLocationResponseBodySchema,
      description: 'Location created',
    },
  },
} satisfies HttpRouteSchema;
