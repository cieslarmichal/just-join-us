import { type LocationState, type Location } from '../../entities/location/location.ts';

export interface CreateLocationPayload {
  readonly data: Omit<LocationState, 'id'>;
}

export interface UpdateLocationPayload {
  readonly location: Location;
}

export interface FindLocationPayload {
  readonly id?: string;
  readonly companyId?: string;
  readonly name?: string;
}

export interface FindLocationsPayload {
  readonly ids?: string[] | undefined;
  readonly name?: string | undefined;
  readonly companyId?: string | undefined;
  readonly isRemote?: boolean | undefined;
}

export interface LocationRepository {
  createLocation(payload: CreateLocationPayload): Promise<Location>;
  updateLocation(payload: UpdateLocationPayload): Promise<Location>;
  findLocation(payload: FindLocationPayload): Promise<Location | null>;
  findLocations(payload: FindLocationsPayload): Promise<Location[]>;
}
