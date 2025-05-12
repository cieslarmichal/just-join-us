import { beforeEach, expect, describe, it } from 'vitest';

import { CompanyLocationTestFactory } from '../../../../tests/factories/companyLocationTestFactory/companyLocationTestFactory.ts';

import { CompanyLocationMapper } from './companyLocationMapper.ts';

describe('CompanyLocationMapper', () => {
  let mapper: CompanyLocationMapper;

  const companyLocationTestFactory = new CompanyLocationTestFactory();

  beforeEach(async () => {
    mapper = new CompanyLocationMapper();
  });

  it('maps from CompanyLocationRawEntity to CompanyLocation', async () => {
    const companyLocationEntity = companyLocationTestFactory.createRaw();

    const companyLocation = mapper.mapToDomain(companyLocationEntity);

    expect(companyLocation.getId()).toEqual(companyLocationEntity.id);

    expect(companyLocation.getState()).toEqual({
      name: companyLocationEntity.name,
      companyId: companyLocationEntity.company_id,
      address: companyLocationEntity.address,
      cityId: companyLocationEntity.city_id,
      latitude: companyLocationEntity.latitude,
      longitude: companyLocationEntity.longitude,
    });
  });
});
