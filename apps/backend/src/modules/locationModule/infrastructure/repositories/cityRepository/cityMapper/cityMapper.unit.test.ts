import { beforeEach, expect, describe, it } from 'vitest';

import { CityTestFactory } from '../../../../tests/factories/cityTestFactory/cityTestFactory.ts';

import { CityMapper } from './cityMapper.ts';

describe('CityMapper', () => {
  let mapper: CityMapper;

  const cityTestFactory = new CityTestFactory();

  beforeEach(async () => {
    mapper = new CityMapper();
  });

  it('maps from CityRawEntity to City', async () => {
    const cityEntity = cityTestFactory.createRaw();

    const city = mapper.mapToDomain(cityEntity);

    expect(city.getId()).toBe(cityEntity.id);

    expect(city.getState()).toEqual({
      name: cityEntity.name,
      province: cityEntity.province,
      latitude: cityEntity.latitude,
      longitude: cityEntity.longitude,
    });
  });
});
