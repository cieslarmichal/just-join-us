import { beforeEach, afterEach, expect, it, describe } from 'vitest';

import { testSymbols } from '../../../../../../tests/symbols.ts';
import { TestContainer } from '../../../../../../tests/testContainer.ts';
import { databaseSymbols } from '../../../../databaseModule/symbols.ts';
import type { DatabaseClient } from '../../../../databaseModule/types/databaseClient.ts';
import type { CompanyTestUtils } from '../../../../userModule/tests/utils/companyTestUtils/companyTestUtils.ts';
import { symbols } from '../../../symbols.ts';
import type { CategoryTestUtils } from '../../../tests/utils/categoryTestUtils/categoryTestUtils.ts';
import type { TrainingEventTestUtils } from '../../../tests/utils/trainingEventTestUtils/trainingEventTestUtils.ts';
import type { TrainingTestUtils } from '../../../tests/utils/trainingTestUtils/trainingTestUtils.ts';

import type { FindTrainingEventsAction } from './findTrainingEventsAction.ts';

describe('FindTrainingEventsAction', () => {
  let action: FindTrainingEventsAction;

  let databaseClient: DatabaseClient;

  let companyTestUtils: CompanyTestUtils;
  let categoryTestUtils: CategoryTestUtils;
  let trainingTestUtils: TrainingTestUtils;
  let trainingEventTestUtils: TrainingEventTestUtils;

  beforeEach(async () => {
    const container = await TestContainer.create();

    action = container.get<FindTrainingEventsAction>(symbols.findTrainingEventsAction);

    databaseClient = container.get<DatabaseClient>(databaseSymbols.databaseClient);

    companyTestUtils = container.get<CompanyTestUtils>(testSymbols.companyTestUtils);
    categoryTestUtils = container.get<CategoryTestUtils>(testSymbols.categoryTestUtils);
    trainingTestUtils = container.get<TrainingTestUtils>(testSymbols.trainingTestUtils);
    trainingEventTestUtils = container.get<TrainingEventTestUtils>(testSymbols.trainingEventTestUtils);

    await categoryTestUtils.truncate();
    await companyTestUtils.truncate();
    await trainingTestUtils.truncate();
    await trainingEventTestUtils.truncate();
  });

  afterEach(async () => {
    await categoryTestUtils.truncate();
    await companyTestUtils.truncate();
    await trainingTestUtils.truncate();
    await trainingEventTestUtils.truncate();

    await databaseClient.destroy();
  });

  it('finds trainings events by category', async () => {
    const category1 = await categoryTestUtils.createAndPersist();
    const category2 = await categoryTestUtils.createAndPersist();
    const company = await companyTestUtils.createAndPersist();
    const training1 = await trainingTestUtils.createAndPersist({
      input: { category_id: category1.id, company_id: company.id },
    });
    const training2 = await trainingTestUtils.createAndPersist({
      input: { category_id: category2.id, company_id: company.id },
    });
    const trainingEvent = await trainingEventTestUtils.createAndPersist({ input: { training_id: training1.id } });
    await trainingEventTestUtils.createAndPersist({ input: { training_id: training2.id } });

    const { data: trainingEvents, total } = await action.execute({ categoryId: category1.id, page: 1, pageSize: 10 });

    expect(trainingEvents).toHaveLength(1);
    expect(trainingEvents[0]?.getId()).toBe(trainingEvent.id);
    expect(total).toBe(1);
  });

  it('finds trainings events by company', async () => {
    const category = await categoryTestUtils.createAndPersist();
    const company1 = await companyTestUtils.createAndPersist();
    const company2 = await companyTestUtils.createAndPersist();
    const training1 = await trainingTestUtils.createAndPersist({
      input: { category_id: category.id, company_id: company1.id },
    });
    const training2 = await trainingTestUtils.createAndPersist({
      input: { category_id: category.id, company_id: company2.id },
    });
    const trainingEvent = await trainingEventTestUtils.createAndPersist({ input: { training_id: training1.id } });
    await trainingEventTestUtils.createAndPersist({ input: { training_id: training2.id } });

    const { data: trainingEvents, total } = await action.execute({ companyId: company1.id, page: 1, pageSize: 10 });

    expect(trainingEvents).toHaveLength(1);
    expect(trainingEvents[0]?.getId()).toBe(trainingEvent.id);
    expect(total).toBe(1);
  });

  it('finds all training events', async () => {
    const category = await categoryTestUtils.createAndPersist();
    const company = await companyTestUtils.createAndPersist();
    const training1 = await trainingTestUtils.createAndPersist({
      input: { category_id: category.id, company_id: company.id },
    });
    const training2 = await trainingTestUtils.createAndPersist({
      input: { category_id: category.id, company_id: company.id },
    });
    await trainingEventTestUtils.createAndPersist({ input: { training_id: training1.id } });
    await trainingEventTestUtils.createAndPersist({ input: { training_id: training2.id } });

    const { data: trainingEvents, total } = await action.execute({ page: 1, pageSize: 10 });

    expect(trainingEvents).toHaveLength(2);
    expect(total).toBe(2);
  });
});
