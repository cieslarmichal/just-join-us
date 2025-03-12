import type { Migration } from '../../../types/migration.ts';
import type { MigrationSource } from '../../../types/migrationSource.ts';

import { M1CreateCategoriesTableMigration } from './m1CreateCategoriesTableMigration.ts';
import { M2CreateTrainingsTableMigration } from './m2CreateTrainingsTableMigration.ts';
import { M3CreateTrainingEventsTableMigration } from './m3CreateTrainingEventsTableMigration.ts';
import { M4CreateTrainingEventEnrollmentsTableMigration } from './m4CreateTrainingEventEnrollmentsTableMigration.ts';

export class TrainingMigrationSource implements MigrationSource {
  public async getMigrations(): Promise<Migration[]> {
    return [
      new M1CreateCategoriesTableMigration(),
      new M2CreateTrainingsTableMigration(),
      new M3CreateTrainingEventsTableMigration(),
      new M4CreateTrainingEventEnrollmentsTableMigration(),
    ];
  }

  public getMigrationName(migration: Migration): string {
    return migration.name;
  }

  public async getMigration(migration: Migration): Promise<Migration> {
    return migration;
  }

  public getMigrationTableName(): string {
    return 'training_migrations';
  }
}
