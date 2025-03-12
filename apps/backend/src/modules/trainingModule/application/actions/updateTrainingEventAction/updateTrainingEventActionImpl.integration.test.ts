import { beforeEach, describe, expect, it, afterEach } from 'vitest';

import { Generator } from '../../../../../../tests/generator.ts';
import { testSymbols } from '../../../../../../tests/symbols.ts';
import { TestContainer } from '../../../../../../tests/testContainer.ts';
import { OperationNotValidError } from '../../../../../common/errors/operationNotValidError.ts';
import { databaseSymbols } from '../../../../databaseModule/symbols.ts';
import type { DatabaseClient } from '../../../../databaseModule/types/databaseClient.ts';
import type { CompanyTestUtils } from '../../../../userModule/tests/utils/companyTestUtils/companyTestUtils.ts';
import { symbols } from '../../../symbols.ts';
import type { CategoryTestUtils } from '../../../tests/utils/categoryTestUtils/categoryTestUtils.ts';
import { type TrainingEventTestUtils } from '../../../tests/utils/trainingEventTestUtils/trainingEventTestUtils.ts';
import type { TrainingTestUtils } from '../../../tests/utils/trainingTestUtils/trainingTestUtils.ts';

import { type UpdateTrainingEventAction } from './updateTrainingEventAction.ts';

describe('UpdateTrainingEventActionImpl', () => {
  let action: UpdateTrainingEventAction;

  let databaseClient: DatabaseClient;

  let categoryTestUtils: CategoryTestUtils;
  let companyTestUtils: CompanyTestUtils;
  let trainingTestUtils: TrainingTestUtils;
  let trainingEventTestUtils: TrainingEventTestUtils;

  beforeEach(async () => {
    const container = await TestContainer.create();

    action = container.get<UpdateTrainingEventAction>(symbols.updateTrainingEventAction);

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

  it('updates TrainingEvent data', async () => {
    const category = await categoryTestUtils.createAndPersist();
    const company = await companyTestUtils.createAndPersist();
    const training = await trainingTestUtils.createAndPersist({
      input: { category_id: category.id, company_id: company.id },
    });
    const trainingEvent = await trainingEventTestUtils.createAndPersist({
      input: { training_id: training.id },
    });

    const updatedLatitude = Generator.latitude();
    const updatedLongitude = Generator.longitude();
    const updatedCentPrice = Generator.centPrice();
    const updatedCity = Generator.city();
    const updatedPlace = Generator.place();
    const updatedStartsAt = Generator.futureDate();
    const updatedEndsAt = Generator.soonDate(updatedStartsAt);
    const updatedIsHidden = Generator.boolean();

    const { trainingEvent: updatedTrainingEvent } = await action.execute({
      id: trainingEvent.id,
      latitude: updatedLatitude,
      longitude: updatedLongitude,
      centPrice: updatedCentPrice,
      city: updatedCity,
      place: updatedPlace,
      startsAt: updatedStartsAt,
      endsAt: updatedEndsAt,
      isHidden: updatedIsHidden,
    });

    const foundTrainingEvent = await trainingEventTestUtils.findById({ id: trainingEvent.id });

    expect(updatedTrainingEvent.getState()).toEqual({
      city: updatedCity,
      place: updatedPlace,
      latitude: updatedLatitude,
      longitude: updatedLongitude,
      startsAt: updatedStartsAt,
      endsAt: updatedEndsAt,
      trainingId: trainingEvent.training_id,
      centPrice: updatedCentPrice,
      isHidden: updatedIsHidden,
      createdAt: trainingEvent.created_at,
      training: {
        name: training.name,
        description: training.description,
        categoryName: category.name,
        companyName: company.name,
        companyLogoUrl: company.logo_url,
      },
    });

    expect(foundTrainingEvent).toEqual({
      id: trainingEvent.id,
      city: updatedCity,
      place: updatedPlace,
      latitude: updatedLatitude,
      longitude: updatedLongitude,
      starts_at: updatedStartsAt,
      ends_at: updatedEndsAt,
      training_id: trainingEvent.training_id,
      cent_price: updatedCentPrice,
      is_hidden: updatedIsHidden,
      created_at: trainingEvent.created_at,
    });
  });

  it('throws an error - when a TrainingEvent with given id not found', async () => {
    const notExistingTrainingEventId = Generator.uuid();

    const centPrice = Generator.centPrice();

    try {
      await action.execute({
        id: notExistingTrainingEventId,
        centPrice,
      });
    } catch (error) {
      expect(error).toBeInstanceOf(OperationNotValidError);

      expect((error as OperationNotValidError).context).toMatchObject({
        reason: 'TrainingEvent not found.',
        id: notExistingTrainingEventId,
      });

      return;
    }

    expect.fail();
  });
});
