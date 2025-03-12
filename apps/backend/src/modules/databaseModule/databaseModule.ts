import knex from 'knex';

import { type DependencyInjectionContainer } from '../../common/dependencyInjection/dependencyInjectionContainer.ts';
import { type DependencyInjectionModule } from '../../common/dependencyInjection/dependencyInjectionModule.ts';
import { type Config } from '../../core/config.ts';
import { applicationSymbols } from '../applicationModule/symbols.ts';

import { DatabaseManager } from './infrastructure/databaseManager.ts';
import { symbols } from './symbols.ts';
import type { DatabaseClient } from './types/databaseClient.ts';

export class DatabaseModule implements DependencyInjectionModule {
  public declareBindings(container: DependencyInjectionContainer): void {
    container.bind<DatabaseClient>(symbols.databaseClient, () => {
      const config = container.get<Config>(applicationSymbols.config);

      return knex({
        client: 'pg',
        connection: {
          host: config.database.host,
          port: config.database.port,
          user: config.database.username,
          password: config.database.password,
          database: config.database.name,
        },
        pool: {
          min: 1,
          max: 10,
        },
        useNullAsDefault: true,
      });
    });

    container.bind<DatabaseManager>(
      symbols.databaseManager,
      () => new DatabaseManager(container.get<DatabaseClient>(symbols.databaseClient)),
    );
  }
}
