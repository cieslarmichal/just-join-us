import type { DatabaseClient } from '../../../types/databaseClient.ts';
import type { Migration } from '../../../types/migration.ts';

export class M1CreateCategoriesTableMigration implements Migration {
  public readonly name = 'M1CreateCategoriesTableMigration';

  private readonly tableName = 'categories';

  public async up(databaseClient: DatabaseClient): Promise<void> {
    await databaseClient.schema.createTable(this.tableName, (table) => {
      table.uuid('id').notNullable().primary();

      table.string('name', 32).notNullable().unique();

      table.string('slug', 32).notNullable().unique();
    });
  }

  public async down(databaseClient: DatabaseClient): Promise<void> {
    await databaseClient.schema.dropTable(this.tableName);
  }
}
