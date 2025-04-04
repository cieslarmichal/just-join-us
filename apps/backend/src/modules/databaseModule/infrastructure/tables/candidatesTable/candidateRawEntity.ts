import type { UserRole } from '../../../../../common/types/userRole.ts';

export interface CandidateRawEntity {
  readonly id: string;
  readonly first_name: string;
  readonly last_name: string;
  readonly resume_url?: string | undefined;
  readonly linkedin_url?: string | undefined;
  readonly github_url?: string | undefined;
}

export interface CandidateRawEntityExtended {
  readonly id: string;
  readonly email: string;
  readonly password: string;
  readonly is_email_verified: boolean;
  readonly is_deleted: boolean;
  readonly role: UserRole;
  readonly created_at: Date;
  readonly first_name: string;
  readonly last_name: string;
  readonly resume_url?: string | undefined;
  readonly linkedin_url?: string | undefined;
  readonly github_url?: string | undefined;
}
