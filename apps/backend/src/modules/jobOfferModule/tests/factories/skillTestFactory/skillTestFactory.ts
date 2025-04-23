import { Generator } from '../../../../../../tests/generator.ts';
import type { SkillRawEntity } from '../../../../databaseModule/infrastructure/tables/skillsTable/skillRawEntity.ts';
import { type SkillDraft, Skill } from '../../../domain/entities/skill/skill.ts';

export class SkillTestFactory {
  public create(input: Partial<SkillDraft> = {}): Skill {
    const name = Generator.skillName();
    const slug = name.replace(/\s+/g, '-').toLowerCase();

    return new Skill({
      id: Generator.uuid(),
      name,
      slug,
      ...input,
    });
  }

  public createRaw(input: Partial<SkillRawEntity> = {}): SkillRawEntity {
    const name = Generator.skillName();
    const slug = name.replace(/\s+/g, '-').toLowerCase();

    return {
      id: Generator.uuid(),
      name,
      slug,
      ...input,
    };
  }
}
