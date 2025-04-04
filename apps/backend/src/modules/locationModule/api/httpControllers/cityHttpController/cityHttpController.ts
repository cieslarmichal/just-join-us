import { type HttpController } from '../../../../../common/http/httpController.ts';
import { httpMethodNames } from '../../../../../common/http/httpMethodName.ts';
import { type HttpRequest } from '../../../../../common/http/httpRequest.ts';
import { type HttpOkResponse } from '../../../../../common/http/httpResponse.ts';
import { HttpRoute } from '../../../../../common/http/httpRoute.ts';
import { httpStatusCodes } from '../../../../../common/http/httpStatusCode.ts';
import type { FindCitiesAction } from '../../../application/actions/findCitiesAction/findCitiesAction.ts';
import type { City } from '../../../domain/entities/city/city.ts';

import type { CityDto } from './schemas/citySchema.ts';
import {
  findCitiesSchema,
  type FindCitiesQueryParams,
  type FindCitiesResponseBody,
} from './schemas/findCitiesSchema.ts';

export class CityHttpController implements HttpController {
  public readonly tags = ['City'];
  private readonly findCitiesAction: FindCitiesAction;

  public constructor(findCategoriesAction: FindCitiesAction) {
    this.findCitiesAction = findCategoriesAction;
  }

  public getHttpRoutes(): HttpRoute[] {
    return [
      new HttpRoute({
        method: httpMethodNames.get,
        path: '/cities',
        handler: this.findCities.bind(this),
        schema: findCitiesSchema,
        description: 'Find cities',
      }),
    ];
  }

  private async findCities(
    request: HttpRequest<undefined, FindCitiesQueryParams>,
  ): Promise<HttpOkResponse<FindCitiesResponseBody>> {
    const { name, type, page = 1, pageSize = 10 } = request.queryParams;

    const { data, total } = await this.findCitiesAction.execute({
      name,
      type,
      page,
      pageSize,
    });

    return {
      statusCode: httpStatusCodes.ok,
      body: {
        data: data.map((city) => this.mapCityToDto(city)),
        metadata: {
          page,
          pageSize,
          total,
        },
      },
    };
  }

  private mapCityToDto(city: City): CityDto {
    return {
      id: city.getId(),
      name: city.getName(),
      province: city.getProvince(),
      latitude: city.getLatitude(),
      longitude: city.getLongitude(),
    };
  }
}
