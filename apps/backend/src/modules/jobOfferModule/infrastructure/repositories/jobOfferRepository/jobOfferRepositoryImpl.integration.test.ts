import { beforeEach, afterEach, expect, describe, it } from 'vitest';

import { Generator } from '../../../../../../tests/generator.ts';
import { testSymbols } from '../../../../../../tests/symbols.ts';
import { TestContainer } from '../../../../../../tests/testContainer.ts';
import { RepositoryError } from '../../../../../common/errors/repositoryError.ts';
import { databaseSymbols } from '../../../../databaseModule/symbols.ts';
import type { DatabaseClient } from '../../../../databaseModule/types/databaseClient.ts';
import type { CompanyTestUtils } from '../../../../userModule/tests/utils/companyTestUtils/companyTestUtils.ts';
import { Category } from '../../../domain/entities/category/category.ts';
import { type JobOfferRepository } from '../../../domain/repositories/jobOfferRepository/jobOfferRepository.ts';
import { symbols } from '../../../symbols.ts';
import { JobOfferTestFactory } from '../../../tests/factories/jobOfferTestFactory/jobOfferTestFactory.ts';
import type { CategoryTestUtils } from '../../../tests/utils/categoryTestUtils/categoryTestUtils.ts';
import { type JobOfferTestUtils } from '../../../tests/utils/jobOfferTestUtils/jobOfferTestUtils.ts';

describe('JobOfferRepositoryImpl', () => {
  let jobOfferRepository: JobOfferRepository;

  let databaseClient: DatabaseClient;

  let categoryTestUtils: CategoryTestUtils;
  let companyTestUtils: CompanyTestUtils;
  let jobOfferTestUtils: JobOfferTestUtils;

  const jobOfferTestFactory = new JobOfferTestFactory();

  beforeEach(async () => {
    const container = await TestContainer.create();

    jobOfferRepository = container.get<JobOfferRepository>(symbols.jobOfferRepository);

    databaseClient = container.get<DatabaseClient>(databaseSymbols.databaseClient);

    categoryTestUtils = container.get<CategoryTestUtils>(testSymbols.categoryTestUtils);
    companyTestUtils = container.get<CompanyTestUtils>(testSymbols.companyTestUtils);
    jobOfferTestUtils = container.get<JobOfferTestUtils>(testSymbols.jobOfferTestUtils);

    await categoryTestUtils.truncate();
    await companyTestUtils.truncate();
    await jobOfferTestUtils.truncate();
  });

  afterEach(async () => {
    await categoryTestUtils.truncate();
    await companyTestUtils.truncate();
    await jobOfferTestUtils.truncate();

    await databaseClient.destroy();
  });

  describe('Create', () => {
    it('creates a JobOffer', async () => {
      const category = await categoryTestUtils.createAndPersist();

      const company = await companyTestUtils.createAndPersist();

      const createdJobOffer = jobOfferTestFactory.create({ categoryId: category.id, companyId: company.id });

      const { name, description, isHidden, categoryId, companyId } = createdJobOffer.getState();

      const jobOffer = await jobOfferRepository.createJobOffer({
        data: {
          name,
          description,
          isHidden,
          categoryId,
          companyId,
        },
      });

      const foundJobOffer = await jobOfferTestUtils.findByName({ name, companyId });

      expect(foundJobOffer).toEqual({
        id: jobOffer.getId(),
        name,
        description,
        is_hidden: isHidden,
        category_id: categoryId,
        company_id: companyId,
        created_at: expect.any(Date),
      });

      expect(jobOffer.getState()).toEqual({
        name,
        description,
        isHidden,
        categoryId,
        companyId,
        createdAt: expect.any(Date),
      });
    });

    it('throws an error when a JobOffer with the same name and company already exists', async () => {
      const category = await categoryTestUtils.createAndPersist();

      const company = await companyTestUtils.createAndPersist();

      const createdJobOffer = jobOfferTestFactory.create({ categoryId: category.id, companyId: company.id });

      const { description, isHidden, categoryId, companyId } = createdJobOffer.getState();

      const existingJobOffer = await jobOfferTestUtils.createAndPersist({
        input: { category_id: categoryId, company_id: companyId },
      });

      try {
        await jobOfferRepository.createJobOffer({
          data: {
            name: existingJobOffer.name,
            description,
            isHidden,
            categoryId,
            companyId: existingJobOffer.company_id,
          },
        });
      } catch (error) {
        expect(error).toBeInstanceOf(RepositoryError);

        return;
      }

      expect.fail();
    });

    it(`updates JobOffer's data`, async () => {
      const category1 = await categoryTestUtils.createAndPersist();

      const company = await companyTestUtils.createAndPersist();

      const jobOfferRawEntity = await jobOfferTestUtils.createAndPersist({
        input: { category_id: category1.id, company_id: company.id },
      });

      const jobOffer = jobOfferTestFactory.create({
        id: jobOfferRawEntity.id,
        categoryId: jobOfferRawEntity.category_id,
        companyId: jobOfferRawEntity.company_id,
        name: jobOfferRawEntity.name,
        description: jobOfferRawEntity.description,
        isHidden: jobOfferRawEntity.is_hidden,
        createdAt: jobOfferRawEntity.created_at,
      });

      const category2 = await categoryTestUtils.createAndPersist();

      const updatedName = Generator.jobOfferName();

      const updatedDescription = Generator.jobOfferDescription();

      const updatedIsHidden = Generator.boolean();

      jobOffer.setCategory({ category: new Category({ id: category2.id, name: category2.name }) });

      jobOffer.setName({ name: updatedName });

      jobOffer.setDescription({ description: updatedDescription });

      jobOffer.setIsHidden({ isHidden: updatedIsHidden });

      const updatedJobOffer = await jobOfferRepository.updateJobOffer({ jobOffer });

      const foundJobOffer = await jobOfferTestUtils.findById({ id: jobOffer.getId() });

      expect(updatedJobOffer.getState()).toEqual({
        name: updatedName,
        description: updatedDescription,
        isHidden: updatedIsHidden,
        categoryId: category2.id,
        companyId: jobOfferRawEntity.company_id,
        createdAt: jobOfferRawEntity.created_at,
      });

      expect(foundJobOffer).toEqual({
        id: jobOfferRawEntity.id,
        name: updatedName,
        description: updatedDescription,
        is_hidden: updatedIsHidden,
        category_id: category2.id,
        company_id: jobOfferRawEntity.company_id,
        created_at: jobOfferRawEntity.created_at,
      });
    });
  });

  describe('Find', () => {
    it('finds a JobOffer by id', async () => {
      const category = await categoryTestUtils.createAndPersist();

      const company = await companyTestUtils.createAndPersist();

      const jobOffer = await jobOfferTestUtils.createAndPersist({
        input: { category_id: category.id, company_id: company.id },
      });

      const foundJobOffer = await jobOfferRepository.findJobOffer({ id: jobOffer.id });

      expect(foundJobOffer?.getState()).toEqual({
        name: jobOffer.name,
        description: jobOffer.description,
        isHidden: jobOffer.is_hidden,
        categoryId: jobOffer.category_id,
        category: { name: category.name },
        companyId: jobOffer.company_id,
        company: { name: company.name, logoUrl: company.logo_url },
        createdAt: jobOffer.created_at,
      });
    });

    it('returns null if a JobOffer with given id does not exist', async () => {
      const id = Generator.uuid();

      const jobOffer = await jobOfferRepository.findJobOffer({ id });

      expect(jobOffer).toBeNull();
    });

    it('finds JobOffers by company', async () => {
      const category = await categoryTestUtils.createAndPersist();

      const company1 = await companyTestUtils.createAndPersist();

      const company2 = await companyTestUtils.createAndPersist();

      const jobOffer1 = await jobOfferTestUtils.createAndPersist({
        input: { category_id: category.id, company_id: company1.id },
      });

      const jobOffer2 = await jobOfferTestUtils.createAndPersist({
        input: { category_id: category.id, company_id: company1.id },
      });

      await jobOfferTestUtils.createAndPersist({
        input: { category_id: category.id, company_id: company2.id },
      });

      const jobOffers = await jobOfferRepository.findJobOffers({
        companyId: company1.id,
        page: 1,
        pageSize: 10,
      });

      expect(jobOffers).toHaveLength(2);

      expect(jobOffers[0]?.getState()).toEqual({
        name: jobOffer2.name,
        description: jobOffer2.description,
        isHidden: jobOffer2.is_hidden,
        categoryId: jobOffer2.category_id,
        category: { name: category.name },
        companyId: jobOffer2.company_id,
        company: { name: company1.name, logoUrl: company1.logo_url },
        createdAt: jobOffer2.created_at,
      });

      expect(jobOffers[1]?.getState()).toEqual({
        name: jobOffer1.name,
        description: jobOffer1.description,
        isHidden: jobOffer1.is_hidden,
        categoryId: jobOffer1.category_id,
        category: { name: category.name },
        companyId: jobOffer1.company_id,
        company: { name: company1.name, logoUrl: company1.logo_url },
        createdAt: jobOffer1.created_at,
      });
    });
  });

  describe('Count', () => {
    it('counts JobOffers by company', async () => {
      const category = await categoryTestUtils.createAndPersist();

      const company1 = await companyTestUtils.createAndPersist();

      const company2 = await companyTestUtils.createAndPersist();

      await jobOfferTestUtils.createAndPersist({
        input: { category_id: category.id, company_id: company1.id },
      });

      await jobOfferTestUtils.createAndPersist({
        input: { category_id: category.id, company_id: company1.id },
      });

      await jobOfferTestUtils.createAndPersist({
        input: { category_id: category.id, company_id: company2.id },
      });

      const count = await jobOfferRepository.countJobOffers({ companyId: company2.id });

      expect(count).toEqual(1);
    });
  });
});
