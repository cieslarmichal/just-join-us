import { TestUtils } from '../../../../../../tests/testUtils.ts';
import { companiesTable } from '../../../../databaseModule/infrastructure/tables/companiesTable/companiesTable.ts';
import type {
  CompanyRawEntity,
  CompanyRawEntityExtended,
} from '../../../../databaseModule/infrastructure/tables/companiesTable/companyRawEntity.ts';
import type { UserRawEntity } from '../../../../databaseModule/infrastructure/tables/usersTable/userRawEntity.ts';
import { usersTable } from '../../../../databaseModule/infrastructure/tables/usersTable/usersTable.ts';
import type { DatabaseClient } from '../../../../databaseModule/types/databaseClient.ts';
import { CompanyTestFactory } from '../../factories/companyTestFactory/companyTestFactory.ts';
import { UserTestFactory } from '../../factories/userTestFactory/userTestFactory.ts';

interface CreateAndPersistPayload {
  readonly companyInput?: Partial<CompanyRawEntity>;
  readonly userInput?: Partial<UserRawEntity>;
}

interface FindByIdPayload {
  readonly id: string;
}

interface FindByNamePayload {
  readonly name: string;
}

export class CompanyTestUtils extends TestUtils {
  private readonly userTestFactory = new UserTestFactory();
  private readonly companyTestFactory = new CompanyTestFactory();

  public constructor(databaseClient: DatabaseClient) {
    super(databaseClient, usersTable.name);
  }

  public async createAndPersist(payload: CreateAndPersistPayload = {}): Promise<CompanyRawEntityExtended> {
    const { companyInput, userInput } = payload;

    const user = this.userTestFactory.createRaw({
      ...userInput,
      role: 'company',
    });

    const company = this.companyTestFactory.createRaw({
      ...companyInput,
      id: user.id,
    });

    await this.databaseClient.transaction(async (transaction) => {
      await transaction<UserRawEntity>(usersTable.name).insert(user);

      await transaction<CompanyRawEntity>(companiesTable.name).insert(company);
    });

    return this.findById({ id: user.id }) as Promise<CompanyRawEntityExtended>;
  }

  public async findById(payload: FindByIdPayload): Promise<CompanyRawEntityExtended | undefined> {
    const { id } = payload;

    const rawEntity = await this.databaseClient(companiesTable.name)
      .select([
        usersTable.allColumns,
        companiesTable.columns.name,
        companiesTable.columns.phone_number,
        companiesTable.columns.tax_id_number,
        companiesTable.columns.logo_url,
        companiesTable.columns.is_verified,
      ])
      .join(usersTable.name, companiesTable.columns.id, '=', usersTable.columns.id)
      .where(usersTable.columns.id, id)
      .first();

    if (!rawEntity) {
      return undefined;
    }

    return rawEntity as CompanyRawEntityExtended;
  }

  public async findByName(payload: FindByNamePayload): Promise<CompanyRawEntityExtended | undefined> {
    const { name } = payload;

    const rawEntity = await this.databaseClient(companiesTable.name)
      .select([
        usersTable.allColumns,
        companiesTable.columns.name,
        companiesTable.columns.phone_number,
        companiesTable.columns.tax_id_number,
        companiesTable.columns.logo_url,
        companiesTable.columns.is_verified,
      ])
      .join(usersTable.name, companiesTable.columns.id, '=', usersTable.columns.id)
      .where(companiesTable.columns.name, name)
      .first();

    if (!rawEntity) {
      return undefined;
    }

    return rawEntity as CompanyRawEntityExtended;
  }
}
