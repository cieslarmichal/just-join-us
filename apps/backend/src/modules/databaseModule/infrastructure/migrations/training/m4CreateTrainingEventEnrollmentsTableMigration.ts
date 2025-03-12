import type { DatabaseClient } from '../../../types/databaseClient.ts';
import type { Migration } from '../../../types/migration.ts';

export class M4CreateTrainingEventEnrollmentsTableMigration implements Migration {
  public readonly name = 'M4CreateTrainingEventEnrollmentsTableMigration';

  private readonly tableName = 'training_event_enrollments';

  public async up(databaseClient: DatabaseClient): Promise<void> {
    await databaseClient.schema.createTable(this.tableName, (table) => {
      table.uuid('id').notNullable().primary();

      table.uuid('student_id').notNullable().references('id').inTable('students').onDelete('CASCADE');

      table.uuid('training_event_id').notNullable().references('id').inTable('training_events').onDelete('CASCADE');

      table.timestamp('created_at').notNullable().defaultTo(databaseClient.raw('CURRENT_TIMESTAMP'));

      table.unique(['student_id', 'training_event_id']);
    });
  }

  public async down(databaseClient: DatabaseClient): Promise<void> {
    await databaseClient.schema.dropTable(this.tableName);
  }
}
