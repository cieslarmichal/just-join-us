import type { BlacklistTokenRawEntity } from '../../../../../databaseModule/infrastructure/tables/blacklistTokensTable/blacklistTokenRawEntity.ts';
import { BlacklistToken } from '../../../../domain/entities/blacklistToken/blacklistToken.ts';

export class BlacklistTokenMapper {
  public mapToDomain(entity: BlacklistTokenRawEntity): BlacklistToken {
    const { id, token, expires_at: expiresAt } = entity;

    return new BlacklistToken({
      id,
      expiresAt,
      token,
    });
  }
}
