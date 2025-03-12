import { type Static, Type } from '@sinclair/typebox';

import { type HttpRouteSchema } from '../../../../../../common/http/httpRoute.ts';
import { httpStatusCodes } from '../../../../../../common/http/httpStatusCode.ts';

import { latitudeSchema, longitudeSchema, trainingEventSchema } from './trainingEventSchema.ts';

export const findTrainingEventsQueryParamsSchema = Type.Object({
  trainingName: Type.Optional(Type.String({ minLength: 1 })),
  categoryId: Type.Optional(Type.String({ format: 'uuid' })),
  companyId: Type.Optional(Type.String({ format: 'uuid' })),
  latitude: Type.Optional(latitudeSchema),
  longitude: Type.Optional(longitudeSchema),
  radius: Type.Optional(Type.Number()),
  page: Type.Optional(Type.Integer({ minimum: 1 })),
  pageSize: Type.Optional(Type.Integer({ minimum: 1 })),
});

export type FindTrainingEventsQueryParams = Static<typeof findTrainingEventsQueryParamsSchema>;

const findTrainingEventsResponseBodySchema = Type.Object({
  data: Type.Array(trainingEventSchema),
  metadata: Type.Object({
    page: Type.Integer({ minimum: 1 }),
    pageSize: Type.Integer({ minimum: 1 }),
    total: Type.Integer({ minimum: 0 }),
  }),
});

export type FindTrainingEventsResponseBody = Static<typeof findTrainingEventsResponseBodySchema>;

export const findTrainingEventsSchema = {
  request: {
    queryParams: findTrainingEventsQueryParamsSchema,
  },
  response: {
    [httpStatusCodes.ok]: {
      schema: findTrainingEventsResponseBodySchema,
      description: 'TrainingEvents found',
    },
  },
} satisfies HttpRouteSchema;
