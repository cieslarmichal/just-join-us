import type { DatabaseClient } from '../../../types/databaseClient.ts';
import type { Migration } from '../../../types/migration.ts';

export class M4CreateBlacklistTokensTableMigration implements Migration {
  public readonly name = 'M4CreateBlacklistTokensTableMigration';

  private readonly tableName = 'blacklist_tokens';

  public async up(databaseClient: DatabaseClient): Promise<void> {
    await databaseClient.schema.createTable(this.tableName, (table) => {
      table.uuid('id').notNullable().primary();

      table.text('token').notNullable().unique();

      table.timestamp('expires_at').notNullable();
    });
  }

  public async down(databaseClient: DatabaseClient): Promise<void> {
    await databaseClient.schema.dropTable(this.tableName);
  }
}
