import { type Static, Type } from '@sinclair/typebox';

import { type HttpRouteSchema } from '../../../../../../common/http/httpRoute.ts';
import { httpStatusCodes } from '../../../../../../common/http/httpStatusCode.ts';

import { passwordSchema } from './userSchema.ts';

const changeUserPasswordBodySchema = Type.Object({
  password: passwordSchema,
  token: Type.Optional(Type.String({ minLength: 1 })),
});

export type ChangeUserPasswordBody = Static<typeof changeUserPasswordBodySchema>;

const changeUserPasswordResponseBodySchema = Type.Null();

export type ChangeUserPasswordResponseBody = Static<typeof changeUserPasswordResponseBodySchema>;

export const changeUserPasswordSchema = {
  request: {
    body: changeUserPasswordBodySchema,
  },
  response: {
    [httpStatusCodes.ok]: {
      schema: changeUserPasswordResponseBodySchema,
      description: 'User password changed',
    },
  },
} satisfies HttpRouteSchema;
