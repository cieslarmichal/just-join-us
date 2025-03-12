import { type Action } from '../../../../../common/types/action.ts';
import { type Training } from '../../../domain/entities/training/training.ts';

export interface FindTrainingActionPayload {
  readonly id: string;
}

export interface FindTrainingActionResult {
  readonly training: Training;
}

export type FindTrainingAction = Action<FindTrainingActionPayload, FindTrainingActionResult>;
