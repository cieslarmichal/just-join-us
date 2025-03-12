import { type DatabaseTable } from '../../../types/databaseTable.ts';

import { type StudentRawEntity } from './studentRawEntity.ts';

const studentsTableName = 'students';

export const studentsTable: DatabaseTable<StudentRawEntity, typeof studentsTableName> = {
  name: studentsTableName,
  allColumns: `${studentsTableName}.*`,
  columns: {
    id: `${studentsTableName}.id`,
    first_name: `${studentsTableName}.first_name`,
    last_name: `${studentsTableName}.last_name`,
    birth_date: `${studentsTableName}.birth_date`,
    phone_number: `${studentsTableName}.phone_number`,
  },
};
