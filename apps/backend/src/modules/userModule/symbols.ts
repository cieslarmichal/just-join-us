export const symbols = {
  blacklistTokenMapper: Symbol('blacklistTokenMapper'),
  blacklistTokenRepository: Symbol('blacklistTokenRepository'),

  userMapper: Symbol('userMapper'),
  studentMapper: Symbol('studentMapper'),
  companyMapper: Symbol('companyMapper'),
  userRepository: Symbol('userRepository'),
  studentRepository: Symbol('studentRepository'),
  companyRepository: Symbol('companyRepository'),
  registerStudentAction: Symbol('registerStudentAction'),
  registerCompanyAction: Symbol('registerCompanyAction'),
  findUserAction: Symbol('findUserAction'),
  loginUserAction: Symbol('loginUserAction'),
  refreshUserTokensAction: Symbol('refreshUserTokensAction'),
  logoutUserAction: Symbol('logoutUserAction'),
  updateStudentAction: Symbol('updateStudentAction'),
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
