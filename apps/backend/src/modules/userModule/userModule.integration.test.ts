import { beforeEach, expect, describe, it } from 'vitest';

import { TestContainer } from '../../../tests/testContainer.ts';
import { type DependencyInjectionContainer } from '../../common/dependencyInjection/dependencyInjectionContainer.ts';

import { UserHttpController } from './api/httpControllers/userHttpController/userHttpController.ts';
import { EmailQueueController } from './api/queueControllers/emailQueueController/emailQueueController.ts';
import { HashServiceImpl } from './application/services/hashService/hashServiceImpl.ts';
import { userSymbols } from './symbols.ts';

describe('UserModule', () => {
  let container: DependencyInjectionContainer;

  beforeEach(async () => {
    container = await TestContainer.create();
  });

  it('declares bindings', async () => {
    expect(container.get<UserHttpController>(userSymbols.userHttpController)).toBeInstanceOf(UserHttpController);

    expect(container.get<EmailQueueController>(userSymbols.emailQueueController)).toBeInstanceOf(EmailQueueController);

    expect(container.get(userSymbols.hashService)).toBeInstanceOf(HashServiceImpl);
  });
});
