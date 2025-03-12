import type { UserRawEntity } from '../../../../../databaseModule/infrastructure/tables/usersTable/userRawEntity.ts';
import { User } from '../../../../domain/entities/user/user.ts';

export class UserMapper {
  public mapToDomain(entity: UserRawEntity): User {
    const {
      id,
      email,
      password,
      is_email_verified: isEmailVerified,
      is_deleted: isDeleted,
      role,
      created_at: createdAt,
    } = entity;

    return new User({
      id,
      email,
      password,
      isEmailVerified,
      isDeleted,
      role,
      createdAt,
    });
  }
}
