import { type HttpController } from '../../../../../common/http/httpController.ts';
import { httpMethodNames } from '../../../../../common/http/httpMethodName.ts';
import { type HttpRequest } from '../../../../../common/http/httpRequest.ts';
import { type HttpCreatedResponse, type HttpOkResponse } from '../../../../../common/http/httpResponse.ts';
import { HttpRoute } from '../../../../../common/http/httpRoute.ts';
import { httpStatusCodes } from '../../../../../common/http/httpStatusCode.ts';
import { type AccessControlService } from '../../../../authModule/application/services/accessControlService/accessControlService.ts';
import type { CreateTrainingAction } from '../../../application/actions/createTrainingAction/createTrainingAction.ts';
import { type FindTrainingAction } from '../../../application/actions/findTrainingAction/findTrainingAction.ts';
import type { FindTrainingsAction } from '../../../application/actions/findTrainingsAction/findTrainingsAction.ts';
import type { UpdateTrainingAction } from '../../../application/actions/updateTrainingAction/updateTrainingAction.ts';
import { type Training } from '../../../domain/entities/training/training.ts';

import {
  createTrainingSchema,
  type CreateTrainingRequestBody,
  type CreateTrainingResponseBody,
} from './schemas/createTrainingSchema.ts';
import {
  findTrainingSchema,
  type FindTrainingPathParams,
  type FindTrainingResponseBody,
} from './schemas/findTrainingSchema.ts';
import {
  findTrainingsSchema,
  type FindTrainingsQueryParams,
  type FindTrainingsResponseBody,
} from './schemas/findTrainingsSchema.ts';
import type { TrainingDto } from './schemas/trainingSchema.ts';
import {
  updateTrainingSchema,
  type UpdateTrainingRequestBody,
  type UpdateTrainingPathParams,
  type UpdateTrainingResponseBody,
} from './schemas/updateTrainingSchema.ts';

export class TrainingHttpController implements HttpController {
  public readonly tags = ['Training'];
  private readonly createTrainingAction: CreateTrainingAction;
  private readonly findTrainingAction: FindTrainingAction;
  private readonly findTrainingsAction: FindTrainingsAction;
  private readonly updateTrainingAction: UpdateTrainingAction;
  private readonly accessControlService: AccessControlService;

  public constructor(
    createTrainingAction: CreateTrainingAction,
    findTrainingAction: FindTrainingAction,
    findTrainingsAction: FindTrainingsAction,
    updateTrainingAction: UpdateTrainingAction,
    accessControlService: AccessControlService,
  ) {
    this.createTrainingAction = createTrainingAction;
    this.findTrainingAction = findTrainingAction;
    this.findTrainingsAction = findTrainingsAction;
    this.updateTrainingAction = updateTrainingAction;
    this.accessControlService = accessControlService;
  }

  public getHttpRoutes(): HttpRoute[] {
    return [
      new HttpRoute({
        method: httpMethodNames.post,
        path: '/trainings',
        handler: this.createTraining.bind(this),
        schema: createTrainingSchema,
        description: 'Create Training',
      }),
      new HttpRoute({
        method: httpMethodNames.get,
        path: '/trainings',
        handler: this.findTrainings.bind(this),
        schema: findTrainingsSchema,
        description: 'Find Trainings',
      }),
      new HttpRoute({
        method: httpMethodNames.get,
        path: '/trainings/:trainingId',
        handler: this.findTraining.bind(this),
        schema: findTrainingSchema,
        description: 'Find Training by id',
      }),
      new HttpRoute({
        method: httpMethodNames.patch,
        path: '/trainings/:trainingId',
        handler: this.updateTraining.bind(this),
        schema: updateTrainingSchema,
        description: 'Update Training',
      }),
    ];
  }

  private async createTraining(
    request: HttpRequest<CreateTrainingRequestBody>,
  ): Promise<HttpCreatedResponse<CreateTrainingResponseBody>> {
    await this.accessControlService.verifyBearerToken({ requestHeaders: request.headers });

    const { name, description, categoryId, companyId } = request.body;

    const { training } = await this.createTrainingAction.execute({
      name,
      description,
      categoryId,
      companyId,
    });

    return {
      statusCode: httpStatusCodes.created,
      body: this.mapTrainingToDto(training),
    };
  }

  private async findTrainings(
    request: HttpRequest<undefined, FindTrainingsQueryParams>,
  ): Promise<HttpOkResponse<FindTrainingsResponseBody>> {
    await this.accessControlService.verifyBearerToken({ requestHeaders: request.headers });

    const { name, companyId, page = 1, pageSize = 10 } = request.queryParams;

    const { data, total } = await this.findTrainingsAction.execute({
      name,
      companyId,
      page,
      pageSize,
    });

    return {
      statusCode: httpStatusCodes.ok,
      body: {
        data: data.map((training) => this.mapTrainingToDto(training)),
        metadata: {
          page,
          pageSize,
          total,
        },
      },
    };
  }

  private async findTraining(
    request: HttpRequest<undefined, undefined, FindTrainingPathParams>,
  ): Promise<HttpOkResponse<FindTrainingResponseBody>> {
    await this.accessControlService.verifyBearerToken({ requestHeaders: request.headers });

    const { trainingId } = request.pathParams;

    const { training } = await this.findTrainingAction.execute({ id: trainingId });

    return {
      statusCode: httpStatusCodes.ok,
      body: this.mapTrainingToDto(training),
    };
  }

  private async updateTraining(
    request: HttpRequest<UpdateTrainingRequestBody, undefined, UpdateTrainingPathParams>,
  ): Promise<HttpOkResponse<UpdateTrainingResponseBody>> {
    await this.accessControlService.verifyBearerToken({ requestHeaders: request.headers });

    const { trainingId } = request.pathParams;

    const { name, description, categoryId, isHidden } = request.body;

    const { training } = await this.updateTrainingAction.execute({
      id: trainingId,
      name,
      description,
      categoryId,
      isHidden,
    });

    return {
      statusCode: httpStatusCodes.ok,
      body: this.mapTrainingToDto(training),
    };
  }

  private mapTrainingToDto(training: Training): TrainingDto {
    const { name, description, isHidden, categoryId, category, companyId, company, createdAt } = training.getState();

    const trainingDto: TrainingDto = {
      id: training.getId(),
      name,
      description,
      isHidden,
      categoryId,
      companyId,
      createdAt: createdAt.toISOString(),
    };

    if (category) {
      trainingDto.category = { name: category.name };
    }

    if (company) {
      trainingDto.company = { name: company.name, logoUrl: company.logoUrl };
    }

    return trainingDto;
  }
}
