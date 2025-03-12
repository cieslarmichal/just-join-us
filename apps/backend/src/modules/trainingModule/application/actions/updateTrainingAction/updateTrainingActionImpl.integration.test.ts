import { beforeEach, describe, expect, it, afterEach } from 'vitest';

import { Generator } from '../../../../../../tests/generator.ts';
import { testSymbols } from '../../../../../../tests/symbols.ts';
import { TestContainer } from '../../../../../../tests/testContainer.ts';
import { OperationNotValidError } from '../../../../../common/errors/operationNotValidError.ts';
import { databaseSymbols } from '../../../../databaseModule/symbols.ts';
import type { DatabaseClient } from '../../../../databaseModule/types/databaseClient.ts';
import type { CompanyTestUtils } from '../../../../userModule/tests/utils/companyTestUtils/companyTestUtils.ts';
import { Training } from '../../../domain/entities/training/training.ts';
import { symbols } from '../../../symbols.ts';
import type { CategoryTestUtils } from '../../../tests/utils/categoryTestUtils/categoryTestUtils.ts';
import type { TrainingTestUtils } from '../../../tests/utils/trainingTestUtils/trainingTestUtils.ts';

import { type UpdateTrainingAction } from './updateTrainingAction.ts';

describe('UpdateTrainingActionImpl', () => {
  let action: UpdateTrainingAction;

  let databaseClient: DatabaseClient;

  let companyTestUtils: CompanyTestUtils;
  let categoryTestUtils: CategoryTestUtils;
  let trainingTestUtils: TrainingTestUtils;

  beforeEach(async () => {
    const container = await TestContainer.create();

    action = container.get<UpdateTrainingAction>(symbols.updateTrainingAction);

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

  it('updates Training data', async () => {
    const category = await categoryTestUtils.createAndPersist();
    const company = await companyTestUtils.createAndPersist();
    const trainingRawEntity = await trainingTestUtils.createAndPersist({
      input: { category_id: category.id, company_id: company.id },
    });

    const training = new Training({
      id: trainingRawEntity.id,
      name: trainingRawEntity.name,
      description: trainingRawEntity.description,
      categoryId: trainingRawEntity.category_id,
      companyId: trainingRawEntity.company_id,
      isHidden: trainingRawEntity.is_hidden,
      createdAt: trainingRawEntity.created_at,
    });

    const updatedIsHidden = Generator.boolean();
    const updatedName = Generator.trainingName();
    const updatedDescription = Generator.trainingDescription();
    const updatedCategory = await categoryTestUtils.createAndPersist();

    const { training: updatedTraining } = await action.execute({
      id: training.getId(),
      name: updatedName,
      description: updatedDescription,
      isHidden: updatedIsHidden,
      categoryId: updatedCategory.id,
    });

    const foundTraining = await trainingTestUtils.findById({ id: training.getId() });

    expect(updatedTraining.getState()).toEqual({
      name: updatedName,
      description: updatedDescription,
      isHidden: updatedIsHidden,
      categoryId: updatedCategory.id,
      companyId: trainingRawEntity.company_id,
      createdAt: trainingRawEntity.created_at,
      category: { name: updatedCategory.name },
      company: { name: company.name, logoUrl: company.logo_url },
    });

    expect(foundTraining).toEqual({
      id: trainingRawEntity.id,
      name: updatedName,
      description: updatedDescription,
      is_hidden: updatedIsHidden,
      category_id: updatedCategory.id,
      company_id: trainingRawEntity.company_id,
      created_at: trainingRawEntity.created_at,
    });
  });

  it('throws an error - when a Training with given id not found', async () => {
    const trainingId = Generator.uuid();

    const name = Generator.trainingName();

    try {
      await action.execute({
        id: trainingId,
        name,
      });
    } catch (error) {
      expect(error).toBeInstanceOf(OperationNotValidError);

      expect((error as OperationNotValidError).context).toMatchObject({
        reason: 'Training not found.',
        id: trainingId,
      });

      return;
    }

    expect.fail();
  });

  it('throws an error - when a Category with given id not found', async () => {
    const category = await categoryTestUtils.createAndPersist();
    const company = await companyTestUtils.createAndPersist();
    const trainingRawEntity = await trainingTestUtils.createAndPersist({
      input: { category_id: category.id, company_id: company.id },
    });

    const categoryId = Generator.uuid();

    try {
      await action.execute({
        id: trainingRawEntity.id,
        categoryId,
      });
    } catch (error) {
      expect(error).toBeInstanceOf(OperationNotValidError);

      expect((error as OperationNotValidError).context).toMatchObject({
        reason: 'Category not found.',
        id: categoryId,
      });

      return;
    }

    expect.fail();
  });
});
