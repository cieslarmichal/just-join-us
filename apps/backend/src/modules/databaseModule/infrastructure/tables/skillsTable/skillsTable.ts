import { type DatabaseTable } from '../../../types/databaseTable.ts';

import type { SkillRawEntity } from './skillRawEntity.ts';

const tableName = 'skills';

export const skillsTable: DatabaseTable<SkillRawEntity, typeof tableName> = {
  name: tableName,
  allColumns: `${tableName}.*`,
  columns: {
    id: `${tableName}.id`,
    name: `${tableName}.name`,
  },
};
