export interface CategoryDraft {
  readonly id: string;
  readonly name: string;
  readonly slug: string;
}

export interface CategoryState {
  readonly name: string;
  readonly slug: string;
}

export class Category {
  private id: string;
  private state: CategoryState;

  public constructor(draft: CategoryDraft) {
    const { id, name, slug } = draft;

    this.id = id;

    this.state = { name, slug };
  }

  public getId(): string {
    return this.id;
  }

  public getName(): string {
    return this.state.name;
  }

  public getSlug(): string {
    return this.state.slug;
  }

  public getState(): CategoryState {
    return this.state;
  }
}
