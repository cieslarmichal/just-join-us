import { beforeEach, afterEach, expect, describe, it } from 'vitest';

import { TestContainer } from '../../../../../../tests/testContainer.ts';
import { RepositoryError } from '../../../../../common/errors/repositoryError.ts';
import { databaseSymbols } from '../../../../databaseModule/symbols.ts';
import type { DatabaseClient } from '../../../../databaseModule/types/databaseClient.ts';
import { type BlacklistTokenRepository } from '../../../domain/repositories/blacklistTokenRepository/blacklistTokenRepository.ts';
import { symbols } from '../../../symbols.ts';
import { BlacklistTokenTestFactory } from '../../../tests/factories/blacklistTokenTestFactory/blacklistTokenTestFactory.ts';
import { BlacklistTokenTestUtils } from '../../../tests/utils/blacklistTokenTestUtils/blacklistTokenTestUtils.ts';

describe('BlacklistTokenRepositoryImpl', () => {
  let blacklistTokenRepository: BlacklistTokenRepository;

  let databaseClient: DatabaseClient;

  let blacklistTokenTestUtils: BlacklistTokenTestUtils;

  const blacklistTokenTestFactory = new BlacklistTokenTestFactory();

  beforeEach(async () => {
    const container = await TestContainer.create();

    blacklistTokenRepository = container.get<BlacklistTokenRepository>(symbols.blacklistTokenRepository);

    databaseClient = container.get<DatabaseClient>(databaseSymbols.databaseClient);

    blacklistTokenTestUtils = new BlacklistTokenTestUtils(databaseClient);

    await blacklistTokenTestUtils.truncate();
  });

  afterEach(async () => {
    await blacklistTokenTestUtils.truncate();

    await databaseClient.destroy();
  });

  describe('Create', () => {
    it('creates a BlacklistToken', async () => {
      const createdBlacklistToken = blacklistTokenTestFactory.create();

      const token = createdBlacklistToken.getToken();

      const expiresAt = createdBlacklistToken.getExpiresAt();

      const blacklistToken = await blacklistTokenRepository.createBlacklistToken({
        token,
        expiresAt,
      });

      const foundBlacklistToken = await blacklistTokenTestUtils.findByToken({ token });

      expect(blacklistToken.getToken()).toEqual(token);

      expect(blacklistToken.getExpiresAt()).toEqual(expiresAt);

      expect(foundBlacklistToken).toEqual({
        id: blacklistToken.getId(),
        token,
        expires_at: expiresAt,
      });
    });

    it('throws an error when a BlacklistToken with the same email already exists', async () => {
      const existingBlacklistToken = await blacklistTokenTestUtils.createAndPersist();

      try {
        await blacklistTokenRepository.createBlacklistToken({
          token: existingBlacklistToken.token,
          expiresAt: existingBlacklistToken.expires_at,
        });
      } catch (error) {
        expect(error).toBeInstanceOf(RepositoryError);

        return;
      }

      expect.fail();
    });
  });

  describe('Find', () => {
    it('finds a BlacklistToken by token', async () => {
      const blacklistToken = await blacklistTokenTestUtils.createAndPersist();

      const foundBlacklistToken = await blacklistTokenRepository.findBlacklistToken({ token: blacklistToken.token });

      expect(foundBlacklistToken).not.toBeNull();
    });

    it('returns null if a BlacklistToken with given token does not exist', async () => {
      const createdBlacklistToken = blacklistTokenTestFactory.create();

      const blacklistToken = await blacklistTokenRepository.findBlacklistToken({
        token: createdBlacklistToken.getToken(),
      });

      expect(blacklistToken).toBeNull();
    });
  });
});
