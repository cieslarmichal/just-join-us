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

const updateTrainingEventPathParamsSchema = Type.Object({
  trainingEventId: Type.String({ format: 'uuid' }),
});

export type UpdateTrainingEventPathParams = Static<typeof updateTrainingEventPathParamsSchema>;

const updateTrainingEventRequestBodySchema = Type.Object({
  city: Type.Optional(citySchema),
  place: Type.Optional(placeSchema),
  latitude: Type.Optional(latitudeSchema),
  longitude: Type.Optional(longitudeSchema),
  centPrice: Type.Optional(centPriceSchema),
  startsAt: Type.Optional(Type.String({ format: 'date-time' })),
  endsAt: Type.Optional(Type.String({ format: 'date-time' })),
  isHidden: Type.Optional(Type.Boolean()),
});

export type UpdateTrainingEventRequestBody = Static<typeof updateTrainingEventRequestBodySchema>;

const updateTrainingEventResponseBodySchema = trainingEventSchema;

export type UpdateTrainingEventResponseBody = Static<typeof updateTrainingEventResponseBodySchema>;

export const updateTrainingEventSchema = {
  request: {
    pathParams: updateTrainingEventPathParamsSchema,
    body: updateTrainingEventRequestBodySchema,
  },
  response: {
    [httpStatusCodes.ok]: {
      schema: updateTrainingEventResponseBodySchema,
      description: 'TrainingEvent updated',
    },
  },
} satisfies HttpRouteSchema;
