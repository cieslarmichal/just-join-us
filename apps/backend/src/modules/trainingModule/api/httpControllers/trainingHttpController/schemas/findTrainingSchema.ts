import { type Static, Type } from '@sinclair/typebox';

import { type HttpRouteSchema } from '../../../../../../common/http/httpRoute.ts';
import { httpStatusCodes } from '../../../../../../common/http/httpStatusCode.ts';

import { trainingSchema } from './trainingSchema.ts';

const findTrainingPathParamsSchema = Type.Object({
  trainingId: Type.String({ format: 'uuid' }),
});

export type FindTrainingPathParams = Static<typeof findTrainingPathParamsSchema>;

const findTrainingResponseBodySchema = trainingSchema;

export type FindTrainingResponseBody = Static<typeof findTrainingResponseBodySchema>;

export const findTrainingSchema = {
  request: {
    pathParams: findTrainingPathParamsSchema,
  },
  response: {
    [httpStatusCodes.ok]: {
      schema: findTrainingResponseBodySchema,
      description: 'Training found',
    },
  },
} satisfies HttpRouteSchema;
