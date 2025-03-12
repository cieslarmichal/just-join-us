import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { Generator } from '../../../../../../tests/generator.ts';
import { testSymbols } from '../../../../../../tests/symbols.ts';
import { TestContainer } from '../../../../../../tests/testContainer.ts';
import { OperationNotValidError } from '../../../../../common/errors/operationNotValidError.ts';
import { tokenTypes } from '../../../../../common/types/tokenType.ts';
import { type TokenService } from '../../../../authModule/application/services/tokenService/tokenService.ts';
import { authSymbols } from '../../../../authModule/symbols.ts';
import { databaseSymbols } from '../../../../databaseModule/symbols.ts';
import type { DatabaseClient } from '../../../../databaseModule/types/databaseClient.ts';
import { symbols } from '../../../symbols.ts';
import { type BlacklistTokenTestUtils } from '../../../tests/utils/blacklistTokenTestUtils/blacklistTokenTestUtils.ts';
import { type UserTestUtils } from '../../../tests/utils/userTestUtils/userTestUtils.ts';

import { type LogoutUserAction } from './logoutUserAction.ts';

describe('LogoutUserActionImpl', () => {
  let action: LogoutUserAction;

  let databaseClient: DatabaseClient;

  let tokenService: TokenService;

  let userTestUtils: UserTestUtils;

  let blacklistTokenTestUtils: BlacklistTokenTestUtils;

  beforeEach(async () => {
    const container = await TestContainer.create();

    action = container.get<LogoutUserAction>(symbols.logoutUserAction);

    databaseClient = container.get<DatabaseClient>(databaseSymbols.databaseClient);

    tokenService = container.get<TokenService>(authSymbols.tokenService);

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

  it('logs user out', async () => {
    const refreshToken = tokenService.createToken({
      data: {
        type: tokenTypes.refresh,
      },
      expiresIn: Generator.number(10000, 100000),
    });

    const accessToken = tokenService.createToken({
      data: {
        type: tokenTypes.access,
      },
      expiresIn: Generator.number(10000, 100000),
    });

    const user = await userTestUtils.createAndPersist();

    await action.execute({
      userId: user.id,
      refreshToken,
      accessToken,
    });

    const blacklistRefreshToken = await blacklistTokenTestUtils.findByToken({
      token: refreshToken,
    });

    expect(blacklistRefreshToken.token).toEqual(refreshToken);

    const blacklistAccessToken = await blacklistTokenTestUtils.findByToken({
      token: accessToken,
    });

    expect(blacklistAccessToken.token).toEqual(accessToken);
  });

  it('throws an error - when a User with given id not found', async () => {
    const refreshToken = tokenService.createToken({
      data: {
        type: tokenTypes.refresh,
      },
      expiresIn: Generator.number(10000, 100000),
    });

    const accessToken = tokenService.createToken({
      data: {
        type: tokenTypes.access,
      },
      expiresIn: Generator.number(10000, 100000),
    });

    const userId = Generator.uuid();

    try {
      await action.execute({
        userId,
        refreshToken,
        accessToken,
      });
    } catch (error) {
      expect(error).toBeInstanceOf(OperationNotValidError);

      expect((error as OperationNotValidError).context).toMatchObject({
        reason: 'User not found.',
        userId,
      });

      return;
    }

    expect.fail();
  });

  it('throws an error - when RefreshToken is of different purpose', async () => {
    const user = await userTestUtils.createAndPersist();

    const invalidRefreshToken = tokenService.createToken({
      data: {
        invalid: 'true',
        userId: user.id,
        type: tokenTypes.emailVerification,
      },
      expiresIn: Generator.number(10000, 100000),
    });

    const accessToken = tokenService.createToken({
      data: {
        type: tokenTypes.access,
      },
      expiresIn: Generator.number(10000, 100000),
    });

    try {
      await action.execute({
        userId: user.id,
        refreshToken: invalidRefreshToken,
        accessToken,
      });
    } catch (error) {
      expect(error).toBeInstanceOf(OperationNotValidError);

      expect((error as OperationNotValidError).context).toMatchObject({
        reason: 'Invalid refresh token.',
      });

      return;
    }

    expect.fail();
  });

  it('throws an error - when AccessToken is of different purpose', async () => {
    const user = await userTestUtils.createAndPersist();

    const refreshToken = tokenService.createToken({
      data: {
        type: tokenTypes.refresh,
      },
      expiresIn: Generator.number(10000, 100000),
    });

    const invalidAccessToken = tokenService.createToken({
      data: {
        invalid: 'true',
        userId: user.id,
        type: tokenTypes.emailVerification,
      },
      expiresIn: Generator.number(10000, 100000),
    });

    try {
      await action.execute({
        userId: user.id,
        refreshToken,
        accessToken: invalidAccessToken,
      });
    } catch (error) {
      expect(error).toBeInstanceOf(OperationNotValidError);

      expect((error as OperationNotValidError).context).toMatchObject({
        reason: 'Invalid access token.',
      });

      return;
    }

    expect.fail();
  });
});
