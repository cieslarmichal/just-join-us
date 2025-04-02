import { type DatabaseTable } from '../../../types/databaseTable.ts';

import { type CandidateRawEntity } from './candidateRawEntity.ts';

const candidatesTableName = 'candidates';

export const candidatesTable: DatabaseTable<CandidateRawEntity, typeof candidatesTableName> = {
  name: candidatesTableName,
  allColumns: `${candidatesTableName}.*`,
  columns: {
    id: `${candidatesTableName}.id`,
    first_name: `${candidatesTableName}.first_name`,
    last_name: `${candidatesTableName}.last_name`,
    birth_date: `${candidatesTableName}.birth_date`,
    phone: `${candidatesTableName}.phone`,
  },
};
