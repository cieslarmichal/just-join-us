import { beforeEach, afterEach, expect, describe, it } from 'vitest';

import { Generator } from '../../../../../../tests/generator.ts';
import { testSymbols } from '../../../../../../tests/symbols.ts';
import { TestContainer } from '../../../../../../tests/testContainer.ts';
import { RepositoryError } from '../../../../../common/errors/repositoryError.ts';
import { databaseSymbols } from '../../../../databaseModule/symbols.ts';
import type { DatabaseClient } from '../../../../databaseModule/types/databaseClient.ts';
import { type UserRepository } from '../../../domain/repositories/userRepository/userRepository.ts';
import { symbols } from '../../../symbols.ts';
import { UserTestFactory } from '../../../tests/factories/userTestFactory/userTestFactory.ts';
import { type UserTestUtils } from '../../../tests/utils/userTestUtils/userTestUtils.ts';

describe('UserRepositoryImpl', () => {
  let userRepository: UserRepository;

  let databaseClient: DatabaseClient;

  let userTestUtils: UserTestUtils;

  const userTestFactory = new UserTestFactory();

  beforeEach(async () => {
    const container = await TestContainer.create();

    userRepository = container.get<UserRepository>(symbols.userRepository);

    databaseClient = container.get<DatabaseClient>(databaseSymbols.databaseClient);

    userTestUtils = container.get<UserTestUtils>(testSymbols.userTestUtils);

    await userTestUtils.truncate();
  });

  afterEach(async () => {
    await userTestUtils.truncate();

    await databaseClient.destroy();
  });

  describe('Create', () => {
    it('creates a User', async () => {
      const createdUser = userTestFactory.create();

      const { email, password, isEmailVerified, isDeleted, role } = createdUser.getUserState();

      const user = await userRepository.createUser({
        data: {
          email,
          password,
          isEmailVerified,
          isDeleted,
          role,
        },
      });

      const foundUser = await userTestUtils.findByEmail({ email });

      expect(user.getEmail()).toEqual(email);

      expect(foundUser?.email).toEqual(email);
    });

    it('throws an error when a User with the same email already exists', async () => {
      const existingUser = await userTestUtils.createAndPersist();

      try {
        await userRepository.createUser({
          data: {
            email: existingUser.email,
            password: existingUser.password,
            isEmailVerified: existingUser.is_email_verified,
            isDeleted: existingUser.is_deleted,
            role: existingUser.role,
          },
        });
      } catch (error) {
        expect(error).toBeInstanceOf(RepositoryError);

        return;
      }

      expect.fail();
    });

    it(`updates User's data`, async () => {
      const userRawEntity = await userTestUtils.createAndPersist();

      const user = userTestFactory.create({
        id: userRawEntity.id,
        email: userRawEntity.email,
        password: userRawEntity.password,
        isEmailVerified: userRawEntity.is_email_verified,
        isDeleted: userRawEntity.is_deleted,
        role: userRawEntity.role,
        createdAt: userRawEntity.created_at,
      });

      const password = Generator.password();

      const isEmailVerified = Generator.boolean();

      const isDeleted = Generator.boolean();

      user.setPassword({ password });

      user.setIsEmailVerified({ isEmailVerified });

      user.setIsDeleted({ isDeleted });

      const updatedUser = await userRepository.updateUser({ user });

      const foundUser = await userTestUtils.findById({ id: user.getId() });

      expect(updatedUser.getUserState()).toEqual({
        email: userRawEntity.email,
        password,
        isEmailVerified,
        isDeleted,
        role: userRawEntity.role,
        createdAt: userRawEntity.created_at,
      });

      expect(foundUser).toEqual({
        id: user.getId(),
        email: userRawEntity.email,
        password,
        is_email_verified: isEmailVerified,
        is_deleted: isDeleted,
        role: userRawEntity.role,
        created_at: userRawEntity.created_at,
      });
    });
  });

  describe('Find', () => {
    it('finds a User by id', async () => {
      const user = await userTestUtils.createAndPersist();

      const foundUser = await userRepository.findUser({ id: user.id });

      expect(foundUser?.getUserState()).toEqual({
        email: user.email,
        password: user.password,
        isEmailVerified: user.is_email_verified,
        isDeleted: user.is_deleted,
        role: user.role,
        createdAt: user.created_at,
      });
    });

    it('finds a User by email', async () => {
      const user = await userTestUtils.createAndPersist();

      const foundUser = await userRepository.findUser({ email: user.email });

      expect(foundUser?.getUserState()).toEqual({
        email: user.email,
        password: user.password,
        isEmailVerified: user.is_email_verified,
        isDeleted: user.is_deleted,
        role: user.role,
        createdAt: user.created_at,
      });
    });

    it('returns null if a User with given id does not exist', async () => {
      const createdUser = userTestFactory.create();

      const user = await userRepository.findUser({ id: createdUser.getId() });

      expect(user).toBeNull();
    });
  });

  describe('FindAll', () => {
    it('finds all Users', async () => {
      const user1 = await userTestUtils.createAndPersist();

      const user2 = await userTestUtils.createAndPersist();

      const users = await userRepository.findUsers({
        page: 1,
        pageSize: 10,
      });

      expect(users).toHaveLength(2);

      expect(users[0]?.getUserState()).toEqual({
        email: user2.email,
        password: user2.password,
        isEmailVerified: user2.is_email_verified,
        isDeleted: user2.is_deleted,
        role: user2.role,
        createdAt: user2.created_at,
      });

      expect(users[1]?.getUserState()).toEqual({
        email: user1.email,
        password: user1.password,
        isEmailVerified: user1.is_email_verified,
        isDeleted: user1.is_deleted,
        role: user1.role,
        createdAt: user1.created_at,
      });
    });
  });

  describe('Count', () => {
    it('counts Users', async () => {
      await userTestUtils.createAndPersist();

      await userTestUtils.createAndPersist();

      const count = await userRepository.countUsers();

      expect(count).toEqual(2);
    });
  });
});
