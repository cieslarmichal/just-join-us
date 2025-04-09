import knex from 'knex';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { v7 as uuid } from 'uuid';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface InputCity {
  readonly Name: string;
  readonly Province: string;
  readonly Latitude: number;
  readonly Longitude: number;
}

const databaseClient = knex({
  client: 'pg',
  connection: {
    host: process.env['DATABASE_HOST'] as string,
    port: 5432,
    user: process.env['DATABASE_USERNAME'] as string,
    password: process.env['DATABASE_PASSWORD'] as string,
    database: process.env['DATABASE_NAME'] as string,
  },
  pool: {
    min: 1,
    max: 10,
  },
  useNullAsDefault: true,
});

const citiesFile = readFileSync(path.resolve(__dirname, '../../../resources/cities.json'), 'utf8');

const cities: InputCity[] = JSON.parse(citiesFile);

const citiesTable = 'cities';

const batchSize = 100;

async function insertCities(): Promise<void> {
  try {
    for (let i = 0; i < cities.length; i += batchSize) {
      const batch = cities.slice(i, i + batchSize).map((city) => ({
        id: uuid(),
        name: city.Name,
        province: city.Province,
        latitude: city.Latitude,
        longitude: city.Longitude,
      }));

      await databaseClient(citiesTable).insert(batch);

      console.log(`Saved ${(batchSize * i).toString()} cities.`);
    }

    console.log('All cities have been saved successfully.');
  } catch (error) {
    console.error('Error inserting cities:', error);
  } finally {
    await databaseClient.destroy();
    console.log('Database connection closed.');
  }
}

await insertCities();
