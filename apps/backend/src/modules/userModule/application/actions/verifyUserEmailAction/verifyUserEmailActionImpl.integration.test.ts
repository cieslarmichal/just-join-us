import { beforeEach, describe, expect, it, afterEach } from 'vitest';

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
import { type UserTestUtils } from '../../../tests/utils/userTestUtils/userTestUtils.ts';

import { type VerifyUserEmailAction } from './verifyUserEmailAction.ts';

describe('VerifyUserEmailActionImpl', () => {
  let action: VerifyUserEmailAction;

  let databaseClient: DatabaseClient;

  let tokenService: TokenService;

  let userTestUtils: UserTestUtils;

  beforeEach(async () => {
    const container = await TestContainer.create();

    action = container.get<VerifyUserEmailAction>(symbols.verifyUserEmailAction);

    databaseClient = container.get<DatabaseClient>(databaseSymbols.databaseClient);

    tokenService = container.get<TokenService>(authSymbols.tokenService);

    userTestUtils = container.get<UserTestUtils>(testSymbols.userTestUtils);

    await userTestUtils.truncate();
  });

  afterEach(async () => {
    await userTestUtils.truncate();

    await databaseClient.destroy();
  });

  it('verifies user email', async () => {
    const user = await userTestUtils.createAndPersist({ input: { is_email_verified: false } });

    const emailVerificationToken = tokenService.createToken({
      data: {
        userId: user.id,
        type: tokenTypes.emailVerification,
      },
      expiresIn: Generator.number(10000, 100000),
    });

    await action.execute({ emailVerificationToken });

    const updatedUser = await userTestUtils.findById({
      id: user.id,
    });

    expect(updatedUser?.is_email_verified).toBe(true);
  });

  it('throws an error - when a User with given id not found', async () => {
    const userId = Generator.uuid();

    const emailVerificationToken = tokenService.createToken({
      data: {
        userId,
        type: tokenTypes.emailVerification,
      },
      expiresIn: Generator.number(10000, 100000),
    });

    try {
      await action.execute({ emailVerificationToken });
    } catch (error) {
      expect(error).toBeInstanceOf(OperationNotValidError);

      expect((error as OperationNotValidError).context).toMatchObject({
        reason: 'User not found.',
        id: userId,
      });

      return;
    }

    expect.fail();
  });

  it('throws an error - when emailVerificationToken is invalid', async () => {
    const invalidEmailVerificationToken = 'invalidEmailVerificationToken';

    try {
      await action.execute({ emailVerificationToken: invalidEmailVerificationToken });
    } catch (error) {
      expect(error).toBeInstanceOf(OperationNotValidError);

      expect((error as OperationNotValidError).context).toMatchObject({
        reason: 'Invalid email verification token.',
        token: invalidEmailVerificationToken,
      });

      return;
    }

    expect.fail();
  });

  it('throws an error - when token is not an emailVerification token', async () => {
    const user = await userTestUtils.createAndPersist({ input: { is_email_verified: false } });

    const invalidEmailVerificationToken = tokenService.createToken({
      data: {
        userId: user.id,
        type: tokenTypes.refresh,
      },
      expiresIn: Generator.number(10000, 100000),
    });

    try {
      await action.execute({ emailVerificationToken: invalidEmailVerificationToken });
    } catch (error) {
      expect(error).toBeInstanceOf(OperationNotValidError);

      expect((error as OperationNotValidError).context).toMatchObject({
        reason: 'Token type is not email verification token.',
      });

      return;
    }

    expect.fail();
  });

  it('throws an error - when UserTokens were found but emailVerificationToken is expired', async () => {
    const user = await userTestUtils.createAndPersist({ input: { is_email_verified: false } });

    const emailVerificationToken = tokenService.createToken({
      data: { userId: user.id },
      expiresIn: 0,
    });

    try {
      await action.execute({ emailVerificationToken });
    } catch (error) {
      expect(error).toBeInstanceOf(OperationNotValidError);

      expect((error as OperationNotValidError).context).toMatchObject({
        reason: 'Invalid email verification token.',
        token: emailVerificationToken,
      });

      return;
    }

    expect.fail();
  });

  it('throws an error - when User is already verified', async () => {
    const user = await userTestUtils.createAndPersist({ input: { is_email_verified: true } });

    const emailVerificationToken = tokenService.createToken({
      data: {
        userId: user.id,
        type: tokenTypes.emailVerification,
      },
      expiresIn: Generator.number(10000, 100000),
    });

    try {
      await action.execute({ emailVerificationToken });
    } catch (error) {
      expect(error).toBeInstanceOf(OperationNotValidError);

      expect((error as OperationNotValidError).context).toMatchObject({
        reason: 'User email already verified.',
        email: user.email,
      });

      return;
    }

    expect.fail();
  });
});
