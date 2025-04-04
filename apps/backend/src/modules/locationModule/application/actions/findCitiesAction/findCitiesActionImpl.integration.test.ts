import { beforeEach, afterEach, expect, it, describe } from 'vitest';

import { testSymbols } from '../../../../../../tests/symbols.ts';
import { TestContainer } from '../../../../../../tests/testContainer.ts';
import { databaseSymbols } from '../../../../databaseModule/symbols.ts';
import type { DatabaseClient } from '../../../../databaseModule/types/databaseClient.ts';
import { symbols } from '../../../symbols.ts';
import type { CityTestUtils } from '../../../tests/utils/cityTestUtils/cityTestUtils.ts';

import { type FindCitiesAction } from './findCitiesAction.ts';

describe('FindCitiesAction', () => {
  let action: FindCitiesAction;

  let databaseClient: DatabaseClient;

  let cityTestUtils: CityTestUtils;

  beforeEach(async () => {
    const container = await TestContainer.create();

    action = container.get<FindCitiesAction>(symbols.findCitiesAction);

    databaseClient = container.get<DatabaseClient>(databaseSymbols.databaseClient);

    cityTestUtils = container.get<CityTestUtils>(testSymbols.cityTestUtils);

    await cityTestUtils.truncate();
  });

  afterEach(async () => {
    await cityTestUtils.truncate();

    await databaseClient.destroy();
  });

  it('finds all cities', async () => {
    const city1 = await cityTestUtils.createAndPersist({ input: { name: 'Cieszyn' } });
    const city2 = await cityTestUtils.createAndPersist({ input: { name: 'Warszawa' } });
    const city3 = await cityTestUtils.createAndPersist({ input: { name: 'Gdańsk' } });

    const { data: cities, total } = await action.execute({ page: 1, pageSize: 10 });

    expect(cities).toHaveLength(3);
    expect(cities[0]?.getId()).toBe(city1.id);
    expect(cities[1]?.getId()).toBe(city3.id);
    expect(cities[2]?.getId()).toBe(city2.id);
    expect(total).toBe(3);
  });

  it('finds cities by name', async () => {
    const city1 = await cityTestUtils.createAndPersist({ input: { name: 'Warszawa' } });
    await cityTestUtils.createAndPersist({ input: { name: 'Gdańsk' } });
    await cityTestUtils.createAndPersist({ input: { name: 'Cieszyn' } });

    const { data: cities, total } = await action.execute({ name: 'war', page: 1, pageSize: 10 });

    expect(cities).toHaveLength(1);
    expect(cities[0]?.getId()).toBe(city1.id);
    expect(total).toBe(1);
  });
});
