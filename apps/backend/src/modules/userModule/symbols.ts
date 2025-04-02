export const symbols = {
  blacklistTokenMapper: Symbol('blacklistTokenMapper'),
  blacklistTokenRepository: Symbol('blacklistTokenRepository'),

  userMapper: Symbol('userMapper'),
  candidateMapper: Symbol('candidateMapper'),
  companyMapper: Symbol('companyMapper'),
  userRepository: Symbol('userRepository'),
  candidateRepository: Symbol('candidateRepository'),
  companyRepository: Symbol('companyRepository'),
  registerCandidateAction: Symbol('registerCandidateAction'),
  registerCompanyAction: Symbol('registerCompanyAction'),
  findUserAction: Symbol('findUserAction'),
  loginUserAction: Symbol('loginUserAction'),
  refreshUserTokensAction: Symbol('refreshUserTokensAction'),
  logoutUserAction: Symbol('logoutUserAction'),
  updateCandidateAction: Symbol('updateCandidateAction'),
  updateCompanyAction: Symbol('updateCompanyAction'),
  sendResetPasswordEmailAction: Symbol('sendResetPasswordEmailAction'),
  sendVerificationEmailAction: Symbol('sendVerificationEmailAction'),
  changeUserPasswordAction: Symbol('changeUserPasswordAction'),
  verifyUserEmailAction: Symbol('verifyUserEmailAction'),
  userHttpController: Symbol('userHttpController'),

  emailEventRepository: Symbol('emailEventRepository'),
  emailEventMapper: Symbol('emailEventMapper'),
  emailMessageBus: Symbol('emailMessageBus'),
  emailQueueController: Symbol('emailQueueController'),

  hashService: Symbol('hashService'),
  passwordValidationService: Symbol('passwordValidationService'),
};

export const userSymbols = {
  userHttpController: symbols.userHttpController,
  emailQueueController: symbols.emailQueueController,
  hashService: symbols.hashService,
  emailMessageBus: symbols.emailMessageBus,
  companyRepository: symbols.companyRepository,
};
