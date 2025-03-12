import { type Static, Type } from '@sinclair/typebox';

import type { HttpRouteSchema } from '../../../../../../common/http/httpRoute.ts';
import { httpStatusCodes } from '../../../../../../common/http/httpStatusCode.ts';

const checkHealthResponseBodySchema = Type.Object({
  healthy: Type.Boolean(),
});

export type CheckHealthResponseBody = Static<typeof checkHealthResponseBodySchema>;

export const checkHealthSchema = {
  request: {},
  response: {
    [httpStatusCodes.ok]: {
      schema: checkHealthResponseBodySchema,
      description: 'Application is healthy',
    },
  },
} satisfies HttpRouteSchema;
