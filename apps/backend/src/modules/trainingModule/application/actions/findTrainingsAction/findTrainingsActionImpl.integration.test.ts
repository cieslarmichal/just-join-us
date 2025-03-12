import { beforeEach, afterEach, expect, it, describe } from 'vitest';

import { testSymbols } from '../../../../../../tests/symbols.ts';
import { TestContainer } from '../../../../../../tests/testContainer.ts';
import { databaseSymbols } from '../../../../databaseModule/symbols.ts';
import type { DatabaseClient } from '../../../../databaseModule/types/databaseClient.ts';
import type { CompanyTestUtils } from '../../../../userModule/tests/utils/companyTestUtils/companyTestUtils.ts';
import { symbols } from '../../../symbols.ts';
import type { CategoryTestUtils } from '../../../tests/utils/categoryTestUtils/categoryTestUtils.ts';
import type { TrainingTestUtils } from '../../../tests/utils/trainingTestUtils/trainingTestUtils.ts';

import { type FindTrainingsAction } from './findTrainingsAction.ts';

describe('FindTrainingsAction', () => {
  let action: FindTrainingsAction;

  let databaseClient: DatabaseClient;

  let companyTestUtils: CompanyTestUtils;
  let categoryTestUtils: CategoryTestUtils;
  let trainingTestUtils: TrainingTestUtils;

  beforeEach(async () => {
    const container = await TestContainer.create();

    action = container.get<FindTrainingsAction>(symbols.findTrainingsAction);

    databaseClient = container.get<DatabaseClient>(databaseSymbols.databaseClient);

    trainingTestUtils = container.get<TrainingTestUtils>(testSymbols.trainingTestUtils);
    companyTestUtils = container.get<CompanyTestUtils>(testSymbols.companyTestUtils);
    categoryTestUtils = container.get<CategoryTestUtils>(testSymbols.categoryTestUtils);

    await categoryTestUtils.truncate();
    await companyTestUtils.truncate();
    await trainingTestUtils.truncate();
  });

  afterEach(async () => {
    await categoryTestUtils.truncate();
    await companyTestUtils.truncate();
    await trainingTestUtils.truncate();

    await databaseClient.destroy();
  });

  it('finds all company trainings', async () => {
    const category = await categoryTestUtils.createAndPersist();
    const company1 = await companyTestUtils.createAndPersist();
    const company2 = await companyTestUtils.createAndPersist();
    const training1 = await trainingTestUtils.createAndPersist({
      input: { category_id: category.id, company_id: company1.id },
    });
    const training2 = await trainingTestUtils.createAndPersist({
      input: { category_id: category.id, company_id: company1.id },
    });
    await trainingTestUtils.createAndPersist({
      input: { category_id: category.id, company_id: company2.id },
    });

    const { data: trainings, total } = await action.execute({ companyId: company1.id, page: 1, pageSize: 10 });

    expect(trainings).toHaveLength(2);
    expect(trainings[0]?.getId()).toBe(training2.id);
    expect(trainings[1]?.getId()).toBe(training1.id);
    expect(total).toBe(2);
  });

  it('finds company trainings by name', async () => {
    const category = await categoryTestUtils.createAndPersist();
    const company1 = await companyTestUtils.createAndPersist();
    const company2 = await companyTestUtils.createAndPersist();
    await trainingTestUtils.createAndPersist({
      input: { category_id: category.id, company_id: company1.id, name: 'Strzelanie z pistoletu' },
    });
    const training = await trainingTestUtils.createAndPersist({
      input: { category_id: category.id, company_id: company1.id, name: 'Pierwsza pomoc' },
    });
    await trainingTestUtils.createAndPersist({
      input: { category_id: category.id, company_id: company2.id, name: 'Pierwsza pomoc' },
    });

    const { data: trainings, total } = await action.execute({
      companyId: company1.id,
      name: 'pierwsza',
      page: 1,
      pageSize: 10,
    });

    expect(trainings).toHaveLength(1);
    expect(trainings[0]?.getId()).toBe(training.id);
    expect(total).toBe(1);
  });
});
