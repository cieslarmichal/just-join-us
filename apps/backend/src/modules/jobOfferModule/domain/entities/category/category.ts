export interface CategoryDraft {
  readonly id: string;
  readonly name: string;
}

export interface CategoryState {
  readonly name: string;
}

export class Category {
  private id: string;
  private state: CategoryState;

  public constructor(draft: CategoryDraft) {
    const { id, name } = draft;

    this.id = id;

    this.state = { name };
  }

  public getId(): string {
    return this.id;
  }

  public getName(): string {
    return this.state.name;
  }

  public getState(): CategoryState {
    return this.state;
  }
}
