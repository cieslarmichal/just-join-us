import { type UserState, type User } from '../../../domain/entities/user/user.ts';

export interface CreateUserPayload {
  readonly data: Omit<UserState, 'id' | 'createdAt'>;
}

export interface UpdateUserPayload {
  readonly user: User;
}

export interface FindUserPayload {
  readonly id?: string;
  readonly email?: string;
}

export interface FindUsersPayload {
  readonly page: number;
  readonly pageSize: number;
}

export interface UserRepository {
  createUser(input: CreateUserPayload): Promise<User>;
  updateUser(input: UpdateUserPayload): Promise<User>;
  findUser(input: FindUserPayload): Promise<User | null>;
  findUsers(payload: FindUsersPayload): Promise<User[]>;
  countUsers(): Promise<number>;
}
