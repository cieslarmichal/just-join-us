import { type DatabaseTable } from '../../../types/databaseTable.ts';

import { type BlacklistTokenRawEntity } from './blacklistTokenRawEntity.ts';

const blacklistTokensTableName = 'blacklist_tokens';

export const blacklistTokensTable: DatabaseTable<BlacklistTokenRawEntity, typeof blacklistTokensTableName> = {
  name: blacklistTokensTableName,
  allColumns: `${blacklistTokensTableName}.*`,
  columns: {
    id: `${blacklistTokensTableName}.id`,
    token: `${blacklistTokensTableName}.token`,
    expires_at: `${blacklistTokensTableName}.expires_at`,
  },
};
