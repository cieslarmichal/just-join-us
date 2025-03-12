import { beforeEach, afterEach, expect, describe, it } from 'vitest';

import { Generator } from '../../../../../../tests/generator.ts';
import { testSymbols } from '../../../../../../tests/symbols.ts';
import { TestContainer } from '../../../../../../tests/testContainer.ts';
import { databaseSymbols } from '../../../../databaseModule/symbols.ts';
import type { DatabaseClient } from '../../../../databaseModule/types/databaseClient.ts';
import type { CompanyTestUtils } from '../../../../userModule/tests/utils/companyTestUtils/companyTestUtils.ts';
import { type TrainingEventRepository } from '../../../domain/repositories/trainingEventRepository/trainingEventRepository.ts';
import { symbols } from '../../../symbols.ts';
import { TrainingEventTestFactory } from '../../../tests/factories/trainingEventTestFactory/trainingEventTestFactory.ts';
import type { CategoryTestUtils } from '../../../tests/utils/categoryTestUtils/categoryTestUtils.ts';
import { type TrainingEventTestUtils } from '../../../tests/utils/trainingEventTestUtils/trainingEventTestUtils.ts';
import type { TrainingTestUtils } from '../../../tests/utils/trainingTestUtils/trainingTestUtils.ts';

describe('TrainingEventRepositoryImpl', () => {
  let trainingEventRepository: TrainingEventRepository;

  let databaseClient: DatabaseClient;

  let categoryTestUtils: CategoryTestUtils;
  let companyTestUtils: CompanyTestUtils;
  let trainingTestUtils: TrainingTestUtils;
  let trainingEventTestUtils: TrainingEventTestUtils;

  const trainingEventTestFactory = new TrainingEventTestFactory();

  beforeEach(async () => {
    const container = await TestContainer.create();

    trainingEventRepository = container.get<TrainingEventRepository>(symbols.trainingEventRepository);

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

  describe('Create', () => {
    it('creates a TrainingEvent', async () => {
      const category = await categoryTestUtils.createAndPersist();
      const company = await companyTestUtils.createAndPersist();
      const training = await trainingTestUtils.createAndPersist({
        input: { category_id: category.id, company_id: company.id },
      });

      const createdTrainingEvent = trainingEventTestFactory.create({ trainingId: training.id });

      const trainingEvent = await trainingEventRepository.createTrainingEvent({
        data: {
          city: createdTrainingEvent.getCity(),
          place: createdTrainingEvent.getPlace(),
          latitude: createdTrainingEvent.getLatitude(),
          longitude: createdTrainingEvent.getLongitude(),
          startsAt: createdTrainingEvent.getStartsAt(),
          endsAt: createdTrainingEvent.getEndsAt(),
          trainingId: createdTrainingEvent.getTrainingId(),
          centPrice: createdTrainingEvent.getCentPrice(),
          isHidden: createdTrainingEvent.getIsHidden(),
        },
      });

      const foundTrainingEvent = await trainingEventTestUtils.findByTrainingId({ trainingId: training.id });

      expect(trainingEvent.getState()).toEqual({
        city: createdTrainingEvent.getCity(),
        place: createdTrainingEvent.getPlace(),
        latitude: createdTrainingEvent.getLatitude(),
        longitude: createdTrainingEvent.getLongitude(),
        startsAt: createdTrainingEvent.getStartsAt(),
        endsAt: createdTrainingEvent.getEndsAt(),
        trainingId: createdTrainingEvent.getTrainingId(),
        centPrice: createdTrainingEvent.getCentPrice(),
        isHidden: createdTrainingEvent.getIsHidden(),
        createdAt: trainingEvent.getCreatedAt(),
        training: {
          name: training.name,
          description: training.description,
          categoryName: category.name,
          companyName: company.name,
          companyLogoUrl: company.logo_url,
        },
      });

      expect(foundTrainingEvent).toBeDefined();
    });

    it("updates TrainingEvent's data", async () => {
      const category = await categoryTestUtils.createAndPersist();
      const company = await companyTestUtils.createAndPersist();
      const training = await trainingTestUtils.createAndPersist({
        input: { category_id: category.id, company_id: company.id },
      });
      const trainingEventRawEntity = await trainingEventTestUtils.createAndPersist({
        input: { training_id: training.id },
      });

      const trainingEvent = trainingEventTestFactory.create({
        id: trainingEventRawEntity.id,
        centPrice: trainingEventRawEntity.cent_price,
        city: trainingEventRawEntity.city,
        place: trainingEventRawEntity.place,
        latitude: trainingEventRawEntity.latitude,
        longitude: trainingEventRawEntity.longitude,
        startsAt: trainingEventRawEntity.starts_at,
        endsAt: trainingEventRawEntity.ends_at,
        trainingId: trainingEventRawEntity.training_id,
        isHidden: trainingEventRawEntity.is_hidden,
        createdAt: trainingEventRawEntity.created_at,
      });

      const updatedLatitude = Generator.latitude();
      const updatedLongitude = Generator.longitude();
      const updatedCentPrice = Generator.centPrice();
      const updatedCity = Generator.city();
      const updatedPlace = Generator.place();
      const updatedStartsAt = Generator.futureDate();
      const updatedEndsAt = Generator.soonDate(updatedStartsAt);
      const updatedIsHidden = Generator.boolean();

      trainingEvent.setLatitude({ latitude: updatedLatitude });
      trainingEvent.setLongitude({ longitude: updatedLongitude });
      trainingEvent.setCentPrice({ centPrice: updatedCentPrice });
      trainingEvent.setCity({ city: updatedCity });
      trainingEvent.setPlace({ place: updatedPlace });
      trainingEvent.setStartsAt({ startsAt: updatedStartsAt });
      trainingEvent.setEndsAt({ endsAt: updatedEndsAt });
      trainingEvent.setIsHidden({ isHidden: updatedIsHidden });

      const updatedTrainingEvent = await trainingEventRepository.updateTrainingEvent({ trainingEvent });

      const foundTrainingEvent = await trainingEventTestUtils.findById({ id: trainingEvent.getId() });

      expect(updatedTrainingEvent.getState()).toEqual({
        city: updatedCity,
        place: updatedPlace,
        latitude: updatedLatitude,
        longitude: updatedLongitude,
        startsAt: updatedStartsAt,
        endsAt: updatedEndsAt,
        trainingId: trainingEvent.getTrainingId(),
        centPrice: updatedCentPrice,
        isHidden: updatedIsHidden,
        createdAt: trainingEvent.getCreatedAt(),
        training: {
          name: training.name,
          description: training.description,
          categoryName: category.name,
          companyName: company.name,
          companyLogoUrl: company.logo_url,
        },
      });

      expect(foundTrainingEvent).toEqual({
        id: trainingEvent.getId(),
        city: updatedCity,
        place: updatedPlace,
        latitude: updatedLatitude,
        longitude: updatedLongitude,
        starts_at: updatedStartsAt,
        ends_at: updatedEndsAt,
        training_id: trainingEvent.getTrainingId(),
        cent_price: updatedCentPrice,
        is_hidden: updatedIsHidden,
        created_at: trainingEvent.getCreatedAt(),
      });
    });
  });

  describe('Find', () => {
    it('finds a TrainingEvent by id', async () => {
      const category = await categoryTestUtils.createAndPersist();
      const company = await companyTestUtils.createAndPersist();
      const training = await trainingTestUtils.createAndPersist({
        input: { category_id: category.id, company_id: company.id },
      });
      const trainingEvent = await trainingEventTestUtils.createAndPersist({
        input: { training_id: training.id },
      });

      const foundTrainingEvent = await trainingEventRepository.findTrainingEvent({ id: trainingEvent.id });

      expect(foundTrainingEvent?.getState()).toEqual({
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

    it('returns null if a TrainingEvent with given id does not exist', async () => {
      const id = Generator.uuid();

      const trainingEvent = await trainingEventRepository.findTrainingEvent({ id });

      expect(trainingEvent).toBeNull();
    });

    it('finds TrainingEvents by category', async () => {
      const category1 = await categoryTestUtils.createAndPersist();
      const category2 = await categoryTestUtils.createAndPersist();
      const company = await companyTestUtils.createAndPersist();
      const training1 = await trainingTestUtils.createAndPersist({
        input: { category_id: category1.id, company_id: company.id },
      });
      const training2 = await trainingTestUtils.createAndPersist({
        input: { category_id: category2.id, company_id: company.id },
      });

      const trainingEvent = await trainingEventTestUtils.createAndPersist({
        input: { training_id: training1.id },
      });
      await trainingEventTestUtils.createAndPersist({ input: { training_id: training2.id } });

      const trainingEvents = await trainingEventRepository.findTrainingEvents({
        categoryId: category1.id,
        page: 1,
        pageSize: 10,
      });

      expect(trainingEvents).toHaveLength(1);

      expect(trainingEvents[0]?.getId()).toEqual(trainingEvent.id);

      expect(trainingEvents[0]?.getState()).toEqual({
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
          name: training1.name,
          description: training1.description,
          categoryName: category1.name,
          companyName: company.name,
          companyLogoUrl: company.logo_url,
        },
      });
    });

    it('finds TrainingEvents by company', async () => {
      const category1 = await categoryTestUtils.createAndPersist();
      const category2 = await categoryTestUtils.createAndPersist();
      const company1 = await companyTestUtils.createAndPersist();
      const company2 = await companyTestUtils.createAndPersist();
      const training1 = await trainingTestUtils.createAndPersist({
        input: { category_id: category1.id, company_id: company1.id },
      });
      const training2 = await trainingTestUtils.createAndPersist({
        input: { category_id: category2.id, company_id: company2.id },
      });

      const trainingEvent = await trainingEventTestUtils.createAndPersist({
        input: { training_id: training1.id },
      });
      await trainingEventTestUtils.createAndPersist({ input: { training_id: training2.id } });

      const trainingEvents = await trainingEventRepository.findTrainingEvents({
        companyId: company1.id,
        page: 1,
        pageSize: 10,
      });

      expect(trainingEvents[0]?.getId()).toEqual(trainingEvent.id);
    });

    it('finds TrainingEvents by training name', async () => {
      const category = await categoryTestUtils.createAndPersist();
      const company = await companyTestUtils.createAndPersist();
      const training1 = await trainingTestUtils.createAndPersist({
        input: { category_id: category.id, company_id: company.id, name: 'Strzelanie' },
      });
      const training2 = await trainingTestUtils.createAndPersist({
        input: { category_id: category.id, company_id: company.id, name: 'Pierwsza pomoc' },
      });

      const trainingEvent = await trainingEventTestUtils.createAndPersist({
        input: { training_id: training1.id },
      });
      await trainingEventTestUtils.createAndPersist({ input: { training_id: training2.id } });

      const trainingEvents = await trainingEventRepository.findTrainingEvents({
        trainingName: 'strzel',
        page: 1,
        pageSize: 10,
      });

      expect(trainingEvents[0]?.getId()).toEqual(trainingEvent.id);
    });

    it('finds TrainingEvents by geolocation', async () => {
      const category = await categoryTestUtils.createAndPersist();
      const company = await companyTestUtils.createAndPersist();
      const training = await trainingTestUtils.createAndPersist({
        input: { category_id: category.id, company_id: company.id },
      });

      const latitude = Generator.latitude();
      const longitude = Generator.longitude();

      const trainingEvent = await trainingEventTestUtils.createAndPersist({
        input: { training_id: training.id, latitude, longitude },
      });

      const trainingEvents = await trainingEventRepository.findTrainingEvents({
        latitude,
        longitude,
        radius: 1000,
        page: 1,
        pageSize: 10,
      });

      expect(trainingEvents[0]?.getId()).toEqual(trainingEvent.id);
    });
  });

  describe('Count', () => {
    it('counts TrainingEvents without filtering', async () => {
      const category = await categoryTestUtils.createAndPersist();
      const company = await companyTestUtils.createAndPersist();
      const training = await trainingTestUtils.createAndPersist({
        input: { category_id: category.id, company_id: company.id },
      });
      await trainingEventTestUtils.createAndPersist({ input: { training_id: training.id } });
      await trainingEventTestUtils.createAndPersist({ input: { training_id: training.id } });

      const count = await trainingEventRepository.countTrainingEvents({});

      expect(count).toEqual(2);
    });

    it('counts TrainingEvents by category', async () => {
      const category1 = await categoryTestUtils.createAndPersist();
      const category2 = await categoryTestUtils.createAndPersist();
      const company = await companyTestUtils.createAndPersist();
      const training1 = await trainingTestUtils.createAndPersist({
        input: { category_id: category1.id, company_id: company.id },
      });
      const training2 = await trainingTestUtils.createAndPersist({
        input: { category_id: category2.id, company_id: company.id },
      });

      await trainingEventTestUtils.createAndPersist({ input: { training_id: training1.id } });
      await trainingEventTestUtils.createAndPersist({ input: { training_id: training1.id } });
      await trainingEventTestUtils.createAndPersist({ input: { training_id: training2.id } });

      const count = await trainingEventRepository.countTrainingEvents({ categoryId: category1.id });

      expect(count).toEqual(2);
    });

    it('counts TrainingEvents by company', async () => {
      const category1 = await categoryTestUtils.createAndPersist();
      const category2 = await categoryTestUtils.createAndPersist();
      const company1 = await companyTestUtils.createAndPersist();
      const company2 = await companyTestUtils.createAndPersist();
      const training1 = await trainingTestUtils.createAndPersist({
        input: { category_id: category1.id, company_id: company1.id },
      });
      const training2 = await trainingTestUtils.createAndPersist({
        input: { category_id: category2.id, company_id: company2.id },
      });

      await trainingEventTestUtils.createAndPersist({ input: { training_id: training1.id } });
      await trainingEventTestUtils.createAndPersist({ input: { training_id: training2.id } });
      await trainingEventTestUtils.createAndPersist({ input: { training_id: training2.id } });
      await trainingEventTestUtils.createAndPersist({ input: { training_id: training2.id } });

      const count = await trainingEventRepository.countTrainingEvents({ companyId: company2.id });

      expect(count).toEqual(3);
    });

    it('counts TrainingEvents by training name', async () => {
      const category = await categoryTestUtils.createAndPersist();
      const company = await companyTestUtils.createAndPersist();
      const training1 = await trainingTestUtils.createAndPersist({
        input: { category_id: category.id, company_id: company.id, name: 'Strzelanie' },
      });
      const training2 = await trainingTestUtils.createAndPersist({
        input: { category_id: category.id, company_id: company.id, name: 'Pierwsza pomoc' },
      });

      await trainingEventTestUtils.createAndPersist({ input: { training_id: training1.id } });
      await trainingEventTestUtils.createAndPersist({ input: { training_id: training2.id } });

      const count = await trainingEventRepository.countTrainingEvents({ trainingName: 'strzel' });

      expect(count).toEqual(1);
    });
  });
});
