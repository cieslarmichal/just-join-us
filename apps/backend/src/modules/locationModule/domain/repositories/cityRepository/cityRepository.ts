import type { City } from '../../entities/city/city.ts';

export interface FindCityPayload {
  readonly id: string;
}

export interface FindCitiesPayload {
  readonly name?: string | undefined;
  readonly page: number;
  readonly pageSize: number;
}

export interface CountCitiesPayload {
  readonly name?: string | undefined;
}

export interface CityRepository {
  findCity(payload: FindCityPayload): Promise<City | null>;
  findCities(payload: FindCitiesPayload): Promise<City[]>;
  countCities(payload: CountCitiesPayload): Promise<number>;
}
