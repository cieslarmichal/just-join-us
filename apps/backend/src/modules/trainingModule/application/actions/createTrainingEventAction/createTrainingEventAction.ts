import { type Action } from '../../../../../common/types/action.ts';
import { type TrainingEvent } from '../../../domain/entities/trainingEvent/trainingEvent.ts';

export interface CreateTrainingEventActionPayload {
  readonly city: string;
  readonly place?: string | undefined;
  readonly latitude: number;
  readonly longitude: number;
  readonly centPrice: number;
  readonly startsAt: Date;
  readonly endsAt: Date;
  readonly trainingId: string;
}

export interface CreateTrainingEventActionResult {
  readonly trainingEvent: TrainingEvent;
}

export type CreateTrainingEventAction = Action<CreateTrainingEventActionPayload, CreateTrainingEventActionResult>;
