import type { Migration } from '../../../types/migration.ts';
import type { MigrationSource } from '../../../types/migrationSource.ts';

import { M1CreateCategoriesTableMigration } from './m1CreateCategoriesTableMigration.ts';
import { M2CreateSkillsTableMigration } from './m2CreateSkillsTableMigration.ts';
import { M3CreateJobOffersTableMigration } from './m3CreateJobOffersTableMigration.ts';

export class JobOfferMigrationSource implements MigrationSource {
  public async getMigrations(): Promise<Migration[]> {
    return [
      new M1CreateCategoriesTableMigration(),
      new M2CreateSkillsTableMigration(),
      new M3CreateJobOffersTableMigration(),
    ];
  }

  public getMigrationName(migration: Migration): string {
    return migration.name;
  }

  public async getMigration(migration: Migration): Promise<Migration> {
    return migration;
  }

  public getMigrationTableName(): string {
    return 'job_offers_migrations';
  }
}
