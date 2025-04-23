import type { SkillRawEntity } from '../../../../../databaseModule/infrastructure/tables/skillsTable/skillRawEntity.ts';
import { Skill } from '../../../../domain/entities/skill/skill.ts';

export class SkillMapper {
  public mapToDomain(entity: SkillRawEntity): Skill {
    const { id, name, slug } = entity;

    return new Skill({
      id,
      name,
      slug,
    });
  }
}
