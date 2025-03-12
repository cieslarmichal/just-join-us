import { type Action } from '../../../../../common/types/action.ts';
import type { TrainingEvent } from '../../../domain/entities/trainingEvent/trainingEvent.ts';

export interface FindTrainingEventsActionPayload {
  readonly trainingName?: string | undefined;
  readonly categoryId?: string | undefined;
  readonly companyId?: string | undefined;
  readonly latitude?: number | undefined;
  readonly longitude?: number | undefined;
  readonly radius?: number | undefined;
  readonly page: number;
  readonly pageSize: number;
}

export interface FindTrainingEventsActionResult {
  readonly data: TrainingEvent[];
  readonly total: number;
}

export type FindTrainingEventsAction = Action<FindTrainingEventsActionPayload, FindTrainingEventsActionResult>;
