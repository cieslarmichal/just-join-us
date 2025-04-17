import { type DatabaseTable } from '../../../types/databaseTable.ts';

import { type CityRawEntity } from './cityRawEntity.ts';

const tableName = 'cities';

export const citiesTable: DatabaseTable<CityRawEntity, typeof tableName> = {
  name: tableName,
  allColumns: `${tableName}.*`,
  columns: {
    id: `${tableName}.id`,
    name: `${tableName}.name`,
    slug: `${tableName}.slug`,
    province: `${tableName}.province`,
    latitude: `${tableName}.latitude`,
    longitude: `${tableName}.longitude`,
  },
};
