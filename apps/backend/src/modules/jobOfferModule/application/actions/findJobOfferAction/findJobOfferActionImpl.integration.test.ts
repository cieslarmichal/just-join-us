import { beforeEach, afterEach, expect, it, describe } from 'vitest';

import { Generator } from '../../../../../../tests/generator.ts';
import { testSymbols } from '../../../../../../tests/symbols.ts';
import { TestContainer } from '../../../../../../tests/testContainer.ts';
import { ResourceNotFoundError } from '../../../../../common/errors/resourceNotFoundError.ts';
import { databaseSymbols } from '../../../../databaseModule/symbols.ts';
import type { DatabaseClient } from '../../../../databaseModule/types/databaseClient.ts';
import type { LocationTestUtils } from '../../../../locationModule/tests/utils/locationTestUtils/locationTestUtils.ts';
import type { CompanyTestUtils } from '../../../../userModule/tests/utils/companyTestUtils/companyTestUtils.ts';
import { symbols } from '../../../symbols.ts';
import type { CategoryTestUtils } from '../../../tests/utils/categoryTestUtils/categoryTestUtils.ts';
import { type JobOfferTestUtils } from '../../../tests/utils/jobOfferTestUtils/jobOfferTestUtils.ts';
import type { SkillTestUtils } from '../../../tests/utils/skillTestUtils/skillTestUtils.ts';

import { type FindJobOfferAction } from './findJobOfferAction.ts';

describe('FindJobOfferAction', () => {
  let action: FindJobOfferAction;

  let databaseClient: DatabaseClient;

  let companyTestUtils: CompanyTestUtils;
  let categoryTestUtils: CategoryTestUtils;
  let locationTestUtils: LocationTestUtils;
  let skillTestUtils: SkillTestUtils;
  let jobOfferTestUtils: JobOfferTestUtils;

  beforeEach(async () => {
    const container = await TestContainer.create();

    action = container.get<FindJobOfferAction>(symbols.findJobOfferAction);

    databaseClient = container.get<DatabaseClient>(databaseSymbols.databaseClient);

    jobOfferTestUtils = container.get<JobOfferTestUtils>(testSymbols.jobOfferTestUtils);
    skillTestUtils = container.get<SkillTestUtils>(testSymbols.skillTestUtils);
    locationTestUtils = container.get<LocationTestUtils>(testSymbols.locationTestUtils);
    companyTestUtils = container.get<CompanyTestUtils>(testSymbols.companyTestUtils);
    categoryTestUtils = container.get<CategoryTestUtils>(testSymbols.categoryTestUtils);

    await categoryTestUtils.truncate();
    await companyTestUtils.truncate();
    await skillTestUtils.truncate();
    await locationTestUtils.truncate();
    await jobOfferTestUtils.truncate();
  });

  afterEach(async () => {
    await categoryTestUtils.truncate();
    await companyTestUtils.truncate();
    await skillTestUtils.truncate();
    await locationTestUtils.truncate();
    await jobOfferTestUtils.truncate();

    await databaseClient.destroy();
  });

  it('throws an error if a jobOffer with given id does not exist', async () => {
    const nonExistingTraningId = Generator.uuid();

    try {
      await action.execute({ id: nonExistingTraningId });
    } catch (error) {
      expect(error).toBeInstanceOf(ResourceNotFoundError);

      return;
    }

    expect.fail();
  });

  it('finds jobOffer', async () => {
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

    const { jobOffer: foundJobOffer } = await action.execute({ id: jobOffer.id });

    expect(foundJobOffer.getState()).toEqual({
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
});
