import { userRoles } from './userRole';

export interface UserBase {
  readonly id: string;
  readonly email: string;
  readonly isEmailVerified: boolean;
  readonly isDeleted: boolean;
  readonly createdAt: string;
}

export interface Admin extends UserBase {
  readonly role: typeof userRoles.admin;
}

export interface Candidate extends UserBase {
  readonly role: typeof userRoles.candidate;
  readonly firstName: string;
  readonly lastName: string;
  readonly resumeUrl?: string;
  readonly githubUrl?: string;
  readonly linkedinUrl?: string;
}

export interface Company extends UserBase {
  readonly role: typeof userRoles.company;
  readonly name: string;
  readonly phone: string;
  readonly logoUrl: string;
}

export type User = Candidate | Company | Admin;
