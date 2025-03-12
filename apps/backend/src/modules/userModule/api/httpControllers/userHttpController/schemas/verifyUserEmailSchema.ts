import { type Static, Type } from '@sinclair/typebox';

import { type HttpRouteSchema } from '../../../../../../common/http/httpRoute.ts';
import { httpStatusCodes } from '../../../../../../common/http/httpStatusCode.ts';

const verifyUserEmailBodySchema = Type.Object({
  token: Type.String({ minLength: 1 }),
});

export type VerifyUserEmailBody = Static<typeof verifyUserEmailBodySchema>;

const verifyUserEmailResponseBodySchema = Type.Null();

export type VerifyUserEmailResponseBody = Static<typeof verifyUserEmailResponseBodySchema>;

export const verifyUserEmailSchema = {
  request: {
    body: verifyUserEmailBodySchema,
  },
  response: {
    [httpStatusCodes.ok]: {
      schema: verifyUserEmailResponseBodySchema,
      description: "User's email verified",
    },
  },
} satisfies HttpRouteSchema;
