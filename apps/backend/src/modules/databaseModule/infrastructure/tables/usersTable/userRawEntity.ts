import type { UserRole } from '../../../../../common/types/userRole.ts';

export interface UserRawEntity {
  readonly id: string;
  readonly email: string;
  readonly password: string;
  readonly is_email_verified: boolean;
  readonly is_deleted: boolean;
  readonly role: UserRole;
  readonly created_at: Date;
}
