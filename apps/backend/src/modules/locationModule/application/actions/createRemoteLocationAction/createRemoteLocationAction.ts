import { type Action } from '../../../../../common/types/action.ts';
import type { Location } from '../../../domain/entities/location/location.ts';

export interface CreateRemoteLocationActionPayload {
  readonly name: string;
  readonly companyId: string;
}

export interface CreateRemoteLocationActionResult {
  readonly location: Location;
}

export type CreateRemoteLocationAction = Action<CreateRemoteLocationActionPayload, CreateRemoteLocationActionResult>;
