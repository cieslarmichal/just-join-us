import { type HttpController } from '../../../../../common/http/httpController.ts';
import { httpMethodNames } from '../../../../../common/http/httpMethodName.ts';
import { type HttpRequest } from '../../../../../common/http/httpRequest.ts';
import { type HttpCreatedResponse, type HttpOkResponse } from '../../../../../common/http/httpResponse.ts';
import { HttpRoute } from '../../../../../common/http/httpRoute.ts';
import { httpStatusCodes } from '../../../../../common/http/httpStatusCode.ts';
import { type AccessControlService } from '../../../../authModule/application/services/accessControlService/accessControlService.ts';
import type { CreateJobOfferAction } from '../../../application/actions/createJobOfferAction/createJobOfferAction.ts';
import { type FindJobOfferAction } from '../../../application/actions/findJobOfferAction/findJobOfferAction.ts';
import type { FindJobOffersAction } from '../../../application/actions/findJobOffersAction/findJobOffersAction.ts';
import type { UpdateJobOfferAction } from '../../../application/actions/updateJobOfferAction/updateJobOfferAction.ts';
import { type JobOffer } from '../../../domain/entities/jobOffer/jobOffer.ts';

import {
  createJobOfferSchema,
  type CreateJobOfferRequestBody,
  type CreateJobOfferResponseBody,
} from './schemas/createJobOfferSchema.ts';
import {
  findJobOfferSchema,
  type FindJobOfferPathParams,
  type FindJobOfferResponseBody,
} from './schemas/findJobOfferSchema.ts';
import {
  findJobOffersSchema,
  type FindJobOffersQueryParams,
  type FindJobOffersResponseBody,
} from './schemas/findJobOffersSchema.ts';
import type { JobOfferDto } from './schemas/jobOfferSchema.ts';
import {
  updateJobOfferSchema,
  type UpdateJobOfferRequestBody,
  type UpdateJobOfferPathParams,
  type UpdateJobOfferResponseBody,
} from './schemas/updateJobOfferSchema.ts';

export class JobOfferHttpController implements HttpController {
  public readonly tags = ['JobOffer'];
  private readonly createJobOfferAction: CreateJobOfferAction;
  private readonly findJobOfferAction: FindJobOfferAction;
  private readonly findJobOffersAction: FindJobOffersAction;
  private readonly updateJobOfferAction: UpdateJobOfferAction;
  private readonly accessControlService: AccessControlService;

  public constructor(
    createJobOfferAction: CreateJobOfferAction,
    findJobOfferAction: FindJobOfferAction,
    findJobOffersAction: FindJobOffersAction,
    updateJobOfferAction: UpdateJobOfferAction,
    accessControlService: AccessControlService,
  ) {
    this.createJobOfferAction = createJobOfferAction;
    this.findJobOfferAction = findJobOfferAction;
    this.findJobOffersAction = findJobOffersAction;
    this.updateJobOfferAction = updateJobOfferAction;
    this.accessControlService = accessControlService;
  }

  public getHttpRoutes(): HttpRoute[] {
    return [
      new HttpRoute({
        method: httpMethodNames.post,
        path: '/job-offers',
        handler: this.createJobOffer.bind(this),
        schema: createJobOfferSchema,
        description: 'Create JobOffer',
      }),
      new HttpRoute({
        method: httpMethodNames.get,
        path: '/job-offers',
        handler: this.findJobOffers.bind(this),
        schema: findJobOffersSchema,
        description: 'Find JobOffers',
      }),
      new HttpRoute({
        method: httpMethodNames.get,
        path: '/job-offers/:jobOfferId',
        handler: this.findJobOffer.bind(this),
        schema: findJobOfferSchema,
        description: 'Find JobOffer by id',
      }),
      new HttpRoute({
        method: httpMethodNames.patch,
        path: '/job-offers/:jobOfferId',
        handler: this.updateJobOffer.bind(this),
        schema: updateJobOfferSchema,
        description: 'Update JobOffer',
      }),
    ];
  }

  private async createJobOffer(
    request: HttpRequest<CreateJobOfferRequestBody>,
  ): Promise<HttpCreatedResponse<CreateJobOfferResponseBody>> {
    await this.accessControlService.verifyBearerToken({ requestHeaders: request.headers });

    const {
      name,
      description,
      categoryId,
      companyId,
      employmentType,
      experienceLevel,
      locationId,
      isRemote,
      maxSalary,
      minSalary,
      skillIds,
      workingTime,
    } = request.body;

    const { jobOffer } = await this.createJobOfferAction.execute({
      name,
      description,
      categoryId,
      companyId,
      employmentType,
      experienceLevel,
      locationId,
      isRemote,
      maxSalary,
      minSalary,
      skillIds,
      workingTime,
    });

    return {
      statusCode: httpStatusCodes.created,
      body: this.mapJobOfferToDto(jobOffer),
    };
  }

  private async findJobOffers(
    request: HttpRequest<undefined, FindJobOffersQueryParams>,
  ): Promise<HttpOkResponse<FindJobOffersResponseBody>> {
    const {
      name,
      category,
      employmentType,
      experienceLevel,
      minSalary,
      maxSalary,
      workingTime,
      companyId,
      page = 1,
      pageSize = 10,
    } = request.queryParams;

    const { data, total } = await this.findJobOffersAction.execute({
      name,
      category,
      employmentType,
      experienceLevel,
      minSalary,
      maxSalary,
      workingTime,
      companyId,
      page,
      pageSize,
    });

    return {
      statusCode: httpStatusCodes.ok,
      body: {
        data: data.map((jobOffer) => this.mapJobOfferToDto(jobOffer)),
        metadata: {
          page,
          pageSize,
          total,
        },
      },
    };
  }

  private async findJobOffer(
    request: HttpRequest<undefined, undefined, FindJobOfferPathParams>,
  ): Promise<HttpOkResponse<FindJobOfferResponseBody>> {
    const { jobOfferId } = request.pathParams;

    const { jobOffer } = await this.findJobOfferAction.execute({ id: jobOfferId });

    return {
      statusCode: httpStatusCodes.ok,
      body: this.mapJobOfferToDto(jobOffer),
    };
  }

  private async updateJobOffer(
    request: HttpRequest<UpdateJobOfferRequestBody, undefined, UpdateJobOfferPathParams>,
  ): Promise<HttpOkResponse<UpdateJobOfferResponseBody>> {
    await this.accessControlService.verifyBearerToken({ requestHeaders: request.headers });

    const { jobOfferId } = request.pathParams;

    const {
      name,
      description,
      categoryId,
      isHidden,
      isRemote,
      employmentType,
      experienceLevel,
      locationId,
      maxSalary,
      minSalary,
      skillIds,
      workingTime,
    } = request.body;

    const { jobOffer } = await this.updateJobOfferAction.execute({
      id: jobOfferId,
      name,
      description,
      categoryId,
      isHidden,
      employmentType,
      experienceLevel,
      isRemote,
      locationId,
      maxSalary,
      minSalary,
      skillIds,
      workingTime,
    });

    return {
      statusCode: httpStatusCodes.ok,
      body: this.mapJobOfferToDto(jobOffer),
    };
  }

  private mapJobOfferToDto(jobOffer: JobOffer): JobOfferDto {
    const {
      name,
      description,
      isHidden,
      categoryId,
      category,
      companyId,
      company,
      createdAt,
      employmentType,
      experienceLevel,
      maxSalary,
      minSalary,
      workingTime,
      locationId,
      location,
      isRemote,
      skills,
    } = jobOffer.getState();

    const jobOfferDto: JobOfferDto = {
      id: jobOffer.getId(),
      name,
      description,
      isHidden,
      isRemote,
      categoryId,
      companyId,
      createdAt: createdAt.toISOString(),
      employmentType,
      experienceLevel,
      minSalary,
      maxSalary,
      workingTime,
      skills: skills || [],
    };

    if (category) {
      jobOfferDto.category = { name: category.name };
    }

    if (company) {
      jobOfferDto.company = { name: company.name, logoUrl: company.logoUrl };
    }

    if (location) {
      jobOfferDto.location = { city: location.city, latitude: location.latitude, longitude: location.longitude };
    }

    if (locationId) {
      jobOfferDto.locationId = locationId;
    }

    return jobOfferDto;
  }
}
