import { type Static, Type } from '@sinclair/typebox';

import { type HttpRouteSchema } from '../../../../../../common/http/httpRoute.ts';
import { httpStatusCodes } from '../../../../../../common/http/httpStatusCode.ts';

import { citySchema } from './citySchema.ts';

export const findCityPathParamsSchema = Type.Object({
  slug: Type.String({ minLength: 1 }),
});

export type FindCityPathParams = Static<typeof findCityPathParamsSchema>;

const findCityResponseBodySchema = citySchema;

export type FindCityResponseBody = Static<typeof findCityResponseBodySchema>;

export const findCitySchema = {
  request: {
    pathParams: findCityPathParamsSchema,
  },
  response: {
    [httpStatusCodes.ok]: {
      schema: findCityResponseBodySchema,
      description: 'City found',
    },
  },
} satisfies HttpRouteSchema;
