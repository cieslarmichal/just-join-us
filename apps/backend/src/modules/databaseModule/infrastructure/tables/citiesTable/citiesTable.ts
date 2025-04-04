import { type DatabaseTable } from '../../../types/databaseTable.ts';

import { type CityRawEntity } from './cityRawEntity.ts';

const citiesTableName = 'cities';

export const citiesTable: DatabaseTable<CityRawEntity, typeof citiesTableName> = {
  name: citiesTableName,
  allColumns: `${citiesTableName}.*`,
  columns: {
    id: `${citiesTableName}.id`,
    name: `${citiesTableName}.name`,
    province: `${citiesTableName}.province`,
    latitude: `${citiesTableName}.latitude`,
    longitude: `${citiesTableName}.longitude`,
  },
};
