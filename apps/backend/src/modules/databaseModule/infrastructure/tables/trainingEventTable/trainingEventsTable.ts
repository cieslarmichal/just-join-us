import { type DatabaseTable } from '../../../types/databaseTable.ts';

import { type TrainingEventRawEntity } from './trainingEventRawEntity.ts';

const trainingEventsTableName = 'training_events';

export const trainingEventsTable: DatabaseTable<TrainingEventRawEntity, typeof trainingEventsTableName> = {
  name: trainingEventsTableName,
  allColumns: `${trainingEventsTableName}.*`,
  columns: {
    id: `${trainingEventsTableName}.id`,
    city: `${trainingEventsTableName}.city`,
    place: `${trainingEventsTableName}.place`,
    latitude: `${trainingEventsTableName}.latitude`,
    longitude: `${trainingEventsTableName}.longitude`,
    cent_price: `${trainingEventsTableName}.cent_price`,
    training_id: `${trainingEventsTableName}.training_id`,
    starts_at: `${trainingEventsTableName}.starts_at`,
    ends_at: `${trainingEventsTableName}.ends_at`,
    is_hidden: `${trainingEventsTableName}.is_hidden`,
    created_at: `${trainingEventsTableName}.created_at`,
  },
};
