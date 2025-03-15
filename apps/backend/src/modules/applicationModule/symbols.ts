export const symbols = {
  config: Symbol('config'),
  loggerService: Symbol('loggerService'),
  uuidService: Symbol('uuidService'),
  s3Client: Symbol('s3Client'),
  s3Service: Symbol('s3Service'),
  httpService: Symbol('httpService'),
  emailService: Symbol('emailService'),
  applicationHttpController: Symbol('applicationHttpController'),
  uploadImageAction: Symbol('uploadImageAction'),
};

export const applicationSymbols = {
  config: symbols.config,
  loggerService: symbols.loggerService,
  uuidService: symbols.uuidService,
  s3Client: symbols.s3Client,
  s3Service: symbols.s3Service,
  httpService: symbols.httpService,
  emailService: symbols.emailService,
  applicationHttpController: symbols.applicationHttpController,
};
