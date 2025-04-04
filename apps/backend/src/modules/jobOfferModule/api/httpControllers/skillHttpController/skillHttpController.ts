import { type HttpController } from '../../../../../common/http/httpController.ts';
import { httpMethodNames } from '../../../../../common/http/httpMethodName.ts';
import { type HttpRequest } from '../../../../../common/http/httpRequest.ts';
import { type HttpOkResponse } from '../../../../../common/http/httpResponse.ts';
import { HttpRoute } from '../../../../../common/http/httpRoute.ts';
import { httpStatusCodes } from '../../../../../common/http/httpStatusCode.ts';
import { type AccessControlService } from '../../../../authModule/application/services/accessControlService/accessControlService.ts';
import type { FindSkillsAction } from '../../../application/actions/findSkillsAction/findSkillsAction.ts';
import type { Skill } from '../../../domain/entities/skill/skill.ts';

import {
  findSkillsSchema,
  type FindSkillsQueryParams,
  type FindSkillsResponseBody,
} from './schemas/findSkillsSchema.ts';
import type { SkillDto } from './schemas/skillSchema.ts';

export class SkillHttpController implements HttpController {
  public readonly tags = ['Skill'];
  private readonly findSkillsAction: FindSkillsAction;
  private readonly accessControlService: AccessControlService;

  public constructor(findSkillsAction: FindSkillsAction, accessControlService: AccessControlService) {
    this.findSkillsAction = findSkillsAction;
    this.accessControlService = accessControlService;
  }

  public getHttpRoutes(): HttpRoute[] {
    return [
      new HttpRoute({
        method: httpMethodNames.get,
        path: '/skills',
        handler: this.findSkills.bind(this),
        schema: findSkillsSchema,
        description: 'Find skills',
      }),
    ];
  }

  private async findSkills(
    request: HttpRequest<undefined, FindSkillsQueryParams>,
  ): Promise<HttpOkResponse<FindSkillsResponseBody>> {
    await this.accessControlService.verifyBearerToken({ requestHeaders: request.headers });

    const { name, page = 1, pageSize = 10 } = request.queryParams;

    const { data, total } = await this.findSkillsAction.execute({
      name,
      page,
      pageSize,
    });

    return {
      statusCode: httpStatusCodes.ok,
      body: {
        data: data.map((skill) => this.mapSkillToDto(skill)),
        metadata: {
          page,
          pageSize,
          total,
        },
      },
    };
  }

  private mapSkillToDto(skill: Skill): SkillDto {
    return {
      id: skill.getId(),
      name: skill.getName(),
    };
  }
}
