import type { DatabaseClient } from '../../../types/databaseClient.ts';
import type { Migration } from '../../../types/migration.ts';

export class M2CreateStudentsTableMigration implements Migration {
  public readonly name = 'M2CreateStudentsTableMigration';

  private readonly tableName = 'students';

  public async up(databaseClient: DatabaseClient): Promise<void> {
    await databaseClient.schema.createTable(this.tableName, (table) => {
      table.uuid('id').notNullable().primary();

      table.foreign('id').references('id').inTable('users').onDelete('CASCADE');

      table.string('first_name', 64).notNullable();

      table.string('last_name', 64).notNullable();

      table.dateTime('birth_date').notNullable();

      table.string('phone_number', 20).notNullable().checkRegex('^[0-9+][0-9]*$');
    });
  }

  public async down(databaseClient: DatabaseClient): Promise<void> {
    await databaseClient.schema.dropTable(this.tableName);
  }
}
