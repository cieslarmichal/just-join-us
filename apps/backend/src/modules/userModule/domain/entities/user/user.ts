import type { UserRole } from '../../../../../common/types/userRole.ts';

export interface UserDraft {
  readonly id: string;
  readonly email: string;
  readonly password: string;
  readonly isEmailVerified: boolean;
  readonly isDeleted: boolean;
  readonly role: UserRole;
  readonly createdAt: Date;
}

export interface UserState {
  readonly email: string;
  password: string;
  isEmailVerified: boolean;
  isDeleted: boolean;
  readonly role: UserRole;
  readonly createdAt: Date;
}

export interface SetPasswordPayload {
  readonly password: string;
}

export interface SetEmailPayload {
  readonly email: string;
}

export interface SetIsEmailVerifiedPayload {
  readonly isEmailVerified: boolean;
}

export interface SetIsDeletedPayload {
  readonly isDeleted: boolean;
}

export interface SetNamePayload {
  readonly name: string;
}

export class User {
  private id: string;
  private state: UserState;

  public constructor(draft: UserDraft) {
    const { id, email, password, isEmailVerified, isDeleted, role, createdAt } = draft;

    this.id = id;

    this.state = {
      email,
      password,
      isEmailVerified,
      isDeleted,
      role,
      createdAt,
    };
  }

  public getId(): string {
    return this.id;
  }

  public getEmail(): string {
    return this.state.email;
  }

  public getPassword(): string {
    return this.state.password;
  }

  public getRole(): UserRole {
    return this.state.role;
  }

  public getIsEmailVerified(): boolean {
    return this.state.isEmailVerified;
  }

  public getIsDeleted(): boolean {
    return this.state.isDeleted;
  }

  public getCreatedAt(): Date {
    return this.state.createdAt;
  }

  public getUserState(): UserState {
    return this.state;
  }

  public setPassword(payload: SetPasswordPayload): void {
    const { password } = payload;

    this.state.password = password;
  }

  public setIsEmailVerified(payload: SetIsEmailVerifiedPayload): void {
    const { isEmailVerified } = payload;

    this.state.isEmailVerified = isEmailVerified;
  }

  public setIsDeleted(payload: SetIsDeletedPayload): void {
    const { isDeleted } = payload;

    this.state.isDeleted = isDeleted;
  }
}
