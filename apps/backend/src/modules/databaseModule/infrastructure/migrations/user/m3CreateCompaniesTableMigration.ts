import type { DatabaseClient } from '../../../types/databaseClient.ts';
import type { Migration } from '../../../types/migration.ts';

export class M3CreateCompaniesTableMigration implements Migration {
  public readonly name = 'M3CreateCompaniesTableMigration';

  private readonly tableName = 'companies';

  public async up(databaseClient: DatabaseClient): Promise<void> {
    await databaseClient.schema.createTable(this.tableName, (table) => {
      table.uuid('id').notNullable().primary();

      table.foreign('id').references('id').inTable('users').onDelete('CASCADE');

      table.string('tax_id', 16).notNullable().checkRegex('^[A-Z0-9]+$');

      table.string('name', 128).notNullable();

      table.string('phone', 20).notNullable().checkRegex('^[0-9+][0-9]*$');

      table.boolean('is_verified').notNullable();

      table.string('logo_url', 256).notNullable();
    });

    await databaseClient.raw('CREATE EXTENSION IF NOT EXISTS pg_trgm;');

    await databaseClient.raw(
      'CREATE INDEX IF NOT EXISTS companies_name_gin_index ON companies USING gin (name gin_trgm_ops);',
    );
  }

  public async down(databaseClient: DatabaseClient): Promise<void> {
    await databaseClient.schema.dropTable(this.tableName);
  }
}
