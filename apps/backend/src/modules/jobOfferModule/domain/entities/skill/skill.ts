export interface SkillDraft {
  readonly id: string;
  readonly name: string;
  readonly slug: string;
}

export interface SkillState {
  readonly name: string;
  readonly slug: string;
}

export class Skill {
  private id: string;
  private state: SkillState;

  public constructor(draft: SkillDraft) {
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

  public getState(): SkillState {
    return this.state;
  }
}
