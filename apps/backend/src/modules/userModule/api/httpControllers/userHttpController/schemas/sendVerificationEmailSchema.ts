import { type Static, Type } from '@sinclair/typebox';

import { type HttpRouteSchema } from '../../../../../../common/http/httpRoute.ts';
import { httpStatusCodes } from '../../../../../../common/http/httpStatusCode.ts';

import { emailSchema } from './userSchema.ts';

const sendVerificationEmailBodySchema = Type.Object({
  email: emailSchema,
});

export type SendVerificationEmailBody = Static<typeof sendVerificationEmailBodySchema>;

const sendVerificationEmailResponseBodySchema = Type.Null();

export type SendVerificationEmailResponseBody = Static<typeof sendVerificationEmailResponseBodySchema>;

export const sendVerificationEmailSchema = {
  request: {
    body: sendVerificationEmailBodySchema,
  },
  response: {
    [httpStatusCodes.ok]: {
      schema: sendVerificationEmailResponseBodySchema,
      description: 'Verification email sent',
    },
  },
} satisfies HttpRouteSchema;
