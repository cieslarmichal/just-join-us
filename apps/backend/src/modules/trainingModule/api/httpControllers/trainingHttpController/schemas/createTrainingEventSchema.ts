import { type Static, Type } from '@sinclair/typebox';

import { type HttpRouteSchema } from '../../../../../../common/http/httpRoute.ts';
import { httpStatusCodes } from '../../../../../../common/http/httpStatusCode.ts';

import {
  citySchema,
  placeSchema,
  latitudeSchema,
  longitudeSchema,
  centPriceSchema,
  trainingEventSchema,
} from './trainingEventSchema.ts';

const createTrainingEventRequestBodySchema = Type.Object({
  city: citySchema,
  place: Type.Optional(placeSchema),
  latitude: latitudeSchema,
  longitude: longitudeSchema,
  centPrice: centPriceSchema,
  startsAt: Type.String({ format: 'date-time' }),
  endsAt: Type.String({ format: 'date-time' }),
  trainingId: Type.String({ format: 'uuid' }),
});

export type CreateTrainingEventRequestBody = Static<typeof createTrainingEventRequestBodySchema>;

const createTrainingEventResponseBodySchema = trainingEventSchema;

export type CreateTrainingEventResponseBody = Static<typeof createTrainingEventResponseBodySchema>;

export const createTrainingEventSchema = {
  request: {
    body: createTrainingEventRequestBodySchema,
  },
  response: {
    [httpStatusCodes.created]: {
      schema: createTrainingEventResponseBodySchema,
      description: 'TrainingEvent created',
    },
  },
} satisfies HttpRouteSchema;
