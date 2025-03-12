import { type Static, Type } from '@sinclair/typebox';

import { type HttpRouteSchema } from '../../../../../../common/http/httpRoute.ts';
import { httpStatusCodes } from '../../../../../../common/http/httpStatusCode.ts';

const logoutUserPathParamsSchema = Type.Object({
  userId: Type.String({ format: 'uuid' }),
});

export type LogoutUserPathParams = Static<typeof logoutUserPathParamsSchema>;

const logoutUserBodySchema = Type.Object({
  refreshToken: Type.String(),
  accessToken: Type.String(),
});

export type LogoutUserBody = Static<typeof logoutUserBodySchema>;

const logoutUserResponseBodySchema = Type.Null();

export type LogoutUserResponseBody = Static<typeof logoutUserResponseBodySchema>;

export const logoutUserSchema = {
  request: {
    pathParams: logoutUserPathParamsSchema,
    body: logoutUserBodySchema,
  },
  response: {
    [httpStatusCodes.ok]: {
      schema: logoutUserResponseBodySchema,
      description: 'User logged out',
    },
  },
} satisfies HttpRouteSchema;
