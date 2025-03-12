import { beforeEach, expect, describe, it } from 'vitest';

import { TestContainer } from '../../../tests/testContainer.ts';
import { type DependencyInjectionContainer } from '../../common/dependencyInjection/dependencyInjectionContainer.ts';

import { DatabaseManager } from './infrastructure/databaseManager.ts';
import { databaseSymbols } from './symbols.ts';

describe('DatabaseModule', () => {
  let container: DependencyInjectionContainer;

  beforeEach(async () => {
    container = await TestContainer.create();
  });

  it('declares bindings', async () => {
    expect(container.get(databaseSymbols.databaseManager)).toBeInstanceOf(DatabaseManager);
  });
});
