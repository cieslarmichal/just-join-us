import { beforeEach, afterEach, expect, it, describe } from 'vitest';

import { Generator } from '../../../../../../tests/generator.ts';
import { testSymbols } from '../../../../../../tests/symbols.ts';
import { TestContainer } from '../../../../../../tests/testContainer.ts';
import { ResourceNotFoundError } from '../../../../../common/errors/resourceNotFoundError.ts';
import { databaseSymbols } from '../../../../databaseModule/symbols.ts';
import type { DatabaseClient } from '../../../../databaseModule/types/databaseClient.ts';
import type { CompanyTestUtils } from '../../../../userModule/tests/utils/companyTestUtils/companyTestUtils.ts';
import { symbols } from '../../../symbols.ts';
import type { CategoryTestUtils } from '../../../tests/utils/categoryTestUtils/categoryTestUtils.ts';
import { type JobOfferTestUtils } from '../../../tests/utils/jobOfferTestUtils/jobOfferTestUtils.ts';

import { type FindJobOfferAction } from './findJobOfferAction.ts';

describe('FindJobOfferAction', () => {
  let action: FindJobOfferAction;

  let databaseClient: DatabaseClient;

  let companyTestUtils: CompanyTestUtils;
  let categoryTestUtils: CategoryTestUtils;
  let jobOfferTestUtils: JobOfferTestUtils;

  beforeEach(async () => {
    const container = await TestContainer.create();

    action = container.get<FindJobOfferAction>(symbols.findJobOfferAction);

    databaseClient = container.get<DatabaseClient>(databaseSymbols.databaseClient);

    jobOfferTestUtils = container.get<JobOfferTestUtils>(testSymbols.jobOfferTestUtils);
    companyTestUtils = container.get<CompanyTestUtils>(testSymbols.companyTestUtils);
    categoryTestUtils = container.get<CategoryTestUtils>(testSymbols.categoryTestUtils);

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
    const jobOffer = await jobOfferTestUtils.createAndPersist({
      input: { category_id: category.id, company_id: company.id },
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
    });
  });
});
