import { type DatabaseTable } from '../../../types/databaseTable.ts';

import { type CategoryRawEntity } from './categoryRawEntity.ts';

const categoriesTableName = 'categories';

export const categoriesTable: DatabaseTable<CategoryRawEntity, typeof categoriesTableName> = {
  name: categoriesTableName,
  allColumns: `${categoriesTableName}.*`,
  columns: {
    id: `${categoriesTableName}.id`,
    name: `${categoriesTableName}.name`,
  },
};
