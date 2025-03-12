import { type Static, Type } from '@sinclair/typebox';

import { type HttpRouteSchema } from '../../../../../../common/http/httpRoute.ts';
import { httpStatusCodes } from '../../../../../../common/http/httpStatusCode.ts';

import { emailSchema, passwordSchema } from './userSchema.ts';

const loginUserBodySchema = Type.Object({
  email: emailSchema,
  password: passwordSchema,
});

export type LoginUserBody = Static<typeof loginUserBodySchema>;

const loginUserResponseBodySchema = Type.Object({
  accessToken: Type.String(),
  refreshToken: Type.String(),
});

export type LoginUserResponseBody = Static<typeof loginUserResponseBodySchema>;

export const loginUserSchema = {
  request: {
    body: loginUserBodySchema,
  },
  response: {
    [httpStatusCodes.ok]: {
      schema: loginUserResponseBodySchema,
      description: 'User logged in',
    },
  },
} satisfies HttpRouteSchema;
