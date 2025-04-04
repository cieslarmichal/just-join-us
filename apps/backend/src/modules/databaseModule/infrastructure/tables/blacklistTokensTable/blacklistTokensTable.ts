import { type DatabaseTable } from '../../../types/databaseTable.ts';

import { type BlacklistTokenRawEntity } from './blacklistTokenRawEntity.ts';

const tableName = 'blacklist_tokens';

export const blacklistTokensTable: DatabaseTable<BlacklistTokenRawEntity, typeof tableName> = {
  name: tableName,
  allColumns: `${tableName}.*`,
  columns: {
    id: `${tableName}.id`,
    token: `${tableName}.token`,
    expires_at: `${tableName}.expires_at`,
  },
};
