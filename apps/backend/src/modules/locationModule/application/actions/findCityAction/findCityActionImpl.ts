import { ResourceNotFoundError } from '../../../../../common/errors/resourceNotFoundError.ts';
import type { CityRepository } from '../../../domain/repositories/cityRepository/cityRepository.ts';

import { type FindCityAction, type FindCityActionPayload, type FindCityActionResult } from './findCityAction.ts';

export class FindCityActionImpl implements FindCityAction {
  private readonly cityRepository: CityRepository;

  public constructor(cityRepository: CityRepository) {
    this.cityRepository = cityRepository;
  }

  public async execute(payload: FindCityActionPayload): Promise<FindCityActionResult> {
    const { slug } = payload;

    const city = await this.cityRepository.findCity({ slug });

    if (!city) {
      throw new ResourceNotFoundError({
        resource: 'City',
        slug,
      });
    }

    return { city };
  }
}
