import type { CityRepository } from '../../../domain/repositories/cityRepository/cityRepository.ts';

import {
  type FindCitiesAction,
  type FindCitiesActionPayload,
  type FindCitiesActionResult,
} from './findCitiesAction.ts';

export class FindCitiesActionImpl implements FindCitiesAction {
  private readonly cityRepository: CityRepository;

  public constructor(cityRepository: CityRepository) {
    this.cityRepository = cityRepository;
  }

  public async execute(payload: FindCitiesActionPayload): Promise<FindCitiesActionResult> {
    const { name, page, pageSize } = payload;

    const [categories, total] = await Promise.all([
      this.cityRepository.findCities({ name, page, pageSize }),
      this.cityRepository.countCities({ name }),
    ]);

    return { data: categories, total };
  }
}
