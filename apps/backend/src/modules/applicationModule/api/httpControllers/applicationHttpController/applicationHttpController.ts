import { OperationNotValidError } from '../../../../../common/errors/operationNotValidError.ts';
import { serializeError } from '../../../../../common/errors/serializeError.ts';
import type { HttpController } from '../../../../../common/http/httpController.ts';
import { httpMethodNames } from '../../../../../common/http/httpMethodName.ts';
import type { HttpRequest } from '../../../../../common/http/httpRequest.ts';
import type { HttpCreatedResponse, HttpOkResponse } from '../../../../../common/http/httpResponse.ts';
import { HttpRoute } from '../../../../../common/http/httpRoute.ts';
import { httpStatusCodes } from '../../../../../common/http/httpStatusCode.ts';
import type { LoggerService } from '../../../../../common/logger/loggerService.ts';
import type { DatabaseClient } from '../../../../databaseModule/types/databaseClient.ts';
import type { UploadImageAction } from '../../../application/actions/uploadImageAction/uploadImageAction.ts';

import { checkHealthSchema, type CheckHealthResponseBody } from './schemas/checkHealthSchema.ts';
import { uploadImageSchema, type UploadImageResponseBody } from './schemas/uploadImageSchema.ts';

export class ApplicationHttpController implements HttpController {
  public readonly tags = ['Health'];
  private readonly databaseClient: DatabaseClient;
  private readonly logger: LoggerService;
  private readonly uploadImageAction: UploadImageAction;

  public constructor(uploadImageAction: UploadImageAction, databaseClient: DatabaseClient, logger: LoggerService) {
    this.uploadImageAction = uploadImageAction;
    this.databaseClient = databaseClient;
    this.logger = logger;
  }

  public getHttpRoutes(): HttpRoute[] {
    return [
      new HttpRoute({
        method: httpMethodNames.post,
        path: '/images',
        handler: this.uploadImage.bind(this),
        schema: uploadImageSchema,
        description: 'Upload image',
      }),
      new HttpRoute({
        method: httpMethodNames.get,
        path: '/health',
        handler: this.checkHealth.bind(this),
        schema: checkHealthSchema,
        description: 'Check application health',
      }),
    ];
  }

  private async uploadImage(request: HttpRequest): Promise<HttpCreatedResponse<UploadImageResponseBody>> {
    const file = request.files?.[0];

    if (!file) {
      throw new OperationNotValidError({
        reason: 'No file attached',
      });
    }

    const { imageUrl } = await this.uploadImageAction.execute({
      filePath: file.filePath,
      contentType: file.contentType,
    });

    return {
      statusCode: httpStatusCodes.created,
      body: { url: imageUrl },
    };
  }

  private async checkHealth(): Promise<HttpOkResponse<CheckHealthResponseBody>> {
    const isDatabaseHealthy = await this.checkDatabaseHealth();

    const isApplicationHealthy = isDatabaseHealthy;

    return {
      statusCode: httpStatusCodes.ok,
      body: {
        healthy: isApplicationHealthy,
      },
    };
  }

  private async checkDatabaseHealth(): Promise<boolean> {
    try {
      await this.databaseClient.raw('SELECT 1');

      return true;
    } catch (error) {
      this.logger.error({
        message: 'Database health check failed',
        error: serializeError(error),
      });

      return false;
    }
  }
}
