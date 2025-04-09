import { beforeEach, expect, describe, it } from 'vitest';

import { TestContainer } from '../../../tests/testContainer.ts';
import { type DependencyInjectionContainer } from '../../common/dependencyInjection/dependencyInjectionContainer.ts';

import { CityHttpController } from './api/httpControllers/cityHttpController/cityHttpController.ts';
import { CompanyLocationHttpController } from './api/httpControllers/companyLocationHttpController/companyLocationHttpController.ts';
import { locationSymbols } from './symbols.ts';

describe('LocationModule', () => {
  let container: DependencyInjectionContainer;

  beforeEach(async () => {
    container = await TestContainer.create();
  });

  it('declares bindings', async () => {
    expect(container.get<CompanyLocationHttpController>(locationSymbols.companyLocationHttpController)).toBeInstanceOf(
      CompanyLocationHttpController,
    );

    expect(container.get<CityHttpController>(locationSymbols.cityHttpController)).toBeInstanceOf(CityHttpController);
  });
});
