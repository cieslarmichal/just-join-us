import { type HttpController } from '../../../../../common/http/httpController.ts';
import { httpMethodNames } from '../../../../../common/http/httpMethodName.ts';
import { type HttpRequest } from '../../../../../common/http/httpRequest.ts';
import { type HttpCreatedResponse, type HttpOkResponse } from '../../../../../common/http/httpResponse.ts';
import { HttpRoute } from '../../../../../common/http/httpRoute.ts';
import { httpStatusCodes } from '../../../../../common/http/httpStatusCode.ts';
import { type AccessControlService } from '../../../../authModule/application/services/accessControlService/accessControlService.ts';
import type { CreateLocationAction } from '../../../application/actions/createLocationAction/createLocationAction.ts';
import type { CreateRemoteLocationAction } from '../../../application/actions/createRemoteLocationAction/createRemoteLocationAction.ts';
import type { UpdateLocationAction } from '../../../application/actions/updateLocationAction/updateLocationAction.ts';
import type { Location } from '../../../domain/entities/location/location.ts';

import {
  createLocationSchema,
  type CreateLocationRequestBody,
  type CreateLocationResponseBody,
} from './schemas/createLocationSchema.ts';
import type { LocationDto } from './schemas/locationSchema.ts';
import {
  updateLocationSchema,
  type UpdateLocationRequestBody,
  type UpdateLocationPathParams,
  type UpdateLocationResponseBody,
} from './schemas/updateLocationSchema.ts';

export class LocationHttpController implements HttpController {
  public readonly tags = ['Location'];
  private readonly createLocationAction: CreateLocationAction;
  private readonly createRemoteLocationAction: CreateRemoteLocationAction;
  private readonly updateLocationAction: UpdateLocationAction;
  private readonly accessControlService: AccessControlService;

  public constructor(
    createLocationAction: CreateLocationAction,
    createRemoteLocationAction: CreateRemoteLocationAction,
    updateLocationAction: UpdateLocationAction,
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
        schema: createLocationSchema,
        description: 'Create Location',
      }),
      new HttpRoute({
        method: httpMethodNames.patch,
        path: '/companies/:companyId/locations/:locationId',
        handler: this.updateLocation.bind(this),
        schema: updateLocationSchema,
        description: 'Update Location',
      }),
    ];
  }

  private async createLocation(
    request: HttpRequest<CreateLocationRequestBody>,
  ): Promise<HttpCreatedResponse<CreateLocationResponseBody>> {
    await this.accessControlService.verifyBearerToken({ requestHeaders: request.headers });

    const { companyId } = request.pathParams;

    const { name, isRemote } = request.body;

    let location: Location;

    if (isRemote) {
      const result = await this.createRemoteLocationAction.execute({
        name,
        companyId,
      });
      location = result.location;
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
      location = result.location;
    }

    return {
      statusCode: httpStatusCodes.created,
      body: this.mapLocationToDto(location),
    };
  }

  private async updateLocation(
    request: HttpRequest<UpdateLocationRequestBody, undefined, UpdateLocationPathParams>,
  ): Promise<HttpOkResponse<UpdateLocationResponseBody>> {
    await this.accessControlService.verifyBearerToken({ requestHeaders: request.headers });

    const { locationId } = request.pathParams;

    const { name, address, cityId, latitude, longitude } = request.body;

    const { location } = await this.updateLocationAction.execute({
      id: locationId,
      name,
      address,
      cityId,
      latitude,
      longitude,
    });

    return {
      statusCode: httpStatusCodes.ok,
      body: this.mapLocationToDto(location),
    };
  }

  private mapLocationToDto(location: Location): LocationDto {
    const { name, companyId, isRemote, address, cityId, latitude, longitude } = location.getState();

    const locationDto: LocationDto = {
      id: location.getId(),
      name,
      companyId,
      isRemote,
    };

    if (address) {
      locationDto.address = address;
    }

    if (cityId) {
      locationDto.cityId = cityId;
    }

    if (latitude !== undefined) {
      locationDto.latitude = latitude;
    }

    if (longitude !== undefined) {
      locationDto.longitude = longitude;
    }

    return locationDto;
  }
}
