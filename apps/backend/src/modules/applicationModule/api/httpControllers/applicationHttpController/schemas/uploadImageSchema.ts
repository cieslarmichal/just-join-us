import { type Static, Type } from '@sinclair/typebox';

import type { HttpRouteSchema } from '../../../../../../common/http/httpRoute.ts';
import { httpStatusCodes } from '../../../../../../common/http/httpStatusCode.ts';

export const uploadImageResponseBodySchema = Type.Object({
  url: Type.String(),
});

export type UploadImageResponseBody = Static<typeof uploadImageResponseBodySchema>;

export const uploadImageSchema = {
  request: {},
  response: {
    [httpStatusCodes.created]: {
      schema: uploadImageResponseBodySchema,
      description: 'Image uploaded',
    },
  },
} satisfies HttpRouteSchema;
