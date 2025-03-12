import { type DatabaseTable } from '../../../types/databaseTable.ts';

import { type UserRawEntity } from './userRawEntity.ts';

const usersTableName = 'users';

export const usersTable: DatabaseTable<UserRawEntity, typeof usersTableName> = {
  name: usersTableName,
  allColumns: `${usersTableName}.*`,
  columns: {
    id: `${usersTableName}.id`,
    email: `${usersTableName}.email`,
    password: `${usersTableName}.password`,
    is_email_verified: `${usersTableName}.is_email_verified`,
    is_deleted: `${usersTableName}.is_deleted`,
    role: `${usersTableName}.role`,
    created_at: `${usersTableName}.created_at`,
  },
};
