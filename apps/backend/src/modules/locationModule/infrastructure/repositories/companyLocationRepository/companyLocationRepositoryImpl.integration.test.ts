import { beforeEach, afterEach, expect, describe, it } from 'vitest';

import { Generator } from '../../../../../../tests/generator.ts';
import { testSymbols } from '../../../../../../tests/symbols.ts';
import { TestContainer } from '../../../../../../tests/testContainer.ts';
import { RepositoryError } from '../../../../../common/errors/repositoryError.ts';
import { databaseSymbols } from '../../../../databaseModule/symbols.ts';
import type { DatabaseClient } from '../../../../databaseModule/types/databaseClient.ts';
import type { CompanyTestUtils } from '../../../../userModule/tests/utils/companyTestUtils/companyTestUtils.ts';
import { type CompanyLocationRepository } from '../../../domain/repositories/companyLocationRepository/companyLocationRepository.ts';
import { symbols } from '../../../symbols.ts';
import { CompanyLocationTestFactory } from '../../../tests/factories/companyLocationTestFactory/companyLocationTestFactory.ts';
import type { CityTestUtils } from '../../../tests/utils/cityTestUtils/cityTestUtils.ts';
import type { CompanyLocationTestUtils } from '../../../tests/utils/companyLocationTestUtils/companyLocationTestUtils.ts';

describe('CompanyLocationRepositoryImpl', () => {
  let repository: CompanyLocationRepository;

  let databaseClient: DatabaseClient;

  let cityTestUtils: CityTestUtils;
  let companyTestUtils: CompanyTestUtils;
  let companyLocationTestUtils: CompanyLocationTestUtils;

  const companyLocationTestFactory = new CompanyLocationTestFactory();

  beforeEach(async () => {
    const container = await TestContainer.create();

    repository = container.get<CompanyLocationRepository>(symbols.companyLocationRepository);

    databaseClient = container.get<DatabaseClient>(databaseSymbols.databaseClient);

    cityTestUtils = container.get<CityTestUtils>(testSymbols.cityTestUtils);
    companyTestUtils = container.get<CompanyTestUtils>(testSymbols.companyTestUtils);
    companyLocationTestUtils = container.get<CompanyLocationTestUtils>(testSymbols.companyLocationTestUtils);

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

  describe('Create', () => {
    it('creates a Location', async () => {
      const city = await cityTestUtils.createAndPersist();

      const company = await companyTestUtils.createAndPersist();

      const createdLocation = companyLocationTestFactory.create({ cityId: city.id, companyId: company.id });

      const { name, isRemote, companyId, address, cityId, latitude, longitude } = createdLocation.getState();

      const location = await repository.createCompanyLocation({
        data: {
          name,
          isRemote,
          companyId,
          address: address as string,
          cityId: cityId as string,
          latitude: latitude as number,
          longitude: longitude as number,
        },
      });

      const foundLocation = await companyLocationTestUtils.findByName({ name, companyId });

      expect(foundLocation).toEqual({
        id: location.getId(),
        name,
        address,
        city_id: cityId,
        company_id: companyId,
        is_remote: isRemote,
        latitude,
        longitude,
      });

      expect(location.getState()).toEqual({
        name,
        address,
        cityId,
        companyId,
        isRemote,
        latitude,
        longitude,
      });
    });

    it('throws an error when a Location with the same name and company already exists', async () => {
      const company = await companyTestUtils.createAndPersist();

      const existingLocation = await companyLocationTestUtils.createAndPersist({
        input: { company_id: company.id },
      });

      try {
        await repository.createCompanyLocation({
          data: {
            name: existingLocation.name,
            isRemote: true,
            companyId: existingLocation.company_id,
          },
        });
      } catch (error) {
        expect(error).toBeInstanceOf(RepositoryError);

        return;
      }

      expect.fail();
    });

    it(`updates Location's data`, async () => {
      const city = await cityTestUtils.createAndPersist();

      const company = await companyTestUtils.createAndPersist();

      const companyLocationRawEntity = await companyLocationTestUtils.createAndPersist({
        input: { city_id: city.id, company_id: company.id },
      });

      const companyLocation = companyLocationTestFactory.create({
        id: companyLocationRawEntity.id,
        companyId: companyLocationRawEntity.company_id,
        name: companyLocationRawEntity.name,
        cityId: companyLocationRawEntity.city_id,
        address: companyLocationRawEntity.address,
        isRemote: companyLocationRawEntity.is_remote,
        latitude: companyLocationRawEntity.latitude,
        longitude: companyLocationRawEntity.longitude,
      });

      const updatedName = Generator.string(10);
      const updatedLatitude = Generator.latitude();
      const updatedLongitude = Generator.longitude();
      const updatedAddress = Generator.address();

      companyLocation.setName({ name: updatedName });
      companyLocation.setAddress({ address: updatedAddress });
      companyLocation.setLatitude({ latitude: updatedLatitude });
      companyLocation.setLongitude({ longitude: updatedLongitude });

      const updatedLocation = await repository.updateCompanyLocation({ companyLocation });

      const foundLocation = await companyLocationTestUtils.findById({ id: companyLocation.getId() });

      expect(updatedLocation.getState()).toEqual({
        name: updatedName,
        address: updatedAddress,
        cityId: companyLocationRawEntity.city_id,
        companyId: companyLocationRawEntity.company_id,
        isRemote: companyLocationRawEntity.is_remote,
        latitude: updatedLatitude,
        longitude: updatedLongitude,
      });

      expect(foundLocation).toEqual({
        id: companyLocationRawEntity.id,
        name: updatedName,
        address: updatedAddress,
        city_id: companyLocationRawEntity.city_id,
        company_id: companyLocationRawEntity.company_id,
        is_remote: companyLocationRawEntity.is_remote,
        latitude: updatedLatitude,
        longitude: updatedLongitude,
      });
    });
  });

  describe('Find', () => {
    it('finds a Location by id', async () => {
      const city = await cityTestUtils.createAndPersist();

      const company = await companyTestUtils.createAndPersist();

      const location = await companyLocationTestUtils.createAndPersist({
        input: { city_id: city.id, company_id: company.id },
      });

      const foundLocation = await repository.findCompanyLocation({ id: location.id });

      expect(foundLocation?.getState()).toEqual({
        name: location.name,
        companyId: location.company_id,
        isRemote: location.is_remote,
        address: location.address,
        cityId: location.city_id,
        latitude: location.latitude,
        longitude: location.longitude,
      });
    });

    it('returns null if a Location with given id does not exist', async () => {
      const id = Generator.uuid();

      const location = await repository.findCompanyLocation({ id });

      expect(location).toBeNull();
    });

    it('finds Locations by company', async () => {
      const city = await cityTestUtils.createAndPersist();

      const company1 = await companyTestUtils.createAndPersist();

      const company2 = await companyTestUtils.createAndPersist();

      const location1 = await companyLocationTestUtils.createAndPersist({
        input: { city_id: city.id, company_id: company1.id },
      });

      const location2 = await companyLocationTestUtils.createAndPersist({
        input: { city_id: city.id, company_id: company1.id },
      });

      const location3 = await companyLocationTestUtils.createAndPersist({
        input: { is_remote: true, company_id: company1.id },
      });

      await companyLocationTestUtils.createAndPersist({
        input: { city_id: city.id, company_id: company2.id },
      });

      const locations = await repository.findCompanyLocations({
        companyId: company1.id,
      });

      expect(locations).toHaveLength(3);

      expect(locations[0]?.getState()).toEqual({
        name: location3.name,
        isRemote: location3.is_remote,
        companyId: location3.company_id,
      });

      expect(locations[1]?.getState()).toEqual({
        name: location2.name,
        isRemote: location2.is_remote,
        companyId: location2.company_id,
        address: location2.address,
        cityId: location2.city_id,
        latitude: location2.latitude,
        longitude: location2.longitude,
      });

      expect(locations[2]?.getState()).toEqual({
        name: location1.name,
        isRemote: location1.is_remote,
        companyId: location1.company_id,
        address: location1.address,
        cityId: location1.city_id,
        latitude: location1.latitude,
        longitude: location1.longitude,
      });
    });
  });
});
