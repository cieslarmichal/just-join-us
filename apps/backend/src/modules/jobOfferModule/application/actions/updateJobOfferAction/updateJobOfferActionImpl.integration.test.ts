import { beforeEach, describe, expect, it, afterEach } from 'vitest';

import { Generator } from '../../../../../../tests/generator.ts';
import { testSymbols } from '../../../../../../tests/symbols.ts';
import { TestContainer } from '../../../../../../tests/testContainer.ts';
import { OperationNotValidError } from '../../../../../common/errors/operationNotValidError.ts';
import { databaseSymbols } from '../../../../databaseModule/symbols.ts';
import type { DatabaseClient } from '../../../../databaseModule/types/databaseClient.ts';
import type { CityTestUtils } from '../../../../locationModule/tests/utils/cityTestUtils/cityTestUtils.ts';
import type { CompanyLocationTestUtils } from '../../../../locationModule/tests/utils/companyLocationTestUtils/companyLocationTestUtils.ts';
import type { CompanyTestUtils } from '../../../../userModule/tests/utils/companyTestUtils/companyTestUtils.ts';
import { JobOffer } from '../../../domain/entities/jobOffer/jobOffer.ts';
import { symbols } from '../../../symbols.ts';
import type { CategoryTestUtils } from '../../../tests/utils/categoryTestUtils/categoryTestUtils.ts';
import type { JobOfferTestUtils } from '../../../tests/utils/jobOfferTestUtils/jobOfferTestUtils.ts';
import type { SkillTestUtils } from '../../../tests/utils/skillTestUtils/skillTestUtils.ts';

import { type UpdateJobOfferAction } from './updateJobOfferAction.ts';

describe('UpdateJobOfferActionImpl', () => {
  let action: UpdateJobOfferAction;

  let databaseClient: DatabaseClient;

  let cityTestUtils: CityTestUtils;
  let companyTestUtils: CompanyTestUtils;
  let categoryTestUtils: CategoryTestUtils;
  let companyLocationTestUtils: CompanyLocationTestUtils;
  let skillTestUtils: SkillTestUtils;
  let jobOfferTestUtils: JobOfferTestUtils;

  beforeEach(async () => {
    const container = await TestContainer.create();

    action = container.get<UpdateJobOfferAction>(symbols.updateJobOfferAction);

    databaseClient = container.get<DatabaseClient>(databaseSymbols.databaseClient);

    cityTestUtils = container.get<CityTestUtils>(testSymbols.cityTestUtils);
    jobOfferTestUtils = container.get<JobOfferTestUtils>(testSymbols.jobOfferTestUtils);
    skillTestUtils = container.get<SkillTestUtils>(testSymbols.skillTestUtils);
    companyLocationTestUtils = container.get<CompanyLocationTestUtils>(testSymbols.companyLocationTestUtils);
    companyTestUtils = container.get<CompanyTestUtils>(testSymbols.companyTestUtils);
    categoryTestUtils = container.get<CategoryTestUtils>(testSymbols.categoryTestUtils);

    await cityTestUtils.truncate();
    await categoryTestUtils.truncate();
    await companyTestUtils.truncate();
    await skillTestUtils.truncate();
    await companyLocationTestUtils.truncate();
    await jobOfferTestUtils.truncate();
  });

  afterEach(async () => {
    await cityTestUtils.truncate();
    await categoryTestUtils.truncate();
    await companyTestUtils.truncate();
    await skillTestUtils.truncate();
    await companyLocationTestUtils.truncate();
    await jobOfferTestUtils.truncate();

    await databaseClient.destroy();
  });

  it('updates JobOffer data', async () => {
    const category = await categoryTestUtils.createAndPersist();
    const company = await companyTestUtils.createAndPersist();
    const skill = await skillTestUtils.createAndPersist();
    const location = await companyLocationTestUtils.createAndPersist({ input: { company_id: company.id } });
    const jobOfferRawEntity = await jobOfferTestUtils.createAndPersist({
      input: {
        jobOffer: { category_id: category.id, company_id: company.id },
        skillIds: [skill.id],
        locationIds: [location.id],
      },
    });

    const jobOffer = new JobOffer({
      id: jobOfferRawEntity.id,
      name: jobOfferRawEntity.name,
      description: jobOfferRawEntity.description,
      categoryId: jobOfferRawEntity.category_id,
      companyId: jobOfferRawEntity.company_id,
      isHidden: jobOfferRawEntity.is_hidden,
      createdAt: jobOfferRawEntity.created_at,
      employmentType: jobOfferRawEntity.employment_type,
      workingTime: jobOfferRawEntity.working_time,
      experienceLevel: jobOfferRawEntity.experience_level,
      minSalary: jobOfferRawEntity.min_salary,
      maxSalary: jobOfferRawEntity.max_salary,
      locations: [
        {
          id: location.id,
          isRemote: location.is_remote,
        },
      ],
      skills: [
        {
          id: skill.id,
          name: skill.name,
        },
      ],
    });

    const updatedIsHidden = Generator.boolean();
    const updatedName = Generator.jobOfferName();
    const updatedDescription = Generator.jobOfferDescription();
    const updatedCategory = await categoryTestUtils.createAndPersist();
    const updatedSkill = await skillTestUtils.createAndPersist();
    const city = await cityTestUtils.createAndPersist();
    const updatedLocation = await companyLocationTestUtils.createAndPersist({
      input: { company_id: company.id, city_id: city.id },
    });
    const updatedEmploymentType = Generator.employmentType();
    const updatedWorkingTime = Generator.workingTime();
    const updatedExperienceLevel = Generator.experienceLevel();
    const updatedMinSalary = Generator.minSalary();
    const updatedMaxSalary = Generator.maxSalary();

    const { jobOffer: updatedJobOffer } = await action.execute({
      id: jobOffer.getId(),
      name: updatedName,
      description: updatedDescription,
      isHidden: updatedIsHidden,
      categoryId: updatedCategory.id,
      employmentType: updatedEmploymentType,
      workingTime: updatedWorkingTime,
      experienceLevel: updatedExperienceLevel,
      minSalary: updatedMinSalary,
      maxSalary: updatedMaxSalary,
      skillIds: [updatedSkill.id],
      locationIds: [updatedLocation.id],
    });

    const foundJobOffer = await jobOfferTestUtils.findById({ id: jobOffer.getId() });

    expect(updatedJobOffer.getState()).toEqual({
      name: updatedName,
      description: updatedDescription,
      isHidden: updatedIsHidden,
      categoryId: updatedCategory.id,
      category: { name: updatedCategory.name },
      companyId: jobOfferRawEntity.company_id,
      company: { name: company.name, logoUrl: company.logo_url },
      createdAt: jobOfferRawEntity.created_at,
      employmentType: updatedEmploymentType,
      experienceLevel: updatedExperienceLevel,
      minSalary: updatedMinSalary,
      maxSalary: updatedMaxSalary,
      workingTime: updatedWorkingTime,
      skills: [
        {
          id: updatedSkill.id,
          name: updatedSkill.name,
        },
      ],
      locations: [
        {
          id: updatedLocation.id,
          isRemote: updatedLocation.is_remote,
          city: updatedLocation.city_id,
        },
      ],
    });

    expect(foundJobOffer).toEqual({
      id: jobOfferRawEntity.id,
      name: updatedName,
      description: updatedDescription,
      is_hidden: updatedIsHidden,
      category_id: updatedCategory.id,
      company_id: jobOfferRawEntity.company_id,
      created_at: jobOfferRawEntity.created_at,
      employment_type: updatedEmploymentType,
      experience_level: updatedExperienceLevel,
      min_salary: updatedMinSalary,
      max_salary: updatedMaxSalary,
      working_time: updatedWorkingTime,
    });
  });

  it('throws an error - when a JobOffer with given id not found', async () => {
    const jobOfferId = Generator.uuid();

    const name = Generator.jobOfferName();

    try {
      await action.execute({
        id: jobOfferId,
        name,
      });
    } catch (error) {
      expect(error).toBeInstanceOf(OperationNotValidError);

      expect((error as OperationNotValidError).context).toMatchObject({
        reason: 'JobOffer not found.',
        id: jobOfferId,
      });

      return;
    }

    expect.fail();
  });

  it('throws an error - when a Category with given id not found', async () => {
    const category = await categoryTestUtils.createAndPersist();
    const company = await companyTestUtils.createAndPersist();
    const skill = await skillTestUtils.createAndPersist();
    const location = await companyLocationTestUtils.createAndPersist({ input: { company_id: company.id } });
    const jobOfferRawEntity = await jobOfferTestUtils.createAndPersist({
      input: {
        jobOffer: { category_id: category.id, company_id: company.id },
        skillIds: [skill.id],
        locationIds: [location.id],
      },
    });

    const categoryId = Generator.uuid();

    try {
      await action.execute({
        id: jobOfferRawEntity.id,
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

  it('throws an error - when a Skill with given id not found', async () => {
    const category = await categoryTestUtils.createAndPersist();
    const company = await companyTestUtils.createAndPersist();
    const skill = await skillTestUtils.createAndPersist();
    const location = await companyLocationTestUtils.createAndPersist({ input: { company_id: company.id } });
    const jobOfferRawEntity = await jobOfferTestUtils.createAndPersist({
      input: {
        jobOffer: { category_id: category.id, company_id: company.id },
        skillIds: [skill.id],
        locationIds: [location.id],
      },
    });

    const skillId = Generator.uuid();

    try {
      await action.execute({
        id: jobOfferRawEntity.id,
        skillIds: [skillId],
      });
    } catch (error) {
      expect(error).toBeInstanceOf(OperationNotValidError);

      expect((error as OperationNotValidError).context).toMatchObject({
        reason: 'Some skills not found.',
        ids: [skillId],
      });

      return;
    }

    expect.fail();
  });

  it('throws an error - when a Location with given id not found', async () => {
    const category = await categoryTestUtils.createAndPersist();
    const company = await companyTestUtils.createAndPersist();
    const skill = await skillTestUtils.createAndPersist();
    const location = await companyLocationTestUtils.createAndPersist({ input: { company_id: company.id } });
    const jobOfferRawEntity = await jobOfferTestUtils.createAndPersist({
      input: {
        jobOffer: { category_id: category.id, company_id: company.id },
        skillIds: [skill.id],
        locationIds: [location.id],
      },
    });

    const locationId = Generator.uuid();

    try {
      await action.execute({
        id: jobOfferRawEntity.id,
        locationIds: [locationId],
      });
    } catch (error) {
      expect(error).toBeInstanceOf(OperationNotValidError);

      expect((error as OperationNotValidError).context).toMatchObject({
        reason: 'Some locations not found.',
        ids: [locationId],
      });

      return;
    }

    expect.fail();
  });
});
