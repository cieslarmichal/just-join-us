import type { DatabaseClient } from '../../../types/databaseClient.ts';
import type { Migration } from '../../../types/migration.ts';

export class M1CreateUsersTableMigration implements Migration {
  public readonly name = 'M1CreateUsersTableMigration';

  private readonly tableName = 'users';

  public async up(databaseClient: DatabaseClient): Promise<void> {
    await databaseClient.schema.createTable(this.tableName, (table) => {
      table.uuid('id').notNullable().primary();

      table.string('email', 254).notNullable().unique();
      table.check("email ~ '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,63}$'");

      table.string('password', 255).notNullable();

      table.boolean('is_email_verified').notNullable();

      table.boolean('is_deleted').notNullable();

      table.string('role', 20).notNullable();

      table.timestamp('created_at').notNullable().defaultTo(databaseClient.raw('CURRENT_TIMESTAMP'));
    });
  }

  public async down(databaseClient: DatabaseClient): Promise<void> {
    await databaseClient.schema.dropTable(this.tableName);
  }
}
