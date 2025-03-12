import type { S3Client } from '@aws-sdk/client-s3';

import type { DependencyInjectionContainer } from '../../common/dependencyInjection/dependencyInjectionContainer.ts';
import { type DependencyInjectionModule } from '../../common/dependencyInjection/dependencyInjectionModule.ts';
import type { HttpService } from '../../common/httpService/httpService.ts';
import { HttpServiceImpl } from '../../common/httpService/httpServiceImpl.ts';
import type { LoggerService } from '../../common/logger/loggerService.ts';
import { LoggerServiceFactory } from '../../common/logger/loggerServiceFactory.ts';
import { type S3Config, S3ClientFactory } from '../../common/s3/s3ClientFactory.ts';
import { S3Service } from '../../common/s3/s3Service.ts';
import type { SendGridService } from '../../common/sendGrid/sendGridService.ts';
import { SendGridServiceImpl } from '../../common/sendGrid/sendGridServiceImpl.ts';
import { UuidService } from '../../common/uuid/uuidService.ts';
import { createConfig, type Config } from '../../core/config.ts';
import type { AccessControlService } from '../authModule/application/services/accessControlService/accessControlService.ts';
import { authSymbols } from '../authModule/symbols.ts';
import { databaseSymbols } from '../databaseModule/symbols.ts';
import type { DatabaseClient } from '../databaseModule/types/databaseClient.ts';

import { ApplicationHttpController } from './api/httpControllers/applicationHttpController/applicationHttpController.ts';
import type { UploadImageAction } from './application/actions/uploadImageAction/uploadImageAction.ts';
import { UploadImageActionImpl } from './application/actions/uploadImageAction/uploadImageActionImpl.ts';
import { symbols } from './symbols.ts';

export class ApplicationModule implements DependencyInjectionModule {
  public declareBindings(container: DependencyInjectionContainer): void {
    const config = createConfig();

    container.bind<LoggerService>(symbols.loggerService, () =>
      LoggerServiceFactory.create({ logLevel: config.logLevel }),
    );

    container.bind<HttpService>(
      symbols.httpService,
      () => new HttpServiceImpl(container.get<LoggerService>(symbols.loggerService)),
    );

    container.bind<UuidService>(symbols.uuidService, () => new UuidService());

    container.bind<Config>(symbols.config, () => config);

    container.bind<SendGridService>(
      symbols.sendGridService,
      () =>
        new SendGridServiceImpl(container.get<HttpService>(symbols.httpService), {
          apiKey: config.sendGrid.apiKey,
          senderEmail: config.sendGrid.senderEmail,
        }),
    );

    const s3Config: S3Config = {
      accessKeyId: config.aws.accessKeyId,
      secretAccessKey: config.aws.secretAccessKey,
      region: config.aws.region,
      endpoint: config.aws.endpoint ?? undefined,
    };

    container.bind<S3Client>(symbols.s3Client, () => S3ClientFactory.create(s3Config));

    container.bind<S3Service>(symbols.s3Service, () => new S3Service(container.get<S3Client>(symbols.s3Client)));

    container.bind<UploadImageAction>(
      symbols.uploadImageAction,
      () =>
        new UploadImageActionImpl(
          container.get<S3Service>(symbols.s3Service),
          container.get<LoggerService>(symbols.loggerService),
          container.get<Config>(symbols.config),
          container.get<UuidService>(symbols.uuidService),
        ),
    );

    container.bind<ApplicationHttpController>(
      symbols.applicationHttpController,
      () =>
        new ApplicationHttpController(
          container.get<UploadImageAction>(symbols.uploadImageAction),
          container.get<AccessControlService>(authSymbols.accessControlService),
          container.get<DatabaseClient>(databaseSymbols.databaseClient),
          container.get<LoggerService>(symbols.loggerService),
        ),
    );
  }
}
