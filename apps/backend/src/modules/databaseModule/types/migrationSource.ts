import { type Migration } from './migration.ts';

export interface MigrationSource {
  getMigrations(): Promise<Migration[]>;
  getMigrationName(migration: Migration): string;
  getMigration(migration: Migration): Promise<Migration>;
  getMigrationTableName(): string;
}
