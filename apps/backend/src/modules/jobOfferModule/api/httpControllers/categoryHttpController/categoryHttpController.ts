import { type HttpController } from '../../../../../common/http/httpController.ts';
import { httpMethodNames } from '../../../../../common/http/httpMethodName.ts';
import { type HttpRequest } from '../../../../../common/http/httpRequest.ts';
import { type HttpOkResponse } from '../../../../../common/http/httpResponse.ts';
import { HttpRoute } from '../../../../../common/http/httpRoute.ts';
import { httpStatusCodes } from '../../../../../common/http/httpStatusCode.ts';
import type { FindCategoriesAction } from '../../../application/actions/findCategoriesAction/findCategoriesAction.ts';
import type { Category } from '../../../domain/entities/category/category.ts';

import type { CategoryDto } from './schemas/categorySchema.ts';
import {
  findCategoriesSchema,
  type FindCategoriesQueryParams,
  type FindCategoriesResponseBody,
} from './schemas/findCategoriesSchema.ts';

export class CategoryHttpController implements HttpController {
  public readonly tags = ['Category'];
  private readonly findCategoriesAction: FindCategoriesAction;

  public constructor(findCategoriesAction: FindCategoriesAction) {
    this.findCategoriesAction = findCategoriesAction;
  }

  public getHttpRoutes(): HttpRoute[] {
    return [
      new HttpRoute({
        method: httpMethodNames.get,
        path: '/categories',
        handler: this.findCategories.bind(this),
        schema: findCategoriesSchema,
        description: 'Find categories',
      }),
    ];
  }

  private async findCategories(
    request: HttpRequest<undefined, FindCategoriesQueryParams>,
  ): Promise<HttpOkResponse<FindCategoriesResponseBody>> {
    const { name, page = 1, pageSize = 10 } = request.queryParams;

    const { data, total } = await this.findCategoriesAction.execute({
      name,
      page,
      pageSize,
    });

    return {
      statusCode: httpStatusCodes.ok,
      body: {
        data: data.map((category) => this.mapCategoryToDto(category)),
        metadata: {
          page,
          pageSize,
          total,
        },
      },
    };
  }

  private mapCategoryToDto(category: Category): CategoryDto {
    return {
      id: category.getId(),
      name: category.getName(),
      slug: category.getSlug(),
    };
  }
}
