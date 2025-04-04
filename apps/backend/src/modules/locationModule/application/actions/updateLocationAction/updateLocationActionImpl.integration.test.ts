import { beforeEach, describe, expect, it, afterEach } from 'vitest';

import { Generator } from '../../../../../../tests/generator.ts';
import { testSymbols } from '../../../../../../tests/symbols.ts';
import { TestContainer } from '../../../../../../tests/testContainer.ts';
import { OperationNotValidError } from '../../../../../common/errors/operationNotValidError.ts';
import { databaseSymbols } from '../../../../databaseModule/symbols.ts';
import type { DatabaseClient } from '../../../../databaseModule/types/databaseClient.ts';
import type { CompanyTestUtils } from '../../../../userModule/tests/utils/companyTestUtils/companyTestUtils.ts';
import { Location } from '../../../domain/entities/location/location.ts';
import { symbols } from '../../../symbols.ts';
import type { CityTestUtils } from '../../../tests/utils/cityTestUtils/cityTestUtils.ts';
import type { LocationTestUtils } from '../../../tests/utils/locationTestUtils/locationTestUtils.ts';

import { type UpdateLocationAction } from './updateLocationAction.ts';

describe('UpdateLocationActionImpl', () => {
  let action: UpdateLocationAction;

  let databaseClient: DatabaseClient;

  let companyTestUtils: CompanyTestUtils;
  let cityTestUtils: CityTestUtils;
  let locationTestUtils: LocationTestUtils;

  beforeEach(async () => {
    const container = await TestContainer.create();

    action = container.get<UpdateLocationAction>(symbols.updateLocationAction);

    databaseClient = container.get<DatabaseClient>(databaseSymbols.databaseClient);

    locationTestUtils = container.get<LocationTestUtils>(testSymbols.locationTestUtils);
    companyTestUtils = container.get<CompanyTestUtils>(testSymbols.companyTestUtils);
    cityTestUtils = container.get<CityTestUtils>(testSymbols.cityTestUtils);

    await cityTestUtils.truncate();
    await companyTestUtils.truncate();
    await locationTestUtils.truncate();
  });

  afterEach(async () => {
    await cityTestUtils.truncate();
    await companyTestUtils.truncate();
    await locationTestUtils.truncate();

    await databaseClient.destroy();
  });

  it('updates Location data', async () => {
    const city = await cityTestUtils.createAndPersist();
    const company = await companyTestUtils.createAndPersist();
    const locationRawEntity = await locationTestUtils.createAndPersist({
      input: { city_id: city.id, company_id: company.id, is_remote: false },
    });

    const location = new Location({
      id: locationRawEntity.id,
      name: locationRawEntity.name,
      cityId: locationRawEntity.city_id,
      companyId: locationRawEntity.company_id,
      isRemote: locationRawEntity.is_remote,
      address: locationRawEntity.address,
      latitude: locationRawEntity.latitude,
      longitude: locationRawEntity.longitude,
    });

    const updatedCity = await cityTestUtils.createAndPersist();
    const updatedName = Generator.string(10);
    const updatedAddress = Generator.address();
    const updatedLatitude = Generator.latitude();
    const updatedLongitude = Generator.longitude();

    const { location: updatedLocation } = await action.execute({
      id: location.getId(),
      name: updatedName,
      address: updatedAddress,
      latitude: updatedLatitude,
      longitude: updatedLongitude,
      cityId: updatedCity.id,
    });

    const foundLocation = await locationTestUtils.findById({ id: location.getId() });

    expect(updatedLocation.getState()).toEqual({
      name: updatedName,
      address: updatedAddress,
      cityId: updatedCity.id,
      companyId: location.getCompanyId(),
      isRemote: false,
      latitude: updatedLatitude,
      longitude: updatedLongitude,
    });

    expect(foundLocation).toEqual({
      id: locationRawEntity.id,
      name: updatedName,
      address: updatedAddress,
      city_id: updatedCity.id,
      company_id: locationRawEntity.company_id,
      is_remote: false,
      latitude: updatedLatitude,
      longitude: updatedLongitude,
    });
  });

  it('throws an error - when a Location with given id not found', async () => {
    const locationId = Generator.uuid();

    const name = Generator.string(10);

    try {
      await action.execute({
        id: locationId,
        name,
      });
    } catch (error) {
      expect(error).toBeInstanceOf(OperationNotValidError);

      expect((error as OperationNotValidError).context).toMatchObject({
        reason: 'Location not found.',
        id: locationId,
      });

      return;
    }

    expect.fail();
  });

  it('throws an error - when a City with given id not found', async () => {
    const city = await cityTestUtils.createAndPersist();
    const company = await companyTestUtils.createAndPersist();
    const locationRawEntity = await locationTestUtils.createAndPersist({
      input: { city_id: city.id, company_id: company.id },
    });

    const cityId = Generator.uuid();

    try {
      await action.execute({
        id: locationRawEntity.id,
        cityId,
      });
    } catch (error) {
      expect(error).toBeInstanceOf(OperationNotValidError);

      expect((error as OperationNotValidError).context).toMatchObject({
        reason: 'City not found.',
        id: cityId,
      });

      return;
    }

    expect.fail();
  });
});
