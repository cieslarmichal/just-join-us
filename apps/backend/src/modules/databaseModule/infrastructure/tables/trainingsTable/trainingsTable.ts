import { type DatabaseTable } from '../../../types/databaseTable.ts';

import { type TrainingRawEntity } from './trainingRawEntity.ts';

const trainingsTableName = 'trainings';

export const trainingsTable: DatabaseTable<TrainingRawEntity, typeof trainingsTableName> = {
  name: trainingsTableName,
  allColumns: `${trainingsTableName}.*`,
  columns: {
    id: `${trainingsTableName}.id`,
    name: `${trainingsTableName}.name`,
    description: `${trainingsTableName}.description`,
    is_hidden: `${trainingsTableName}.is_hidden`,
    category_id: `${trainingsTableName}.category_id`,
    company_id: `${trainingsTableName}.company_id`,
    created_at: `${trainingsTableName}.created_at`,
  },
};
