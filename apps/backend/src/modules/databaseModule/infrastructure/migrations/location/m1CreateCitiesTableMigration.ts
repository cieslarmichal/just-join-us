import type { DatabaseClient } from '../../../types/databaseClient.ts';
import type { Migration } from '../../../types/migration.ts';

export class M1CreateCitiesTableMigration implements Migration {
  public readonly name = 'M1CreateCitiesTableMigration';

  private readonly tableName = 'cities';

  public async up(databaseClient: DatabaseClient): Promise<void> {
    await databaseClient.raw('CREATE EXTENSION IF NOT EXISTS pg_trgm;');

    await databaseClient.schema.createTable(this.tableName, (table) => {
      table.uuid('id').notNullable().primary();

      table.string('name', 64).notNullable();

      table.string('slug', 64).notNullable().unique();

      table.string('province', 32).notNullable();

      table.float('latitude').notNullable();

      table.float('longitude').notNullable();
    });

    await databaseClient.raw(
      'create index if not exists cities_name_gin_index on cities using gin (name gin_trgm_ops);',
    );
  }

  public async down(databaseClient: DatabaseClient): Promise<void> {
    await databaseClient.schema.dropTable(this.tableName);
  }
}
