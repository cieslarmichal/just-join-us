import { type DatabaseTable } from '../../../types/databaseTable.ts';

import { type EmailEventRawEntity } from './emailEventRawEntity.ts';

const emailEventsTableName = 'email_events';

export const emailEventsTable: DatabaseTable<EmailEventRawEntity, typeof emailEventsTableName> = {
  name: emailEventsTableName,
  allColumns: `${emailEventsTableName}.*`,
  columns: {
    id: `${emailEventsTableName}.id`,
    payload: `${emailEventsTableName}.payload`,
    event_name: `${emailEventsTableName}.event_name`,
    status: `${emailEventsTableName}.status`,
    created_at: `${emailEventsTableName}.created_at`,
  },
};
