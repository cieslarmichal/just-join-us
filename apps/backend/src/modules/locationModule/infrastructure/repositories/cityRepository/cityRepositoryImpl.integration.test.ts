import { beforeEach, afterEach, expect, describe, it } from 'vitest';

import { Generator } from '../../../../../../tests/generator.ts';
import { testSymbols } from '../../../../../../tests/symbols.ts';
import { TestContainer } from '../../../../../../tests/testContainer.ts';
import { databaseSymbols } from '../../../../databaseModule/symbols.ts';
import type { DatabaseClient } from '../../../../databaseModule/types/databaseClient.ts';
import { type CityRepository } from '../../../domain/repositories/cityRepository/cityRepository.ts';
import { symbols } from '../../../symbols.ts';
import { type CityTestUtils } from '../../../tests/utils/cityTestUtils/cityTestUtils.ts';

describe('CityRepositoryImpl', () => {
  let cityRepository: CityRepository;

  let databaseClient: DatabaseClient;

  let cityTestUtils: CityTestUtils;

  beforeEach(async () => {
    const container = await TestContainer.create();

    cityRepository = container.get<CityRepository>(symbols.cityRepository);

    databaseClient = container.get<DatabaseClient>(databaseSymbols.databaseClient);

    cityTestUtils = container.get<CityTestUtils>(testSymbols.cityTestUtils);

    await cityTestUtils.truncate();
  });

  afterEach(async () => {
    await cityTestUtils.truncate();

    await databaseClient.destroy();
  });

  describe('Find', () => {
    it('finds a City by id', async () => {
      const city = await cityTestUtils.createAndPersist();

      const foundCity = await cityRepository.findCity({ id: city.id });

      expect(foundCity).not.toBeNull();
    });

    it('finds a City by slug', async () => {
      const city = await cityTestUtils.createAndPersist();

      const foundCity = await cityRepository.findCity({ slug: city.slug });

      expect(foundCity).not.toBeNull();
    });

    it('returns null if a City with given id does not exist', async () => {
      const id = Generator.uuid();

      const foundCity = await cityRepository.findCity({ id });

      expect(foundCity).toBeNull();
    });

    it('finds Cities by name', async () => {
      const city = await cityTestUtils.createAndPersist({ input: { name: 'Cieszyn' } });
      await cityTestUtils.createAndPersist({ input: { name: 'Kraków' } });

      const foundCities = await cityRepository.findCities({ name: 'cie', page: 1, pageSize: 10 });

      expect(foundCities).toHaveLength(1);
      expect(foundCities[0]?.getId()).toEqual(city.id);
      expect(foundCities[0]?.getName()).toEqual(city.name);
    });
  });

  describe('Count', () => {
    it('counts all Cities', async () => {
      await cityTestUtils.createAndPersist();
      await cityTestUtils.createAndPersist();
      await cityTestUtils.createAndPersist();

      const count = await cityRepository.countCities({});

      expect(count).toEqual(3);
    });

    it('counts Cities by name', async () => {
      await cityTestUtils.createAndPersist({ input: { name: 'Cieszyn' } });
      await cityTestUtils.createAndPersist({ input: { name: 'Kraków' } });

      const count = await cityRepository.countCities({ name: 'krak' });

      expect(count).toEqual(1);
    });
  });
});
