import { type Static, Type } from '@sinclair/typebox';

import { type HttpRouteSchema } from '../../../../../../common/http/httpRoute.ts';
import { httpStatusCodes } from '../../../../../../common/http/httpStatusCode.ts';

import { emailSchema } from './userSchema.ts';

const resetUserPasswordBodySchema = Type.Object({
  email: emailSchema,
});

export type ResetUserPasswordBody = Static<typeof resetUserPasswordBodySchema>;

const resetUserPasswordResponseBodySchema = Type.Null();

export type ResetUserPasswordResponseBody = Static<typeof resetUserPasswordResponseBodySchema>;

export const resetUserPasswordSchema = {
  request: {
    body: resetUserPasswordBodySchema,
  },
  response: {
    [httpStatusCodes.ok]: {
      schema: resetUserPasswordResponseBodySchema,
      description: 'User password reset',
    },
  },
} satisfies HttpRouteSchema;
