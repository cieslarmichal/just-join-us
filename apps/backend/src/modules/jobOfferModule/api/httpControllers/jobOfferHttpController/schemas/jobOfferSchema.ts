import { type Static, Type } from '@sinclair/typebox';

import {
  companyNameSchema,
  logoUrlSchema,
} from '../../../../../userModule/api/httpControllers/userHttpController/schemas/companySchema.ts';
import { categoryNameSchema } from '../../categoryHttpController/schemas/categorySchema.ts';

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
});

export type JobOfferDto = Static<typeof jobOfferSchema>;
