import type { Category } from '../category/category.ts';

interface TrainingCompanyState {
  readonly name: string;
  readonly logoUrl: string;
}

interface TrainingCategoryState {
  readonly name: string;
}

export interface TrainingDraft {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly isHidden: boolean;
  readonly categoryId: string;
  readonly category?: TrainingCategoryState;
  readonly companyId: string;
  readonly company?: TrainingCompanyState;
  readonly createdAt: Date;
}

export interface TrainingState {
  name: string;
  description: string;
  isHidden: boolean;
  categoryId: string;
  category?: TrainingCategoryState;
  readonly companyId: string;
  readonly company?: TrainingCompanyState;
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

export class Training {
  private id: string;
  private state: TrainingState;

  public constructor(draft: TrainingDraft) {
    const { id, name, description, isHidden, categoryId, companyId, createdAt, category, company } = draft;

    this.id = id;

    let trainingState: TrainingState = {
      name,
      description,
      isHidden,
      categoryId,
      companyId,
      createdAt,
    };

    if (category) {
      trainingState = { ...trainingState, category };
    }

    if (company) {
      trainingState = { ...trainingState, company };
    }

    this.state = trainingState;
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

  public getCategory(): TrainingCategoryState | undefined {
    return this.state.category;
  }

  public getCompanyId(): string {
    return this.state.companyId;
  }

  public getCompany(): TrainingCompanyState | undefined {
    return this.state.company;
  }

  public getCreatedAt(): Date {
    return this.state.createdAt;
  }

  public getState(): TrainingState {
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
