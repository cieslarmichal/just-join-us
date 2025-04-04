import { type Action } from '../../../../../common/types/action.ts';
import type { Location } from '../../../domain/entities/location/location.ts';

export interface UpdateLocationActionPayload {
  readonly id: string;
  readonly name?: string | undefined;
  readonly address?: string | undefined;
  readonly cityId?: string | undefined;
  readonly latitude?: number | undefined;
  readonly longitude?: number | undefined;
}

export interface UpdateLocationActionResult {
  readonly location: Location;
}

export type UpdateLocationAction = Action<UpdateLocationActionPayload, UpdateLocationActionResult>;
