import { type Static, Type } from '@sinclair/typebox';

import {
  companyNameSchema,
  logoUrlSchema,
} from '../../../../../userModule/api/httpControllers/userHttpController/schemas/companySchema.ts';
import { categoryNameSchema } from '../../categoryHttpController/schemas/categorySchema.ts';

import { trainingDescriptionSchema, trainingNameSchema } from './trainingSchema.ts';

export const citySchema = Type.String({
  minLength: 1,
  maxLength: 20,
});

export const placeSchema = Type.String({
  minLength: 1,
  maxLength: 64,
});

export const latitudeSchema = Type.Number({
  minimum: -90,
  maximum: 90,
});

export const longitudeSchema = Type.Number({
  minimum: -180,
  maximum: 180,
});

export const centPriceSchema = Type.Number({
  minimum: 1,
  maximum: 1000000,
});

export const trainingEventSchema = Type.Object({
  id: Type.String({ format: 'uuid' }),
  city: citySchema,
  place: Type.Optional(placeSchema),
  latitude: latitudeSchema,
  longitude: longitudeSchema,
  centPrice: centPriceSchema,
  startsAt: Type.String({ format: 'date-time' }),
  endsAt: Type.String({ format: 'date-time' }),
  isHidden: Type.Boolean(),
  trainingId: Type.String({ format: 'uuid' }),
  training: Type.Optional(
    Type.Object({
      name: trainingNameSchema,
      description: trainingDescriptionSchema,
      categoryName: categoryNameSchema,
      companyName: companyNameSchema,
      companyLogoUrl: logoUrlSchema,
    }),
  ),
  createdAt: Type.String({ format: 'date-time' }),
});

export type TrainingEventDto = Static<typeof trainingEventSchema>;
