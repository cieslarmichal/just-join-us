export interface CompanyLocationDraft {
  readonly id: string;
  readonly name: string;
  readonly companyId: string;
  readonly cityId: string;
  readonly cityName?: string | undefined;
  readonly address: string;
  readonly latitude: number;
  readonly longitude: number;
}

export interface CompanyLocationState {
  name: string;
  readonly companyId: string;
  cityId: string;
  cityName?: string;
  address: string;
  latitude: number;
  longitude: number;
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

export class CompanyLocation {
  private id: string;
  private state: CompanyLocationState;

  public constructor(draft: CompanyLocationDraft) {
    const { id, name, companyId, address, cityId, cityName, latitude, longitude } = draft;

    this.id = id;

    let locationState: CompanyLocationState = {
      name,
      companyId,
      cityId,
      address,
      latitude,
      longitude,
    };

    if (cityName) {
      locationState = { ...locationState, cityName };
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

  public getCityName(): string | undefined {
    return this.state.cityName;
  }

  public getLatitude(): number | undefined {
    return this.state.latitude;
  }

  public getLongitude(): number | undefined {
    return this.state.longitude;
  }

  public getCompanyId(): string {
    return this.state.companyId;
  }

  public getState(): CompanyLocationState {
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
