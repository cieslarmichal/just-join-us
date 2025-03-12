import type { DatabaseClient } from '../../../types/databaseClient.ts';
import type { Migration } from '../../../types/migration.ts';

export class M2CreateTrainingsTableMigration implements Migration {
  public readonly name = 'M2CreateTrainingsTableMigration';

  private readonly tableName = 'trainings';

  public async up(databaseClient: DatabaseClient): Promise<void> {
    await databaseClient.schema.createTable(this.tableName, (table) => {
      table.uuid('id').notNullable().primary();

      table.string('name', 64).notNullable();

      table.text('description').notNullable();

      table.boolean('is_hidden').notNullable().defaultTo(false);

      table.uuid('category_id').notNullable().references('id').inTable('categories').onDelete('CASCADE');

      table.uuid('company_id').notNullable().references('id').inTable('companies').onDelete('CASCADE');

      table.unique(['company_id', 'name']);

      table.timestamp('created_at').notNullable().defaultTo(databaseClient.raw('CURRENT_TIMESTAMP'));
    });

    await databaseClient.raw('CREATE EXTENSION IF NOT EXISTS pg_trgm;');

    await databaseClient.raw(
      'CREATE INDEX IF NOT EXISTS trainings_name_gin_index ON trainings USING gin (name gin_trgm_ops);',
    );
  }

  public async down(databaseClient: DatabaseClient): Promise<void> {
    await databaseClient.schema.dropTable(this.tableName);
  }
}
