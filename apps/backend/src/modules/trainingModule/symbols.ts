export const symbols = {
  categoryMapper: Symbol('categoryMapper'),
  categoryRepository: Symbol('categoryRepository'),
  findCategoriesAction: Symbol('findCategoriesAction'),

  trainingMapper: Symbol('trainingMapper'),
  trainingRepository: Symbol('trainingRepository'),
  createTrainingAction: Symbol('createTrainingAction'),
  findTrainingAction: Symbol('findTrainingAction'),
  findTrainingsAction: Symbol('findTrainingsAction'),
  updateTrainingAction: Symbol('updateTrainingAction'),

  trainingHttpController: Symbol('trainingHttpController'),
  categoryHttpController: Symbol('categoryHttpController'),
};

export const trainingSymbols = {
  trainingHttpController: symbols.trainingHttpController,
  categoryHttpController: symbols.categoryHttpController,
};
