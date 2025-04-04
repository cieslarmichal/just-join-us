import { type DatabaseTable } from '../../../types/databaseTable.ts';

import { type CategoryRawEntity } from './categoryRawEntity.ts';

const tableName = 'categories';

export const categoriesTable: DatabaseTable<CategoryRawEntity, typeof tableName> = {
  name: tableName,
  allColumns: `${tableName}.*`,
  columns: {
    id: `${tableName}.id`,
    name: `${tableName}.name`,
  },
};
