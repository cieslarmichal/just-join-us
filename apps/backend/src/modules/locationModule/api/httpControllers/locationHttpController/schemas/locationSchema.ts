import { type Static, Type } from '@sinclair/typebox';

export const locationNameSchema = Type.String({
  minLength: 1,
  maxLength: 64,
});

export const locationAddressSchema = Type.String({
  minLength: 1,
  maxLength: 64,
});

export const locationSchema = Type.Object({
  id: Type.String({ format: 'uuid' }),
  name: locationNameSchema,
  companyId: Type.String({ format: 'uuid' }),
  isRemote: Type.Boolean(),
  address: Type.Optional(locationAddressSchema),
  cityId: Type.Optional(Type.String({ format: 'uuid' })),
  latitude: Type.Optional(Type.Number()),
  longitude: Type.Optional(Type.Number()),
});

export type LocationDto = Static<typeof locationSchema>;
