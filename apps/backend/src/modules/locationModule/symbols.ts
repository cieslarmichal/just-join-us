export const symbols = {
  cityMapper: Symbol('cityMapper'),
  cityRepository: Symbol('cityRepository'),
  findCitiesAction: Symbol('findCitiesAction'),
  findCityAction: Symbol('findCityAction'),

  companyLocationMapper: Symbol('companyLocationMapper'),
  companyLocationRepository: Symbol('companyLocationRepository'),
  createCompanyLocationAction: Symbol('createCompanyLocationAction'),
  createRemoteCompanyLocationAction: Symbol('createRemoteCompanyLocationAction'),
  updateCompanyLocationAction: Symbol('updateCompanyLocationAction'),
  findCompanyLocationsAction: Symbol('findCompanyLocationsAction'),

  companyLocationHttpController: Symbol('companyLocationHttpController'),
  cityHttpController: Symbol('cityHttpController'),
};

export const locationSymbols = {
  companyLocationHttpController: symbols.companyLocationHttpController,
  cityHttpController: symbols.cityHttpController,
  companyLocationRepository: symbols.companyLocationRepository,
};
