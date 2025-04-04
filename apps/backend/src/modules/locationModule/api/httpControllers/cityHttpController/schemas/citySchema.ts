import { type Static, Type } from '@sinclair/typebox';

export const cityNameSchema = Type.String({
  minLength: 1,
  maxLength: 64,
});

export const citySchema = Type.Object({
  id: Type.String({ format: 'uuid' }),
  name: cityNameSchema,
  province: Type.String(),
  latitude: Type.Number(),
  longitude: Type.Number(),
});

export type CityDto = Static<typeof citySchema>;
