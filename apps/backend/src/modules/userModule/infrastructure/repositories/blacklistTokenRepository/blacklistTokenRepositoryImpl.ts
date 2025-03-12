import { RepositoryError } from '../../../../../common/errors/repositoryError.ts';
import { type UuidService } from '../../../../../common/uuid/uuidService.ts';
import type { BlacklistTokenRawEntity } from '../../../../databaseModule/infrastructure/tables/blacklistTokensTable/blacklistTokenRawEntity.ts';
import { blacklistTokensTable } from '../../../../databaseModule/infrastructure/tables/blacklistTokensTable/blacklistTokensTable.ts';
import type { DatabaseClient } from '../../../../databaseModule/types/databaseClient.ts';
import { type BlacklistToken } from '../../../domain/entities/blacklistToken/blacklistToken.ts';
import {
  type BlacklistTokenRepository,
  type CreateBlacklistTokenPayload,
  type FindBlacklistTokenPayload,
} from '../../../domain/repositories/blacklistTokenRepository/blacklistTokenRepository.ts';

import { type BlacklistTokenMapper } from './blacklistTokenMapper/blacklistTokenMapper.ts';

export class BlacklistTokenRepositoryImpl implements BlacklistTokenRepository {
  private readonly databaseClient: DatabaseClient;
  private readonly blacklistTokenMapper: BlacklistTokenMapper;
  private readonly uuidService: UuidService;

  public constructor(
    databaseClient: DatabaseClient,
    blacklistTokenMapper: BlacklistTokenMapper,
    uuidService: UuidService,
  ) {
    this.databaseClient = databaseClient;
    this.blacklistTokenMapper = blacklistTokenMapper;
    this.uuidService = uuidService;
  }

  public async createBlacklistToken(payload: CreateBlacklistTokenPayload): Promise<BlacklistToken> {
    const { token, expiresAt } = payload;

    let rawEntities: BlacklistTokenRawEntity[];

    try {
      rawEntities = await this.databaseClient<BlacklistTokenRawEntity>(blacklistTokensTable.name).insert(
        {
          id: this.uuidService.generateUuid(),
          token,
          expires_at: expiresAt,
        },
        '*',
      );
    } catch (error) {
      throw new RepositoryError({
        entity: 'BlacklistToken',
        operation: 'create',
        originalError: error,
      });
    }

    const rawEntity = rawEntities[0] as BlacklistTokenRawEntity;

    return this.blacklistTokenMapper.mapToDomain(rawEntity);
  }

  public async findBlacklistToken(payload: FindBlacklistTokenPayload): Promise<BlacklistToken | null> {
    const { token } = payload;

    let rawEntity: BlacklistTokenRawEntity | undefined;

    try {
      rawEntity = await this.databaseClient<BlacklistTokenRawEntity>(blacklistTokensTable.name)
        .select('*')
        .where({ token })
        .first();
    } catch (error) {
      throw new RepositoryError({
        entity: 'BlacklistToken',
        operation: 'find',
        originalError: error,
      });
    }

    if (!rawEntity) {
      return null;
    }

    return this.blacklistTokenMapper.mapToDomain(rawEntity);
  }
}
