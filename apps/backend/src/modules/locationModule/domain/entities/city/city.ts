export interface CityDraft {
  readonly id: string;
  readonly name: string;
  readonly slug: string;
  readonly province: string;
  readonly latitude: number;
  readonly longitude: number;
}

export interface CityState {
  readonly name: string;
  readonly slug: string;
  readonly province: string;
  readonly latitude: number;
  readonly longitude: number;
}

export class City {
  private id: string;
  private state: CityState;

  public constructor(draft: CityDraft) {
    const { id, name, slug, province, latitude, longitude } = draft;

    this.id = id;

    this.state = { name, slug, province, latitude, longitude };
  }

  public getId(): string {
    return this.id;
  }

  public getName(): string {
    return this.state.name;
  }

  public getSlug(): string {
    return this.state.slug;
  }

  public getProvince(): string {
    return this.state.province;
  }

  public getLatitude(): number {
    return this.state.latitude;
  }

  public getLongitude(): number {
    return this.state.longitude;
  }

  public getState(): CityState {
    return this.state;
  }
}
