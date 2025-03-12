import { beforeEach, afterEach, expect, it, describe } from 'vitest';

import { testSymbols } from '../../../../../../tests/symbols.ts';
import { TestContainer } from '../../../../../../tests/testContainer.ts';
import { databaseSymbols } from '../../../../databaseModule/symbols.ts';
import type { DatabaseClient } from '../../../../databaseModule/types/databaseClient.ts';
import type { CompanyTestUtils } from '../../../../userModule/tests/utils/companyTestUtils/companyTestUtils.ts';
import { symbols } from '../../../symbols.ts';
import { TrainingEventTestFactory } from '../../../tests/factories/trainingEventTestFactory/trainingEventTestFactory.ts';
import type { CategoryTestUtils } from '../../../tests/utils/categoryTestUtils/categoryTestUtils.ts';
import { type TrainingEventTestUtils } from '../../../tests/utils/trainingEventTestUtils/trainingEventTestUtils.ts';
import type { TrainingTestUtils } from '../../../tests/utils/trainingTestUtils/trainingTestUtils.ts';

import { type CreateTrainingEventAction } from './createTrainingEventAction.ts';

describe('CreateTrainingEventAction', () => {
  let action: CreateTrainingEventAction;

  let databaseClient: DatabaseClient;

  let categoryTestUtils: CategoryTestUtils;
  let companyTestUtils: CompanyTestUtils;
  let trainingTestUtils: TrainingTestUtils;
  let trainingEventTestUtils: TrainingEventTestUtils;

  const trainingEventTestFactory = new TrainingEventTestFactory();

  beforeEach(async () => {
    const container = await TestContainer.create();

    action = container.get<CreateTrainingEventAction>(symbols.createTrainingEventAction);

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

  it('creates a TrainingEvent', async () => {
    const category = await categoryTestUtils.createAndPersist();
    const company = await companyTestUtils.createAndPersist();
    const training = await trainingTestUtils.createAndPersist({
      input: { category_id: category.id, company_id: company.id },
    });
    const trainingEventInput = trainingEventTestFactory.create({ trainingId: training.id });

    const { trainingEvent: createdTrainingEvent } = await action.execute({
      city: trainingEventInput.getCity(),
      place: trainingEventInput.getPlace(),
      latitude: trainingEventInput.getLatitude(),
      longitude: trainingEventInput.getLongitude(),
      trainingId: trainingEventInput.getTrainingId(),
      centPrice: trainingEventInput.getCentPrice(),
      startsAt: trainingEventInput.getStartsAt(),
      endsAt: trainingEventInput.getEndsAt(),
    });

    const foundTrainingEvent = await trainingEventTestUtils.findByTrainingId({ trainingId: training.id });

    expect(createdTrainingEvent.getState()).toEqual({
      city: trainingEventInput.getCity(),
      place: trainingEventInput.getPlace(),
      latitude: trainingEventInput.getLatitude(),
      longitude: trainingEventInput.getLongitude(),
      startsAt: trainingEventInput.getStartsAt(),
      endsAt: trainingEventInput.getEndsAt(),
      trainingId: trainingEventInput.getTrainingId(),
      centPrice: trainingEventInput.getCentPrice(),
      isHidden: false,
      createdAt: expect.any(Date),
      training: {
        name: training.name,
        description: training.description,
        categoryName: category.name,
        companyName: company.name,
        companyLogoUrl: company.logo_url,
      },
    });

    expect(foundTrainingEvent).toEqual({
      id: createdTrainingEvent.getId(),
      city: trainingEventInput.getCity(),
      place: trainingEventInput.getPlace(),
      latitude: trainingEventInput.getLatitude(),
      longitude: trainingEventInput.getLongitude(),
      starts_at: trainingEventInput.getStartsAt(),
      ends_at: trainingEventInput.getEndsAt(),
      training_id: trainingEventInput.getTrainingId(),
      cent_price: trainingEventInput.getCentPrice(),
      is_hidden: false,
      created_at: expect.any(Date),
    });
  });
});
