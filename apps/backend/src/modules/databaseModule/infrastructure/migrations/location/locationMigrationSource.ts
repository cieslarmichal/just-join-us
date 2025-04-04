import type { Migration } from '../../../types/migration.ts';
import type { MigrationSource } from '../../../types/migrationSource.ts';

import { M1CreateCitiesTableMigration } from './m1CreateCitiesTableMigration.ts';
import { M2CreateCompaniesLocationsTableMigration } from './m2CreateCompaniesLocationsTableMigration.ts';

export class LocationMigrationSource implements MigrationSource {
  public async getMigrations(): Promise<Migration[]> {
    return [new M1CreateCitiesTableMigration(), new M2CreateCompaniesLocationsTableMigration()];
  }

  public getMigrationName(migration: Migration): string {
    return migration.name;
  }

  public async getMigration(migration: Migration): Promise<Migration> {
    return migration;
  }

  public getMigrationTableName(): string {
    return 'locations_migrations';
  }
}
