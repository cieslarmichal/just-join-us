import type { DatabaseClient } from '../../../types/databaseClient.ts';
import type { Migration } from '../../../types/migration.ts';

export class M3CreateJobOffersTableMigration implements Migration {
  public readonly name = 'M3CreateJobOffersTableMigration';

  public async up(databaseClient: DatabaseClient): Promise<void> {
    await databaseClient.schema.createTable('job_offers', (table) => {
      table.uuid('id').notNullable().primary();

      table.string('name', 64).notNullable();

      table.text('description').notNullable();

      table.boolean('is_hidden').notNullable().defaultTo(false);

      table.string('employment_type', 20).notNullable();

      table.string('working_time', 20).notNullable();

      table.string('experience_level', 20).notNullable();

      table.integer('min_salary').notNullable();

      table.integer('max_salary').notNullable();

      table.uuid('category_id').notNullable().references('id').inTable('categories').onDelete('CASCADE');

      table.uuid('company_id').notNullable().references('id').inTable('companies').onDelete('CASCADE');

      table.unique(['company_id', 'name']);

      table.timestamp('created_at').notNullable().defaultTo(databaseClient.raw('CURRENT_TIMESTAMP'));
    });

    await databaseClient.raw('CREATE EXTENSION IF NOT EXISTS pg_trgm;');

    await databaseClient.raw(
      'CREATE INDEX IF NOT EXISTS job_offers_name_gin_index ON job_offers USING gin (name gin_trgm_ops);',
    );

    await databaseClient.schema.createTable('job_offers_skills', (table) => {
      table.uuid('id').notNullable().primary();

      table.uuid('job_offer_id').notNullable().references('id').inTable('job_offers').onDelete('CASCADE');

      table.uuid('skill_id').notNullable().references('id').inTable('skills').onDelete('CASCADE');
    });

    await databaseClient.schema.createTable('job_offers_locations', (table) => {
      table.uuid('id').notNullable().primary();

      table.uuid('job_offer_id').notNullable().references('id').inTable('job_offers').onDelete('CASCADE');

      table
        .uuid('company_location_id')
        .notNullable()
        .references('id')
        .inTable('companies_locations')
        .onDelete('CASCADE');
    });
  }

  public async down(databaseClient: DatabaseClient): Promise<void> {
    await databaseClient.schema.dropTable('job_offers');

    await databaseClient.schema.dropTable('job_offers_skills');
  }
}
