import { beforeEach, expect, describe, it } from 'vitest';

import { CompanyTestFactory } from '../../../../tests/factories/companyTestFactory/companyTestFactory.ts';
import { UserTestFactory } from '../../../../tests/factories/userTestFactory/userTestFactory.ts';

import { CompanyMapper } from './companyMapper.ts';

describe('CompanyMapper', () => {
  let mapper: CompanyMapper;

  const userTestFactory = new UserTestFactory();

  const companyTestFactory = new CompanyTestFactory();

  beforeEach(async () => {
    mapper = new CompanyMapper();
  });

  it('maps from CompanyUserRawEntity to Company', async () => {
    const userRawEntity = userTestFactory.createRaw();

    const companyRawEntity = companyTestFactory.createRaw();

    const company = mapper.mapToDomain({
      ...userRawEntity,
      ...companyRawEntity,
    });

    expect(company.getId()).toEqual(companyRawEntity.id);

    expect(company.getState()).toEqual({
      email: userRawEntity.email,
      password: userRawEntity.password,
      isEmailVerified: userRawEntity.is_email_verified,
      isDeleted: userRawEntity.is_deleted,
      role: userRawEntity.role,
      createdAt: userRawEntity.created_at,
      name: companyRawEntity.name,
      taxIdNumber: companyRawEntity.tax_id_number,
      isVerified: companyRawEntity.is_verified,
      phoneNumber: companyRawEntity.phone_number,
      logoUrl: companyRawEntity.logo_url,
    });
  });
});
