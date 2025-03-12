import type { Migration } from '../../../types/migration.ts';
import type { MigrationSource } from '../../../types/migrationSource.ts';

import { M1CreateUsersTableMigration } from './m1CreateUsersTableMigration.ts';
import { M2CreateStudentsTableMigration } from './m2CreateStudentsTableMigration.ts';
import { M3CreateCompaniesTableMigration } from './m3CreateCompaniesTableMigration.ts';
import { M4CreateBlacklistTokensTableMigration } from './m4CreateBlacklistTokensTableMigration.ts';
import { M5CreateEmailEventsTableMigration } from './m5CreateEmailEventsTableMigration.ts';

export class UserMigrationSource implements MigrationSource {
  public async getMigrations(): Promise<Migration[]> {
    return [
      new M1CreateUsersTableMigration(),
      new M2CreateStudentsTableMigration(),
      new M3CreateCompaniesTableMigration(),
      new M4CreateBlacklistTokensTableMigration(),
      new M5CreateEmailEventsTableMigration(),
    ];
  }

  public getMigrationName(migration: Migration): string {
    return migration.name;
  }

  public async getMigration(migration: Migration): Promise<Migration> {
    return migration;
  }

  public getMigrationTableName(): string {
    return 'user_migrations';
  }
}
