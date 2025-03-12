import { TestUtils } from '../../../../../../tests/testUtils.ts';
import type { UserRawEntity } from '../../../../databaseModule/infrastructure/tables/usersTable/userRawEntity.ts';
import { usersTable } from '../../../../databaseModule/infrastructure/tables/usersTable/usersTable.ts';
import type { DatabaseClient } from '../../../../databaseModule/types/databaseClient.ts';
import { UserTestFactory } from '../../factories/userTestFactory/userTestFactory.ts';

interface CreateAndPersistPayload {
  readonly input?: Partial<UserRawEntity>;
}

interface FindByEmailPayload {
  readonly email: string;
}

interface FindByIdPayload {
  readonly id: string;
}

export class UserTestUtils extends TestUtils {
  private readonly userTestFactory = new UserTestFactory();

  public constructor(databaseClient: DatabaseClient) {
    super(databaseClient, usersTable.name);
  }

  public async createAndPersist(payload: CreateAndPersistPayload = {}): Promise<UserRawEntity> {
    const { input } = payload;

    const user = this.userTestFactory.createRaw(input);

    const rawEntities = await this.databaseClient<UserRawEntity>(usersTable.name).insert(
      {
        id: user.id,
        email: user.email,
        password: user.password,
        is_email_verified: user.is_email_verified,
        is_deleted: user.is_deleted,
        role: user.role,
      },
      '*',
    );

    const rawEntity = rawEntities[0] as UserRawEntity;

    return rawEntity;
  }

  public async findByEmail(payload: FindByEmailPayload): Promise<UserRawEntity | undefined> {
    const { email: emailInput } = payload;

    const email = emailInput.toLowerCase();

    const rawEntity = await this.databaseClient<UserRawEntity>(usersTable.name).select('*').where({ email }).first();

    if (!rawEntity) {
      return undefined;
    }

    return rawEntity;
  }

  public async findById(payload: FindByIdPayload): Promise<UserRawEntity | undefined> {
    const { id } = payload;

    const rawEntity = await this.databaseClient<UserRawEntity>(usersTable.name).select('*').where({ id }).first();

    if (!rawEntity) {
      return undefined;
    }

    return rawEntity;
  }
}
