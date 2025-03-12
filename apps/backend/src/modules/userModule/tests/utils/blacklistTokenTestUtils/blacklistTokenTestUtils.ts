import { TestUtils } from '../../../../../../tests/testUtils.ts';
import type { BlacklistTokenRawEntity } from '../../../../databaseModule/infrastructure/tables/blacklistTokensTable/blacklistTokenRawEntity.ts';
import { blacklistTokensTable } from '../../../../databaseModule/infrastructure/tables/blacklistTokensTable/blacklistTokensTable.ts';
import type { DatabaseClient } from '../../../../databaseModule/types/databaseClient.ts';
import { BlacklistTokenTestFactory } from '../../factories/blacklistTokenTestFactory/blacklistTokenTestFactory.ts';

interface CreateAndPersistPayload {
  readonly input?: Partial<BlacklistTokenRawEntity>;
}

interface FindByTokenPayload {
  readonly token: string;
}

export class BlacklistTokenTestUtils extends TestUtils {
  private readonly blacklistTokenTestFactory = new BlacklistTokenTestFactory();

  public constructor(databaseClient: DatabaseClient) {
    super(databaseClient, blacklistTokensTable.name);
  }

  public async createAndPersist(payload: CreateAndPersistPayload = {}): Promise<BlacklistTokenRawEntity> {
    const { input } = payload;

    const blacklistToken = this.blacklistTokenTestFactory.create(input);

    const rawEntities = await this.databaseClient<BlacklistTokenRawEntity>(blacklistTokensTable.name).insert(
      {
        id: blacklistToken.getId(),
        token: blacklistToken.getToken(),
        expires_at: blacklistToken.getExpiresAt(),
      },
      '*',
    );

    const rawEntity = rawEntities[0] as BlacklistTokenRawEntity;

    return rawEntity;
  }

  public async findByToken(payload: FindByTokenPayload): Promise<BlacklistTokenRawEntity> {
    const { token } = payload;

    const rawEntity = await this.databaseClient<BlacklistTokenRawEntity>(blacklistTokensTable.name)
      .select('*')
      .where({ token })
      .first();

    return rawEntity as BlacklistTokenRawEntity;
  }
}
