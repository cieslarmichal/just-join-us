import { beforeEach, afterEach, expect, it, describe } from 'vitest';

import { Generator } from '../../../../../../tests/generator.ts';
import { testSymbols } from '../../../../../../tests/symbols.ts';
import { TestContainer } from '../../../../../../tests/testContainer.ts';
import { ForbiddenAccessError } from '../../../../../common/errors/forbiddenAccessError.ts';
import { UnauthorizedAccessError } from '../../../../../common/errors/unathorizedAccessError.ts';
import { type TokenService } from '../../../../authModule/application/services/tokenService/tokenService.ts';
import { authSymbols } from '../../../../authModule/symbols.ts';
import { databaseSymbols } from '../../../../databaseModule/symbols.ts';
import type { DatabaseClient } from '../../../../databaseModule/types/databaseClient.ts';
import { symbols } from '../../../symbols.ts';
import { UserTestFactory } from '../../../tests/factories/userTestFactory/userTestFactory.ts';
import { type UserTestUtils } from '../../../tests/utils/userTestUtils/userTestUtils.ts';
import { type HashService } from '../../services/hashService/hashService.ts';

import { type LoginUserAction } from './loginUserAction.ts';

describe('LoginUserAction', () => {
  let action: LoginUserAction;

  let databaseClient: DatabaseClient;

  let userTestUtils: UserTestUtils;

  let tokenService: TokenService;

  let hashService: HashService;

  const userTestFactory = new UserTestFactory();

  beforeEach(async () => {
    const container = await TestContainer.create();

    action = container.get<LoginUserAction>(symbols.loginUserAction);

    tokenService = container.get<TokenService>(authSymbols.tokenService);

    hashService = container.get<HashService>(symbols.hashService);

    databaseClient = container.get<DatabaseClient>(databaseSymbols.databaseClient);

    userTestUtils = container.get<UserTestUtils>(testSymbols.userTestUtils);

    await userTestUtils.truncate();
  });

  afterEach(async () => {
    await userTestUtils.truncate();

    await databaseClient.destroy();
  });

  it('returns tokens', async () => {
    const password = Generator.password();

    const hashedPassword = await hashService.hash({ plainData: password });

    const createdUser = await userTestUtils.createAndPersist({
      input: {
        is_email_verified: true,
        password: hashedPassword,
      },
    });

    const { accessToken, refreshToken } = await action.execute({
      email: createdUser.email,
      password,
    });

    const accessTokenPayload = tokenService.verifyToken({ token: accessToken });

    const refreshTokenPayload = tokenService.verifyToken({ token: refreshToken });

    expect(accessTokenPayload['userId']).toBe(createdUser.id);

    expect(accessTokenPayload['role']).toBe(createdUser.role);

    expect(refreshTokenPayload['userId']).toBe(createdUser.id);
  });

  it('throws an error if User email is not verified', async () => {
    const password = Generator.password();

    const hashedPassword = await hashService.hash({ plainData: password });

    const createdUser = await userTestUtils.createAndPersist({
      input: {
        password: hashedPassword,
        is_email_verified: false,
      },
    });

    try {
      await action.execute({
        email: createdUser.email,
        password,
      });
    } catch (error) {
      expect(error).toBeInstanceOf(ForbiddenAccessError);

      expect((error as ForbiddenAccessError).context).toMatchObject({
        reason: 'User email is not verified.',
        email: createdUser.email,
      });

      return;
    }

    expect.fail();
  });

  it('throws an error if User is deleted', async () => {
    const password = Generator.password();

    const hashedPassword = await hashService.hash({ plainData: password });

    const createdUser = await userTestUtils.createAndPersist({
      input: {
        password: hashedPassword,
        is_deleted: true,
        is_email_verified: true,
      },
    });

    try {
      await action.execute({
        email: createdUser.email,
        password,
      });
    } catch (error) {
      expect(error).toBeInstanceOf(ForbiddenAccessError);

      expect((error as ForbiddenAccessError).context).toMatchObject({
        reason: 'User is deleted.',
        email: createdUser.email,
      });

      return;
    }

    expect.fail();
  });

  it('throws an error if a User with given email does not exist', async () => {
    const nonExistentUser = userTestFactory.create();

    try {
      await action.execute({
        email: nonExistentUser.getEmail(),
        password: nonExistentUser.getPassword(),
      });
    } catch (error) {
      expect(error).toBeInstanceOf(UnauthorizedAccessError);

      expect((error as UnauthorizedAccessError).context).toMatchObject({
        reason: 'Invalid credentials.',
        email: nonExistentUser.getEmail(),
      });

      return;
    }

    expect.fail();
  });

  it(`throws an error if User's password does not match stored password`, async () => {
    const { email, password } = await userTestUtils.createAndPersist({ input: { is_email_verified: true } });

    try {
      await action.execute({
        email,
        password,
      });
    } catch (error) {
      expect(error).toBeInstanceOf(UnauthorizedAccessError);

      expect((error as UnauthorizedAccessError).context).toMatchObject({
        reason: 'Invalid credentials.',
        email,
      });

      return;
    }

    expect.fail();
  });
});
