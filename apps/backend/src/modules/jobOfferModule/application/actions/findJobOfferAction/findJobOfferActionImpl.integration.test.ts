import { beforeEach, afterEach, expect, it, describe } from 'vitest';

import { Generator } from '../../../../../../tests/generator.ts';
import { testSymbols } from '../../../../../../tests/symbols.ts';
import { TestContainer } from '../../../../../../tests/testContainer.ts';
import { ResourceNotFoundError } from '../../../../../common/errors/resourceNotFoundError.ts';
import { databaseSymbols } from '../../../../databaseModule/symbols.ts';
import type { DatabaseClient } from '../../../../databaseModule/types/databaseClient.ts';
import type { CityTestUtils } from '../../../../locationModule/tests/utils/cityTestUtils/cityTestUtils.ts';
import type { CompanyLocationTestUtils } from '../../../../locationModule/tests/utils/companyLocationTestUtils/companyLocationTestUtils.ts';
import type { CompanyTestUtils } from '../../../../userModule/tests/utils/companyTestUtils/companyTestUtils.ts';
import { symbols } from '../../../symbols.ts';
import type { CategoryTestUtils } from '../../../tests/utils/categoryTestUtils/categoryTestUtils.ts';
import { type JobOfferTestUtils } from '../../../tests/utils/jobOfferTestUtils/jobOfferTestUtils.ts';
import type { SkillTestUtils } from '../../../tests/utils/skillTestUtils/skillTestUtils.ts';

import { type FindJobOfferAction } from './findJobOfferAction.ts';

describe('FindJobOfferAction', () => {
  let action: FindJobOfferAction;

  let databaseClient: DatabaseClient;

  let cityTestUtils: CityTestUtils;
  let companyTestUtils: CompanyTestUtils;
  let categoryTestUtils: CategoryTestUtils;
  let companyLocationTestUtils: CompanyLocationTestUtils;
  let skillTestUtils: SkillTestUtils;
  let jobOfferTestUtils: JobOfferTestUtils;

  beforeEach(async () => {
    const container = await TestContainer.create();

    action = container.get<FindJobOfferAction>(symbols.findJobOfferAction);

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
    const city = await cityTestUtils.createAndPersist();
    const category = await categoryTestUtils.createAndPersist();
    const company = await companyTestUtils.createAndPersist();
    const skill = await skillTestUtils.createAndPersist();
    const location = await companyLocationTestUtils.createAndPersist({
      input: { company_id: company.id, city_id: city.id },
    });
    const jobOffer = await jobOfferTestUtils.createAndPersist({
      input: {
        jobOffer: { category_id: category.id, company_id: company.id, location_id: location.id },
        skillIds: [skill.id],
      },
    });

    const { jobOffer: foundJobOffer } = await action.execute({ id: jobOffer.id });

    expect(foundJobOffer.getState()).toEqual({
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
      locationId: jobOffer.location_id,
      location: {
        city: city.name,
        latitude: location.latitude,
        longitude: location.longitude,
      },
    });
  });
});
