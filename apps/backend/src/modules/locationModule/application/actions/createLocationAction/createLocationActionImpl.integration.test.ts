import { beforeEach, afterEach, expect, it, describe } from 'vitest';

import { Generator } from '../../../../../../tests/generator.ts';
import { testSymbols } from '../../../../../../tests/symbols.ts';
import { TestContainer } from '../../../../../../tests/testContainer.ts';
import { ResourceAlreadyExistsError } from '../../../../../common/errors/resourceAlreadyExistsError.ts';
import { databaseSymbols } from '../../../../databaseModule/symbols.ts';
import type { DatabaseClient } from '../../../../databaseModule/types/databaseClient.ts';
import type { CompanyTestUtils } from '../../../../userModule/tests/utils/companyTestUtils/companyTestUtils.ts';
import { symbols } from '../../../symbols.ts';
import type { CityTestUtils } from '../../../tests/utils/cityTestUtils/cityTestUtils.ts';
import type { LocationTestUtils } from '../../../tests/utils/locationTestUtils/locationTestUtils.ts';

import type { CreateLocationAction } from './createLocationAction.ts';

describe('CreateLocationAction', () => {
  let action: CreateLocationAction;

  let databaseClient: DatabaseClient;

  let companyTestUtils: CompanyTestUtils;
  let cityTestUtils: CityTestUtils;
  let locationTestUtils: LocationTestUtils;

  beforeEach(async () => {
    const container = await TestContainer.create();

    action = container.get<CreateLocationAction>(symbols.createLocationAction);

    databaseClient = container.get<DatabaseClient>(databaseSymbols.databaseClient);

    companyTestUtils = container.get<CompanyTestUtils>(testSymbols.companyTestUtils);
    cityTestUtils = container.get<CityTestUtils>(testSymbols.cityTestUtils);
    locationTestUtils = container.get<LocationTestUtils>(testSymbols.locationTestUtils);

    await companyTestUtils.truncate();
    await cityTestUtils.truncate();
    await locationTestUtils.truncate();
  });

  afterEach(async () => {
    await companyTestUtils.truncate();
    await cityTestUtils.truncate();
    await locationTestUtils.truncate();

    await databaseClient.destroy();
  });

  it('creates a Location', async () => {
    const city = await cityTestUtils.createAndPersist();
    const company = await companyTestUtils.createAndPersist();
    const address = Generator.address();
    const latitude = Generator.latitude();
    const longitude = Generator.longitude();
    const locationName = Generator.string(10);

    const { location: createdLocation } = await action.execute({
      name: locationName,
      companyId: company.id,
      address,
      cityId: city.id,
      latitude,
      longitude,
    });

    const foundLocation = await locationTestUtils.findByName({ name: locationName, companyId: company.id });

    expect(createdLocation.getState()).toEqual({
      name: locationName,
      companyId: company.id,
      isRemote: false,
      address,
      cityId: city.id,
      latitude,
      longitude,
    });

    expect(foundLocation).toEqual({
      id: createdLocation.getId(),
      name: locationName,
      company_id: company.id,
      is_remote: false,
      address,
      city_id: city.id,
      latitude,
      longitude,
    });
  });

  it('throws an error when a Location with the same name and company already exists', async () => {
    const city = await cityTestUtils.createAndPersist();
    const company = await companyTestUtils.createAndPersist();

    const existingLocation = await locationTestUtils.createAndPersist({
      input: { company_id: company.id, city_id: city.id },
    });

    try {
      await action.execute({
        cityId: city.id,
        name: existingLocation.name,
        companyId: existingLocation.company_id,
        address: existingLocation.address as string,
        latitude: existingLocation.latitude as number,
        longitude: existingLocation.longitude as number,
      });
    } catch (error) {
      expect(error).toBeInstanceOf(ResourceAlreadyExistsError);

      expect((error as ResourceAlreadyExistsError).context).toEqual({
        resource: 'Location',
        id: existingLocation.id,
        name: existingLocation.name,
        companyId: existingLocation.company_id,
      });

      return;
    }

    expect.fail();
  });
});
