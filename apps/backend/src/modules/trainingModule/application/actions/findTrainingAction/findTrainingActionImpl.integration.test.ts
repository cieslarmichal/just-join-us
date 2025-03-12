import { beforeEach, afterEach, expect, it, describe } from 'vitest';

import { Generator } from '../../../../../../tests/generator.ts';
import { testSymbols } from '../../../../../../tests/symbols.ts';
import { TestContainer } from '../../../../../../tests/testContainer.ts';
import { ResourceNotFoundError } from '../../../../../common/errors/resourceNotFoundError.ts';
import { databaseSymbols } from '../../../../databaseModule/symbols.ts';
import type { DatabaseClient } from '../../../../databaseModule/types/databaseClient.ts';
import type { CompanyTestUtils } from '../../../../userModule/tests/utils/companyTestUtils/companyTestUtils.ts';
import { symbols } from '../../../symbols.ts';
import type { CategoryTestUtils } from '../../../tests/utils/categoryTestUtils/categoryTestUtils.ts';
import { type TrainingTestUtils } from '../../../tests/utils/trainingTestUtils/trainingTestUtils.ts';

import { type FindTrainingAction } from './findTrainingAction.ts';

describe('FindTrainingAction', () => {
  let action: FindTrainingAction;

  let databaseClient: DatabaseClient;

  let companyTestUtils: CompanyTestUtils;
  let categoryTestUtils: CategoryTestUtils;
  let trainingTestUtils: TrainingTestUtils;

  beforeEach(async () => {
    const container = await TestContainer.create();

    action = container.get<FindTrainingAction>(symbols.findTrainingAction);

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

  it('throws an error if a training with given id does not exist', async () => {
    const nonExistingTraningId = Generator.uuid();

    try {
      await action.execute({ id: nonExistingTraningId });
    } catch (error) {
      expect(error).toBeInstanceOf(ResourceNotFoundError);

      return;
    }

    expect.fail();
  });

  it('finds training', async () => {
    const category = await categoryTestUtils.createAndPersist();
    const company = await companyTestUtils.createAndPersist();
    const training = await trainingTestUtils.createAndPersist({
      input: { category_id: category.id, company_id: company.id },
    });

    const { training: foundTraining } = await action.execute({ id: training.id });

    expect(foundTraining.getState()).toEqual({
      name: training.name,
      description: training.description,
      isHidden: training.is_hidden,
      categoryId: training.category_id,
      category: { name: category.name },
      companyId: training.company_id,
      company: { name: company.name, logoUrl: company.logo_url },
      createdAt: training.created_at,
    });
  });
});
