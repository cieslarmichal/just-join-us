import { type Action } from '../../../../../common/types/action.ts';
import type { City } from '../../../domain/entities/city/city.ts';

export interface FindCitiesActionPayload {
  readonly name?: string | undefined;
  readonly type?: string | undefined;
  readonly page: number;
  readonly pageSize: number;
}

export interface FindCitiesActionResult {
  readonly data: City[];
  readonly total: number;
}

export type FindCitiesAction = Action<FindCitiesActionPayload, FindCitiesActionResult>;
