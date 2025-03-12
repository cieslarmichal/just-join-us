import { type Static, Type } from '@sinclair/typebox';

import { type HttpRouteSchema } from '../../../../../../common/http/httpRoute.ts';
import { httpStatusCodes } from '../../../../../../common/http/httpStatusCode.ts';

import { trainingDescriptionSchema, trainingNameSchema, trainingSchema } from './trainingSchema.ts';

const updateTrainingPathParamsSchema = Type.Object({
  trainingId: Type.String({ format: 'uuid' }),
});

export type UpdateTrainingPathParams = Static<typeof updateTrainingPathParamsSchema>;

const updateTrainingRequestBodySchema = Type.Object({
  name: Type.Optional(trainingNameSchema),
  description: Type.Optional(trainingDescriptionSchema),
  categoryId: Type.Optional(Type.String({ format: 'uuid' })),
  isHidden: Type.Optional(Type.Boolean()),
});

export type UpdateTrainingRequestBody = Static<typeof updateTrainingRequestBodySchema>;

const updateTrainingResponseBodySchema = trainingSchema;

export type UpdateTrainingResponseBody = Static<typeof updateTrainingResponseBodySchema>;

export const updateTrainingSchema = {
  request: {
    pathParams: updateTrainingPathParamsSchema,
    body: updateTrainingRequestBodySchema,
  },
  response: {
    [httpStatusCodes.ok]: {
      schema: updateTrainingResponseBodySchema,
      description: 'Training updated',
    },
  },
} satisfies HttpRouteSchema;
