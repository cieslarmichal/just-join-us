import { type Static, Type } from '@sinclair/typebox';

export const companyLocationNameSchema = Type.String({
  minLength: 1,
  maxLength: 64,
});

export const companyLocationAddressSchema = Type.String({
  minLength: 1,
  maxLength: 64,
});

export const companyLocationSchema = Type.Object({
  id: Type.String({ format: 'uuid' }),
  name: companyLocationNameSchema,
  companyId: Type.String({ format: 'uuid' }),
  isRemote: Type.Boolean(),
  address: Type.Optional(companyLocationAddressSchema),
  cityId: Type.Optional(Type.String({ format: 'uuid' })),
  cityName: Type.Optional(Type.String()),
  latitude: Type.Optional(Type.Number()),
  longitude: Type.Optional(Type.Number()),
});

export type CompanyLocationDto = Static<typeof companyLocationSchema>;
