import { beforeEach, afterEach, expect, describe, it } from 'vitest';

import { Generator } from '../../../../../../tests/generator.ts';
import { testSymbols } from '../../../../../../tests/symbols.ts';
import { TestContainer } from '../../../../../../tests/testContainer.ts';
import { databaseSymbols } from '../../../../databaseModule/symbols.ts';
import type { DatabaseClient } from '../../../../databaseModule/types/databaseClient.ts';
import type { CityTestUtils } from '../../../../locationModule/tests/utils/cityTestUtils/cityTestUtils.ts';
import type { CompanyLocationTestUtils } from '../../../../locationModule/tests/utils/companyLocationTestUtils/companyLocationTestUtils.ts';
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

  let cityTestUtils: CityTestUtils;
  let categoryTestUtils: CategoryTestUtils;
  let companyTestUtils: CompanyTestUtils;
  let companyLocationTestUtils: CompanyLocationTestUtils;
  let skillTestUtils: SkillTestUtils;
  let jobOfferTestUtils: JobOfferTestUtils;

  const jobOfferTestFactory = new JobOfferTestFactory();

  beforeEach(async () => {
    const container = await TestContainer.create();

    jobOfferRepository = container.get<JobOfferRepository>(symbols.jobOfferRepository);

    databaseClient = container.get<DatabaseClient>(databaseSymbols.databaseClient);

    cityTestUtils = container.get<CityTestUtils>(testSymbols.cityTestUtils);
    categoryTestUtils = container.get<CategoryTestUtils>(testSymbols.categoryTestUtils);
    companyTestUtils = container.get<CompanyTestUtils>(testSymbols.companyTestUtils);
    companyLocationTestUtils = container.get<CompanyLocationTestUtils>(testSymbols.companyLocationTestUtils);
    skillTestUtils = container.get<SkillTestUtils>(testSymbols.skillTestUtils);
    jobOfferTestUtils = container.get<JobOfferTestUtils>(testSymbols.jobOfferTestUtils);

    await cityTestUtils.truncate();
    await categoryTestUtils.truncate();
    await companyTestUtils.truncate();
    await companyLocationTestUtils.truncate();
    await skillTestUtils.truncate();
    await jobOfferTestUtils.truncate();
  });

  afterEach(async () => {
    await cityTestUtils.truncate();
    await categoryTestUtils.truncate();
    await companyTestUtils.truncate();
    await companyLocationTestUtils.truncate();
    await skillTestUtils.truncate();
    await jobOfferTestUtils.truncate();

    await databaseClient.destroy();
  });

  describe('Create', () => {
    it('creates a JobOffer', async () => {
      const city = await cityTestUtils.createAndPersist();
      const category = await categoryTestUtils.createAndPersist();
      const company = await companyTestUtils.createAndPersist();
      const skill = await skillTestUtils.createAndPersist();
      const location = await companyLocationTestUtils.createAndPersist({
        input: { company_id: company.id, city_id: city.id },
      });

      const {
        name,
        description,
        isHidden,
        isRemote,
        employmentType,
        experienceLevel,
        minSalary,
        maxSalary,
        workingTime,
      } = jobOfferTestFactory.create().getState();

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
          isRemote,
          locationId: location.id,
          skills: [{ id: skill.id, name: skill.name }],
        },
      });

      const foundJobOffer = await jobOfferTestUtils.findByName({ name, companyId: company.id });

      expect(foundJobOffer).toEqual({
        id: jobOffer.getId(),
        name,
        description,
        is_hidden: isHidden,
        is_remote: isRemote,
        location_id: location.id,
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
        isRemote,
        categoryId: category.id,
        companyId: company.id,
        employmentType,
        experienceLevel,
        minSalary,
        maxSalary,
        workingTime,
        locationId: location.id,
        location: { city: city.name, latitude: location.latitude, longitude: location.longitude },
        skills: [{ id: skill.id, name: skill.name }],
        category: { name: category.name },
        company: { name: company.name, logoUrl: company.logo_url },
        createdAt: expect.any(Date),
      });
    });

    it(`updates JobOffer's data`, async () => {
      const category = await categoryTestUtils.createAndPersist();
      const company = await companyTestUtils.createAndPersist();
      const skill = await skillTestUtils.createAndPersist();

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
        skills: [{ id: skill.id, name: skill.name }],
      });

      const category2 = await categoryTestUtils.createAndPersist();
      const updatedName = Generator.jobOfferName();
      const updatedDescription = Generator.jobOfferDescription();
      const updatedIsHidden = Generator.boolean();
      const updatedIsRemote = Generator.boolean();
      jobOffer.setCategory({
        category: new Category({ id: category2.id, name: category2.name, slug: category2.slug }),
      });
      jobOffer.setName({ name: updatedName });
      jobOffer.setDescription({ description: updatedDescription });
      jobOffer.setIsHidden({ isHidden: updatedIsHidden });
      jobOffer.setIsRemote({ isRemote: updatedIsRemote });

      const updatedJobOffer = await jobOfferRepository.updateJobOffer({ jobOffer });

      const foundJobOffer = await jobOfferTestUtils.findById({ id: jobOffer.getId() });

      expect(updatedJobOffer.getState()).toEqual({
        name: updatedName,
        description: updatedDescription,
        isHidden: updatedIsHidden,
        isRemote: updatedIsRemote,
        categoryId: category2.id,
        companyId: existingJobOffer.company_id,
        createdAt: existingJobOffer.created_at,
        employmentType: existingJobOffer.employment_type,
        experienceLevel: existingJobOffer.experience_level,
        minSalary: existingJobOffer.min_salary,
        maxSalary: existingJobOffer.max_salary,
        workingTime: existingJobOffer.working_time,
        skills: [{ id: skill.id, name: skill.name }],
        category: { name: category2.name },
        company: {
          name: company.name,
          logoUrl: company.logo_url,
        },
      });

      expect(foundJobOffer).toEqual({
        id: existingJobOffer.id,
        name: updatedName,
        description: updatedDescription,
        is_hidden: updatedIsHidden,
        is_remote: updatedIsRemote,
        location_id: null,
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
      const jobOffer = await jobOfferTestUtils.createAndPersist({
        input: {
          jobOffer: { category_id: category.id, company_id: company.id },
          skillIds: [skill.id],
        },
      });

      const foundJobOffer = await jobOfferRepository.findJobOffer({ id: jobOffer.id });

      expect(foundJobOffer?.getState()).toEqual({
        name: jobOffer.name,
        description: jobOffer.description,
        isHidden: jobOffer.is_hidden,
        isRemote: jobOffer.is_remote,
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

      const jobOffer1 = await jobOfferTestUtils.createAndPersist({
        input: {
          jobOffer: { category_id: category.id, company_id: company.id },
          skillIds: [skill.id],
        },
      });

      const jobOffer2 = await jobOfferTestUtils.createAndPersist({
        input: {
          jobOffer: { category_id: category.id, company_id: company.id },
          skillIds: [skill.id],
        },
      });

      const foundJobOffers = await jobOfferRepository.findJobOffers({ companyId: company.id, page: 1, pageSize: 10 });

      expect(foundJobOffers).toHaveLength(2);
      expect(foundJobOffers[0]?.getState()).toEqual({
        name: jobOffer2.name,
        description: jobOffer2.description,
        isHidden: jobOffer2.is_hidden,
        isRemote: jobOffer2.is_remote,
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
      });
      expect(foundJobOffers[1]?.getState()).toEqual({
        name: jobOffer1.name,
        description: jobOffer1.description,
        isHidden: jobOffer1.is_hidden,
        isRemote: jobOffer1.is_remote,
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
      });
    });

    it('finds JobOffers by category', async () => {
      const category = await categoryTestUtils.createAndPersist();
      const company = await companyTestUtils.createAndPersist();
      const skill = await skillTestUtils.createAndPersist();

      const jobOffer1 = await jobOfferTestUtils.createAndPersist({
        input: {
          jobOffer: { category_id: category.id, company_id: company.id },
          skillIds: [skill.id],
        },
      });

      const jobOffer2 = await jobOfferTestUtils.createAndPersist({
        input: {
          jobOffer: { category_id: category.id, company_id: company.id },
          skillIds: [skill.id],
        },
      });

      const foundJobOffers = await jobOfferRepository.findJobOffers({ category: category.slug, page: 1, pageSize: 10 });

      expect(foundJobOffers).toHaveLength(2);
      expect(foundJobOffers[0]?.getState()).toEqual({
        name: jobOffer2.name,
        description: jobOffer2.description,
        isHidden: jobOffer2.is_hidden,
        categoryId: jobOffer2.category_id,
        isRemote: jobOffer2.is_remote,
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
      });
      expect(foundJobOffers[1]?.getState()).toEqual({
        name: jobOffer1.name,
        description: jobOffer1.description,
        isHidden: jobOffer1.is_hidden,
        isRemote: jobOffer1.is_remote,
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
      });
    });
  });

  describe('Count', () => {
    it('counts JobOffers by company', async () => {
      const category = await categoryTestUtils.createAndPersist();
      const company = await companyTestUtils.createAndPersist();
      const skill = await skillTestUtils.createAndPersist();

      await jobOfferTestUtils.createAndPersist({
        input: {
          jobOffer: { category_id: category.id, company_id: company.id },
          skillIds: [skill.id],
        },
      });

      await jobOfferTestUtils.createAndPersist({
        input: {
          jobOffer: { category_id: category.id, company_id: company.id },
          skillIds: [skill.id],
        },
      });

      const count = await jobOfferRepository.countJobOffers({ companyId: company.id });

      expect(count).toBe(2);
    });

    it('counts JobOffers by category', async () => {
      const category = await categoryTestUtils.createAndPersist();
      const company = await companyTestUtils.createAndPersist();
      const skill = await skillTestUtils.createAndPersist();

      await jobOfferTestUtils.createAndPersist({
        input: {
          jobOffer: { category_id: category.id, company_id: company.id },
          skillIds: [skill.id],
        },
      });

      await jobOfferTestUtils.createAndPersist({
        input: {
          jobOffer: { category_id: category.id, company_id: company.id },
          skillIds: [skill.id],
        },
      });

      const count = await jobOfferRepository.countJobOffers({ category: category.slug });

      expect(count).toBe(2);
    });
  });
});
