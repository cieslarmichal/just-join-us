import { type Static, Type } from '@sinclair/typebox';

import { type HttpRouteSchema } from '../../../../../../common/http/httpRoute.ts';
import { httpStatusCodes } from '../../../../../../common/http/httpStatusCode.ts';

import { trainingEventSchema } from './trainingEventSchema.ts';

const findTrainingEventPathParamsSchema = Type.Object({
  trainingEventId: Type.String({ format: 'uuid' }),
});

export type FindTrainingEventPathParams = Static<typeof findTrainingEventPathParamsSchema>;

const findTrainingEventResponseBodySchema = trainingEventSchema;

export type FindTrainingEventResponseBody = Static<typeof findTrainingEventResponseBodySchema>;

export const findTrainingEventSchema = {
  request: {
    pathParams: findTrainingEventPathParamsSchema,
  },
  response: {
    [httpStatusCodes.ok]: {
      schema: findTrainingEventResponseBodySchema,
      description: 'TrainingEvent found',
    },
  },
} satisfies HttpRouteSchema;
