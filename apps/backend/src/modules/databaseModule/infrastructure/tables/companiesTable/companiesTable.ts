import { type DatabaseTable } from '../../../types/databaseTable.ts';

import { type CompanyRawEntity } from './companyRawEntity.ts';

const tableName = 'companies';

export const companiesTable: DatabaseTable<CompanyRawEntity, typeof tableName> = {
  name: tableName,
  allColumns: `${tableName}.*`,
  columns: {
    id: `${tableName}.id`,
    name: `${tableName}.name`,
    description: `${tableName}.description`,
    phone: `${tableName}.phone`,
    logo_url: `${tableName}.logo_url`,
  },
};
