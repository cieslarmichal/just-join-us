import { beforeEach, afterEach, expect, it, describe } from 'vitest';

import { testSymbols } from '../../../../../../tests/symbols.ts';
import { TestContainer } from '../../../../../../tests/testContainer.ts';
import { databaseSymbols } from '../../../../databaseModule/symbols.ts';
import type { DatabaseClient } from '../../../../databaseModule/types/databaseClient.ts';
import { symbols } from '../../../symbols.ts';
import type { CategoryTestUtils } from '../../../tests/utils/categoryTestUtils/categoryTestUtils.ts';

import { type FindCategoriesAction } from './findCategoriesAction.ts';

describe('FindCategoriesAction', () => {
  let action: FindCategoriesAction;

  let databaseClient: DatabaseClient;

  let categoryTestUtils: CategoryTestUtils;

  beforeEach(async () => {
    const container = await TestContainer.create();

    action = container.get<FindCategoriesAction>(symbols.findCategoriesAction);

    databaseClient = container.get<DatabaseClient>(databaseSymbols.databaseClient);

    categoryTestUtils = container.get<CategoryTestUtils>(testSymbols.categoryTestUtils);

    await categoryTestUtils.truncate();
  });

  afterEach(async () => {
    await categoryTestUtils.truncate();

    await databaseClient.destroy();
  });

  it('finds all categories', async () => {
    const category1 = await categoryTestUtils.createAndPersist({ input: { name: 'C++' } });
    const category2 = await categoryTestUtils.createAndPersist({ input: { name: 'Go' } });
    const category3 = await categoryTestUtils.createAndPersist({ input: { name: 'Java' } });

    const { data: categories, total } = await action.execute({ page: 1, pageSize: 10 });

    expect(categories).toHaveLength(3);
    expect(categories[0]?.getId()).toBe(category1.id);
    expect(categories[1]?.getId()).toBe(category2.id);
    expect(categories[2]?.getId()).toBe(category3.id);
    expect(total).toBe(3);
  });

  it('finds categories by name', async () => {
    const category1 = await categoryTestUtils.createAndPersist({ input: { name: 'Net' } });
    await categoryTestUtils.createAndPersist({ input: { name: 'AI/ML' } });
    await categoryTestUtils.createAndPersist({ input: { name: 'Data' } });

    const { data: categories, total } = await action.execute({ name: 'net', page: 1, pageSize: 10 });

    expect(categories).toHaveLength(1);
    expect(categories[0]?.getId()).toBe(category1.id);
    expect(total).toBe(1);
  });
});
