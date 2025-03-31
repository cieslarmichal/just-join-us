import type { UserRole } from '../../../../../common/types/userRole.ts';

export interface StudentRawEntity {
  readonly id: string;
  readonly first_name: string;
  readonly last_name: string;
  readonly birth_date: Date;
  readonly phone: string;
}

export interface StudentRawEntityExtended {
  readonly id: string;
  readonly email: string;
  readonly password: string;
  readonly is_email_verified: boolean;
  readonly is_deleted: boolean;
  readonly role: UserRole;
  readonly created_at: Date;
  readonly first_name: string;
  readonly last_name: string;
  readonly birth_date: Date;
  readonly phone: string;
}
