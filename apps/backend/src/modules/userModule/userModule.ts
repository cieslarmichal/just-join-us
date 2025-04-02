import { type DependencyInjectionContainer } from '../../common/dependencyInjection/dependencyInjectionContainer.ts';
import { type DependencyInjectionModule } from '../../common/dependencyInjection/dependencyInjectionModule.ts';
import type { EmailService } from '../../common/emailService/emailService.ts';
import { type LoggerService } from '../../common/logger/loggerService.ts';
import { type UuidService } from '../../common/uuid/uuidService.ts';
import { type Config } from '../../core/config.ts';
import { applicationSymbols } from '../applicationModule/symbols.ts';
import { type AccessControlService } from '../authModule/application/services/accessControlService/accessControlService.ts';
import { type TokenService } from '../authModule/application/services/tokenService/tokenService.ts';
import { authSymbols } from '../authModule/symbols.ts';
import { databaseSymbols } from '../databaseModule/symbols.ts';
import type { DatabaseClient } from '../databaseModule/types/databaseClient.ts';

import { UserHttpController } from './api/httpControllers/userHttpController/userHttpController.ts';
import { EmailQueueController } from './api/queueControllers/emailQueueController/emailQueueController.ts';
import { type ChangeUserPasswordAction } from './application/actions/changeUserPasswordAction/changeUserPasswordAction.ts';
import { ChangeUserPasswordActionImpl } from './application/actions/changeUserPasswordAction/changeUserPasswordActionImpl.ts';
import { type FindUserAction } from './application/actions/findUserAction/findUserAction.ts';
import { FindUserActionImpl } from './application/actions/findUserAction/findUserActionImpl.ts';
import { type LoginUserAction } from './application/actions/loginUserAction/loginUserAction.ts';
import { LoginUserActionImpl } from './application/actions/loginUserAction/loginUserActionImpl.ts';
import { type LogoutUserAction } from './application/actions/logoutUserAction/logoutUserAction.ts';
import { LogoutUserActionImpl } from './application/actions/logoutUserAction/logoutUserActionImpl.ts';
import { type RefreshUserTokensAction } from './application/actions/refreshUserTokensAction/refreshUserTokensAction.ts';
import { RefreshUserTokensActionImpl } from './application/actions/refreshUserTokensAction/refreshUserTokensActionImpl.ts';
import { type RegisterCompanyAction } from './application/actions/registerCompanyAction/registerCompanyAction.ts';
import { RegisterCompanyActionImpl } from './application/actions/registerCompanyAction/registerCompanyActionImpl.ts';
import { type RegisterCandidateAction } from './application/actions/registerCandidateAction/registerCandidateAction.ts';
import { RegisterCandidateActionImpl } from './application/actions/registerCandidateAction/registerCandidateActionImpl.ts';
import { type SendResetPasswordEmailAction } from './application/actions/sendResetPasswordEmailAction/sendResetPasswordEmailAction.ts';
import { SendResetPasswordEmailActionImpl } from './application/actions/sendResetPasswordEmailAction/sendResetPasswordEmailActionImpl.ts';
import { type SendVerificationEmailAction } from './application/actions/sendVerificationEmailAction/sendVerificationEmailAction.ts';
import { SendVerificationEmailActionImpl } from './application/actions/sendVerificationEmailAction/sendVerificationEmailActionImpl.ts';
import { type UpdateCompanyAction } from './application/actions/updateCompanyAction/updateCompanyAction.ts';
import { UpdateCompanyActionImpl } from './application/actions/updateCompanyAction/updateCompanyActionImpl.ts';
import { type UpdateCandidateAction } from './application/actions/updateCandidateAction/updateCandidateAction.ts';
import { UpdateCandidateActionImpl } from './application/actions/updateCandidateAction/updateCandidateActionImpl.ts';
import { type VerifyUserEmailAction } from './application/actions/verifyUserEmailAction/verifyUserEmailAction.ts';
import { VerifyUserEmailActionImpl } from './application/actions/verifyUserEmailAction/verifyUserEmailActionImpl.ts';
import { type EmailMessageBus } from './application/messageBuses/emailMessageBus/emailMessageBus.ts';
import { type HashService } from './application/services/hashService/hashService.ts';
import { HashServiceImpl } from './application/services/hashService/hashServiceImpl.ts';
import { type PasswordValidationService } from './application/services/passwordValidationService/passwordValidationService.ts';
import { PasswordValidationServiceImpl } from './application/services/passwordValidationService/passwordValidationServiceImpl.ts';
import { type BlacklistTokenRepository } from './domain/repositories/blacklistTokenRepository/blacklistTokenRepository.ts';
import { type CompanyRepository } from './domain/repositories/companyRepository/companyRepository.ts';
import { type EmailEventRepository } from './domain/repositories/emailEventRepository/emailEventRepository.ts';
import { type CandidateRepository } from './domain/repositories/candidateRepository/candidateRepository.ts';
import { type UserRepository } from './domain/repositories/userRepository/userRepository.ts';
import { EmailMessageBusImpl } from './infrastructure/messageBuses/emailMessageBus/emailMessageBusImpl.ts';
import { BlacklistTokenMapper } from './infrastructure/repositories/blacklistTokenRepository/blacklistTokenMapper/blacklistTokenMapper.ts';
import { BlacklistTokenRepositoryImpl } from './infrastructure/repositories/blacklistTokenRepository/blacklistTokenRepositoryImpl.ts';
import { CompanyMapper } from './infrastructure/repositories/companyRepository/companyMapper/companyMapper.ts';
import { CompanyRepositoryImpl } from './infrastructure/repositories/companyRepository/companyRepositoryImpl.ts';
import { EmailEventRepositoryImpl } from './infrastructure/repositories/emailEventRepository/emailEventRepositoryImpl.ts';
import { EmailEventMapper } from './infrastructure/repositories/emailEventRepository/mappers/emailEventMapper/emailEventMapper.ts';
import { CandidateMapper } from './infrastructure/repositories/candidateRepository/candidateMapper/candidateMapper.ts';
import { CandidateRepositoryImpl } from './infrastructure/repositories/candidateRepository/candidateRepositoryImpl.ts';
import { UserMapper } from './infrastructure/repositories/userRepository/userMapper/userMapper.ts';
import { UserRepositoryImpl } from './infrastructure/repositories/userRepository/userRepositoryImpl.ts';
import { symbols } from './symbols.ts';

export class UserModule implements DependencyInjectionModule {
  public declareBindings(container: DependencyInjectionContainer): void {
    container.bind<UserMapper>(symbols.userMapper, () => new UserMapper());

    container.bind<CandidateMapper>(symbols.candidateMapper, () => new CandidateMapper());

    container.bind<CompanyMapper>(symbols.companyMapper, () => new CompanyMapper());

    container.bind<UserRepository>(
      symbols.userRepository,
      () =>
        new UserRepositoryImpl(
          container.get<DatabaseClient>(databaseSymbols.databaseClient),
          container.get<UserMapper>(symbols.userMapper),
          container.get<UuidService>(applicationSymbols.uuidService),
        ),
    );

    container.bind<CandidateRepository>(
      symbols.candidateRepository,
      () =>
        new CandidateRepositoryImpl(
          container.get<DatabaseClient>(databaseSymbols.databaseClient),
          container.get<CandidateMapper>(symbols.candidateMapper),
          container.get<UuidService>(applicationSymbols.uuidService),
        ),
    );

    container.bind<CompanyRepository>(
      symbols.companyRepository,
      () =>
        new CompanyRepositoryImpl(
          container.get<DatabaseClient>(databaseSymbols.databaseClient),
          container.get<CompanyMapper>(symbols.companyMapper),
          container.get<UuidService>(applicationSymbols.uuidService),
        ),
    );

    container.bind<BlacklistTokenMapper>(symbols.blacklistTokenMapper, () => new BlacklistTokenMapper());

    container.bind<BlacklistTokenRepository>(
      symbols.blacklistTokenRepository,
      () =>
        new BlacklistTokenRepositoryImpl(
          container.get<DatabaseClient>(databaseSymbols.databaseClient),
          container.get<BlacklistTokenMapper>(symbols.blacklistTokenMapper),
          container.get<UuidService>(applicationSymbols.uuidService),
        ),
    );

    container.bind<HashService>(
      symbols.hashService,
      () => new HashServiceImpl(container.get<Config>(applicationSymbols.config)),
    );

    container.bind<PasswordValidationService>(
      symbols.passwordValidationService,
      () => new PasswordValidationServiceImpl(),
    );

    container.bind<RegisterCompanyAction>(
      symbols.registerCompanyAction,
      () =>
        new RegisterCompanyActionImpl(
          container.get<CompanyRepository>(symbols.companyRepository),
          container.get<HashService>(symbols.hashService),
          container.get<LoggerService>(applicationSymbols.loggerService),
          container.get<PasswordValidationService>(symbols.passwordValidationService),
          container.get<SendVerificationEmailAction>(symbols.sendVerificationEmailAction),
        ),
    );

    container.bind<RegisterCandidateAction>(
      symbols.registerCandidateAction,
      () =>
        new RegisterCandidateActionImpl(
          container.get<CandidateRepository>(symbols.candidateRepository),
          container.get<HashService>(symbols.hashService),
          container.get<LoggerService>(applicationSymbols.loggerService),
          container.get<PasswordValidationService>(symbols.passwordValidationService),
          container.get<SendVerificationEmailAction>(symbols.sendVerificationEmailAction),
        ),
    );

    container.bind<LoginUserAction>(
      symbols.loginUserAction,
      () =>
        new LoginUserActionImpl(
          container.get<UserRepository>(symbols.userRepository),
          container.get<LoggerService>(applicationSymbols.loggerService),
          container.get<HashService>(symbols.hashService),
          container.get<TokenService>(authSymbols.tokenService),
          container.get<Config>(applicationSymbols.config),
        ),
    );

    container.bind<LogoutUserAction>(
      symbols.logoutUserAction,
      () =>
        new LogoutUserActionImpl(
          container.get<UserRepository>(symbols.userRepository),
          container.get<TokenService>(authSymbols.tokenService),
          container.get<BlacklistTokenRepository>(symbols.blacklistTokenRepository),
          container.get<LoggerService>(applicationSymbols.loggerService),
        ),
    );

    container.bind<RefreshUserTokensAction>(
      symbols.refreshUserTokensAction,
      () =>
        new RefreshUserTokensActionImpl(
          container.get<LoggerService>(applicationSymbols.loggerService),
          container.get<TokenService>(authSymbols.tokenService),
          container.get<Config>(applicationSymbols.config),
          container.get<UserRepository>(symbols.userRepository),
          container.get<BlacklistTokenRepository>(symbols.blacklistTokenRepository),
        ),
    );

    container.bind<SendResetPasswordEmailAction>(
      symbols.sendResetPasswordEmailAction,
      () =>
        new SendResetPasswordEmailActionImpl(
          container.get<TokenService>(authSymbols.tokenService),
          container.get<UserRepository>(symbols.userRepository),
          container.get<LoggerService>(applicationSymbols.loggerService),
          container.get<Config>(applicationSymbols.config),
          container.get<EmailMessageBus>(symbols.emailMessageBus),
        ),
    );

    container.bind<ChangeUserPasswordAction>(
      symbols.changeUserPasswordAction,
      () =>
        new ChangeUserPasswordActionImpl(
          container.get<UserRepository>(symbols.userRepository),
          container.get<BlacklistTokenRepository>(symbols.blacklistTokenRepository),
          container.get<HashService>(symbols.hashService),
          container.get<TokenService>(authSymbols.tokenService),
          container.get<PasswordValidationService>(symbols.passwordValidationService),
          container.get<LoggerService>(applicationSymbols.loggerService),
        ),
    );

    container.bind<UpdateCandidateAction>(
      symbols.updateCandidateAction,
      () =>
        new UpdateCandidateActionImpl(
          container.get<CandidateRepository>(symbols.candidateRepository),
          container.get<LoggerService>(applicationSymbols.loggerService),
        ),
    );

    container.bind<UpdateCompanyAction>(
      symbols.updateCompanyAction,
      () =>
        new UpdateCompanyActionImpl(
          container.get<CompanyRepository>(symbols.companyRepository),
          container.get<LoggerService>(applicationSymbols.loggerService),
        ),
    );

    container.bind<FindUserAction>(
      symbols.findUserAction,
      () =>
        new FindUserActionImpl(
          container.get<UserRepository>(symbols.userRepository),
          container.get<CandidateRepository>(symbols.candidateRepository),
          container.get<CompanyRepository>(symbols.companyRepository),
        ),
    );

    container.bind<SendVerificationEmailAction>(
      symbols.sendVerificationEmailAction,
      () =>
        new SendVerificationEmailActionImpl(
          container.get<TokenService>(authSymbols.tokenService),
          container.get<UserRepository>(symbols.userRepository),
          container.get<LoggerService>(applicationSymbols.loggerService),
          container.get<Config>(applicationSymbols.config),
          container.get<EmailMessageBus>(symbols.emailMessageBus),
        ),
    );

    container.bind<VerifyUserEmailAction>(
      symbols.verifyUserEmailAction,
      () =>
        new VerifyUserEmailActionImpl(
          container.get<TokenService>(authSymbols.tokenService),
          container.get<UserRepository>(symbols.userRepository),
          container.get<LoggerService>(applicationSymbols.loggerService),
        ),
    );

    container.bind<UserHttpController>(
      symbols.userHttpController,
      () =>
        new UserHttpController(
          container.get<RegisterCompanyAction>(symbols.registerCompanyAction),
          container.get<RegisterCandidateAction>(symbols.registerCandidateAction),
          container.get<LoginUserAction>(symbols.loginUserAction),
          container.get<UpdateCompanyAction>(symbols.updateCompanyAction),
          container.get<UpdateCandidateAction>(symbols.updateCandidateAction),
          container.get<FindUserAction>(symbols.findUserAction),
          container.get<AccessControlService>(authSymbols.accessControlService),
          container.get<VerifyUserEmailAction>(symbols.verifyUserEmailAction),
          container.get<SendResetPasswordEmailAction>(symbols.sendResetPasswordEmailAction),
          container.get<ChangeUserPasswordAction>(symbols.changeUserPasswordAction),
          container.get<LogoutUserAction>(symbols.logoutUserAction),
          container.get<RefreshUserTokensAction>(symbols.refreshUserTokensAction),
          container.get<SendVerificationEmailAction>(symbols.sendVerificationEmailAction),
        ),
    );

    container.bind<EmailEventMapper>(symbols.emailEventMapper, () => new EmailEventMapper());

    container.bind<EmailEventRepository>(
      symbols.emailEventRepository,
      () =>
        new EmailEventRepositoryImpl(
          container.get<DatabaseClient>(databaseSymbols.databaseClient),
          container.get<UuidService>(applicationSymbols.uuidService),
          container.get<EmailEventMapper>(symbols.emailEventMapper),
        ),
    );

    container.bind<EmailMessageBus>(
      symbols.emailMessageBus,
      () => new EmailMessageBusImpl(container.get<EmailEventRepository>(symbols.emailEventRepository)),
    );

    container.bind<EmailQueueController>(
      symbols.emailQueueController,
      () =>
        new EmailQueueController(
          container.get<EmailEventRepository>(symbols.emailEventRepository),
          container.get<EmailService>(applicationSymbols.emailService),
          container.get<LoggerService>(applicationSymbols.loggerService),
        ),
    );
  }
}
