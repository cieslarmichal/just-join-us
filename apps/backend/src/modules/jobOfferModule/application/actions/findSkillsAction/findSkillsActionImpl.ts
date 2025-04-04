import type { SkillRepository } from '../../../domain/repositories/skillRepository/skillRepository.ts';

import {
  type FindSkillsAction,
  type FindSkillsActionPayload,
  type FindSkillsActionResult,
} from './findSkillsAction.ts';

export class FindSkillsActionImpl implements FindSkillsAction {
  private readonly skillRepository: SkillRepository;

  public constructor(skillRepository: SkillRepository) {
    this.skillRepository = skillRepository;
  }

  public async execute(payload: FindSkillsActionPayload): Promise<FindSkillsActionResult> {
    const { name, page, pageSize } = payload;

    const [skills, total] = await Promise.all([
      this.skillRepository.findSkills({ name, page, pageSize }),
      this.skillRepository.countSkills({ name }),
    ]);

    return { data: skills, total };
  }
}
