import { type DependencyInjectionContainer } from '../../common/dependencyInjection/dependencyInjectionContainer.ts';
import { type DependencyInjectionModule } from '../../common/dependencyInjection/dependencyInjectionModule.ts';
import { type Config } from '../../core/config.ts';
import { applicationSymbols } from '../applicationModule/symbols.ts';

import { type AccessControlService } from './application/services/accessControlService/accessControlService.ts';
import { AccessControlServiceImpl } from './application/services/accessControlService/accessControlServiceImpl.ts';
import { type TokenService } from './application/services/tokenService/tokenService.ts';
import { TokenServiceImpl } from './application/services/tokenService/tokenServiceImpl.ts';
import { symbols } from './symbols.ts';

export class AuthModule implements DependencyInjectionModule {
  public declareBindings(container: DependencyInjectionContainer): void {
    container.bind<TokenService>(
      symbols.tokenService,
      () => new TokenServiceImpl(container.get<Config>(applicationSymbols.config)),
    );

    container.bind<AccessControlService>(
      symbols.accessControlService,
      () => new AccessControlServiceImpl(container.get<TokenService>(symbols.tokenService)),
    );
  }
}
