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
import type { TrainingEventTestUtils } from '../../../tests/utils/trainingEventTestUtils/trainingEventTestUtils.ts';
import { type TrainingTestUtils } from '../../../tests/utils/trainingTestUtils/trainingTestUtils.ts';

import { type FindTrainingEventAction } from './findTrainingEventAction.ts';

describe('FindTrainingEventAction', () => {
  let action: FindTrainingEventAction;

  let databaseClient: DatabaseClient;

  let categoryTestUtils: CategoryTestUtils;
  let companyTestUtils: CompanyTestUtils;
  let trainingTestUtils: TrainingTestUtils;
  let trainingEventTestUtils: TrainingEventTestUtils;

  beforeEach(async () => {
    const container = await TestContainer.create();

    action = container.get<FindTrainingEventAction>(symbols.findTrainingEventAction);

    databaseClient = container.get<DatabaseClient>(databaseSymbols.databaseClient);

    categoryTestUtils = container.get<CategoryTestUtils>(testSymbols.categoryTestUtils);
    companyTestUtils = container.get<CompanyTestUtils>(testSymbols.companyTestUtils);
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

  it('throws an error if a training event with given id does not exist', async () => {
    const nonExistingTrainingEventId = Generator.uuid();

    try {
      await action.execute({ id: nonExistingTrainingEventId });
    } catch (error) {
      expect(error).toBeInstanceOf(ResourceNotFoundError);

      return;
    }

    expect.fail();
  });

  it('finds TrainingEvent', async () => {
    const category = await categoryTestUtils.createAndPersist();
    const company = await companyTestUtils.createAndPersist();
    const training = await trainingTestUtils.createAndPersist({
      input: { category_id: category.id, company_id: company.id },
    });
    const trainingEvent = await trainingEventTestUtils.createAndPersist({
      input: { training_id: training.id },
    });

    const { trainingEvent: foundTrainingEvent } = await action.execute({ id: trainingEvent.id });

    expect(foundTrainingEvent.getState()).toEqual({
      city: trainingEvent.city,
      place: trainingEvent.place,
      latitude: trainingEvent.latitude,
      longitude: trainingEvent.longitude,
      startsAt: trainingEvent.starts_at,
      endsAt: trainingEvent.ends_at,
      trainingId: trainingEvent.training_id,
      centPrice: trainingEvent.cent_price,
      isHidden: trainingEvent.is_hidden,
      createdAt: trainingEvent.created_at,
      training: {
        name: training.name,
        description: training.description,
        categoryName: category.name,
        companyName: company.name,
        companyLogoUrl: company.logo_url,
      },
    });
  });
});
