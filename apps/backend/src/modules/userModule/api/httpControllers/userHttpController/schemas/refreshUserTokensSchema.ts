import { type Static, Type } from '@sinclair/typebox';

import { type HttpRouteSchema } from '../../../../../../common/http/httpRoute.ts';
import { httpStatusCodes } from '../../../../../../common/http/httpStatusCode.ts';

const refreshUserTokensBodySchema = Type.Object({
  refreshToken: Type.String({ minLength: 1 }),
});

export type RefreshUserTokensBody = Static<typeof refreshUserTokensBodySchema>;

const refreshUserTokensResponseBodySchema = Type.Object({
  accessToken: Type.String(),
  refreshToken: Type.String(),
});

export type RefreshUserTokensResponseBody = Static<typeof refreshUserTokensResponseBodySchema>;

export const refreshUserTokensSchema = {
  request: {
    body: refreshUserTokensBodySchema,
  },
  response: {
    [httpStatusCodes.ok]: {
      schema: refreshUserTokensResponseBodySchema,
      description: 'User tokens refreshed',
    },
  },
} satisfies HttpRouteSchema;
