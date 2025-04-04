import { type S3Client } from '@aws-sdk/client-s3';

import { type DependencyInjectionContainer } from '../src/common/dependencyInjection/dependencyInjectionContainer.ts';
import type { EmailService } from '../src/common/emailService/emailService.ts';
import type { LoggerService } from '../src/common/logger/loggerService.ts';
import { S3TestUtils } from '../src/common/s3/tests/s3TestUtils.ts';
import { Application } from '../src/core/application.ts';
import { applicationSymbols } from '../src/modules/applicationModule/symbols.ts';
import { databaseSymbols } from '../src/modules/databaseModule/symbols.ts';
import type { DatabaseClient } from '../src/modules/databaseModule/types/databaseClient.ts';
import { CategoryTestUtils } from '../src/modules/jobOfferModule/tests/utils/categoryTestUtils/categoryTestUtils.ts';
import { JobOfferTestUtils } from '../src/modules/jobOfferModule/tests/utils/jobOfferTestUtils/jobOfferTestUtils.ts';
import { SkillTestUtils } from '../src/modules/jobOfferModule/tests/utils/skillTestUtils/categoryTestUtils.ts';
import { CityTestUtils } from '../src/modules/locationModule/tests/utils/cityTestUtils/cityTestUtils.ts';
import { LocationTestUtils } from '../src/modules/locationModule/tests/utils/locationTestUtils/locationTestUtils.ts';
import { type EmailMessageBus } from '../src/modules/userModule/application/messageBuses/emailMessageBus/emailMessageBus.ts';
import { userSymbols } from '../src/modules/userModule/symbols.ts';
import { BlacklistTokenTestUtils } from '../src/modules/userModule/tests/utils/blacklistTokenTestUtils/blacklistTokenTestUtils.ts';
import { CandidateTestUtils } from '../src/modules/userModule/tests/utils/candidateTestUtils/candidateTestUtils.ts';
import { CompanyTestUtils } from '../src/modules/userModule/tests/utils/companyTestUtils/companyTestUtils.ts';
import { EmailEventTestUtils } from '../src/modules/userModule/tests/utils/emailEventTestUtils/emailEventTestUtils.ts';
import { UserTestUtils } from '../src/modules/userModule/tests/utils/userTestUtils/userTestUtils.ts';

import { testSymbols } from './symbols.ts';

export class TestContainer {
  public static async create(): Promise<DependencyInjectionContainer> {
    const container = Application.createContainer();

    container.bind<UserTestUtils>(
      testSymbols.userTestUtils,
      () => new UserTestUtils(container.get<DatabaseClient>(databaseSymbols.databaseClient)),
    );

    container.bind<CandidateTestUtils>(
      testSymbols.candidateTestUtils,
      () => new CandidateTestUtils(container.get<DatabaseClient>(databaseSymbols.databaseClient)),
    );

    container.bind<CompanyTestUtils>(
      testSymbols.companyTestUtils,
      () => new CompanyTestUtils(container.get<DatabaseClient>(databaseSymbols.databaseClient)),
    );

    container.bind<BlacklistTokenTestUtils>(
      testSymbols.blacklistTokenTestUtils,
      () => new BlacklistTokenTestUtils(container.get<DatabaseClient>(databaseSymbols.databaseClient)),
    );

    container.bind<EmailEventTestUtils>(
      testSymbols.emailEventTestUtils,
      () => new EmailEventTestUtils(container.get<DatabaseClient>(databaseSymbols.databaseClient)),
    );

    container.bind<CategoryTestUtils>(
      testSymbols.categoryTestUtils,
      () => new CategoryTestUtils(container.get<DatabaseClient>(databaseSymbols.databaseClient)),
    );

    container.bind<SkillTestUtils>(
      testSymbols.skillTestUtils,
      () => new SkillTestUtils(container.get<DatabaseClient>(databaseSymbols.databaseClient)),
    );

    container.bind<JobOfferTestUtils>(
      testSymbols.jobOfferTestUtils,
      () => new JobOfferTestUtils(container.get<DatabaseClient>(databaseSymbols.databaseClient)),
    );

    container.bind<CityTestUtils>(
      testSymbols.cityTestUtils,
      () => new CityTestUtils(container.get<DatabaseClient>(databaseSymbols.databaseClient)),
    );

    container.bind<LocationTestUtils>(
      testSymbols.locationTestUtils,
      () => new LocationTestUtils(container.get<DatabaseClient>(databaseSymbols.databaseClient)),
    );

    await container.overrideBinding<LoggerService>(
      applicationSymbols.loggerService,
      () =>
        ({
          info: (): void => {},
          error: (): void => {},
          debug: (): void => {},
          warn: (): void => {},
        }) as unknown as LoggerService,
    );

    await container.overrideBinding<EmailService>(applicationSymbols.emailService, () => ({
      sendEmail: async (): Promise<void> => {},
    }));

    await container.overrideBinding<EmailMessageBus>(userSymbols.emailMessageBus, () => ({
      sendEvent: async (): Promise<void> => {},
    }));

    container.bind<S3TestUtils>(
      testSymbols.s3TestUtils,
      () => new S3TestUtils(container.get<S3Client>(applicationSymbols.s3Client)),
    );

    return container;
  }
}
