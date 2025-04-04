import { beforeEach, expect, describe, it } from 'vitest';

import { LocationTestFactory } from '../../../../tests/factories/locationTestFactory/locationTestFactory.ts';

import { LocationMapper } from './locationMapper.ts';

describe('LocationMapper', () => {
  let mapper: LocationMapper;

  const locationTestFactory = new LocationTestFactory();

  beforeEach(async () => {
    mapper = new LocationMapper();
  });

  it('maps from LocationRawEntity to Location', async () => {
    const locationEntity = locationTestFactory.createRaw();

    const location = mapper.mapToDomain(locationEntity);

    expect(location.getId()).toEqual(locationEntity.id);

    expect(location.getState()).toEqual({
      name: locationEntity.name,
      companyId: locationEntity.company_id,
      isRemote: locationEntity.is_remote,
      address: locationEntity.address,
      cityId: locationEntity.city_id,
      latitude: locationEntity.latitude,
      longitude: locationEntity.longitude,
    });
  });
});
