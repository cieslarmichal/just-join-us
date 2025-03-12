import { beforeEach, afterEach, expect, it, describe } from 'vitest';

import { Generator } from '../../../../../../tests/generator.ts';
import { testSymbols } from '../../../../../../tests/symbols.ts';
import { TestContainer } from '../../../../../../tests/testContainer.ts';
import { ResourceAlreadyExistsError } from '../../../../../common/errors/resourceAlreadyExistsError.ts';
import { databaseSymbols } from '../../../../databaseModule/symbols.ts';
import type { DatabaseClient } from '../../../../databaseModule/types/databaseClient.ts';
import type { CompanyTestUtils } from '../../../../userModule/tests/utils/companyTestUtils/companyTestUtils.ts';
import { symbols } from '../../../symbols.ts';
import { TrainingTestFactory } from '../../../tests/factories/trainingTestFactory/trainingTestFactory.ts';
import type { CategoryTestUtils } from '../../../tests/utils/categoryTestUtils/categoryTestUtils.ts';
import type { TrainingTestUtils } from '../../../tests/utils/trainingTestUtils/trainingTestUtils.ts';

import type { CreateTrainingAction } from './createTrainingAction.ts';

describe('CreateTrainingAction', () => {
  let action: CreateTrainingAction;

  let databaseClient: DatabaseClient;

  let companyTestUtils: CompanyTestUtils;
  let categoryTestUtils: CategoryTestUtils;
  let trainingTestUtils: TrainingTestUtils;

  const trainingTestFactory = new TrainingTestFactory();

  beforeEach(async () => {
    const container = await TestContainer.create();

    action = container.get<CreateTrainingAction>(symbols.createTrainingAction);

    databaseClient = container.get<DatabaseClient>(databaseSymbols.databaseClient);

    companyTestUtils = container.get<CompanyTestUtils>(testSymbols.companyTestUtils);
    categoryTestUtils = container.get<CategoryTestUtils>(testSymbols.categoryTestUtils);
    trainingTestUtils = container.get<TrainingTestUtils>(testSymbols.trainingTestUtils);

    await companyTestUtils.truncate();
    await categoryTestUtils.truncate();
    await trainingTestUtils.truncate();
  });

  afterEach(async () => {
    await companyTestUtils.truncate();
    await categoryTestUtils.truncate();
    await trainingTestUtils.truncate();

    await databaseClient.destroy();
  });

  it('creates a Training', async () => {
    const category = await categoryTestUtils.createAndPersist();
    const company = await companyTestUtils.createAndPersist();
    const trainingName = Generator.trainingName();
    const trainingDescription = Generator.trainingDescription();

    const { training: createdTraining } = await action.execute({
      name: trainingName,
      description: trainingDescription,
      categoryId: category.id,
      companyId: company.id,
    });

    const foundTraining = await trainingTestUtils.findByName({ name: trainingName, companyId: company.id });

    expect(createdTraining.getState()).toEqual({
      name: trainingName,
      description: trainingDescription,
      isHidden: false,
      categoryId: category.id,
      companyId: company.id,
      createdAt: expect.any(Date),
    });

    expect(foundTraining).toEqual({
      id: createdTraining.getId(),
      name: trainingName,
      description: trainingDescription,
      is_hidden: false,
      category_id: category.id,
      company_id: company.id,
      created_at: expect.any(Date),
    });
  });

  it('throws an error when a Training with the same name and company already exists', async () => {
    const category = await categoryTestUtils.createAndPersist();
    const company = await companyTestUtils.createAndPersist();
    const existingTraining = await trainingTestUtils.createAndPersist({
      input: { category_id: category.id, company_id: company.id },
    });

    const training = trainingTestFactory.create();

    try {
      await action.execute({
        name: existingTraining.name,
        description: training.getDescription(),
        categoryId: category.id,
        companyId: existingTraining.company_id,
      });
    } catch (error) {
      expect(error).toBeInstanceOf(ResourceAlreadyExistsError);

      expect((error as ResourceAlreadyExistsError).context).toEqual({
        resource: 'Training',
        id: existingTraining.id,
        name: existingTraining.name,
        companyId: existingTraining.company_id,
      });

      return;
    }

    expect.fail();
  });
});
