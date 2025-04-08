import type { SkillRawEntity } from '../../../../databaseModule/infrastructure/tables/skillsTable/skillRawEntity.ts';
import type { Skill } from '../../entities/skill/skill.ts';

export interface CreateSkillPayload {
  readonly data: Omit<SkillRawEntity, 'id'>;
}

export interface FindSkillPayload {
  readonly id: string;
}

export interface FindSkillsPayload {
  readonly ids?: string[] | undefined;
  readonly name?: string | undefined;
  readonly page: number;
  readonly pageSize: number;
}

export interface CountSkillsPayload {
  readonly name?: string | undefined;
}

export interface SkillRepository {
  createSkill(payload: CreateSkillPayload): Promise<Skill>;
  findSkill(payload: FindSkillPayload): Promise<Skill | null>;
  findSkills(payload: FindSkillsPayload): Promise<Skill[]>;
  countSkills(payload: CountSkillsPayload): Promise<number>;
}
