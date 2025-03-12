import { type Action } from '../../../../../common/types/action.ts';
import { type TrainingEvent } from '../../../domain/entities/trainingEvent/trainingEvent.ts';

export interface FindTrainingEventActionPayload {
  readonly id: string;
}

export interface FindTrainingEventActionResult {
  readonly trainingEvent: TrainingEvent;
}

export type FindTrainingEventAction = Action<FindTrainingEventActionPayload, FindTrainingEventActionResult>;
