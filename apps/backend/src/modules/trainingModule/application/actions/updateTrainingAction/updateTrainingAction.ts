import { type Action } from '../../../../../common/types/action.ts';
import type { Training } from '../../../domain/entities/training/training.ts';

export interface UpdateTrainingActionPayload {
  readonly id: string;
  readonly name?: string | undefined;
  readonly description?: string | undefined;
  readonly categoryId?: string | undefined;
  readonly isHidden?: boolean | undefined;
}

export interface UpdateTrainingEventActionResult {
  readonly training: Training;
}

export type UpdateTrainingAction = Action<UpdateTrainingActionPayload, UpdateTrainingEventActionResult>;
