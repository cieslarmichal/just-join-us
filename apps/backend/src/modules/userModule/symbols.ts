export const symbols = {
  hashService: Symbol('hashService'),
  passwordValidationService: Symbol('passwordValidationService'),

  blacklistTokenMapper: Symbol('blacklistTokenMapper'),
  blacklistTokenRepository: Symbol('blacklistTokenRepository'),

  userMapper: Symbol('userMapper'),
  userRepository: Symbol('userRepository'),
  findUserAction: Symbol('findUserAction'),
  loginUserAction: Symbol('loginUserAction'),
  refreshUserTokensAction: Symbol('refreshUserTokensAction'),
  logoutUserAction: Symbol('logoutUserAction'),
  sendResetPasswordEmailAction: Symbol('sendResetPasswordEmailAction'),
  sendVerificationEmailAction: Symbol('sendVerificationEmailAction'),
  changeUserPasswordAction: Symbol('changeUserPasswordAction'),
  verifyUserEmailAction: Symbol('verifyUserEmailAction'),
  userHttpController: Symbol('userHttpController'),

  candidateMapper: Symbol('candidateMapper'),
  candidateRepository: Symbol('candidateRepository'),
  registerCandidateAction: Symbol('registerCandidateAction'),
  updateCandidateAction: Symbol('updateCandidateAction'),

  companyMapper: Symbol('companyMapper'),
  companyRepository: Symbol('companyRepository'),
  registerCompanyAction: Symbol('registerCompanyAction'),
  updateCompanyAction: Symbol('updateCompanyAction'),

  emailEventRepository: Symbol('emailEventRepository'),
  emailEventMapper: Symbol('emailEventMapper'),
  emailMessageBus: Symbol('emailMessageBus'),
  emailQueueController: Symbol('emailQueueController'),
};

export const userSymbols = {
  userHttpController: symbols.userHttpController,
  emailQueueController: symbols.emailQueueController,
  hashService: symbols.hashService,
  emailMessageBus: symbols.emailMessageBus,
  companyRepository: symbols.companyRepository,
};
