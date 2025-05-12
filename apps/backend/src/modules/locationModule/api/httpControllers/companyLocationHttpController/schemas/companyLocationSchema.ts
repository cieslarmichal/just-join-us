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
  address: companyLocationAddressSchema,
  cityId: Type.String({ format: 'uuid' }),
  cityName: Type.Optional(Type.String()),
  latitude: Type.Number(),
  longitude: Type.Number(),
});

export type CompanyLocationDto = Static<typeof companyLocationSchema>;
