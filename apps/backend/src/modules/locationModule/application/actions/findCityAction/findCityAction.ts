import { type Action } from '../../../../../common/types/action.ts';
import type { City } from '../../../domain/entities/city/city.ts';

export interface FindCityActionPayload {
  readonly slug: string;
}

export interface FindCityActionResult {
  readonly city: City;
}

export type FindCityAction = Action<FindCityActionPayload, FindCityActionResult>;
