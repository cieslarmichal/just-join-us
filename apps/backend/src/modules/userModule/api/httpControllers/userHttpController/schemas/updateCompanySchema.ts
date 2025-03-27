import { type Static, Type } from '@sinclair/typebox';

import { type HttpRouteSchema } from '../../../../../../common/http/httpRoute.ts';
import { httpStatusCodes } from '../../../../../../common/http/httpStatusCode.ts';

import { companySchema, companyPhoneSchema, logoUrlSchema } from './companySchema.ts';

const updateCompanyPathParamsSchema = Type.Object({
  companyId: Type.String({ format: 'uuid' }),
});

export type UpdateCompanyPathParams = Static<typeof updateCompanyPathParamsSchema>;

const updateCompanyRequestBodySchema = Type.Object({
  phone: Type.Optional(companyPhoneSchema),
  logoUrl: Type.Optional(logoUrlSchema),
  isDeleted: Type.Optional(Type.Boolean()),
});

export type UpdateCompanyRequestBody = Static<typeof updateCompanyRequestBodySchema>;

const updateCompanyResponseBodySchema = companySchema;

export type UpdateCompanyResponseBody = Static<typeof updateCompanyResponseBodySchema>;

export const updateCompanySchema = {
  request: {
    pathParams: updateCompanyPathParamsSchema,
    body: updateCompanyRequestBodySchema,
  },
  response: {
    [httpStatusCodes.ok]: {
      schema: updateCompanyResponseBodySchema,
      description: 'Company updated',
    },
  },
} satisfies HttpRouteSchema;
