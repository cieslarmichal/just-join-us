import { beforeEach, afterEach, expect, it, describe } from 'vitest';

import { Generator } from '../../../../../../tests/generator.ts';
import { testSymbols } from '../../../../../../tests/symbols.ts';
import { TestContainer } from '../../../../../../tests/testContainer.ts';
import { databaseSymbols } from '../../../../databaseModule/symbols.ts';
import type { DatabaseClient } from '../../../../databaseModule/types/databaseClient.ts';
import type { CompanyLocationTestUtils } from '../../../../locationModule/tests/utils/companyLocationTestUtils/companyLocationTestUtils.ts';
import type { CompanyTestUtils } from '../../../../userModule/tests/utils/companyTestUtils/companyTestUtils.ts';
import { symbols } from '../../../symbols.ts';
import type { CategoryTestUtils } from '../../../tests/utils/categoryTestUtils/categoryTestUtils.ts';
import type { JobOfferTestUtils } from '../../../tests/utils/jobOfferTestUtils/jobOfferTestUtils.ts';
import type { SkillTestUtils } from '../../../tests/utils/skillTestUtils/skillTestUtils.ts';

import type { CreateJobOfferAction } from './createJobOfferAction.ts';

describe('CreateJobOfferAction', () => {
  let action: CreateJobOfferAction;

  let databaseClient: DatabaseClient;

  let companyTestUtils: CompanyTestUtils;
  let categoryTestUtils: CategoryTestUtils;
  let companyLocationTestUtils: CompanyLocationTestUtils;
  let skillTestUtils: SkillTestUtils;
  let jobOfferTestUtils: JobOfferTestUtils;

  beforeEach(async () => {
    const container = await TestContainer.create();

    action = container.get<CreateJobOfferAction>(symbols.createJobOfferAction);

    databaseClient = container.get<DatabaseClient>(databaseSymbols.databaseClient);

    jobOfferTestUtils = container.get<JobOfferTestUtils>(testSymbols.jobOfferTestUtils);
    skillTestUtils = container.get<SkillTestUtils>(testSymbols.skillTestUtils);
    companyLocationTestUtils = container.get<CompanyLocationTestUtils>(testSymbols.companyLocationTestUtils);
    companyTestUtils = container.get<CompanyTestUtils>(testSymbols.companyTestUtils);
    categoryTestUtils = container.get<CategoryTestUtils>(testSymbols.categoryTestUtils);

    await categoryTestUtils.truncate();
    await companyTestUtils.truncate();
    await skillTestUtils.truncate();
    await companyLocationTestUtils.truncate();
    await jobOfferTestUtils.truncate();
  });

  afterEach(async () => {
    await categoryTestUtils.truncate();
    await companyTestUtils.truncate();
    await skillTestUtils.truncate();
    await companyLocationTestUtils.truncate();
    await jobOfferTestUtils.truncate();

    await databaseClient.destroy();
  });

  it('creates a JobOffer', async () => {
    const category = await categoryTestUtils.createAndPersist();
    const company = await companyTestUtils.createAndPersist();
    const skill1 = await skillTestUtils.createAndPersist();
    const skill2 = await skillTestUtils.createAndPersist();
    const skill3 = await skillTestUtils.createAndPersist();
    const location = await companyLocationTestUtils.createAndPersist({ input: { company_id: company.id } });
    const name = Generator.jobOfferName();
    const description = Generator.jobOfferDescription();
    const employmentType = Generator.employmentType();
    const workingTime = Generator.workingTime();
    const experienceLevel = Generator.experienceLevel();
    const minSalary = Generator.minSalary();
    const maxSalary = Generator.maxSalary();

    const { jobOffer: createdJobOffer } = await action.execute({
      name,
      description,
      categoryId: category.id,
      companyId: company.id,
      employmentType,
      experienceLevel,
      minSalary,
      maxSalary,
      workingTime,
      locationIds: [location.id],
      skillIds: [skill1.id, skill2.id, skill3.id],
    });

    const foundJobOffer = await jobOfferTestUtils.findByName({ name, companyId: company.id });

    expect(createdJobOffer.getState()).toEqual({
      name,
      description,
      isHidden: false,
      categoryId: category.id,
      companyId: company.id,
      createdAt: expect.any(Date),
      employmentType,
      experienceLevel,
      minSalary,
      maxSalary,
      workingTime,
      company: {
        name: company.name,
        logoUrl: company.logo_url,
      },
      category: {
        name: category.name,
      },
      skills: expect.any(Array),
      locations: expect.any(Array),
    });
    expect(createdJobOffer.getSkills()).toHaveLength(3);
    expect(createdJobOffer.getLocations()).toHaveLength(1);

    expect(foundJobOffer).toEqual({
      id: createdJobOffer.getId(),
      name,
      description,
      is_hidden: false,
      category_id: category.id,
      company_id: company.id,
      created_at: expect.any(Date),
      employment_type: employmentType,
      experience_level: experienceLevel,
      min_salary: minSalary,
      max_salary: maxSalary,
      working_time: workingTime,
    });
  });
});
