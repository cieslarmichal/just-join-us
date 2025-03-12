import { beforeEach, expect, it, describe, afterEach } from 'vitest';

import { Generator } from '../../../../../../tests/generator.ts';
import { testSymbols } from '../../../../../../tests/symbols.ts';
import { TestContainer } from '../../../../../../tests/testContainer.ts';
import { OperationNotValidError } from '../../../../../common/errors/operationNotValidError.ts';
import { tokenTypes } from '../../../../../common/types/tokenType.ts';
import { type Config } from '../../../../../core/config.ts';
import { applicationSymbols } from '../../../../applicationModule/symbols.ts';
import { type TokenService } from '../../../../authModule/application/services/tokenService/tokenService.ts';
import { authSymbols } from '../../../../authModule/symbols.ts';
import { databaseSymbols } from '../../../../databaseModule/symbols.ts';
import type { DatabaseClient } from '../../../../databaseModule/types/databaseClient.ts';
import { symbols } from '../../../symbols.ts';
import { type BlacklistTokenTestUtils } from '../../../tests/utils/blacklistTokenTestUtils/blacklistTokenTestUtils.ts';
import { type UserTestUtils } from '../../../tests/utils/userTestUtils/userTestUtils.ts';

import { type RefreshUserTokensAction } from './refreshUserTokensAction.ts';

describe('RefreshUserTokensAction', () => {
  let action: RefreshUserTokensAction;

  let databaseClient: DatabaseClient;

  let userTestUtils: UserTestUtils;

  let blacklistTokenTestUtils: BlacklistTokenTestUtils;

  let tokenService: TokenService;

  let config: Config;

  beforeEach(async () => {
    const container = await TestContainer.create();

    action = container.get<RefreshUserTokensAction>(symbols.refreshUserTokensAction);

    tokenService = container.get<TokenService>(authSymbols.tokenService);

    config = container.get<Config>(applicationSymbols.config);

    databaseClient = container.get<DatabaseClient>(databaseSymbols.databaseClient);

    userTestUtils = container.get<UserTestUtils>(testSymbols.userTestUtils);

    blacklistTokenTestUtils = container.get<BlacklistTokenTestUtils>(testSymbols.blacklistTokenTestUtils);

    await userTestUtils.truncate();

    await blacklistTokenTestUtils.truncate();
  });

  afterEach(async () => {
    await userTestUtils.truncate();

    await blacklistTokenTestUtils.truncate();

    await databaseClient.destroy();
  });

  it('returns new access token', async () => {
    const user = await userTestUtils.createAndPersist();

    const refreshToken = tokenService.createToken({
      data: {
        userId: user.id,
        type: tokenTypes.refresh,
      },
      expiresIn: Generator.number(10000, 100000),
    });

    const result = await action.execute({
      refreshToken,
    });

    const accessTokenPayload = tokenService.verifyToken({ token: result.accessToken });

    const refreshTokenPayload = tokenService.verifyToken({ token: result.refreshToken });

    expect(accessTokenPayload['userId']).toBe(user.id);

    expect(refreshTokenPayload['userId']).toBe(user.id);

    expect(result.accessTokenExpiresIn).toBe(config.token.access.expiresIn);
  });

  it('throws an error if User does not exist', async () => {
    const userId = Generator.uuid();

    const refreshToken = tokenService.createToken({
      data: {
        userId,
        type: tokenTypes.refresh,
      },
      expiresIn: Generator.number(10000, 100000),
    });

    try {
      await action.execute({
        refreshToken,
      });
    } catch (error) {
      expect(error).toBeInstanceOf(OperationNotValidError);

      expect((error as OperationNotValidError).context).toEqual({
        reason: 'User not found.',
        id: userId,
      });

      return;
    }

    expect.fail();
  });

  it('throws an error if User is blocked', async () => {
    const user = await userTestUtils.createAndPersist({ input: { is_deleted: true } });

    const refreshToken = tokenService.createToken({
      data: {
        userId: user.id,
        type: tokenTypes.refresh,
      },
      expiresIn: Generator.number(10000, 100000),
    });

    try {
      await action.execute({
        refreshToken,
      });
    } catch (error) {
      expect(error).toBeInstanceOf(OperationNotValidError);

      expect((error as OperationNotValidError).context).toEqual({
        reason: 'User is blocked.',
        id: user.id,
      });

      return;
    }

    expect.fail();
  });

  it('throws an error - when token has a different purpose', async () => {
    const user = await userTestUtils.createAndPersist();

    const refreshToken = tokenService.createToken({
      data: {
        userId: user.id,
        type: tokenTypes.passwordReset,
      },
      expiresIn: Generator.number(10000, 100000),
    });

    try {
      await action.execute({
        refreshToken,
      });
    } catch (error) {
      expect(error).toBeInstanceOf(OperationNotValidError);

      expect((error as OperationNotValidError).context).toEqual({
        reason: 'Token type is not refresh token.',
      });

      return;
    }

    expect.fail();
  });

  it('throws an error if refresh token does not contain userId', async () => {
    const refreshToken = tokenService.createToken({
      data: {
        type: tokenTypes.refresh,
      },
      expiresIn: Generator.number(10000, 100000),
    });

    try {
      await action.execute({
        refreshToken,
      });
    } catch (error) {
      expect(error).toBeInstanceOf(OperationNotValidError);

      expect((error as OperationNotValidError).context).toEqual({
        reason: 'Refresh token does not contain userId.',
      });

      return;
    }

    expect.fail();
  });

  it('throws an error if refresh token is blacklisted', async () => {
    const user = await userTestUtils.createAndPersist();

    const refreshToken = tokenService.createToken({
      data: { userId: user.id },
      expiresIn: Generator.number(10000, 100000),
    });

    await blacklistTokenTestUtils.createAndPersist({ input: { token: refreshToken } });

    try {
      await action.execute({
        refreshToken,
      });
    } catch (error) {
      expect(error).toBeInstanceOf(OperationNotValidError);

      expect((error as OperationNotValidError).context).toEqual({
        reason: 'Refresh token is blacklisted.',
      });

      return;
    }

    expect.fail();
  });
});
