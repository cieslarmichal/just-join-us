import { type Static, Type } from '@sinclair/typebox';

import { type HttpRouteSchema } from '../../../../../../common/http/httpRoute.ts';
import { httpStatusCodes } from '../../../../../../common/http/httpStatusCode.ts';

import { trainingDescriptionSchema, trainingNameSchema, trainingSchema } from './trainingSchema.ts';

const createTrainingRequestBodySchema = Type.Object({
  name: trainingNameSchema,
  description: trainingDescriptionSchema,
  categoryId: Type.String({ format: 'uuid' }),
  companyId: Type.String({ format: 'uuid' }),
});

export type CreateTrainingRequestBody = Static<typeof createTrainingRequestBodySchema>;

const createTrainingResponseBodySchema = trainingSchema;

export type CreateTrainingResponseBody = Static<typeof createTrainingResponseBodySchema>;

export const createTrainingSchema = {
  request: {
    body: createTrainingRequestBodySchema,
  },
  response: {
    [httpStatusCodes.created]: {
      schema: createTrainingResponseBodySchema,
      description: 'Training created',
    },
  },
} satisfies HttpRouteSchema;
