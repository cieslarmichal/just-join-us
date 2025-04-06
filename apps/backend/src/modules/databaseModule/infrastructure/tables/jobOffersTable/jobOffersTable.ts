import { type DatabaseTable } from '../../../types/databaseTable.ts';

import { type JobOfferRawEntity } from './jobOfferRawEntity.ts';

const tableName = 'job_offers';

export const jobOffersTable: DatabaseTable<JobOfferRawEntity, typeof tableName> = {
  name: tableName,
  allColumns: `${tableName}.*`,
  columns: {
    id: `${tableName}.id`,
    name: `${tableName}.name`,
    description: `${tableName}.description`,
    is_hidden: `${tableName}.is_hidden`,
    category_id: `${tableName}.category_id`,
    company_id: `${tableName}.company_id`,
    employment_type: `${tableName}.employment_type`,
    working_time: `${tableName}.working_time`,
    experience_level: `${tableName}.experience_level`,
    min_salary: `${tableName}.min_salary`,
    max_salary: `${tableName}.max_salary`,
    created_at: `${tableName}.created_at`,
  },
};
