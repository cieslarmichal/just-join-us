import type { DatabaseClient } from '../../../types/databaseClient.ts';
import type { Migration } from '../../../types/migration.ts';

export class M2CreateCompaniesLocationsTableMigration implements Migration {
  public readonly name = 'M2CreateCompaniesLocationsTableMigration';

  private readonly tableName = 'companies_locations';

  public async up(databaseClient: DatabaseClient): Promise<void> {
    await databaseClient.raw('CREATE EXTENSION IF NOT EXISTS postgis;');

    await databaseClient.schema.createTable(this.tableName, (table) => {
      table.uuid('id').notNullable().primary();

      table.string('name', 64).notNullable();

      table.string('address', 64).nullable();

      table.specificType('geolocation', 'geometry(point, 4326)').notNullable();

      table.uuid('city_id').references('id').inTable('cities').onDelete('CASCADE');

      table.uuid('company_id').references('id').inTable('companies').onDelete('CASCADE');

      table.boolean('is_remote').notNullable();

      table.unique(['company_id', 'name']);
    });

    await databaseClient.raw(
      'CREATE INDEX IF NOT EXISTS location_events_geolocation_index ON location_events USING gist (geolocation);',
    );
  }

  public async down(databaseClient: DatabaseClient): Promise<void> {
    await databaseClient.schema.dropTable(this.tableName);
  }
}
