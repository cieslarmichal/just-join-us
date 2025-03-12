import { type DatabaseManager } from '../src/modules/databaseModule/infrastructure/databaseManager.ts';
import { databaseSymbols } from '../src/modules/databaseModule/symbols.ts';

import { TestContainer } from './testContainer.ts';

export async function setup(): Promise<void> {
  try {
    const container = await TestContainer.create();

    const databaseManager = container.get<DatabaseManager>(databaseSymbols.databaseManager);

    await databaseManager.setupDatabase();

    console.log('Database: migrations run succeed.');
  } catch (error) {
    console.log('Database: migrations run error.');

    console.log(error);

    process.exit(1);
  }
}
