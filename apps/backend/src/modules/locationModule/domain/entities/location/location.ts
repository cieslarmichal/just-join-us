export interface LocationDraft {
  readonly id: string;
  readonly name: string;
  readonly companyId: string;
  readonly isRemote: boolean;
  readonly cityId?: string | undefined;
  readonly address?: string | undefined;
  readonly latitude?: number | undefined;
  readonly longitude?: number | undefined;
}

export interface LocationState {
  name: string;
  readonly companyId: string;
  readonly isRemote: boolean;
  cityId?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
}

export interface SetNamePayload {
  readonly name: string;
}

export interface SetCityId {
  readonly cityId: string;
}

export interface SetAddressPayload {
  readonly address: string;
}

export interface SetLatitudePayload {
  readonly latitude: number;
}

export interface SetLongitudePayload {
  readonly longitude: number;
}

export class Location {
  private id: string;
  private state: LocationState;

  public constructor(draft: LocationDraft) {
    const { id, name, companyId, isRemote, address, cityId, latitude, longitude } = draft;

    this.id = id;

    let locationState: LocationState = {
      name,
      companyId,
      isRemote,
    };

    if (address) {
      locationState = { ...locationState, address };
    }

    if (cityId) {
      locationState = { ...locationState, cityId };
    }

    if (latitude !== undefined) {
      locationState = { ...locationState, latitude };
    }

    if (longitude !== undefined) {
      locationState = { ...locationState, longitude };
    }

    this.state = locationState;
  }

  public getId(): string {
    return this.id;
  }

  public getName(): string {
    return this.state.name;
  }

  public getAddress(): string | undefined {
    return this.state.address;
  }

  public getCityId(): string | undefined {
    return this.state.cityId;
  }

  public getLatitude(): number | undefined {
    return this.state.latitude;
  }

  public getLongitude(): number | undefined {
    return this.state.longitude;
  }

  public getIsRemote(): boolean {
    return this.state.isRemote;
  }

  public getCompanyId(): string {
    return this.state.companyId;
  }

  public getState(): LocationState {
    return this.state;
  }

  public setName(payload: SetNamePayload): void {
    this.state.name = payload.name;
  }

  public setCityId(payload: SetCityId): void {
    this.state.cityId = payload.cityId;
  }

  public setAddress(payload: SetAddressPayload): void {
    this.state.address = payload.address;
  }

  public setLatitude(payload: SetLatitudePayload): void {
    this.state.latitude = payload.latitude;
  }

  public setLongitude(payload: SetLongitudePayload): void {
    this.state.longitude = payload.longitude;
  }
}
