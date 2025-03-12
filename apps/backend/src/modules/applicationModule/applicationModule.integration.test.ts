import { beforeEach, expect, describe, it } from 'vitest';

import { TestContainer } from '../../../tests/testContainer.ts';
import { type DependencyInjectionContainer } from '../../common/dependencyInjection/dependencyInjectionContainer.ts';
import { HttpServiceImpl } from '../../common/httpService/httpServiceImpl.ts';
import { S3Service } from '../../common/s3/s3Service.ts';
import { UuidService } from '../../common/uuid/uuidService.ts';

import { ApplicationHttpController } from './api/httpControllers/applicationHttpController/applicationHttpController.ts';
import { applicationSymbols } from './symbols.ts';

describe('ApplicationModule', () => {
  let container: DependencyInjectionContainer;

  beforeEach(async () => {
    container = await TestContainer.create();
  });

  it('declares bindings', async () => {
    expect(container.get(applicationSymbols.config)).toBeDefined();

    expect(container.get(applicationSymbols.httpService)).toBeInstanceOf(HttpServiceImpl);

    expect(container.get(applicationSymbols.uuidService)).toBeInstanceOf(UuidService);

    expect(container.get(applicationSymbols.s3Service)).toBeInstanceOf(S3Service);

    expect(container.get(applicationSymbols.applicationHttpController)).toBeInstanceOf(ApplicationHttpController);
  });
});
