import { type Action } from '../../../../../common/types/action.ts';
import type { Location } from '../../../domain/entities/location/location.ts';

export interface CreateLocationActionPayload {
  readonly companyId: string;
  readonly name: string;
  readonly cityId: string;
  readonly address: string;
  readonly latitude: number;
  readonly longitude: number;
}

export interface CreateLocationActionResult {
  readonly location: Location;
}

export type CreateLocationAction = Action<CreateLocationActionPayload, CreateLocationActionResult>;
