import { type Action } from '../../../../../common/types/action.ts';
import type { Skill } from '../../../domain/entities/skill/skill.ts';

export interface FindSkillsActionPayload {
  readonly name?: string | undefined;
  readonly page: number;
  readonly pageSize: number;
}

export interface FindSkillsActionResult {
  readonly data: Skill[];
  readonly total: number;
}

export type FindSkillsAction = Action<FindSkillsActionPayload, FindSkillsActionResult>;
