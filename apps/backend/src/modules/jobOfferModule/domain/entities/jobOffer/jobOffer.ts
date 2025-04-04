import type { Category } from '../category/category.ts';

interface JobOfferCompanyState {
  readonly name: string;
  readonly logoUrl: string;
}

interface JobOfferCategoryState {
  readonly name: string;
}

export interface JobOfferDraft {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly isHidden: boolean;
  readonly categoryId: string;
  readonly category?: JobOfferCategoryState;
  readonly companyId: string;
  readonly company?: JobOfferCompanyState;
  readonly createdAt: Date;
}

export interface JobOfferState {
  name: string;
  description: string;
  isHidden: boolean;
  categoryId: string;
  category?: JobOfferCategoryState;
  readonly companyId: string;
  readonly company?: JobOfferCompanyState;
  readonly createdAt: Date;
}

export interface SetNamePayload {
  readonly name: string;
}

export interface SetDescriptionPayload {
  readonly description: string;
}

export interface SetIsHiddenPayload {
  readonly isHidden: boolean;
}

export interface SetCategoryPayload {
  readonly category: Category;
}

export class JobOffer {
  private id: string;
  private state: JobOfferState;

  public constructor(draft: JobOfferDraft) {
    const { id, name, description, isHidden, categoryId, companyId, createdAt, category, company } = draft;

    this.id = id;

    let jobOfferState: JobOfferState = {
      name,
      description,
      isHidden,
      categoryId,
      companyId,
      createdAt,
    };

    if (category) {
      jobOfferState = { ...jobOfferState, category };
    }

    if (company) {
      jobOfferState = { ...jobOfferState, company };
    }

    this.state = jobOfferState;
  }

  public getId(): string {
    return this.id;
  }

  public getName(): string {
    return this.state.name;
  }

  public getDescription(): string {
    return this.state.description;
  }

  public getIsHidden(): boolean {
    return this.state.isHidden;
  }

  public getCategoryId(): string {
    return this.state.categoryId;
  }

  public getCategory(): JobOfferCategoryState | undefined {
    return this.state.category;
  }

  public getCompanyId(): string {
    return this.state.companyId;
  }

  public getCompany(): JobOfferCompanyState | undefined {
    return this.state.company;
  }

  public getCreatedAt(): Date {
    return this.state.createdAt;
  }

  public getState(): JobOfferState {
    return this.state;
  }

  public setName(payload: SetNamePayload): void {
    this.state.name = payload.name;
  }

  public setDescription(payload: SetDescriptionPayload): void {
    this.state.description = payload.description;
  }

  public setIsHidden(payload: SetIsHiddenPayload): void {
    this.state.isHidden = payload.isHidden;
  }

  public setCategory(payload: SetCategoryPayload): void {
    this.state.categoryId = payload.category.getId();
    this.state.category = { name: payload.category.getName() };
  }
}
