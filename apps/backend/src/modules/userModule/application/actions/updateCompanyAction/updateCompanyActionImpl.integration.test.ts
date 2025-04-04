import { beforeEach, describe, expect, it, afterEach } from 'vitest';

import { Generator } from '../../../../../../tests/generator.ts';
import { testSymbols } from '../../../../../../tests/symbols.ts';
import { TestContainer } from '../../../../../../tests/testContainer.ts';
import { OperationNotValidError } from '../../../../../common/errors/operationNotValidError.ts';
import { databaseSymbols } from '../../../../databaseModule/symbols.ts';
import type { DatabaseClient } from '../../../../databaseModule/types/databaseClient.ts';
import { symbols } from '../../../symbols.ts';
import { type CompanyTestUtils } from '../../../tests/utils/companyTestUtils/companyTestUtils.ts';

import { type UpdateCompanyAction } from './updateCompanyAction.ts';

describe('UpdateCompanyActionImpl', () => {
  let action: UpdateCompanyAction;

  let databaseClient: DatabaseClient;

  let companyTestUtils: CompanyTestUtils;

  beforeEach(async () => {
    const container = await TestContainer.create();

    action = container.get<UpdateCompanyAction>(symbols.updateCompanyAction);

    databaseClient = container.get<DatabaseClient>(databaseSymbols.databaseClient);

    companyTestUtils = container.get<CompanyTestUtils>(testSymbols.companyTestUtils);

    await companyTestUtils.truncate();
  });

  afterEach(async () => {
    await companyTestUtils.truncate();

    await databaseClient.destroy();
  });

  it('updates company data', async () => {
    const company = await companyTestUtils.createAndPersist();

    const name = Generator.companyName();
    const description = Generator.companyDescription();
    const phone = Generator.phone();
    const logoUrl = Generator.imageUrl();
    const isDeleted = Generator.boolean();

    await action.execute({
      id: company.id,
      phone,
      isDeleted,
      logoUrl,
    });

    const updatedCompany = await companyTestUtils.findById({ id: company.id });

    expect(updatedCompany?.phone).toBe(phone);
    expect(updatedCompany?.is_deleted).toBe(isDeleted);
    expect(updatedCompany?.logo_url).toBe(logoUrl);
    expect(updatedCompany?.name).toBe(name);
    expect(updatedCompany?.description).toBe(description);
  });

  it('throws an error - when a Company with given id not found', async () => {
    const companyId = Generator.uuid();

    const phone = Generator.phone();

    try {
      await action.execute({
        id: companyId,
        phone,
      });
    } catch (error) {
      expect(error).toBeInstanceOf(OperationNotValidError);

      expect((error as OperationNotValidError).context).toMatchObject({
        reason: 'Company not found.',
        id: companyId,
      });

      return;
    }

    expect.fail();
  });
});
