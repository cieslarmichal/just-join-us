import { beforeEach, describe, expect, it, afterEach } from 'vitest';

import { Generator } from '../../../../../../tests/generator.ts';
import { testSymbols } from '../../../../../../tests/symbols.ts';
import { TestContainer } from '../../../../../../tests/testContainer.ts';
import { OperationNotValidError } from '../../../../../common/errors/operationNotValidError.ts';
import { databaseSymbols } from '../../../../databaseModule/symbols.ts';
import type { DatabaseClient } from '../../../../databaseModule/types/databaseClient.ts';
import type { CompanyTestUtils } from '../../../../userModule/tests/utils/companyTestUtils/companyTestUtils.ts';
import { JobOffer } from '../../../domain/entities/jobOffer/jobOffer.ts';
import { symbols } from '../../../symbols.ts';
import type { CategoryTestUtils } from '../../../tests/utils/categoryTestUtils/categoryTestUtils.ts';
import type { JobOfferTestUtils } from '../../../tests/utils/jobOfferTestUtils/jobOfferTestUtils.ts';

import { type UpdateJobOfferAction } from './updateJobOfferAction.ts';

describe('UpdateJobOfferActionImpl', () => {
  let action: UpdateJobOfferAction;

  let databaseClient: DatabaseClient;

  let companyTestUtils: CompanyTestUtils;
  let categoryTestUtils: CategoryTestUtils;
  let jobOfferTestUtils: JobOfferTestUtils;

  beforeEach(async () => {
    const container = await TestContainer.create();

    action = container.get<UpdateJobOfferAction>(symbols.updateJobOfferAction);

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

  it('updates JobOffer data', async () => {
    const category = await categoryTestUtils.createAndPersist();
    const company = await companyTestUtils.createAndPersist();
    const jobOfferRawEntity = await jobOfferTestUtils.createAndPersist({
      input: { category_id: category.id, company_id: company.id },
    });

    const jobOffer = new JobOffer({
      id: jobOfferRawEntity.id,
      name: jobOfferRawEntity.name,
      description: jobOfferRawEntity.description,
      categoryId: jobOfferRawEntity.category_id,
      companyId: jobOfferRawEntity.company_id,
      isHidden: jobOfferRawEntity.is_hidden,
      createdAt: jobOfferRawEntity.created_at,
    });

    const updatedIsHidden = Generator.boolean();
    const updatedName = Generator.jobOfferName();
    const updatedDescription = Generator.jobOfferDescription();
    const updatedCategory = await categoryTestUtils.createAndPersist();

    const { jobOffer: updatedJobOffer } = await action.execute({
      id: jobOffer.getId(),
      name: updatedName,
      description: updatedDescription,
      isHidden: updatedIsHidden,
      categoryId: updatedCategory.id,
    });

    const foundJobOffer = await jobOfferTestUtils.findById({ id: jobOffer.getId() });

    expect(updatedJobOffer.getState()).toEqual({
      name: updatedName,
      description: updatedDescription,
      isHidden: updatedIsHidden,
      categoryId: updatedCategory.id,
      companyId: jobOfferRawEntity.company_id,
      createdAt: jobOfferRawEntity.created_at,
      category: { name: updatedCategory.name },
      company: { name: company.name, logoUrl: company.logo_url },
    });

    expect(foundJobOffer).toEqual({
      id: jobOfferRawEntity.id,
      name: updatedName,
      description: updatedDescription,
      is_hidden: updatedIsHidden,
      category_id: updatedCategory.id,
      company_id: jobOfferRawEntity.company_id,
      created_at: jobOfferRawEntity.created_at,
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
    const jobOfferRawEntity = await jobOfferTestUtils.createAndPersist({
      input: { category_id: category.id, company_id: company.id },
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
});
