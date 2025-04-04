import { beforeEach, afterEach, expect, describe, it } from 'vitest';

import { Generator } from '../../../../../../tests/generator.ts';
import { testSymbols } from '../../../../../../tests/symbols.ts';
import { TestContainer } from '../../../../../../tests/testContainer.ts';
import { RepositoryError } from '../../../../../common/errors/repositoryError.ts';
import { databaseSymbols } from '../../../../databaseModule/symbols.ts';
import type { DatabaseClient } from '../../../../databaseModule/types/databaseClient.ts';
import type { CompanyTestUtils } from '../../../../userModule/tests/utils/companyTestUtils/companyTestUtils.ts';
import { type LocationRepository } from '../../../domain/repositories/locationRepository/locationRepository.ts';
import { symbols } from '../../../symbols.ts';
import { LocationTestFactory } from '../../../tests/factories/locationTestFactory/locationTestFactory.ts';
import type { CityTestUtils } from '../../../tests/utils/cityTestUtils/cityTestUtils.ts';
import type { LocationTestUtils } from '../../../tests/utils/locationTestUtils/locationTestUtils.ts';

describe('LocationRepositoryImpl', () => {
  let locationRepository: LocationRepository;

  let databaseClient: DatabaseClient;

  let cityTestUtils: CityTestUtils;
  let companyTestUtils: CompanyTestUtils;
  let locationTestUtils: LocationTestUtils;

  const locationTestFactory = new LocationTestFactory();

  beforeEach(async () => {
    const container = await TestContainer.create();

    locationRepository = container.get<LocationRepository>(symbols.locationRepository);

    databaseClient = container.get<DatabaseClient>(databaseSymbols.databaseClient);

    cityTestUtils = container.get<CityTestUtils>(testSymbols.cityTestUtils);
    companyTestUtils = container.get<CompanyTestUtils>(testSymbols.companyTestUtils);
    locationTestUtils = container.get<LocationTestUtils>(testSymbols.locationTestUtils);

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

  describe('Create', () => {
    it('creates a Location', async () => {
      const city = await cityTestUtils.createAndPersist();

      const company = await companyTestUtils.createAndPersist();

      const createdLocation = locationTestFactory.create({ cityId: city.id, companyId: company.id });

      const { name, isRemote, companyId, address, cityId, latitude, longitude } = createdLocation.getState();

      const location = await locationRepository.createLocation({
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

      const foundLocation = await locationTestUtils.findByName({ name, companyId });

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

      const existingLocation = await locationTestUtils.createAndPersist({
        input: { company_id: company.id, is_remote: true },
      });

      try {
        await locationRepository.createLocation({
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

      const locationRawEntity = await locationTestUtils.createAndPersist({
        input: { city_id: city.id, company_id: company.id },
      });

      const location = locationTestFactory.create({
        id: locationRawEntity.id,
        companyId: locationRawEntity.company_id,
        name: locationRawEntity.name,
        cityId: locationRawEntity.city_id,
        address: locationRawEntity.address,
        isRemote: locationRawEntity.is_remote,
        latitude: locationRawEntity.latitude,
        longitude: locationRawEntity.longitude,
      });

      const updatedName = Generator.string(10);
      const updatedLatitude = Generator.latitude();
      const updatedLongitude = Generator.longitude();
      const updatedAddress = Generator.address();

      location.setName({ name: updatedName });
      location.setAddress({ address: updatedAddress });
      location.setLatitude({ latitude: updatedLatitude });
      location.setLongitude({ longitude: updatedLongitude });

      const updatedLocation = await locationRepository.updateLocation({ location });

      const foundLocation = await locationTestUtils.findById({ id: location.getId() });

      expect(updatedLocation.getState()).toEqual({
        name: updatedName,
        address: updatedAddress,
        cityId: locationRawEntity.city_id,
        companyId: locationRawEntity.company_id,
        isRemote: locationRawEntity.is_remote,
        latitude: updatedLatitude,
        longitude: updatedLongitude,
      });

      expect(foundLocation).toEqual({
        id: locationRawEntity.id,
        name: updatedName,
        address: updatedAddress,
        city_id: locationRawEntity.city_id,
        company_id: locationRawEntity.company_id,
        is_remote: locationRawEntity.is_remote,
        latitude: updatedLatitude,
        longitude: updatedLongitude,
      });
    });
  });

  describe('Find', () => {
    it('finds a Location by id', async () => {
      const city = await cityTestUtils.createAndPersist();

      const company = await companyTestUtils.createAndPersist();

      const location = await locationTestUtils.createAndPersist({
        input: { city_id: city.id, company_id: company.id },
      });

      const foundLocation = await locationRepository.findLocation({ id: location.id });

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

      const location = await locationRepository.findLocation({ id });

      expect(location).toBeNull();
    });

    it('finds Locations by company', async () => {
      const city = await cityTestUtils.createAndPersist();

      const company1 = await companyTestUtils.createAndPersist();

      const company2 = await companyTestUtils.createAndPersist();

      const location1 = await locationTestUtils.createAndPersist({
        input: { city_id: city.id, company_id: company1.id },
      });

      const location2 = await locationTestUtils.createAndPersist({
        input: { city_id: city.id, company_id: company1.id },
      });

      const location3 = await locationTestUtils.createAndPersist({
        input: { is_remote: true, company_id: company1.id },
      });

      await locationTestUtils.createAndPersist({
        input: { city_id: city.id, company_id: company2.id },
      });

      const locations = await locationRepository.findLocations({
        companyId: company1.id,
      });

      expect(locations).toHaveLength(2);

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
