import { type HttpController } from '../../../../../common/http/httpController.ts';
import { httpMethodNames } from '../../../../../common/http/httpMethodName.ts';
import { type HttpRequest } from '../../../../../common/http/httpRequest.ts';
import { type HttpCreatedResponse, type HttpOkResponse } from '../../../../../common/http/httpResponse.ts';
import { HttpRoute } from '../../../../../common/http/httpRoute.ts';
import { httpStatusCodes } from '../../../../../common/http/httpStatusCode.ts';
import { type AccessControlService } from '../../../../authModule/application/services/accessControlService/accessControlService.ts';
import type { CreateTrainingAction } from '../../../application/actions/createTrainingAction/createTrainingAction.ts';
import { type CreateTrainingEventAction } from '../../../application/actions/createTrainingEventAction/createTrainingEventAction.ts';
import { type FindTrainingAction } from '../../../application/actions/findTrainingAction/findTrainingAction.ts';
import type { FindTrainingEventAction } from '../../../application/actions/findTrainingEventAction/findTrainingEventAction.ts';
import type { FindTrainingEventsAction } from '../../../application/actions/findTrainingEventsAction/findTrainingEventsAction.ts';
import type { FindTrainingsAction } from '../../../application/actions/findTrainingsAction/findTrainingsAction.ts';
import type { UpdateTrainingAction } from '../../../application/actions/updateTrainingAction/updateTrainingAction.ts';
import type { UpdateTrainingEventAction } from '../../../application/actions/updateTrainingEventAction/updateTrainingEventAction.ts';
import { type Training } from '../../../domain/entities/training/training.ts';
import { type TrainingEvent } from '../../../domain/entities/trainingEvent/trainingEvent.ts';

import {
  createTrainingEventSchema,
  type CreateTrainingEventRequestBody,
  type CreateTrainingEventResponseBody,
} from './schemas/createTrainingEventSchema.ts';
import {
  createTrainingSchema,
  type CreateTrainingRequestBody,
  type CreateTrainingResponseBody,
} from './schemas/createTrainingSchema.ts';
import {
  findTrainingEventSchema,
  type FindTrainingEventPathParams,
  type FindTrainingEventResponseBody,
} from './schemas/findTrainingEventSchema.ts';
import {
  findTrainingEventsSchema,
  type FindTrainingEventsQueryParams,
  type FindTrainingEventsResponseBody,
} from './schemas/findTrainingEventsSchema.ts';
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
import { type TrainingEventDto } from './schemas/trainingEventSchema.ts';
import type { TrainingDto } from './schemas/trainingSchema.ts';
import {
  type UpdateTrainingEventRequestBody,
  type UpdateTrainingEventPathParams,
  type UpdateTrainingEventResponseBody,
  updateTrainingEventSchema,
} from './schemas/updateTrainingEventSchema.ts';
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
  private readonly createTrainingEventAction: CreateTrainingEventAction;
  private readonly findTrainingEventAction: FindTrainingEventAction;
  private readonly findTrainingEventsAction: FindTrainingEventsAction;
  private readonly updateTrainingEventAction: UpdateTrainingEventAction;
  private readonly accessControlService: AccessControlService;

  public constructor(
    createTrainingAction: CreateTrainingAction,
    findTrainingAction: FindTrainingAction,
    findTrainingsAction: FindTrainingsAction,
    updateTrainingAction: UpdateTrainingAction,
    createTrainingEventAction: CreateTrainingEventAction,
    findTrainingEventAction: FindTrainingEventAction,
    findTrainingEventsAction: FindTrainingEventsAction,
    updateTrainingEventAction: UpdateTrainingEventAction,
    accessControlService: AccessControlService,
  ) {
    this.createTrainingAction = createTrainingAction;
    this.findTrainingAction = findTrainingAction;
    this.findTrainingsAction = findTrainingsAction;
    this.updateTrainingAction = updateTrainingAction;
    this.createTrainingEventAction = createTrainingEventAction;
    this.findTrainingEventAction = findTrainingEventAction;
    this.findTrainingEventsAction = findTrainingEventsAction;
    this.updateTrainingEventAction = updateTrainingEventAction;
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
      new HttpRoute({
        method: httpMethodNames.post,
        path: '/training-events',
        handler: this.createTrainingEvent.bind(this),
        schema: createTrainingEventSchema,
        description: 'Create TrainingEvent',
      }),
      new HttpRoute({
        method: httpMethodNames.get,
        path: '/training-events',
        handler: this.findTrainingEvents.bind(this),
        schema: findTrainingEventsSchema,
        description: 'Find TrainingEvents',
      }),
      new HttpRoute({
        method: httpMethodNames.get,
        path: '/training-events/:trainingEventId',
        handler: this.findTrainingEvent.bind(this),
        schema: findTrainingEventSchema,
        description: 'Find TrainingEvent by id',
      }),
      new HttpRoute({
        method: httpMethodNames.patch,
        path: '/training-events/:trainingEventId',
        handler: this.updateTrainingEvent.bind(this),
        schema: updateTrainingEventSchema,
        description: 'Update TrainingEvent',
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

  private async createTrainingEvent(
    request: HttpRequest<CreateTrainingEventRequestBody>,
  ): Promise<HttpCreatedResponse<CreateTrainingEventResponseBody>> {
    await this.accessControlService.verifyBearerToken({ requestHeaders: request.headers });

    const { city, place, latitude, longitude, centPrice, startsAt, endsAt, trainingId } = request.body;

    const { trainingEvent } = await this.createTrainingEventAction.execute({
      city,
      place,
      latitude,
      longitude,
      centPrice,
      startsAt: new Date(startsAt),
      endsAt: new Date(endsAt),
      trainingId,
    });

    return {
      statusCode: httpStatusCodes.created,
      body: this.mapTrainingEventToDto(trainingEvent),
    };
  }

  private async findTrainingEvent(
    request: HttpRequest<undefined, undefined, FindTrainingEventPathParams>,
  ): Promise<HttpOkResponse<FindTrainingEventResponseBody>> {
    await this.accessControlService.verifyBearerToken({ requestHeaders: request.headers });

    const { trainingEventId } = request.pathParams;

    const { trainingEvent } = await this.findTrainingEventAction.execute({ id: trainingEventId });

    return {
      statusCode: httpStatusCodes.ok,
      body: this.mapTrainingEventToDto(trainingEvent),
    };
  }

  private async findTrainingEvents(
    request: HttpRequest<undefined, FindTrainingEventsQueryParams>,
  ): Promise<HttpOkResponse<FindTrainingEventsResponseBody>> {
    await this.accessControlService.verifyBearerToken({ requestHeaders: request.headers });

    const {
      trainingName,
      categoryId,
      companyId,
      latitude,
      longitude,
      radius,
      page = 1,
      pageSize = 10,
    } = request.queryParams;

    const { data, total } = await this.findTrainingEventsAction.execute({
      trainingName,
      categoryId,
      companyId,
      latitude,
      longitude,
      radius,
      page,
      pageSize,
    });

    return {
      statusCode: httpStatusCodes.ok,
      body: {
        data: data.map((trainingEvent) => this.mapTrainingEventToDto(trainingEvent)),
        metadata: {
          page,
          pageSize,
          total,
        },
      },
    };
  }

  private async updateTrainingEvent(
    request: HttpRequest<UpdateTrainingEventRequestBody, undefined, UpdateTrainingEventPathParams>,
  ): Promise<HttpOkResponse<UpdateTrainingEventResponseBody>> {
    await this.accessControlService.verifyBearerToken({ requestHeaders: request.headers });

    const { trainingEventId } = request.pathParams;

    const { city, place, latitude, longitude, centPrice, startsAt, endsAt, isHidden } = request.body;

    const { trainingEvent } = await this.updateTrainingEventAction.execute({
      id: trainingEventId,
      city,
      place,
      latitude,
      longitude,
      centPrice,
      startsAt: startsAt ? new Date(startsAt) : undefined,
      endsAt: endsAt ? new Date(endsAt) : undefined,
      isHidden,
    });

    return {
      statusCode: httpStatusCodes.ok,
      body: this.mapTrainingEventToDto(trainingEvent),
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

  private mapTrainingEventToDto(trainingEvent: TrainingEvent): TrainingEventDto {
    const { city, place, latitude, longitude, centPrice, startsAt, endsAt, trainingId, training, isHidden, createdAt } =
      trainingEvent.getState();

    const trainingEventDto: TrainingEventDto = {
      id: trainingEvent.getId(),
      city,
      latitude,
      longitude,
      centPrice,
      startsAt: startsAt.toISOString(),
      endsAt: endsAt.toISOString(),
      trainingId,
      isHidden,
      createdAt: createdAt.toISOString(),
    };

    if (place) {
      trainingEventDto.place = place;
    }

    if (training) {
      trainingEventDto.training = {
        name: training.name,
        description: training.description,
        categoryName: training.categoryName,
        companyName: training.companyName,
        companyLogoUrl: training.companyLogoUrl,
      };
    }

    return trainingEventDto;
  }
}
