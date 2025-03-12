import { type Action } from '../../../../../common/types/action.ts';
import type { Training } from '../../../domain/entities/training/training.ts';

export interface FindTrainingsActionPayload {
  readonly name?: string | undefined;
  readonly companyId: string;
  readonly page: number;
  readonly pageSize: number;
}

export interface FindTrainingsActionResult {
  readonly data: Training[];
  readonly total: number;
}

export type FindTrainingsAction = Action<FindTrainingsActionPayload, FindTrainingsActionResult>;
