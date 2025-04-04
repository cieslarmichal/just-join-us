export const symbols = {
  cityMapper: Symbol('cityMapper'),
  cityRepository: Symbol('cityRepository'),
  findCitiesAction: Symbol('findCitiesAction'),

  locationMapper: Symbol('locationMapper'),
  locationRepository: Symbol('locationRepository'),
  createLocationAction: Symbol('createLocationAction'),
  createRemoteLocationAction: Symbol('createRemoteLocationAction'),
  updateLocationAction: Symbol('updateLocationAction'),

  locationHttpController: Symbol('locationHttpController'),
  cityHttpController: Symbol('cityHttpController'),
};

export const locationSymbols = {
  locationHttpController: symbols.locationHttpController,
  cityHttpController: symbols.cityHttpController,
};
