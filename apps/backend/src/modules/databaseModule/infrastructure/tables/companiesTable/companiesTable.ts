import { type DatabaseTable } from '../../../types/databaseTable.ts';

import { type CompanyRawEntity } from './companyRawEntity.ts';

const companiesTableName = 'companies';

export const companiesTable: DatabaseTable<CompanyRawEntity, typeof companiesTableName> = {
  name: companiesTableName,
  allColumns: `${companiesTableName}.*`,
  columns: {
    id: `${companiesTableName}.id`,
    name: `${companiesTableName}.name`,
    tax_id_number: `${companiesTableName}.tax_id_number`,
    phone_number: `${companiesTableName}.phone_number`,
    is_verified: `${companiesTableName}.is_verified`,
    logo_url: `${companiesTableName}.logo_url`,
  },
};
