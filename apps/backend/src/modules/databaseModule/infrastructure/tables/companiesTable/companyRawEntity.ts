import type { UserRole } from '../../../../../common/types/userRole.ts';

export interface CompanyRawEntity {
  readonly id: string;
  readonly name: string;
  readonly tax_id: string;
  readonly phone: string;
  readonly is_verified: boolean;
  readonly logo_url: string;
}

export interface CompanyRawEntityExtended {
  readonly id: string;
  readonly email: string;
  readonly password: string;
  readonly is_email_verified: boolean;
  readonly is_deleted: boolean;
  readonly role: UserRole;
  readonly created_at: Date;
  readonly name: string;
  readonly tax_id: string;
  readonly phone: string;
  readonly is_verified: boolean;
  readonly logo_url: string;
}
