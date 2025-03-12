import type { DatabaseClient } from '../../../types/databaseClient.ts';
import type { Migration } from '../../../types/migration.ts';

export class M3CreateTrainingEventsTableMigration implements Migration {
  public readonly name = 'M3CreateTrainingEventsTableMigration';

  private readonly tableName = 'training_events';

  public async up(databaseClient: DatabaseClient): Promise<void> {
    await databaseClient.raw('CREATE EXTENSION IF NOT EXISTS postgis;');
    await databaseClient.raw('CREATE EXTENSION IF NOT EXISTS pg_trgm;');

    await databaseClient.schema.createTable(this.tableName, (table) => {
      table.uuid('id').notNullable().primary();

      table.timestamp('starts_at').notNullable();
      table.check('starts_at > current_timestamp');

      table.timestamp('ends_at').notNullable();
      table.check('ends_at > starts_at');

      table.integer('cent_price').notNullable();
      table.check('cent_price >= 0');

      table.boolean('is_hidden').notNullable().defaultTo(false);

      table.string('city', 64).notNullable();

      table.string('place', 64).nullable();

      table.specificType('geolocation', 'geometry(point, 4326)').notNullable();

      table.uuid('training_id').notNullable().references('id').inTable('trainings').onDelete('CASCADE');

      table.timestamp('created_at').notNullable().defaultTo(databaseClient.raw('CURRENT_TIMESTAMP'));
    });

    await databaseClient.raw(
      'CREATE INDEX IF NOT EXISTS training_events_city_gin_index ON training_events USING gin (city gin_trgm_ops);',
    );
    await databaseClient.raw(
      'CREATE INDEX IF NOT EXISTS training_events_geolocation_index ON training_events USING gist (geolocation);',
    );
  }

  public async down(databaseClient: DatabaseClient): Promise<void> {
    await databaseClient.schema.dropTable(this.tableName);
  }
}
