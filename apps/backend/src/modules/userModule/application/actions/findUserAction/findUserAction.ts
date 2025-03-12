import { type Action } from '../../../../../common/types/action.ts';
import type { UserRole } from '../../../../../common/types/userRole.ts';
import { type Company } from '../../../domain/entities/company/company.ts';
import { type Student } from '../../../domain/entities/student/student.ts';
import { type User } from '../../../domain/entities/user/user.ts';

export interface FindUserActionPayload {
  readonly id: string;
  readonly role?: UserRole;
}

export interface FindUserActionResult {
  readonly user: User | Student | Company;
}

export type FindUserAction = Action<FindUserActionPayload, FindUserActionResult>;
