import { beforeEach, afterEach, expect, it, describe } from 'vitest';

import { testSymbols } from '../../../../../../tests/symbols.ts';
import { TestContainer } from '../../../../../../tests/testContainer.ts';
import { ResourceAlreadyExistsError } from '../../../../../common/errors/resourceAlreadyExistsError.ts';
import { databaseSymbols } from '../../../../databaseModule/symbols.ts';
import type { DatabaseClient } from '../../../../databaseModule/types/databaseClient.ts';
import type { CompanyTestUtils } from '../../../../userModule/tests/utils/companyTestUtils/companyTestUtils.ts';
import { symbols } from '../../../symbols.ts';
import type { CompanyLocationTestUtils } from '../../../tests/utils/companyLocationTestUtils/companyLocationTestUtils.ts';

import type { CreateRemoteCompanyLocationAction } from './createRemoteCompanyLocationAction.ts';

describe('CreateRemoteCompanyLocationAction', () => {
  let action: CreateRemoteCompanyLocationAction;

  let databaseClient: DatabaseClient;

  let companyTestUtils: CompanyTestUtils;
  let companyLocationTestUtils: CompanyLocationTestUtils;

  beforeEach(async () => {
    const container = await TestContainer.create();

    action = container.get<CreateRemoteCompanyLocationAction>(symbols.createRemoteCompanyLocationAction);

    databaseClient = container.get<DatabaseClient>(databaseSymbols.databaseClient);

    companyTestUtils = container.get<CompanyTestUtils>(testSymbols.companyTestUtils);
    companyLocationTestUtils = container.get<CompanyLocationTestUtils>(testSymbols.companyLocationTestUtils);

    await companyTestUtils.truncate();
    await companyLocationTestUtils.truncate();
  });

  afterEach(async () => {
    await companyTestUtils.truncate();
    await companyLocationTestUtils.truncate();

    await databaseClient.destroy();
  });

  it('creates a remote Location', async () => {
    const company = await companyTestUtils.createAndPersist();

    const locationName = 'Remote';

    const { companyLocation: createdLocation } = await action.execute({
      companyId: company.id,
      name: locationName,
    });

    const foundLocation = await companyLocationTestUtils.findByName({ name: locationName, companyId: company.id });

    expect(createdLocation.getState()).toEqual({
      name: locationName,
      companyId: company.id,
      isRemote: true,
    });

    expect(foundLocation).toEqual({
      id: createdLocation.getId(),
      name: locationName,
      company_id: company.id,
      is_remote: true,
      address: null,
      city_id: null,
      latitude: null,
      longitude: null,
    });
  });

  it('throws an error when a remote Location already exists', async () => {
    const company = await companyTestUtils.createAndPersist();

    const existingLocation = await companyLocationTestUtils.createAndPersist({
      input: { company_id: company.id, name: 'Remote' },
    });

    const locationName = 'Remote2';

    try {
      await action.execute({ companyId: existingLocation.company_id, name: locationName });
    } catch (error) {
      expect(error).toBeInstanceOf(ResourceAlreadyExistsError);

      expect((error as ResourceAlreadyExistsError).context).toEqual({
        resource: 'RemoteLocation',
        id: existingLocation.id,
        companyId: existingLocation.company_id,
      });

      return;
    }

    expect.fail();
  });
});
