import { type DatabaseTable } from '../../../types/databaseTable.ts';

import { type CandidateRawEntity } from './candidateRawEntity.ts';

const tableName = 'candidates';

export const candidatesTable: DatabaseTable<CandidateRawEntity, typeof tableName> = {
  name: tableName,
  allColumns: `${tableName}.*`,
  columns: {
    id: `${tableName}.id`,
    first_name: `${tableName}.first_name`,
    last_name: `${tableName}.last_name`,
    resume_url: `${tableName}.resume_url`,
    linkedin_url: `${tableName}.linkedin_url`,
    github_url: `${tableName}.github_url`,
  },
};
