import { type Static, Type } from '@sinclair/typebox';

import { type HttpRouteSchema } from '../../../../../../common/http/httpRoute.ts';
import { httpStatusCodes } from '../../../../../../common/http/httpStatusCode.ts';

import { trainingSchema } from './trainingSchema.ts';

export const findTrainingsQueryParamsSchema = Type.Object({
  name: Type.Optional(Type.String({ minLength: 1 })),
  companyId: Type.String({ format: 'uuid' }),
  page: Type.Optional(Type.Integer({ minimum: 1 })),
  pageSize: Type.Optional(Type.Integer({ minimum: 1 })),
});

export type FindTrainingsQueryParams = Static<typeof findTrainingsQueryParamsSchema>;

const findTrainingsResponseBodySchema = Type.Object({
  data: Type.Array(trainingSchema),
  metadata: Type.Object({
    page: Type.Integer({ minimum: 1 }),
    pageSize: Type.Integer({ minimum: 1 }),
    total: Type.Integer({ minimum: 0 }),
  }),
});

export type FindTrainingsResponseBody = Static<typeof findTrainingsResponseBodySchema>;

export const findTrainingsSchema = {
  request: {
    queryParams: findTrainingsQueryParamsSchema,
  },
  response: {
    [httpStatusCodes.ok]: {
      schema: findTrainingsResponseBodySchema,
      description: 'Trainings found',
    },
  },
} satisfies HttpRouteSchema;
