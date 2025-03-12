import { beforeEach, expect, describe, it } from 'vitest';

import { TestContainer } from '../../../tests/testContainer.ts';
import { type DependencyInjectionContainer } from '../../common/dependencyInjection/dependencyInjectionContainer.ts';

import { AccessControlServiceImpl } from './application/services/accessControlService/accessControlServiceImpl.ts';
import { TokenServiceImpl } from './application/services/tokenService/tokenServiceImpl.ts';
import { authSymbols } from './symbols.ts';

describe('AuthModule', () => {
  let container: DependencyInjectionContainer;

  beforeEach(async () => {
    container = await TestContainer.create();
  });

  it('declares bindings', async () => {
    expect(container.get(authSymbols.tokenService)).toBeInstanceOf(TokenServiceImpl);

    expect(container.get(authSymbols.accessControlService)).toBeInstanceOf(AccessControlServiceImpl);
  });
});
