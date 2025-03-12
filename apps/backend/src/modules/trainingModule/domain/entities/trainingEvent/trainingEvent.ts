interface TrainingEventTrainingState {
  readonly name: string;
  readonly description: string;
  readonly categoryName: string;
  readonly companyName: string;
  readonly companyLogoUrl: string;
}

export interface TrainingEventDraft {
  readonly id: string;
  readonly city: string;
  readonly place?: string | undefined;
  readonly latitude: number;
  readonly longitude: number;
  readonly centPrice: number;
  readonly startsAt: Date;
  readonly endsAt: Date;
  readonly isHidden: boolean;
  readonly trainingId: string;
  readonly training?: TrainingEventTrainingState;
  readonly createdAt: Date;
}

export interface TrainingEventState {
  city: string;
  place?: string;
  latitude: number;
  longitude: number;
  centPrice: number;
  startsAt: Date;
  endsAt: Date;
  isHidden: boolean;
  readonly trainingId: string;
  readonly training?: TrainingEventTrainingState;
  readonly createdAt: Date;
}

export interface SetCityPayload {
  readonly city: string;
}

export interface SetPlacePayload {
  readonly place: string;
}

export interface SetLatitudePayload {
  readonly latitude: number;
}

export interface SetLongitudePayload {
  readonly longitude: number;
}

export interface SetCentPricePayload {
  readonly centPrice: number;
}

export interface SetStartsAtPayload {
  readonly startsAt: Date;
}

export interface SetEndsAtPayload {
  readonly endsAt: Date;
}

export interface SetIsHiddenPayload {
  readonly isHidden: boolean;
}

export class TrainingEvent {
  private id: string;
  private state: TrainingEventState;

  public constructor(draft: TrainingEventDraft) {
    const {
      id,
      city,
      longitude,
      latitude,
      place,
      centPrice,
      startsAt,
      endsAt,
      isHidden,
      trainingId,
      training,
      createdAt,
    } = draft;

    this.id = id;

    let state: TrainingEventState = {
      city,
      longitude,
      latitude,
      centPrice,
      startsAt,
      endsAt,
      isHidden,
      trainingId,
      createdAt,
    };

    if (place !== undefined) {
      state = { ...state, place };
    }

    if (training !== undefined) {
      state = { ...state, training };
    }

    this.state = state;
  }

  public getId(): string {
    return this.id;
  }

  public getCity(): string {
    return this.state.city;
  }

  public getPlace(): string | undefined {
    return this.state.place;
  }

  public getLatitude(): number {
    return this.state.latitude;
  }

  public getLongitude(): number {
    return this.state.longitude;
  }

  public getCentPrice(): number {
    return this.state.centPrice;
  }

  public getStartsAt(): Date {
    return this.state.startsAt;
  }

  public getEndsAt(): Date {
    return this.state.endsAt;
  }

  public getIsHidden(): boolean {
    return this.state.isHidden;
  }

  public getTrainingId(): string {
    return this.state.trainingId;
  }

  public getTraining(): TrainingEventTrainingState | undefined {
    return this.state.training;
  }

  public getCreatedAt(): Date {
    return this.state.createdAt;
  }

  public getState(): TrainingEventState {
    return this.state;
  }

  public setCity(payload: SetCityPayload): void {
    this.state.city = payload.city;
  }

  public setPlace(payload: SetPlacePayload): void {
    this.state.place = payload.place;
  }

  public setLatitude(payload: SetLatitudePayload): void {
    this.state.latitude = payload.latitude;
  }

  public setLongitude(payload: SetLongitudePayload): void {
    this.state.longitude = payload.longitude;
  }

  public setCentPrice(payload: SetCentPricePayload): void {
    this.state.centPrice = payload.centPrice;
  }

  public setStartsAt(payload: SetStartsAtPayload): void {
    this.state.startsAt = payload.startsAt;
  }

  public setEndsAt(payload: SetEndsAtPayload): void {
    this.state.endsAt = payload.endsAt;
  }

  public setIsHidden(payload: SetIsHiddenPayload): void {
    this.state.isHidden = payload.isHidden;
  }
}
