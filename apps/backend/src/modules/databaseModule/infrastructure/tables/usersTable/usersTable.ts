import { type DatabaseTable } from '../../../types/databaseTable.ts';

import { type UserRawEntity } from './userRawEntity.ts';

const tableName = 'users';

export const usersTable: DatabaseTable<UserRawEntity, typeof tableName> = {
  name: tableName,
  allColumns: `${tableName}.*`,
  columns: {
    id: `${tableName}.id`,
    email: `${tableName}.email`,
    password: `${tableName}.password`,
    is_email_verified: `${tableName}.is_email_verified`,
    is_deleted: `${tableName}.is_deleted`,
    role: `${tableName}.role`,
    created_at: `${tableName}.created_at`,
  },
};
