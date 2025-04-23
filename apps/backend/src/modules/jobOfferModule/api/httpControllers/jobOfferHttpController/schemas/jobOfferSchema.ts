import { type Static, Type } from '@sinclair/typebox';

import {
  companyNameSchema,
  logoUrlSchema,
} from '../../../../../userModule/api/httpControllers/userHttpController/schemas/companySchema.ts';
import { categoryNameSchema } from '../../categoryHttpController/schemas/categorySchema.ts';
import { skillNameSchema } from '../../skillHttpController/schemas/skillSchema.ts';

export const jobOfferNameSchema = Type.String({
  minLength: 3,
  maxLength: 64,
});

export const jobOfferDescriptionSchema = Type.String({
  minLength: 3,
  maxLength: 2000,
});

export const jobOfferSchema = Type.Object({
  id: Type.String({ format: 'uuid' }),
  name: jobOfferNameSchema,
  description: jobOfferDescriptionSchema,
  isHidden: Type.Boolean(),
  categoryId: Type.String({ format: 'uuid' }),
  category: Type.Optional(
    Type.Object({
      name: categoryNameSchema,
    }),
  ),
  companyId: Type.String({ format: 'uuid' }),
  company: Type.Optional(
    Type.Object({
      name: companyNameSchema,
      logoUrl: logoUrlSchema,
    }),
  ),
  createdAt: Type.String({ format: 'date-time' }),
  employmentType: Type.String({ minLength: 1 }),
  workingTime: Type.String({ minLength: 1 }),
  experienceLevel: Type.String({ minLength: 1 }),
  minSalary: Type.Number({ minimum: 1 }),
  maxSalary: Type.Number({ minimum: 1 }),
  skills: Type.Optional(
    Type.Array(
      Type.Object({
        name: skillNameSchema,
      }),
    ),
  ),
  locations: Type.Optional(
    Type.Array(
      Type.Object({
        id: Type.String({ format: 'uuid' }),
        isRemote: Type.Boolean(),
        city: Type.Optional(Type.String()),
      }),
    ),
  ),
});

export type JobOfferDto = Static<typeof jobOfferSchema>;
