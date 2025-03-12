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
import { type HashService } from '../../services/hashService/hashService.ts';

import { type ChangeUserPasswordAction } from './changeUserPasswordAction.ts';

describe('ChangeUserPasswordActionImpl', () => {
  let action: ChangeUserPasswordAction;

  let databaseClient: DatabaseClient;

  let tokenService: TokenService;

  let userTestUtils: UserTestUtils;

  let hashService: HashService;

  beforeEach(async () => {
    const container = await TestContainer.create();

    action = container.get<ChangeUserPasswordAction>(symbols.changeUserPasswordAction);

    databaseClient = container.get<DatabaseClient>(databaseSymbols.databaseClient);

    tokenService = container.get<TokenService>(authSymbols.tokenService);

    hashService = container.get<HashService>(symbols.hashService);

    userTestUtils = container.get<UserTestUtils>(testSymbols.userTestUtils);

    await userTestUtils.truncate();
  });

  afterEach(async () => {
    await userTestUtils.truncate();

    await databaseClient.destroy();
  });

  describe('change user password with token', () => {
    it('changes user password', async () => {
      const user = await userTestUtils.createAndPersist();

      const resetPasswordToken = tokenService.createToken({
        data: {
          userId: user.id,
          type: tokenTypes.passwordReset,
        },
        expiresIn: Generator.number(10000, 100000),
      });

      const newPassword = Generator.password();

      await action.execute({
        newPassword,
        identifier: {
          resetPasswordToken,
        },
      });

      const updatedUser = await userTestUtils.findById({
        id: user.id,
      });

      const isUpdatedPasswordValid = await hashService.compare({
        plainData: newPassword,
        hashedData: updatedUser?.password as string,
      });

      expect(isUpdatedPasswordValid).toBe(true);
    });

    it('throws an error - when a User with given id not found', async () => {
      const newPassword = Generator.password();

      const userId = Generator.uuid();

      const resetPasswordToken = tokenService.createToken({
        data: {
          userId,
          type: tokenTypes.passwordReset,
        },
        expiresIn: Generator.number(10000, 100000),
      });

      try {
        await action.execute({
          newPassword,
          identifier: {
            resetPasswordToken,
          },
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

    it('throws an error - when password does not meet the requirements', async () => {
      const user = await userTestUtils.createAndPersist();

      const resetPasswordToken = tokenService.createToken({
        data: {
          userId: user.id,
          type: tokenTypes.passwordReset,
        },
        expiresIn: Generator.number(10000, 100000),
      });

      const newPassword = Generator.alphaString(5);

      try {
        await action.execute({
          newPassword,
          identifier: {
            resetPasswordToken,
          },
        });
      } catch (error) {
        expect(error).toBeInstanceOf(OperationNotValidError);

        return;
      }

      expect.fail();
    });

    it('throws an error - when resetPasswordToken is invalid', async () => {
      const invalidResetPasswordToken = 'invalidResetPasswordToken';

      const newPassword = Generator.password();

      try {
        await action.execute({
          newPassword,
          identifier: {
            resetPasswordToken: invalidResetPasswordToken,
          },
        });
      } catch (error) {
        expect(error).toBeInstanceOf(OperationNotValidError);

        expect((error as OperationNotValidError).context).toMatchObject({
          reason: 'Invalid reset password token.',
          token: invalidResetPasswordToken,
        });

        return;
      }

      expect.fail();
    });

    it('throws an error - when token is has a different purpose', async () => {
      const user = await userTestUtils.createAndPersist();

      const resetPasswordToken = tokenService.createToken({
        data: {
          userId: user.id,
          type: tokenTypes.refresh,
        },
        expiresIn: Generator.number(10000, 100000),
      });

      const newPassword = Generator.password();

      try {
        await action.execute({
          newPassword,
          identifier: {
            resetPasswordToken,
          },
        });
      } catch (error) {
        expect(error).toBeInstanceOf(OperationNotValidError);

        expect((error as OperationNotValidError).context).toMatchObject({
          reason: 'Invalid reset password token.',
          resetPasswordToken,
        });

        return;
      }

      expect.fail();
    });
  });

  it('throws an error - when user is blocked', async () => {
    const user = await userTestUtils.createAndPersist({ input: { is_deleted: true } });

    const resetPasswordToken = tokenService.createToken({
      data: {
        userId: user.id,
        type: tokenTypes.passwordReset,
      },
      expiresIn: Generator.number(10000, 100000),
    });

    const newPassword = Generator.password();

    try {
      await action.execute({
        newPassword,
        identifier: {
          resetPasswordToken,
        },
      });
    } catch (error) {
      expect(error).toBeInstanceOf(OperationNotValidError);

      expect((error as OperationNotValidError).context).toMatchObject({
        reason: 'User is blocked.',
        userId: user.id,
      });

      return;
    }

    expect.fail();
  });

  describe('change user password with userId', () => {
    it('changes user password', async () => {
      const user = await userTestUtils.createAndPersist();

      const newPassword = Generator.password();

      await action.execute({
        newPassword,
        identifier: {
          userId: user.id,
        },
      });

      const updatedUser = await userTestUtils.findById({
        id: user.id,
      });

      const isUpdatedPasswordValid = await hashService.compare({
        plainData: newPassword,
        hashedData: updatedUser?.password as string,
      });

      expect(isUpdatedPasswordValid).toBe(true);
    });

    it('throws an error - when a User with given id not found', async () => {
      const newPassword = Generator.password();

      const userId = Generator.uuid();

      try {
        await action.execute({
          newPassword,
          identifier: {
            userId,
          },
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

    it('throws an error - when password does not meet the requirements', async () => {
      const user = await userTestUtils.createAndPersist();

      const newPassword = Generator.alphaString(5);

      try {
        await action.execute({
          newPassword,
          identifier: {
            userId: user.id,
          },
        });
      } catch (error) {
        expect(error).toBeInstanceOf(OperationNotValidError);

        return;
      }

      expect.fail();
    });
  });
});
