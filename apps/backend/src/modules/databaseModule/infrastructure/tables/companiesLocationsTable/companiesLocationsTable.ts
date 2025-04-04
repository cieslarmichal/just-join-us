import { type DatabaseTable } from '../../../types/databaseTable.ts';

import { type CompanyLocationRawEntity } from './companyLocationRawEntity.ts';

const tableName = 'companies_locations';

export const companiesLocationsTable: DatabaseTable<CompanyLocationRawEntity, typeof tableName> = {
  name: tableName,
  allColumns: `${tableName}.*`,
  columns: {
    id: `${tableName}.id`,
    city_id: `${tableName}.city_id`,
    company_id: `${tableName}.company_id`,
    name: `${tableName}.name`,
    latitude: `${tableName}.latitude`,
    longitude: `${tableName}.longitude`,
    is_remote: `${tableName}.is_remote`,
    address: `${tableName}.address`,
    geolocation: `${tableName}.geolocation`,
  },
};
