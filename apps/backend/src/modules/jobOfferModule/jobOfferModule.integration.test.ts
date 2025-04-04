import { beforeEach, expect, describe, it } from 'vitest';

import { TestContainer } from '../../../tests/testContainer.ts';
import { type DependencyInjectionContainer } from '../../common/dependencyInjection/dependencyInjectionContainer.ts';

import { CategoryHttpController } from './api/httpControllers/categoryHttpController/categoryHttpController.ts';
import { JobOfferHttpController } from './api/httpControllers/jobOfferHttpController/jobOfferHttpController.ts';
import { jobOfferSymbols } from './symbols.ts';

describe('JobOfferModule', () => {
  let container: DependencyInjectionContainer;

  beforeEach(async () => {
    container = await TestContainer.create();
  });

  it('declares bindings', async () => {
    expect(container.get<JobOfferHttpController>(jobOfferSymbols.jobOfferHttpController)).toBeInstanceOf(
      JobOfferHttpController,
    );

    expect(container.get<CategoryHttpController>(jobOfferSymbols.categoryHttpController)).toBeInstanceOf(
      CategoryHttpController,
    );
  });
});
