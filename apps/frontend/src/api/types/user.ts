import { UserRole } from './userRole';

export interface User {
  readonly id: string;
  readonly email: string;
  readonly isEmailVerified: boolean;
  readonly isDeleted: boolean;
  readonly role: UserRole;
  readonly createdAt: string;
}
