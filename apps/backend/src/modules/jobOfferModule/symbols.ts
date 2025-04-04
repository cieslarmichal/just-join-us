export const symbols = {
  categoryMapper: Symbol('categoryMapper'),
  categoryRepository: Symbol('categoryRepository'),
  findCategoriesAction: Symbol('findCategoriesAction'),

  skillMapper: Symbol('skillMapper'),
  skillRepository: Symbol('skillRepository'),
  findSkillsAction: Symbol('findSkillsAction'),

  jobOfferMapper: Symbol('jobOfferMapper'),
  jobOfferRepository: Symbol('jobOfferRepository'),
  createJobOfferAction: Symbol('createJobOfferAction'),
  findJobOfferAction: Symbol('findJobOfferAction'),
  findJobOffersAction: Symbol('findJobOffersAction'),
  updateJobOfferAction: Symbol('updateJobOfferAction'),

  jobOfferHttpController: Symbol('jobOfferHttpController'),
  categoryHttpController: Symbol('categoryHttpController'),
  skillHttpController: Symbol('skillHttpController'),
};

export const jobOfferSymbols = {
  jobOfferHttpController: symbols.jobOfferHttpController,
  categoryHttpController: symbols.categoryHttpController,
  skillHttpController: symbols.skillHttpController,
};
