import { type Static, Type } from '@sinclair/typebox';

import { type HttpRouteSchema } from '../../../../../../common/http/httpRoute.ts';
import { httpStatusCodes } from '../../../../../../common/http/httpStatusCode.ts';

import { firstNameSchema, lastNameSchema, studentSchema, studentPhoneSchema } from './studentSchema.ts';
import { emailSchema, passwordSchema } from './userSchema.ts';

const registerStudentRequestBodySchema = Type.Object({
  email: emailSchema,
  password: passwordSchema,
  firstName: firstNameSchema,
  lastName: lastNameSchema,
  birthDate: Type.String({ format: 'date' }),
  phone: studentPhoneSchema,
});

export type RegisterStudentRequestBody = Static<typeof registerStudentRequestBodySchema>;

const registerStudentResponseBodySchema = studentSchema;

export type RegisterStudentResponseBody = Static<typeof registerStudentResponseBodySchema>;

export const registerStudentSchema = {
  request: {
    body: registerStudentRequestBodySchema,
  },
  response: {
    [httpStatusCodes.created]: {
      schema: registerStudentResponseBodySchema,
      description: 'Student registered',
    },
  },
} satisfies HttpRouteSchema;
