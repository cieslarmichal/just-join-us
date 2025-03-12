import { Generator } from '../../../../../../tests/generator.ts';
import { userRoles } from '../../../../../common/types/userRole.ts';
import type { UserRawEntity } from '../../../../databaseModule/infrastructure/tables/usersTable/userRawEntity.ts';
import { User, type UserDraft } from '../../../domain/entities/user/user.ts';

export class UserTestFactory {
  public create(input: Partial<UserDraft> = {}): User {
    return new User({
      id: Generator.uuid(),
      email: Generator.email(),
      password: Generator.password(),
      isEmailVerified: Generator.boolean(),
      isDeleted: false,
      role: userRoles.student,
      createdAt: Generator.pastDate(),
      ...input,
    });
  }

  public createRaw(input: Partial<UserRawEntity> = {}): UserRawEntity {
    return {
      id: Generator.uuid(),
      email: Generator.email(),
      password: Generator.password(),
      is_email_verified: Generator.boolean(),
      is_deleted: false,
      role: userRoles.student,
      created_at: Generator.pastDate(),
      ...input,
    };
  }
}
