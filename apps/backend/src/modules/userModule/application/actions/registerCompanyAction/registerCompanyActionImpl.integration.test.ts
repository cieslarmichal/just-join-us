import { beforeEach, afterEach, expect, it, describe } from 'vitest';

import { testSymbols } from '../../../../../../tests/symbols.ts';
import { TestContainer } from '../../../../../../tests/testContainer.ts';
import { OperationNotValidError } from '../../../../../common/errors/operationNotValidError.ts';
import { ResourceAlreadyExistsError } from '../../../../../common/errors/resourceAlreadyExistsError.ts';
import { userRoles } from '../../../../../common/types/userRole.ts';
import { databaseSymbols } from '../../../../databaseModule/symbols.ts';
import type { DatabaseClient } from '../../../../databaseModule/types/databaseClient.ts';
import { symbols } from '../../../symbols.ts';
import { CompanyTestFactory } from '../../../tests/factories/companyTestFactory/companyTestFactory.ts';
import { type CompanyTestUtils } from '../../../tests/utils/companyTestUtils/companyTestUtils.ts';

import { type RegisterCompanyAction } from './registerCompanyAction.ts';

describe('RegisterCompanyAction', () => {
  let action: RegisterCompanyAction;

  let databaseClient: DatabaseClient;

  let companyTestUtils: CompanyTestUtils;

  const companyTestFactory = new CompanyTestFactory();

  beforeEach(async () => {
    const container = await TestContainer.create();

    action = container.get<RegisterCompanyAction>(symbols.registerCompanyAction);

    databaseClient = container.get<DatabaseClient>(databaseSymbols.databaseClient);

    companyTestUtils = container.get<CompanyTestUtils>(testSymbols.companyTestUtils);

    await companyTestUtils.truncate();
  });

  afterEach(async () => {
    await companyTestUtils.truncate();

    await databaseClient.destroy();
  });

  it('creates a Company', async () => {
    const company = companyTestFactory.create();

    const { company: createdCompany } = await action.execute({
      email: company.getEmail(),
      password: company.getPassword(),
      name: company.getName(),
      phone: company.getPhone(),
      taxId: company.getTaxId(),
      logoUrl: company.getLogoUrl(),
    });

    const foundCompany = await companyTestUtils.findByName({ name: company.getName() });

    expect(createdCompany.getState()).toEqual({
      email: company.getEmail(),
      password: expect.any(String),
      isEmailVerified: false,
      isDeleted: false,
      role: userRoles.company,
      name: company.getName(),
      phone: company.getPhone(),
      taxId: company.getTaxId(),
      isVerified: false,
      createdAt: expect.any(Date),
      logoUrl: company.getLogoUrl(),
    });

    expect(foundCompany).toEqual({
      id: createdCompany.getId(),
      email: company.getEmail(),
      password: expect.any(String),
      is_email_verified: false,
      is_deleted: false,
      role: userRoles.company,
      name: company.getName(),
      phone: company.getPhone(),
      tax_id: company.getTaxId(),
      is_verified: false,
      logo_url: company.getLogoUrl(),
      created_at: expect.any(Date),
    });
  });

  it('throws an error when a Company with the same email already exists', async () => {
    const existingCompany = await companyTestUtils.createAndPersist();

    const company = companyTestFactory.create();

    try {
      await action.execute({
        email: existingCompany.email,
        password: company.getPassword(),
        name: company.getName(),
        phone: company.getPhone(),
        taxId: company.getTaxId(),
        logoUrl: company.getLogoUrl(),
      });
    } catch (error) {
      expect(error).toBeInstanceOf(ResourceAlreadyExistsError);

      expect((error as ResourceAlreadyExistsError).context).toEqual({
        resource: 'Company',
        email: existingCompany.email,
      });

      return;
    }

    expect.fail();
  });

  it('throws an error when password does not meet requirements', async () => {
    const company = companyTestFactory.create();

    try {
      await action.execute({
        email: company.getEmail(),
        password: '123',
        name: company.getName(),
        phone: company.getPhone(),
        taxId: company.getTaxId(),
        logoUrl: company.getLogoUrl(),
      });
    } catch (error) {
      expect(error).toBeInstanceOf(OperationNotValidError);

      return;
    }

    expect.fail();
  });
});
