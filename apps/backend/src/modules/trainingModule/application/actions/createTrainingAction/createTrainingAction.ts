import { type Action } from '../../../../../common/types/action.ts';
import type { Training } from '../../../domain/entities/training/training.ts';

export interface CreateTrainingActionPayload {
  readonly name: string;
  readonly description: string;
  readonly categoryId: string;
  readonly companyId: string;
}

export interface CreateTrainingActionResult {
  readonly training: Training;
}

export type CreateTrainingAction = Action<CreateTrainingActionPayload, CreateTrainingActionResult>;
