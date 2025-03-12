import { beforeEach, expect, describe, it } from 'vitest';

import { Generator } from '../../../../../../../tests/generator.ts';
import type { BlacklistTokenRawEntity } from '../../../../../databaseModule/infrastructure/tables/blacklistTokensTable/blacklistTokenRawEntity.ts';

import { BlacklistTokenMapper } from './blacklistTokenMapper.ts';

describe('BlacklistTokenMapper', () => {
  let mapper: BlacklistTokenMapper;

  beforeEach(async () => {
    mapper = new BlacklistTokenMapper();
  });

  it('maps from BlacklistTokenRawEntity to BlacklistToken', async () => {
    const blacklistTokenEntity: BlacklistTokenRawEntity = {
      id: Generator.uuid(),
      token: Generator.alphaString(32),
      expires_at: Generator.futureDate(),
    };

    const blacklistToken = mapper.mapToDomain(blacklistTokenEntity);

    expect(blacklistToken).toEqual({
      id: blacklistTokenEntity.id,
      token: blacklistTokenEntity.token,
      expiresAt: blacklistTokenEntity.expires_at,
    });
  });
});
