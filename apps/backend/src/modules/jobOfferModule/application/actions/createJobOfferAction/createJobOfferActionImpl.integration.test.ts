import { beforeEach, afterEach, expect, it, describe } from 'vitest';

import { Generator } from '../../../../../../tests/generator.ts';
import { testSymbols } from '../../../../../../tests/symbols.ts';
import { TestContainer } from '../../../../../../tests/testContainer.ts';
import { ResourceAlreadyExistsError } from '../../../../../common/errors/resourceAlreadyExistsError.ts';
import { databaseSymbols } from '../../../../databaseModule/symbols.ts';
import type { DatabaseClient } from '../../../../databaseModule/types/databaseClient.ts';
import type { CompanyTestUtils } from '../../../../userModule/tests/utils/companyTestUtils/companyTestUtils.ts';
import { symbols } from '../../../symbols.ts';
import { JobOfferTestFactory } from '../../../tests/factories/jobOfferTestFactory/jobOfferTestFactory.ts';
import type { CategoryTestUtils } from '../../../tests/utils/categoryTestUtils/categoryTestUtils.ts';
import type { JobOfferTestUtils } from '../../../tests/utils/jobOfferTestUtils/jobOfferTestUtils.ts';

import type { CreateJobOfferAction } from './createJobOfferAction.ts';

describe('CreateJobOfferAction', () => {
  let action: CreateJobOfferAction;

  let databaseClient: DatabaseClient;

  let companyTestUtils: CompanyTestUtils;
  let categoryTestUtils: CategoryTestUtils;
  let jobOfferTestUtils: JobOfferTestUtils;

  const jobOfferTestFactory = new JobOfferTestFactory();

  beforeEach(async () => {
    const container = await TestContainer.create();

    action = container.get<CreateJobOfferAction>(symbols.createJobOfferAction);

    databaseClient = container.get<DatabaseClient>(databaseSymbols.databaseClient);

    companyTestUtils = container.get<CompanyTestUtils>(testSymbols.companyTestUtils);
    categoryTestUtils = container.get<CategoryTestUtils>(testSymbols.categoryTestUtils);
    jobOfferTestUtils = container.get<JobOfferTestUtils>(testSymbols.jobOfferTestUtils);

    await companyTestUtils.truncate();
    await categoryTestUtils.truncate();
    await jobOfferTestUtils.truncate();
  });

  afterEach(async () => {
    await companyTestUtils.truncate();
    await categoryTestUtils.truncate();
    await jobOfferTestUtils.truncate();

    await databaseClient.destroy();
  });

  it('creates a JobOffer', async () => {
    const category = await categoryTestUtils.createAndPersist();
    const company = await companyTestUtils.createAndPersist();
    const jobOfferName = Generator.jobOfferName();
    const jobOfferDescription = Generator.jobOfferDescription();

    const { jobOffer: createdJobOffer } = await action.execute({
      name: jobOfferName,
      description: jobOfferDescription,
      categoryId: category.id,
      companyId: company.id,
    });

    const foundJobOffer = await jobOfferTestUtils.findByName({ name: jobOfferName, companyId: company.id });

    expect(createdJobOffer.getState()).toEqual({
      name: jobOfferName,
      description: jobOfferDescription,
      isHidden: false,
      categoryId: category.id,
      companyId: company.id,
      createdAt: expect.any(Date),
    });

    expect(foundJobOffer).toEqual({
      id: createdJobOffer.getId(),
      name: jobOfferName,
      description: jobOfferDescription,
      is_hidden: false,
      category_id: category.id,
      company_id: company.id,
      created_at: expect.any(Date),
    });
  });

  it('throws an error when a JobOffer with the same name and company already exists', async () => {
    const category = await categoryTestUtils.createAndPersist();
    const company = await companyTestUtils.createAndPersist();
    const existingJobOffer = await jobOfferTestUtils.createAndPersist({
      input: { category_id: category.id, company_id: company.id },
    });

    const jobOffer = jobOfferTestFactory.create();

    try {
      await action.execute({
        name: existingJobOffer.name,
        description: jobOffer.getDescription(),
        categoryId: category.id,
        companyId: existingJobOffer.company_id,
      });
    } catch (error) {
      expect(error).toBeInstanceOf(ResourceAlreadyExistsError);

      expect((error as ResourceAlreadyExistsError).context).toEqual({
        resource: 'JobOffer',
        id: existingJobOffer.id,
        name: existingJobOffer.name,
        companyId: existingJobOffer.company_id,
      });

      return;
    }

    expect.fail();
  });
});
