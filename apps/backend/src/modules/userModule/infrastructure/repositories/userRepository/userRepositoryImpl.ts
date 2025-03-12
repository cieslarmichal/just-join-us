import { OperationNotValidError } from '../../../../../common/errors/operationNotValidError.ts';
import { RepositoryError } from '../../../../../common/errors/repositoryError.ts';
import { type UuidService } from '../../../../../common/uuid/uuidService.ts';
import type { UserRawEntity } from '../../../../databaseModule/infrastructure/tables/usersTable/userRawEntity.ts';
import { usersTable } from '../../../../databaseModule/infrastructure/tables/usersTable/usersTable.ts';
import type { DatabaseClient } from '../../../../databaseModule/types/databaseClient.ts';
import { type User } from '../../../domain/entities/user/user.ts';
import {
  type UserRepository,
  type CreateUserPayload,
  type FindUserPayload,
  type FindUsersPayload,
  type UpdateUserPayload,
} from '../../../domain/repositories/userRepository/userRepository.ts';

import { type UserMapper } from './userMapper/userMapper.ts';

export class UserRepositoryImpl implements UserRepository {
  private readonly databaseClient: DatabaseClient;
  private readonly userMapper: UserMapper;
  private readonly uuidService: UuidService;

  public constructor(databaseClient: DatabaseClient, userMapper: UserMapper, uuidService: UuidService) {
    this.databaseClient = databaseClient;
    this.userMapper = userMapper;
    this.uuidService = uuidService;
  }

  public async createUser(payload: CreateUserPayload): Promise<User> {
    const {
      data: { email, password, isEmailVerified, isDeleted, role },
    } = payload;

    let rawEntities: UserRawEntity[];

    const id = this.uuidService.generateUuid();

    try {
      rawEntities = await this.databaseClient<UserRawEntity>(usersTable.name).insert(
        {
          id,
          email,
          password,
          is_email_verified: isEmailVerified,
          is_deleted: isDeleted,
          role,
        },
        '*',
      );
    } catch (error) {
      throw new RepositoryError({
        entity: 'User',
        operation: 'create',
        originalError: error,
      });
    }

    const rawEntity = rawEntities[0] as UserRawEntity;

    return this.userMapper.mapToDomain(rawEntity);
  }

  public async updateUser(payload: UpdateUserPayload): Promise<User> {
    const { user } = payload;

    let rawEntities: UserRawEntity[] = [];

    const { password, isDeleted, isEmailVerified } = user.getUserState();

    try {
      rawEntities = await this.databaseClient<UserRawEntity>(usersTable.name)
        .update(
          {
            password,
            is_email_verified: isEmailVerified,
            is_deleted: isDeleted,
          },
          '*',
        )
        .where({ id: user.getId() });
    } catch (error) {
      throw new RepositoryError({
        entity: 'User',
        operation: 'update',
        originalError: error,
      });
    }

    const rawEntity = rawEntities[0] as UserRawEntity;

    return this.userMapper.mapToDomain(rawEntity);
  }

  public async findUser(payload: FindUserPayload): Promise<User | null> {
    const { id, email } = payload;

    let whereCondition: Partial<UserRawEntity> = {};

    if (!id && !email) {
      throw new OperationNotValidError({
        reason: 'Either id or email must be provided.',
      });
    }

    if (id) {
      whereCondition = {
        ...whereCondition,
        id,
      };
    }

    if (email) {
      whereCondition = {
        ...whereCondition,
        email,
      };
    }

    let rawEntity: UserRawEntity | undefined;

    try {
      rawEntity = await this.databaseClient<UserRawEntity>(usersTable.name).select('*').where(whereCondition).first();
    } catch (error) {
      throw new RepositoryError({
        entity: 'User',
        operation: 'find',
        originalError: error,
      });
    }

    if (!rawEntity) {
      return null;
    }

    return this.userMapper.mapToDomain(rawEntity);
  }

  public async findUsers(payload: FindUsersPayload): Promise<User[]> {
    const { page, pageSize } = payload;

    let rawEntities: UserRawEntity[];

    try {
      rawEntities = await this.databaseClient<UserRawEntity>(usersTable.name)
        .select('*')
        .orderBy(usersTable.columns.id, 'desc')
        .limit(pageSize)
        .offset((page - 1) * pageSize);
    } catch (error) {
      throw new RepositoryError({
        entity: 'User',
        operation: 'find',
        originalError: error,
      });
    }

    return rawEntities.map((rawEntity) => this.userMapper.mapToDomain(rawEntity));
  }

  public async countUsers(): Promise<number> {
    try {
      const query = this.databaseClient<UserRawEntity>(usersTable.name);

      const countResult = await query.count().first();

      const count = countResult?.['count'];

      if (count === undefined) {
        throw new RepositoryError({
          entity: 'User',
          operation: 'count',
          countResult,
        });
      }

      if (typeof count === 'string') {
        return parseInt(count, 10);
      }

      return count;
    } catch (error) {
      throw new RepositoryError({
        entity: 'User',
        operation: 'count',
        originalError: error,
      });
    }
  }
}
