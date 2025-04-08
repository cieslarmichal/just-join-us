import { type DatabaseTable } from '../../../types/databaseTable.ts';

import type { JobOfferSkillRawEntity } from './jobOfferSkillRawEntity.ts';

const tableName = 'job_offers_skills';

export const jobOfferSkillsTable: DatabaseTable<JobOfferSkillRawEntity, typeof tableName> = {
  name: tableName,
  allColumns: `${tableName}.*`,
  columns: {
    id: `${tableName}.id`,
    job_offer_id: `${tableName}.job_offer_id`,
    skill_id: `${tableName}.skill_id`,
  },
};
