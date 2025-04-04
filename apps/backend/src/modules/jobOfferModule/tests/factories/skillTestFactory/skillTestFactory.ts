import { Generator } from '../../../../../../tests/generator.ts';
import type { SkillRawEntity } from '../../../../databaseModule/infrastructure/tables/skillsTable/skillRawEntity.ts';
import { type SkillDraft, Skill } from '../../../domain/entities/skill/skill.ts';

export class SkillTestFactory {
  public create(input: Partial<SkillDraft> = {}): Skill {
    return new Skill({
      id: Generator.uuid(),
      name: Generator.skillName(),
      ...input,
    });
  }

  public createRaw(input: Partial<SkillRawEntity> = {}): SkillRawEntity {
    return {
      id: Generator.uuid(),
      name: Generator.skillName(),
      ...input,
    };
  }
}
