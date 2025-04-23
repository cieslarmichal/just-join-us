import { type Static, Type } from '@sinclair/typebox';

export const skillNameSchema = Type.String({
  minLength: 1,
  maxLength: 32,
});

export const skillSchema = Type.Object({
  id: Type.String({ format: 'uuid' }),
  name: skillNameSchema,
  slug: skillNameSchema,
});

export type SkillDto = Static<typeof skillSchema>;
