import type { DatabaseClient } from '../../../types/databaseClient.ts';
import type { Migration } from '../../../types/migration.ts';

export class M5CreateEmailEventsTableMigration implements Migration {
  public readonly name = 'M5CreateEmailEventsTableMigration';

  private readonly tableName = 'email_events';

  public async up(databaseClient: DatabaseClient): Promise<void> {
    await databaseClient.schema.createTable(this.tableName, (table) => {
      table.string('id', 36).notNullable();

      table.text('payload').notNullable();

      table.string('status', 20).notNullable();

      table.string('event_name', 20).notNullable();

      table.timestamp('created_at').notNullable().defaultTo(databaseClient.raw('CURRENT_TIMESTAMP'));
    });
  }

  public async down(databaseClient: DatabaseClient): Promise<void> {
    await databaseClient.schema.dropTable(this.tableName);
  }
}
