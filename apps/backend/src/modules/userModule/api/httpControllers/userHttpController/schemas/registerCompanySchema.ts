import { type Static, Type } from '@sinclair/typebox';

import { type HttpRouteSchema } from '../../../../../../common/http/httpRoute.ts';
import { httpStatusCodes } from '../../../../../../common/http/httpStatusCode.ts';

import {
  companySchema,
  companyNameSchema,
  companyPhoneSchema,
  logoUrlSchema,
  descriptionSchema,
} from './companySchema.ts';
import { emailSchema, passwordSchema } from './userSchema.ts';

const registerCompanyRequestBodySchema = Type.Object({
  email: emailSchema,
  password: passwordSchema,
  name: companyNameSchema,
  description: descriptionSchema,
  phone: companyPhoneSchema,
  logoUrl: logoUrlSchema,
});

export type RegisterCompanyRequestBody = Static<typeof registerCompanyRequestBodySchema>;

const registerCompanyResponseBodySchema = companySchema;

export type RegisterCompanyResponseBody = Static<typeof registerCompanyResponseBodySchema>;

export const registerCompanySchema = {
  request: {
    body: registerCompanyRequestBodySchema,
  },
  response: {
    [httpStatusCodes.created]: {
      schema: registerCompanyResponseBodySchema,
      description: 'Company registered',
    },
  },
} satisfies HttpRouteSchema;
