import { beforeEach, expect, describe, it } from 'vitest';

import { UserTestFactory } from '../../../../tests/factories/userTestFactory/userTestFactory.ts';

import { UserMapper } from './userMapper.ts';

describe('UserMapper', () => {
  let mapper: UserMapper;

  const userTestFactory = new UserTestFactory();

  beforeEach(async () => {
    mapper = new UserMapper();
  });

  it('maps from UserRawEntity to User', async () => {
    const userEntity = userTestFactory.createRaw();

    const user = mapper.mapToDomain(userEntity);

    expect(user.getId()).toEqual(userEntity.id);

    expect(user.getUserState()).toEqual({
      email: userEntity.email,
      password: userEntity.password,
      isEmailVerified: userEntity.is_email_verified,
      isDeleted: userEntity.is_deleted,
      role: userEntity.role,
      createdAt: userEntity.created_at,
    });
  });
});
