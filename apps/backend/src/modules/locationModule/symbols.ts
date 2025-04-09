export const symbols = {
  cityMapper: Symbol('cityMapper'),
  cityRepository: Symbol('cityRepository'),
  findCitiesAction: Symbol('findCitiesAction'),

  companyLocationMapper: Symbol('companyLocationMapper'),
  companyLocationRepository: Symbol('companyLocationRepository'),
  createCompanyLocationAction: Symbol('createCompanyLocationAction'),
  createRemoteCompanyLocationAction: Symbol('createRemoteCompanyLocationAction'),
  updateCompanyLocationAction: Symbol('updateCompanyLocationAction'),

  companyLocationHttpController: Symbol('companyLocationHttpController'),
  cityHttpController: Symbol('cityHttpController'),
};

export const locationSymbols = {
  companyLocationHttpController: symbols.companyLocationHttpController,
  cityHttpController: symbols.cityHttpController,
  companyLocationRepository: symbols.companyLocationRepository,
};
