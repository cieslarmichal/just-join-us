import knex from 'knex';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { v7 as uuid } from 'uuid';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface InputCity {
  readonly Name: string;
  readonly Type: string;
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

const cities = (JSON.parse(citiesFile) as InputCity[]).filter((city) => city.Type === 'city');

const citiesTable = 'cities';

function generateSlug(name: string, province?: string): string {
  const polishCharactersMapping: Record<string, string> = {
    ą: 'a',
    ć: 'c',
    ę: 'e',
    ł: 'l',
    ń: 'n',
    ó: 'o',
    ś: 's',
    ż: 'z',
    ź: 'z',
  };

  let input = name;

  if (province) {
    input += ` ${province}`;
  }

  return input
    .replace(/\s+/g, '-')
    .toLowerCase()
    .replace(/[ąćęłńóśź]/g, (char) => polishCharactersMapping[char] || char);
}

async function insertCities(): Promise<void> {
  let i = 0;

  for (const city of cities) {
    const rawEntity = {
      id: uuid(),
      name: city.Name,
      slug: generateSlug(city.Name),
      province: city.Province,
      latitude: city.Latitude,
      longitude: city.Longitude,
    };

    try {
      await databaseClient(citiesTable).insert(rawEntity);
    } catch {
      rawEntity.slug = generateSlug(city.Name, city.Province);

      await databaseClient(citiesTable).insert(rawEntity);
    }

    i++;

    console.log(`Saved ${i.toString()}/${cities.length.toString()} cities.`);
  }

  console.log('All cities have been saved successfully.');
}

try {
  await insertCities();
} catch (error) {
  console.error('Error inserting cities:', error);
} finally {
  await databaseClient.destroy();
}
