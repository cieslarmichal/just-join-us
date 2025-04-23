import { type DependencyInjectionContainer } from '../common/dependencyInjection/dependencyInjectionContainer.ts';
import { DependencyInjectionContainerFactory } from '../common/dependencyInjection/dependencyInjectionContainerFactory.ts';
import { type DependencyInjectionModule } from '../common/dependencyInjection/dependencyInjectionModule.ts';
import { userRoles } from '../common/types/userRole.ts';
import { type UuidService } from '../common/uuid/uuidService.ts';
import { ApplicationModule } from '../modules/applicationModule/applicationModule.ts';
import { applicationSymbols } from '../modules/applicationModule/symbols.ts';
import { AuthModule } from '../modules/authModule/authModule.ts';
import { DatabaseModule } from '../modules/databaseModule/databaseModule.ts';
import type { DatabaseManager } from '../modules/databaseModule/infrastructure/databaseManager.ts';
import type { UserRawEntity } from '../modules/databaseModule/infrastructure/tables/usersTable/userRawEntity.ts';
import { usersTable } from '../modules/databaseModule/infrastructure/tables/usersTable/usersTable.ts';
import { databaseSymbols } from '../modules/databaseModule/symbols.ts';
import type { DatabaseClient } from '../modules/databaseModule/types/databaseClient.ts';
import { JobOfferModule } from '../modules/jobOfferModule/jobOfferModule.ts';
import { LocationModule } from '../modules/locationModule/locationModule.ts';
import { type HashService } from '../modules/userModule/application/services/hashService/hashService.ts';
import { userSymbols } from '../modules/userModule/symbols.ts';
import { UserModule } from '../modules/userModule/userModule.ts';

import { type Config } from './config.ts';
import { HttpServer } from './httpServer.ts';

export class Application {
  private static container: DependencyInjectionContainer;
  private static server: HttpServer | undefined;

  public static createContainer(): DependencyInjectionContainer {
    const modules: DependencyInjectionModule[] = [
      new ApplicationModule(),
      new AuthModule(),
      new DatabaseModule(),
      new UserModule(),
      new LocationModule(),
      new JobOfferModule(),
    ];

    const container = DependencyInjectionContainerFactory.create({ modules });

    return container;
  }

  public static async start(): Promise<void> {
    Application.container = Application.createContainer();

    await this.setupDatabase();

    Application.server = new HttpServer(Application.container);

    await Application.server.start();
  }

  public static async stop(): Promise<void> {
    await Application.server?.stop();
  }

  private static async setupDatabase(): Promise<void> {
    const databaseManager = Application.container.get<DatabaseManager>(databaseSymbols.databaseManager);

    await databaseManager.setupDatabase();

    await this.createAdminUser(Application.container);
  }

  private static async createAdminUser(container: DependencyInjectionContainer): Promise<void> {
    const databaseClient = container.get<DatabaseClient>(databaseSymbols.databaseClient);

    const uuidService = container.get<UuidService>(applicationSymbols.uuidService);

    const hashService = container.get<HashService>(userSymbols.hashService);

    const { email, password } = container.get<Config>(applicationSymbols.config).admin;

    const userExists = await databaseClient<UserRawEntity>(usersTable.name).where({ email }).first();

    if (userExists) {
      return;
    }

    const hashedPassword = await hashService.hash({ plainData: password });

    const userId = uuidService.generateUuid();

    await databaseClient<UserRawEntity>(usersTable.name).insert({
      id: userId,
      email,
      password: hashedPassword,
      is_email_verified: true,
      is_deleted: false,
      role: userRoles.admin,
    });
  }
}
