import type { DatabaseClient } from '../types/databaseClient.ts';

import { TrainingMigrationSource } from './migrations/training/trainingMigrationSource.ts';
import { UserMigrationSource } from './migrations/user/userMigrationSource.ts';

export class DatabaseManager {
  private readonly databaseClient: DatabaseClient;

  public constructor(databaseClient: DatabaseClient) {
    this.databaseClient = databaseClient;
  }

  public async setupDatabase(): Promise<void> {
    const migrationSources = [new UserMigrationSource(), new TrainingMigrationSource()];

    for (const migrationSource of migrationSources) {
      await this.databaseClient.migrate.latest({
        migrationSource,
        tableName: migrationSource.getMigrationTableName(),
      });
    }
  }

  public async teardownDatabase(): Promise<void> {
    const migrationSources = [new UserMigrationSource(), new TrainingMigrationSource()];

    for (const migrationSource of migrationSources) {
      await this.databaseClient.migrate.rollback({
        migrationSource,
        tableName: migrationSource.getMigrationTableName(),
      });
    }
  }
}
