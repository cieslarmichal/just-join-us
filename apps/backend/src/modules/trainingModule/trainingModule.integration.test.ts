import { beforeEach, expect, describe, it } from 'vitest';

import { TestContainer } from '../../../tests/testContainer.ts';
import { type DependencyInjectionContainer } from '../../common/dependencyInjection/dependencyInjectionContainer.ts';

import { CategoryHttpController } from './api/httpControllers/categoryHttpController/categoryHttpController.ts';
import { TrainingHttpController } from './api/httpControllers/trainingHttpController/trainingHttpController.ts';
import { trainingSymbols } from './symbols.ts';

describe('TrainingModule', () => {
  let container: DependencyInjectionContainer;

  beforeEach(async () => {
    container = await TestContainer.create();
  });

  it('declares bindings', async () => {
    expect(container.get<TrainingHttpController>(trainingSymbols.trainingHttpController)).toBeInstanceOf(
      TrainingHttpController,
    );

    expect(container.get<CategoryHttpController>(trainingSymbols.categoryHttpController)).toBeInstanceOf(
      CategoryHttpController,
    );
  });
});
