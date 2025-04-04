import { type Static, Type } from '@sinclair/typebox';

import { type HttpRouteSchema } from '../../../../../../common/http/httpRoute.ts';
import { httpStatusCodes } from '../../../../../../common/http/httpStatusCode.ts';

import { locationAddressSchema, locationNameSchema, locationSchema } from './locationSchema.ts';

const updateLocationPathParamsSchema = Type.Object({
  companyId: Type.String({ format: 'uuid' }),
  locationId: Type.String({ format: 'uuid' }),
});

export type UpdateLocationPathParams = Static<typeof updateLocationPathParamsSchema>;

const updateLocationRequestBodySchema = Type.Object({
  name: Type.Optional(locationNameSchema),
  cityId: Type.Optional(Type.String({ format: 'uuid' })),
  address: Type.Optional(locationAddressSchema),
  latitude: Type.Optional(Type.Number()),
  longitude: Type.Optional(Type.Number()),
});

export type UpdateLocationRequestBody = Static<typeof updateLocationRequestBodySchema>;

const updateLocationResponseBodySchema = locationSchema;

export type UpdateLocationResponseBody = Static<typeof updateLocationResponseBodySchema>;

export const updateLocationSchema = {
  request: {
    pathParams: updateLocationPathParamsSchema,
    body: updateLocationRequestBodySchema,
  },
  response: {
    [httpStatusCodes.ok]: {
      schema: updateLocationResponseBodySchema,
      description: 'Location updated',
    },
  },
} satisfies HttpRouteSchema;
