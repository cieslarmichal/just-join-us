import { beforeEach, afterEach, expect, describe, it } from 'vitest';

import { Generator } from '../../../../../../tests/generator.ts';
import { testSymbols } from '../../../../../../tests/symbols.ts';
import { TestContainer } from '../../../../../../tests/testContainer.ts';
import { RepositoryError } from '../../../../../common/errors/repositoryError.ts';
import { databaseSymbols } from '../../../../databaseModule/symbols.ts';
import type { DatabaseClient } from '../../../../databaseModule/types/databaseClient.ts';
import type { LocationTestUtils } from '../../../../locationModule/tests/utils/locationTestUtils/locationTestUtils.ts';
import type { CompanyTestUtils } from '../../../../userModule/tests/utils/companyTestUtils/companyTestUtils.ts';
import { Category } from '../../../domain/entities/category/category.ts';
import { type JobOfferRepository } from '../../../domain/repositories/jobOfferRepository/jobOfferRepository.ts';
import { symbols } from '../../../symbols.ts';
import { JobOfferTestFactory } from '../../../tests/factories/jobOfferTestFactory/jobOfferTestFactory.ts';
import type { CategoryTestUtils } from '../../../tests/utils/categoryTestUtils/categoryTestUtils.ts';
import { type JobOfferTestUtils } from '../../../tests/utils/jobOfferTestUtils/jobOfferTestUtils.ts';
import type { SkillTestUtils } from '../../../tests/utils/skillTestUtils/skillTestUtils.ts';

describe('JobOfferRepositoryImpl', () => {
  let jobOfferRepository: JobOfferRepository;

  let databaseClient: DatabaseClient;

  let categoryTestUtils: CategoryTestUtils;
  let companyTestUtils: CompanyTestUtils;
  let locationTestUtils: LocationTestUtils;
  let skillTestUtils: SkillTestUtils;
  let jobOfferTestUtils: JobOfferTestUtils;

  const jobOfferTestFactory = new JobOfferTestFactory();

  beforeEach(async () => {
    const container = await TestContainer.create();

    jobOfferRepository = container.get<JobOfferRepository>(symbols.jobOfferRepository);

    databaseClient = container.get<DatabaseClient>(databaseSymbols.databaseClient);

    categoryTestUtils = container.get<CategoryTestUtils>(testSymbols.categoryTestUtils);
    companyTestUtils = container.get<CompanyTestUtils>(testSymbols.companyTestUtils);
    locationTestUtils = container.get<LocationTestUtils>(testSymbols.locationTestUtils);
    skillTestUtils = container.get<SkillTestUtils>(testSymbols.skillTestUtils);
    jobOfferTestUtils = container.get<JobOfferTestUtils>(testSymbols.jobOfferTestUtils);

    await categoryTestUtils.truncate();
    await companyTestUtils.truncate();
    await locationTestUtils.truncate();
    await skillTestUtils.truncate();
    await jobOfferTestUtils.truncate();
  });

  afterEach(async () => {
    await categoryTestUtils.truncate();
    await companyTestUtils.truncate();
    await locationTestUtils.truncate();
    await skillTestUtils.truncate();
    await jobOfferTestUtils.truncate();

    await databaseClient.destroy();
  });

  describe('Create', () => {
    it('creates a JobOffer', async () => {
      const category = await categoryTestUtils.createAndPersist();
      const company = await companyTestUtils.createAndPersist();
      const skill = await skillTestUtils.createAndPersist();
      const location = await locationTestUtils.createAndPersist({ input: { company_id: company.id, is_remote: true } });

      const { name, description, isHidden, employmentType, experienceLevel, minSalary, maxSalary, workingTime } =
        jobOfferTestFactory.create().getState();

      const jobOffer = await jobOfferRepository.createJobOffer({
        data: {
          name,
          description,
          isHidden,
          categoryId: category.id,
          companyId: company.id,
          employmentType,
          experienceLevel,
          minSalary,
          maxSalary,
          workingTime,
          locations: [{ id: location.id, isRemote: true }],
          skills: [{ id: skill.id, name: skill.name }],
        },
      });

      const foundJobOffer = await jobOfferTestUtils.findByName({ name, companyId: company.id });

      expect(foundJobOffer).toEqual({
        id: jobOffer.getId(),
        name,
        description,
        is_hidden: isHidden,
        category_id: category.id,
        company_id: company.id,
        employment_type: employmentType,
        experience_level: experienceLevel,
        min_salary: minSalary,
        max_salary: maxSalary,
        working_time: workingTime,
        created_at: expect.any(Date),
      });

      expect(jobOffer.getState()).toEqual({
        name,
        description,
        isHidden,
        categoryId: category.id,
        companyId: company.id,
        employmentType,
        experienceLevel,
        minSalary,
        maxSalary,
        workingTime,
        locations: [{ id: location.id, isRemote: true }],
        skills: [{ id: skill.id, name: skill.name }],
        category: { id: category.id, name: category.name },
        company: { id: company.id, name: company.name, logoUrl: company.logo_url },
        createdAt: expect.any(Date),
      });
    });

    it('throws an error when a JobOffer with the same name and company already exists', async () => {
      const category = await categoryTestUtils.createAndPersist();
      const company = await companyTestUtils.createAndPersist();
      const skill = await skillTestUtils.createAndPersist();
      const location = await locationTestUtils.createAndPersist({ input: { company_id: company.id, is_remote: true } });

      const existingJobOffer = await jobOfferTestUtils.createAndPersist({
        input: { jobOffer: { category_id: category.id, company_id: company.id } },
      });

      try {
        await jobOfferRepository.createJobOffer({
          data: {
            name: existingJobOffer.name,
            description: existingJobOffer.description,
            isHidden: existingJobOffer.is_hidden,
            categoryId: existingJobOffer.category_id,
            companyId: existingJobOffer.company_id,
            employmentType: existingJobOffer.employment_type,
            experienceLevel: existingJobOffer.experience_level,
            minSalary: existingJobOffer.min_salary,
            maxSalary: existingJobOffer.max_salary,
            workingTime: existingJobOffer.working_time,
            locations: [{ id: location.id, isRemote: true }],
            skills: [{ id: skill.id, name: skill.name }],
          },
        });
      } catch (error) {
        expect(error).toBeInstanceOf(RepositoryError);

        return;
      }

      expect.fail();
    });

    it(`updates JobOffer's data`, async () => {
      const category = await categoryTestUtils.createAndPersist();
      const company = await companyTestUtils.createAndPersist();
      const skill = await skillTestUtils.createAndPersist();
      const location = await locationTestUtils.createAndPersist({ input: { company_id: company.id, is_remote: true } });

      const existingJobOffer = await jobOfferTestUtils.createAndPersist({
        input: { jobOffer: { category_id: category.id, company_id: company.id } },
      });

      const jobOffer = jobOfferTestFactory.create({
        id: existingJobOffer.id,
        name: existingJobOffer.name,
        description: existingJobOffer.description,
        isHidden: existingJobOffer.is_hidden,
        categoryId: existingJobOffer.category_id,
        companyId: existingJobOffer.company_id,
        employmentType: existingJobOffer.employment_type,
        experienceLevel: existingJobOffer.experience_level,
        minSalary: existingJobOffer.min_salary,
        maxSalary: existingJobOffer.max_salary,
        workingTime: existingJobOffer.working_time,
        locations: [{ id: location.id, isRemote: true }],
        skills: [{ id: skill.id, name: skill.name }],
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
        companyId: existingJobOffer.company_id,
        createdAt: existingJobOffer.created_at,
        employmentType: existingJobOffer.employment_type,
        experienceLevel: existingJobOffer.experience_level,
        minSalary: existingJobOffer.min_salary,
        maxSalary: existingJobOffer.max_salary,
        workingTime: existingJobOffer.working_time,
        locations: [{ id: location.id, isRemote: true }],
        skills: [{ id: skill.id, name: skill.name }],
        category: { id: category2.id, name: category2.name },
        company: {
          id: existingJobOffer.company_id,
          name: company.name,
          logoUrl: company.logo_url,
        },
      });

      expect(foundJobOffer).toEqual({
        id: existingJobOffer.id,
        name: updatedName,
        description: updatedDescription,
        is_hidden: updatedIsHidden,
        category_id: category2.id,
        company_id: existingJobOffer.company_id,
        created_at: existingJobOffer.created_at,
        employment_type: existingJobOffer.employment_type,
        experience_level: existingJobOffer.experience_level,
        min_salary: existingJobOffer.min_salary,
        max_salary: existingJobOffer.max_salary,
        working_time: existingJobOffer.working_time,
      });
    });
  });

  describe('Find', () => {
    it('finds a JobOffer by id', async () => {
      const category = await categoryTestUtils.createAndPersist();
      const company = await companyTestUtils.createAndPersist();
      const skill = await skillTestUtils.createAndPersist();
      const location = await locationTestUtils.createAndPersist({ input: { company_id: company.id, is_remote: true } });
      const jobOffer = await jobOfferTestUtils.createAndPersist({
        input: {
          jobOffer: { category_id: category.id, company_id: company.id },
          skillIds: [skill.id],
          locationIds: [location.id],
        },
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
        employmentType: jobOffer.employment_type,
        experienceLevel: jobOffer.experience_level,
        minSalary: jobOffer.min_salary,
        maxSalary: jobOffer.max_salary,
        workingTime: jobOffer.working_time,
        skills: [
          {
            id: skill.id,
            name: skill.name,
          },
        ],
        locations: [
          {
            id: location.id,
            isRemote: location.is_remote,
          },
        ],
      });
    });

    it('returns null if a JobOffer with given id does not exist', async () => {
      const id = Generator.uuid();

      const jobOffer = await jobOfferRepository.findJobOffer({ id });

      expect(jobOffer).toBeNull();
    });

    it('finds JobOffers by company', async () => {
      const category = await categoryTestUtils.createAndPersist();
      const company = await companyTestUtils.createAndPersist();
      const skill = await skillTestUtils.createAndPersist();
      const location = await locationTestUtils.createAndPersist({ input: { company_id: company.id, is_remote: true } });

      const jobOffer1 = await jobOfferTestUtils.createAndPersist({
        input: {
          jobOffer: { category_id: category.id, company_id: company.id },
          skillIds: [skill.id],
          locationIds: [location.id],
        },
      });

      const jobOffer2 = await jobOfferTestUtils.createAndPersist({
        input: {
          jobOffer: { category_id: category.id, company_id: company.id },
          skillIds: [skill.id],
          locationIds: [location.id],
        },
      });

      const foundJobOffers = await jobOfferRepository.findJobOffers({ companyId: company.id, page: 1, pageSize: 10 });

      expect(foundJobOffers).toHaveLength(2);
      expect(foundJobOffers[0]?.getState()).toEqual({
        name: jobOffer2.name,
        description: jobOffer2.description,
        isHidden: jobOffer2.is_hidden,
        categoryId: jobOffer2.category_id,
        category: { name: category.name },
        companyId: jobOffer2.company_id,
        company: { name: company.name, logoUrl: company.logo_url },
        createdAt: jobOffer2.created_at,
        employmentType: jobOffer2.employment_type,
        experienceLevel: jobOffer2.experience_level,
        minSalary: jobOffer2.min_salary,
        maxSalary: jobOffer2.max_salary,
        workingTime: jobOffer2.working_time,
        skills: [
          {
            id: skill.id,
            name: skill.name,
          },
        ],
        locations: [
          {
            id: location.id,
            isRemote: location.is_remote,
          },
        ],
      });
      expect(foundJobOffers[1]?.getState()).toEqual({
        name: jobOffer1.name,
        description: jobOffer1.description,
        isHidden: jobOffer1.is_hidden,
        categoryId: jobOffer1.category_id,
        category: { name: category.name },
        companyId: jobOffer1.company_id,
        company: { name: company.name, logoUrl: company.logo_url },
        createdAt: jobOffer1.created_at,
        employmentType: jobOffer1.employment_type,
        experienceLevel: jobOffer1.experience_level,
        minSalary: jobOffer1.min_salary,
        maxSalary: jobOffer1.max_salary,
        workingTime: jobOffer1.working_time,
        skills: [
          {
            id: skill.id,
            name: skill.name,
          },
        ],
        locations: [
          {
            id: location.id,
            isRemote: location.is_remote,
          },
        ],
      });
    });

    it('finds JobOffers by category', async () => {
      const category = await categoryTestUtils.createAndPersist();
      const company = await companyTestUtils.createAndPersist();
      const skill = await skillTestUtils.createAndPersist();
      const location = await locationTestUtils.createAndPersist({ input: { company_id: company.id, is_remote: true } });

      const jobOffer1 = await jobOfferTestUtils.createAndPersist({
        input: {
          jobOffer: { category_id: category.id, company_id: company.id },
          skillIds: [skill.id],
          locationIds: [location.id],
        },
      });

      const jobOffer2 = await jobOfferTestUtils.createAndPersist({
        input: {
          jobOffer: { category_id: category.id, company_id: company.id },
          skillIds: [skill.id],
          locationIds: [location.id],
        },
      });

      const foundJobOffers = await jobOfferRepository.findJobOffers({ categoryId: category.id, page: 1, pageSize: 10 });

      expect(foundJobOffers).toHaveLength(2);
      expect(foundJobOffers[0]?.getState()).toEqual({
        name: jobOffer2.name,
        description: jobOffer2.description,
        isHidden: jobOffer2.is_hidden,
        categoryId: jobOffer2.category_id,
        category: { name: category.name },
        companyId: jobOffer2.company_id,
        company: { name: company.name, logoUrl: company.logo_url },
        createdAt: jobOffer2.created_at,
        employmentType: jobOffer2.employment_type,
        experienceLevel: jobOffer2.experience_level,
        minSalary: jobOffer2.min_salary,
        maxSalary: jobOffer2.max_salary,
        workingTime: jobOffer2.working_time,
        skills: [
          {
            id: skill.id,
            name: skill.name,
          },
        ],
        locations: [
          {
            id: location.id,
            isRemote: location.is_remote,
          },
        ],
      });
      expect(foundJobOffers[1]?.getState()).toEqual({
        name: jobOffer1.name,
        description: jobOffer1.description,
        isHidden: jobOffer1.is_hidden,
        categoryId: jobOffer1.category_id,
        category: { name: category.name },
        companyId: jobOffer1.company_id,
        company: { name: company.name, logoUrl: company.logo_url },
        createdAt: jobOffer1.created_at,
        employmentType: jobOffer1.employment_type,
        experienceLevel: jobOffer1.experience_level,
        minSalary: jobOffer1.min_salary,
        maxSalary: jobOffer1.max_salary,
        workingTime: jobOffer1.working_time,
        skills: [
          {
            id: skill.id,
            name: skill.name,
          },
        ],
        locations: [
          {
            id: location.id,
            isRemote: location.is_remote,
          },
        ],
      });
    });
  });

  describe('Count', () => {
    it('counts JobOffers by company', async () => {
      const category = await categoryTestUtils.createAndPersist();
      const company = await companyTestUtils.createAndPersist();
      const skill = await skillTestUtils.createAndPersist();
      const location = await locationTestUtils.createAndPersist({ input: { company_id: company.id, is_remote: true } });

      await jobOfferTestUtils.createAndPersist({
        input: {
          jobOffer: { category_id: category.id, company_id: company.id },
          skillIds: [skill.id],
          locationIds: [location.id],
        },
      });

      await jobOfferTestUtils.createAndPersist({
        input: {
          jobOffer: { category_id: category.id, company_id: company.id },
          skillIds: [skill.id],
          locationIds: [location.id],
        },
      });

      const count = await jobOfferRepository.countJobOffers({ companyId: company.id });

      expect(count).toBe(2);
    });

    it('counts JobOffers by category', async () => {
      const category = await categoryTestUtils.createAndPersist();
      const company = await companyTestUtils.createAndPersist();
      const skill = await skillTestUtils.createAndPersist();
      const location = await locationTestUtils.createAndPersist({ input: { company_id: company.id, is_remote: true } });

      await jobOfferTestUtils.createAndPersist({
        input: {
          jobOffer: { category_id: category.id, company_id: company.id },
          skillIds: [skill.id],
          locationIds: [location.id],
        },
      });

      await jobOfferTestUtils.createAndPersist({
        input: {
          jobOffer: { category_id: category.id, company_id: company.id },
          skillIds: [skill.id],
          locationIds: [location.id],
        },
      });

      const count = await jobOfferRepository.countJobOffers({ categoryId: category.id });

      expect(count).toBe(2);
    });
  });
});
