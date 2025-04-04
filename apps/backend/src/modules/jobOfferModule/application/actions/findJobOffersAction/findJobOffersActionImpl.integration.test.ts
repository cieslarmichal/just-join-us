import { beforeEach, afterEach, expect, it, describe } from 'vitest';

import { testSymbols } from '../../../../../../tests/symbols.ts';
import { TestContainer } from '../../../../../../tests/testContainer.ts';
import { databaseSymbols } from '../../../../databaseModule/symbols.ts';
import type { DatabaseClient } from '../../../../databaseModule/types/databaseClient.ts';
import type { CompanyTestUtils } from '../../../../userModule/tests/utils/companyTestUtils/companyTestUtils.ts';
import { symbols } from '../../../symbols.ts';
import type { CategoryTestUtils } from '../../../tests/utils/categoryTestUtils/categoryTestUtils.ts';
import type { JobOfferTestUtils } from '../../../tests/utils/jobOfferTestUtils/jobOfferTestUtils.ts';

import { type FindJobOffersAction } from './findJobOffersAction.ts';

describe('FindJobOffersAction', () => {
  let action: FindJobOffersAction;

  let databaseClient: DatabaseClient;

  let companyTestUtils: CompanyTestUtils;
  let categoryTestUtils: CategoryTestUtils;
  let jobOfferTestUtils: JobOfferTestUtils;

  beforeEach(async () => {
    const container = await TestContainer.create();

    action = container.get<FindJobOffersAction>(symbols.findJobOffersAction);

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

  it('finds all company jobOffers', async () => {
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

    const { data: jobOffers, total } = await action.execute({ companyId: company1.id, page: 1, pageSize: 10 });

    expect(jobOffers).toHaveLength(2);
    expect(jobOffers[0]?.getId()).toBe(jobOffer2.id);
    expect(jobOffers[1]?.getId()).toBe(jobOffer1.id);
    expect(total).toBe(2);
  });

  it('finds company jobOffers by name', async () => {
    const category = await categoryTestUtils.createAndPersist();
    const company1 = await companyTestUtils.createAndPersist();
    const company2 = await companyTestUtils.createAndPersist();
    await jobOfferTestUtils.createAndPersist({
      input: { category_id: category.id, company_id: company1.id, name: 'Strzelanie z pistoletu' },
    });
    const jobOffer = await jobOfferTestUtils.createAndPersist({
      input: { category_id: category.id, company_id: company1.id, name: 'Pierwsza pomoc' },
    });
    await jobOfferTestUtils.createAndPersist({
      input: { category_id: category.id, company_id: company2.id, name: 'Pierwsza pomoc' },
    });

    const { data: jobOffers, total } = await action.execute({
      companyId: company1.id,
      name: 'pierwsza',
      page: 1,
      pageSize: 10,
    });

    expect(jobOffers).toHaveLength(1);
    expect(jobOffers[0]?.getId()).toBe(jobOffer.id);
    expect(total).toBe(1);
  });
});
