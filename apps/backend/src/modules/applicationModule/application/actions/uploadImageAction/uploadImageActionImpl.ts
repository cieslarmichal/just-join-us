import { createReadStream } from 'node:fs';

import type { LoggerService } from '../../../../../common/logger/loggerService.ts';
import type { S3Service } from '../../../../../common/s3/s3Service.ts';
import type { UuidService } from '../../../../../common/uuid/uuidService.ts';
import { type Config } from '../../../../../core/config.ts';

import {
  type UploadImageActionResult,
  type UploadImageAction,
  type UploadImageActionPayload,
} from './uploadImageAction.ts';

export class UploadImageActionImpl implements UploadImageAction {
  private readonly s3Service: S3Service;
  private readonly loggerService: LoggerService;
  private readonly config: Config;
  private readonly uuidService: UuidService;

  public constructor(s3Service: S3Service, loggerService: LoggerService, config: Config, uuidService: UuidService) {
    this.s3Service = s3Service;
    this.loggerService = loggerService;
    this.config = config;
    this.uuidService = uuidService;
  }

  public async execute(payload: UploadImageActionPayload): Promise<UploadImageActionResult> {
    const { contentType, filePath, userId } = payload;

    const { bucketName } = this.config.aws;

    const imageId = this.uuidService.generateUuid();

    this.loggerService.debug({
      message: 'Uploading image...',
      contentType,
      bucketName,
      imageId,
      userId,
    });

    await this.s3Service.uploadBlob({
      bucketName,
      blobName: imageId,
      data: createReadStream(filePath),
      contentType,
    });

    const imageUrl = `${this.config.aws.cloudfrontUrl}/${imageId}`;

    this.loggerService.debug({
      message: 'Image uploaded.',
      bucketName,
      imageUrl,
      contentType,
    });

    return { imageUrl };
  }
}
