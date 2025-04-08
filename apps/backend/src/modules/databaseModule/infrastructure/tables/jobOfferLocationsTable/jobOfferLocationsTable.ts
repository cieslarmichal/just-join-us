import { type DatabaseTable } from '../../../types/databaseTable.ts';

import type { JobOfferLocationRawEntity } from './jobOfferLocationRawEntity.ts';

const tableName = 'job_offers_locations';

export const jobOfferLocationsTable: DatabaseTable<JobOfferLocationRawEntity, typeof tableName> = {
  name: tableName,
  allColumns: `${tableName}.*`,
  columns: {
    id: `${tableName}.id`,
    company_location_id: `${tableName}.company_location_id`,
    job_offer_id: `${tableName}.job_offer_id`,
  },
};
