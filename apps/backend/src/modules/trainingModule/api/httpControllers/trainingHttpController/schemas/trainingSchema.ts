import { type Static, Type } from '@sinclair/typebox';

import {
  companyNameSchema,
  logoUrlSchema,
} from '../../../../../userModule/api/httpControllers/userHttpController/schemas/companySchema.ts';
import { categoryNameSchema } from '../../categoryHttpController/schemas/categorySchema.ts';

export const trainingNameSchema = Type.String({
  minLength: 3,
  maxLength: 64,
});

export const trainingDescriptionSchema = Type.String({
  minLength: 3,
  maxLength: 2000,
});

export const trainingSchema = Type.Object({
  id: Type.String({ format: 'uuid' }),
  name: trainingNameSchema,
  description: trainingDescriptionSchema,
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
});

export type TrainingDto = Static<typeof trainingSchema>;
