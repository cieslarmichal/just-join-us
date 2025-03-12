import { type Static, Type } from '@sinclair/typebox';

import { type HttpRouteSchema } from '../../../../../../common/http/httpRoute.ts';
import { httpStatusCodes } from '../../../../../../common/http/httpStatusCode.ts';

import { companySchema } from './companySchema.ts';
import { studentSchema } from './studentSchema.ts';
import { userSchema } from './userSchema.ts';

const findMyUserResponseBodySchema = Type.Union([userSchema, studentSchema, companySchema]);

export type FindMyUserResponseBody = Static<typeof findMyUserResponseBodySchema>;

export const findMyUserSchema = {
  request: {},
  response: {
    [httpStatusCodes.ok]: {
      schema: findMyUserResponseBodySchema,
      description: 'User found',
    },
  },
} satisfies HttpRouteSchema;
