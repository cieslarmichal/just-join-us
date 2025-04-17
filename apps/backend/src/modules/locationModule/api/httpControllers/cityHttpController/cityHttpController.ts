import { type HttpController } from '../../../../../common/http/httpController.ts';
import { httpMethodNames } from '../../../../../common/http/httpMethodName.ts';
import { type HttpRequest } from '../../../../../common/http/httpRequest.ts';
import { type HttpOkResponse } from '../../../../../common/http/httpResponse.ts';
import { HttpRoute } from '../../../../../common/http/httpRoute.ts';
import { httpStatusCodes } from '../../../../../common/http/httpStatusCode.ts';
import type { FindCitiesAction } from '../../../application/actions/findCitiesAction/findCitiesAction.ts';
import type { FindCityAction } from '../../../application/actions/findCityAction/findCityAction.ts';
import type { City } from '../../../domain/entities/city/city.ts';

import type { CityDto } from './schemas/citySchema.ts';
import {
  findCitiesSchema,
  type FindCitiesQueryParams,
  type FindCitiesResponseBody,
} from './schemas/findCitiesSchema.ts';
import { findCitySchema, type FindCityPathParams } from './schemas/findCity.ts';

export class CityHttpController implements HttpController {
  public readonly tags = ['City'];
  private readonly findCitiesAction: FindCitiesAction;
  private readonly findCityAction: FindCityAction;

  public constructor(findCategoriesAction: FindCitiesAction, findCityAction: FindCityAction) {
    this.findCitiesAction = findCategoriesAction;
    this.findCityAction = findCityAction;
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
      new HttpRoute({
        method: httpMethodNames.get,
        path: '/cities/:slug',
        handler: this.findCity.bind(this),
        schema: findCitySchema,
        description: 'Find city by slug',
      }),
    ];
  }

  private async findCities(
    request: HttpRequest<undefined, FindCitiesQueryParams>,
  ): Promise<HttpOkResponse<FindCitiesResponseBody>> {
    const { name, page = 1, pageSize = 10 } = request.queryParams;

    const { data, total } = await this.findCitiesAction.execute({
      name,
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

  private async findCity(
    request: HttpRequest<undefined, undefined, FindCityPathParams>,
  ): Promise<HttpOkResponse<CityDto>> {
    const { slug } = request.pathParams;

    const { city } = await this.findCityAction.execute({ slug });

    return {
      statusCode: httpStatusCodes.ok,
      body: this.mapCityToDto(city),
    };
  }

  private mapCityToDto(city: City): CityDto {
    return {
      id: city.getId(),
      name: city.getName(),
      slug: city.getSlug(),
      province: city.getProvince(),
      latitude: city.getLatitude(),
      longitude: city.getLongitude(),
    };
  }
}
