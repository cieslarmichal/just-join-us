import { type Params } from 'react-router-dom';

import { getTrainingEvent } from '../../api/queries/getTrainingEvent';
import { type TrainingEvent } from '../../api/types/trainingEvent';

export interface DetailsLoaderResult {
  readonly trainingEvent: TrainingEvent;
}

export async function detailsLoader({ params }: { params: Params }): Promise<DetailsLoaderResult> {
  const { id } = params;

  if (!id) {
    throw new Error('Missing training event id');
  }

  const trainingEvent = await getTrainingEvent(id);

  return {
    trainingEvent,
  };
}
