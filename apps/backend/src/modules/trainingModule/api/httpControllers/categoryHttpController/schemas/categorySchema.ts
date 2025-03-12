import { type Static, Type } from '@sinclair/typebox';

export const categoryNameSchema = Type.String({
  minLength: 1,
  maxLength: 32,
});

export const categorySchema = Type.Object({
  id: Type.String({ format: 'uuid' }),
  name: categoryNameSchema,
});

export type CategoryDto = Static<typeof categorySchema>;
