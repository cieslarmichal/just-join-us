import { type DatabaseTable } from '../../../types/databaseTable.ts';

import { type EmailEventRawEntity } from './emailEventRawEntity.ts';

const tableName = 'email_events';

export const emailEventsTable: DatabaseTable<EmailEventRawEntity, typeof tableName> = {
  name: tableName,
  allColumns: `${tableName}.*`,
  columns: {
    id: `${tableName}.id`,
    payload: `${tableName}.payload`,
    event_name: `${tableName}.event_name`,
    status: `${tableName}.status`,
    created_at: `${tableName}.created_at`,
  },
};
