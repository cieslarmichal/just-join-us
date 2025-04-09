import { type HttpController } from '../../../../../common/http/httpController.ts';
import { httpMethodNames } from '../../../../../common/http/httpMethodName.ts';
import { type HttpRequest } from '../../../../../common/http/httpRequest.ts';
import { type HttpCreatedResponse, type HttpOkResponse } from '../../../../../common/http/httpResponse.ts';
import { HttpRoute } from '../../../../../common/http/httpRoute.ts';
import { httpStatusCodes } from '../../../../../common/http/httpStatusCode.ts';
import { type AccessControlService } from '../../../../authModule/application/services/accessControlService/accessControlService.ts';
import type { CreateCompanyLocationAction } from '../../../application/actions/createCompanyLocationAction/createCompanyLocationAction.ts';
import type { CreateRemoteCompanyLocationAction } from '../../../application/actions/createRemoteCompanyLocationAction/createRemoteCompanyLocationAction.ts';
import type { UpdateCompanyLocationAction } from '../../../application/actions/updateCompanyLocationAction/updateCompanyLocationAction.ts';
import type { CompanyLocation } from '../../../domain/entities/companyLocation/companyLocation.ts';

import type { CompanyLocationDto } from './schemas/companyLocationSchema.ts';
import {
  createCompanyLocationSchema,
  type CreateCompanyLocationRequestBody,
  type CreateCompanyLocationResponseBody,
} from './schemas/createCompanyLocationSchema.ts';
import {
  updateCompanyLocationSchema,
  type UpdateCompanyLocationRequestBody,
  type UpdateCompanyLocationPathParams,
  type UpdateCompanyLocationResponseBody,
} from './schemas/updateCompanyLocationSchema.ts';

export class CompanyLocationHttpController implements HttpController {
  public readonly tags = ['CompanyLocation'];
  private readonly createLocationAction: CreateCompanyLocationAction;
  private readonly createRemoteLocationAction: CreateRemoteCompanyLocationAction;
  private readonly updateLocationAction: UpdateCompanyLocationAction;
  private readonly accessControlService: AccessControlService;

  public constructor(
    createLocationAction: CreateCompanyLocationAction,
    createRemoteLocationAction: CreateRemoteCompanyLocationAction,
    updateLocationAction: UpdateCompanyLocationAction,
    accessControlService: AccessControlService,
  ) {
    this.createLocationAction = createLocationAction;
    this.createRemoteLocationAction = createRemoteLocationAction;
    this.updateLocationAction = updateLocationAction;
    this.updateLocationAction = updateLocationAction;
    this.accessControlService = accessControlService;
  }

  public getHttpRoutes(): HttpRoute[] {
    return [
      new HttpRoute({
        method: httpMethodNames.post,
        path: '/companies/:companyId/locations',
        handler: this.createLocation.bind(this),
        schema: createCompanyLocationSchema,
        description: 'Create Location',
      }),
      new HttpRoute({
        method: httpMethodNames.patch,
        path: '/companies/:companyId/locations/:locationId',
        handler: this.updateLocation.bind(this),
        schema: updateCompanyLocationSchema,
        description: 'Update Location',
      }),
    ];
  }

  private async createLocation(
    request: HttpRequest<CreateCompanyLocationRequestBody>,
  ): Promise<HttpCreatedResponse<CreateCompanyLocationResponseBody>> {
    await this.accessControlService.verifyBearerToken({ requestHeaders: request.headers });

    const { companyId } = request.pathParams;

    const { name, isRemote } = request.body;

    let companyLocation: CompanyLocation;

    if (isRemote) {
      const result = await this.createRemoteLocationAction.execute({
        name,
        companyId,
      });
      companyLocation = result.companyLocation;
    } else {
      const { address, cityId, latitude, longitude } = request.body;

      const result = await this.createLocationAction.execute({
        name,
        companyId,
        address,
        cityId,
        latitude,
        longitude,
      });
      companyLocation = result.companyLocation;
    }

    return {
      statusCode: httpStatusCodes.created,
      body: this.mapLocationToDto(companyLocation),
    };
  }

  private async updateLocation(
    request: HttpRequest<UpdateCompanyLocationRequestBody, undefined, UpdateCompanyLocationPathParams>,
  ): Promise<HttpOkResponse<UpdateCompanyLocationResponseBody>> {
    await this.accessControlService.verifyBearerToken({ requestHeaders: request.headers });

    const { locationId } = request.pathParams;

    const { name, address, cityId, latitude, longitude } = request.body;

    const { companyLocation } = await this.updateLocationAction.execute({
      id: locationId,
      name,
      address,
      cityId,
      latitude,
      longitude,
    });

    return {
      statusCode: httpStatusCodes.ok,
      body: this.mapLocationToDto(companyLocation),
    };
  }

  private mapLocationToDto(companyLocation: CompanyLocation): CompanyLocationDto {
    const { name, companyId, isRemote, address, cityId, latitude, longitude } = companyLocation.getState();

    const companyLocationDto: CompanyLocationDto = {
      id: companyLocation.getId(),
      name,
      companyId,
      isRemote,
    };

    if (address) {
      companyLocationDto.address = address;
    }

    if (cityId) {
      companyLocationDto.cityId = cityId;
    }

    if (latitude !== undefined) {
      companyLocationDto.latitude = latitude;
    }

    if (longitude !== undefined) {
      companyLocationDto.longitude = longitude;
    }

    return companyLocationDto;
  }
}
