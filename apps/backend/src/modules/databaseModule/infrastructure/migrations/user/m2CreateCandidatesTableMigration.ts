import type { DatabaseClient } from '../../../types/databaseClient.ts';
import type { Migration } from '../../../types/migration.ts';

export class M2CreateCandidatesTableMigration implements Migration {
  public readonly name = 'M2CreateCandidatesTableMigration';

  private readonly tableName = 'candidates';

  public async up(databaseClient: DatabaseClient): Promise<void> {
    await databaseClient.schema.createTable(this.tableName, (table) => {
      table.uuid('id').notNullable().primary();

      table.foreign('id').references('id').inTable('users').onDelete('CASCADE');

      table.string('first_name', 64).notNullable();

      table.string('last_name', 64).notNullable();

      table.string('resume_url', 256);

      table.string('linkedin_url', 256);

      table.string('github_url', 256);
    });
  }

  public async down(databaseClient: DatabaseClient): Promise<void> {
    await databaseClient.schema.dropTable(this.tableName);
  }
}
