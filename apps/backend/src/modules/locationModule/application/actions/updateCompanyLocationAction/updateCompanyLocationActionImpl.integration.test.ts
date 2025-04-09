import { beforeEach, describe, expect, it, afterEach } from 'vitest';

import { Generator } from '../../../../../../tests/generator.ts';
import { testSymbols } from '../../../../../../tests/symbols.ts';
import { TestContainer } from '../../../../../../tests/testContainer.ts';
import { OperationNotValidError } from '../../../../../common/errors/operationNotValidError.ts';
import { databaseSymbols } from '../../../../databaseModule/symbols.ts';
import type { DatabaseClient } from '../../../../databaseModule/types/databaseClient.ts';
import type { CompanyTestUtils } from '../../../../userModule/tests/utils/companyTestUtils/companyTestUtils.ts';
import { CompanyLocation } from '../../../domain/entities/companyLocation/companyLocation.ts';
import { symbols } from '../../../symbols.ts';
import type { CityTestUtils } from '../../../tests/utils/cityTestUtils/cityTestUtils.ts';
import type { CompanyLocationTestUtils } from '../../../tests/utils/companyLocationTestUtils/companyLocationTestUtils.ts';

import { type UpdateCompanyLocationAction } from './updateCompanyLocationAction.ts';

describe('UpdateCompanyLocationActionImpl', () => {
  let action: UpdateCompanyLocationAction;

  let databaseClient: DatabaseClient;

  let companyTestUtils: CompanyTestUtils;
  let cityTestUtils: CityTestUtils;
  let companyLocationTestUtils: CompanyLocationTestUtils;

  beforeEach(async () => {
    const container = await TestContainer.create();

    action = container.get<UpdateCompanyLocationAction>(symbols.updateCompanyLocationAction);

    databaseClient = container.get<DatabaseClient>(databaseSymbols.databaseClient);

    companyLocationTestUtils = container.get<CompanyLocationTestUtils>(testSymbols.companyLocationTestUtils);
    companyTestUtils = container.get<CompanyTestUtils>(testSymbols.companyTestUtils);
    cityTestUtils = container.get<CityTestUtils>(testSymbols.cityTestUtils);

    await cityTestUtils.truncate();
    await companyTestUtils.truncate();
    await companyLocationTestUtils.truncate();
  });

  afterEach(async () => {
    await cityTestUtils.truncate();
    await companyTestUtils.truncate();
    await companyLocationTestUtils.truncate();

    await databaseClient.destroy();
  });

  it('updates company location', async () => {
    const city = await cityTestUtils.createAndPersist();
    const company = await companyTestUtils.createAndPersist();
    const locationRawEntity = await companyLocationTestUtils.createAndPersist({
      input: { city_id: city.id, company_id: company.id, is_remote: false },
    });

    const location = new CompanyLocation({
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

    const { companyLocation: updatedLocation } = await action.execute({
      id: location.getId(),
      name: updatedName,
      address: updatedAddress,
      latitude: updatedLatitude,
      longitude: updatedLongitude,
      cityId: updatedCity.id,
    });

    const foundLocation = await companyLocationTestUtils.findById({ id: location.getId() });

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

  it('throws an error - when a company location with given id not found', async () => {
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
        reason: 'CompanyLocation not found.',
        id: locationId,
      });

      return;
    }

    expect.fail();
  });

  it('throws an error - when a city with given id not found', async () => {
    const city = await cityTestUtils.createAndPersist();
    const company = await companyTestUtils.createAndPersist();
    const locationRawEntity = await companyLocationTestUtils.createAndPersist({
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
