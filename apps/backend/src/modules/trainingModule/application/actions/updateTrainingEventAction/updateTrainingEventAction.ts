import { type Action } from '../../../../../common/types/action.ts';
import { type TrainingEvent } from '../../../domain/entities/trainingEvent/trainingEvent.ts';

export interface UpdateTrainingEventActionPayload {
  readonly id: string;
  readonly city?: string | undefined;
  readonly place?: string | undefined;
  readonly latitude?: number | undefined;
  readonly longitude?: number | undefined;
  readonly centPrice?: number | undefined;
  readonly startsAt?: Date | undefined;
  readonly endsAt?: Date | undefined;
  readonly isHidden?: boolean | undefined;
}

export interface UpdateTrainingEventActionResult {
  readonly trainingEvent: TrainingEvent;
}

export type UpdateTrainingEventAction = Action<UpdateTrainingEventActionPayload, UpdateTrainingEventActionResult>;
