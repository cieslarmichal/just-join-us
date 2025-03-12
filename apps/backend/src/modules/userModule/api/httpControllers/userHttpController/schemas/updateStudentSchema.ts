import { type Static, Type } from '@sinclair/typebox';

import { type HttpRouteSchema } from '../../../../../../common/http/httpRoute.ts';
import { httpStatusCodes } from '../../../../../../common/http/httpStatusCode.ts';

import { firstNameSchema, lastNameSchema, studentSchema, studentPhoneNumberSchema } from './studentSchema.ts';

const updateStudentPathParamsSchema = Type.Object({
  studentId: Type.String({ format: 'uuid' }),
});

export type UpdateStudentPathParams = Static<typeof updateStudentPathParamsSchema>;

const updateStudentRequestBodySchema = Type.Object({
  firstName: Type.Optional(firstNameSchema),
  lastName: Type.Optional(lastNameSchema),
  birthDate: Type.Optional(Type.String({ format: 'date' })),
  phoneNumber: Type.Optional(studentPhoneNumberSchema),
  isDeleted: Type.Optional(Type.Boolean()),
});

export type UpdateStudentRequestBody = Static<typeof updateStudentRequestBodySchema>;

const updateStudentResponseBodySchema = studentSchema;

export type UpdateStudentResponseBody = Static<typeof updateStudentResponseBodySchema>;

export const updateStudentSchema = {
  request: {
    pathParams: updateStudentPathParamsSchema,
    body: updateStudentRequestBodySchema,
  },
  response: {
    [httpStatusCodes.ok]: {
      schema: updateStudentResponseBodySchema,
      description: 'Student updated',
    },
  },
} satisfies HttpRouteSchema;
