export interface SkillDraft {
  readonly id: string;
  readonly name: string;
}

export interface SkillState {
  readonly name: string;
}

export class Skill {
  private id: string;
  private state: SkillState;

  public constructor(draft: SkillDraft) {
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

  public getState(): SkillState {
    return this.state;
  }
}
