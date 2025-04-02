import { type DatabaseTable } from '../../../types/databaseTable.ts';

import { type TrainingEventEnrollmentRawEntity } from './trainingEventEnrollmentRawEntity.ts';

const trainingEventEnrollmentsTableName = 'training_event_enrollments';

export const trainingEventEnrollmentsTable: DatabaseTable<
  TrainingEventEnrollmentRawEntity,
  typeof trainingEventEnrollmentsTableName
> = {
  name: trainingEventEnrollmentsTableName,
  allColumns: `${trainingEventEnrollmentsTableName}.*`,
  columns: {
    id: `${trainingEventEnrollmentsTableName}.id`,
    candidate_id: `${trainingEventEnrollmentsTableName}.candidate_id`,
    training_event_id: `${trainingEventEnrollmentsTableName}.training_event_id`,
    created_at: `${trainingEventEnrollmentsTableName}.created_at`,
  },
};
