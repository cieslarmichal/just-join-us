import { beforeEach, afterEach, expect, describe, it } from 'vitest';

import { Generator } from '../../../../../../tests/generator.ts';
import { testSymbols } from '../../../../../../tests/symbols.ts';
import { TestContainer } from '../../../../../../tests/testContainer.ts';
import { RepositoryError } from '../../../../../common/errors/repositoryError.ts';
import { databaseSymbols } from '../../../../databaseModule/symbols.ts';
import type { DatabaseClient } from '../../../../databaseModule/types/databaseClient.ts';
import type { CompanyTestUtils } from '../../../../userModule/tests/utils/companyTestUtils/companyTestUtils.ts';
import { Category } from '../../../domain/entities/category/category.ts';
import { type TrainingRepository } from '../../../domain/repositories/trainingRepository/trainingRepository.ts';
import { symbols } from '../../../symbols.ts';
import { TrainingTestFactory } from '../../../tests/factories/trainingTestFactory/trainingTestFactory.ts';
import type { CategoryTestUtils } from '../../../tests/utils/categoryTestUtils/categoryTestUtils.ts';
import { type TrainingTestUtils } from '../../../tests/utils/trainingTestUtils/trainingTestUtils.ts';

describe('TrainingRepositoryImpl', () => {
  let trainingRepository: TrainingRepository;

  let databaseClient: DatabaseClient;

  let categoryTestUtils: CategoryTestUtils;
  let companyTestUtils: CompanyTestUtils;
  let trainingTestUtils: TrainingTestUtils;

  const trainingTestFactory = new TrainingTestFactory();

  beforeEach(async () => {
    const container = await TestContainer.create();

    trainingRepository = container.get<TrainingRepository>(symbols.trainingRepository);

    databaseClient = container.get<DatabaseClient>(databaseSymbols.databaseClient);

    categoryTestUtils = container.get<CategoryTestUtils>(testSymbols.categoryTestUtils);
    companyTestUtils = container.get<CompanyTestUtils>(testSymbols.companyTestUtils);
    trainingTestUtils = container.get<TrainingTestUtils>(testSymbols.trainingTestUtils);

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

  describe('Create', () => {
    it('creates a Training', async () => {
      const category = await categoryTestUtils.createAndPersist();

      const company = await companyTestUtils.createAndPersist();

      const createdTraining = trainingTestFactory.create({ categoryId: category.id, companyId: company.id });

      const { name, description, isHidden, categoryId, companyId } = createdTraining.getState();

      const training = await trainingRepository.createTraining({
        data: {
          name,
          description,
          isHidden,
          categoryId,
          companyId,
        },
      });

      const foundTraining = await trainingTestUtils.findByName({ name, companyId });

      expect(foundTraining).toEqual({
        id: training.getId(),
        name,
        description,
        is_hidden: isHidden,
        category_id: categoryId,
        company_id: companyId,
        created_at: expect.any(Date),
      });

      expect(training.getState()).toEqual({
        name,
        description,
        isHidden,
        categoryId,
        companyId,
        createdAt: expect.any(Date),
      });
    });

    it('throws an error when a Training with the same name and company already exists', async () => {
      const category = await categoryTestUtils.createAndPersist();

      const company = await companyTestUtils.createAndPersist();

      const createdTraining = trainingTestFactory.create({ categoryId: category.id, companyId: company.id });

      const { description, isHidden, categoryId, companyId } = createdTraining.getState();

      const existingTraining = await trainingTestUtils.createAndPersist({
        input: { category_id: categoryId, company_id: companyId },
      });

      try {
        await trainingRepository.createTraining({
          data: {
            name: existingTraining.name,
            description,
            isHidden,
            categoryId,
            companyId: existingTraining.company_id,
          },
        });
      } catch (error) {
        expect(error).toBeInstanceOf(RepositoryError);

        return;
      }

      expect.fail();
    });

    it(`updates Training's data`, async () => {
      const category1 = await categoryTestUtils.createAndPersist();

      const company = await companyTestUtils.createAndPersist();

      const trainingRawEntity = await trainingTestUtils.createAndPersist({
        input: { category_id: category1.id, company_id: company.id },
      });

      const training = trainingTestFactory.create({
        id: trainingRawEntity.id,
        categoryId: trainingRawEntity.category_id,
        companyId: trainingRawEntity.company_id,
        name: trainingRawEntity.name,
        description: trainingRawEntity.description,
        isHidden: trainingRawEntity.is_hidden,
        createdAt: trainingRawEntity.created_at,
      });

      const category2 = await categoryTestUtils.createAndPersist();

      const updatedName = Generator.trainingName();

      const updatedDescription = Generator.trainingDescription();

      const updatedIsHidden = Generator.boolean();

      training.setCategory({ category: new Category({ id: category2.id, name: category2.name }) });

      training.setName({ name: updatedName });

      training.setDescription({ description: updatedDescription });

      training.setIsHidden({ isHidden: updatedIsHidden });

      const updatedTraining = await trainingRepository.updateTraining({ training });

      const foundTraining = await trainingTestUtils.findById({ id: training.getId() });

      expect(updatedTraining.getState()).toEqual({
        name: updatedName,
        description: updatedDescription,
        isHidden: updatedIsHidden,
        categoryId: category2.id,
        companyId: trainingRawEntity.company_id,
        createdAt: trainingRawEntity.created_at,
      });

      expect(foundTraining).toEqual({
        id: trainingRawEntity.id,
        name: updatedName,
        description: updatedDescription,
        is_hidden: updatedIsHidden,
        category_id: category2.id,
        company_id: trainingRawEntity.company_id,
        created_at: trainingRawEntity.created_at,
      });
    });
  });

  describe('Find', () => {
    it('finds a Training by id', async () => {
      const category = await categoryTestUtils.createAndPersist();

      const company = await companyTestUtils.createAndPersist();

      const training = await trainingTestUtils.createAndPersist({
        input: { category_id: category.id, company_id: company.id },
      });

      const foundTraining = await trainingRepository.findTraining({ id: training.id });

      expect(foundTraining?.getState()).toEqual({
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

    it('returns null if a Training with given id does not exist', async () => {
      const id = Generator.uuid();

      const training = await trainingRepository.findTraining({ id });

      expect(training).toBeNull();
    });

    it('finds Trainings by company', async () => {
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

      const trainings = await trainingRepository.findTrainings({
        companyId: company1.id,
        page: 1,
        pageSize: 10,
      });

      expect(trainings).toHaveLength(2);

      expect(trainings[0]?.getState()).toEqual({
        name: training2.name,
        description: training2.description,
        isHidden: training2.is_hidden,
        categoryId: training2.category_id,
        category: { name: category.name },
        companyId: training2.company_id,
        company: { name: company1.name, logoUrl: company1.logo_url },
        createdAt: training2.created_at,
      });

      expect(trainings[1]?.getState()).toEqual({
        name: training1.name,
        description: training1.description,
        isHidden: training1.is_hidden,
        categoryId: training1.category_id,
        category: { name: category.name },
        companyId: training1.company_id,
        company: { name: company1.name, logoUrl: company1.logo_url },
        createdAt: training1.created_at,
      });
    });
  });

  describe('Count', () => {
    it('counts Trainings by company', async () => {
      const category = await categoryTestUtils.createAndPersist();

      const company1 = await companyTestUtils.createAndPersist();

      const company2 = await companyTestUtils.createAndPersist();

      await trainingTestUtils.createAndPersist({
        input: { category_id: category.id, company_id: company1.id },
      });

      await trainingTestUtils.createAndPersist({
        input: { category_id: category.id, company_id: company1.id },
      });

      await trainingTestUtils.createAndPersist({
        input: { category_id: category.id, company_id: company2.id },
      });

      const count = await trainingRepository.countTrainings({ companyId: company2.id });

      expect(count).toEqual(1);
    });
  });
});
