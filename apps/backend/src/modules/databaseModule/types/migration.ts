import { type DatabaseClient } from './databaseClient.ts';

export interface Migration {
  readonly name: string;
  up(databaseClient: DatabaseClient): Promise<void>;
  down(databaseClient: DatabaseClient): Promise<void>;
}
