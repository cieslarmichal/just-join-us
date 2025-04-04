import { beforeEach, expect, describe, it } from 'vitest';

import { SkillTestFactory } from '../../../../tests/factories/skillTestFactory/skillTestFactory.ts';

import { SkillMapper } from './skillMapper.ts';

describe('SkillMapper', () => {
  let mapper: SkillMapper;

  const skillTestFactory = new SkillTestFactory();

  beforeEach(async () => {
    mapper = new SkillMapper();
  });

  it('maps from SkillRawEntity to Skill', async () => {
    const skillEntity = skillTestFactory.createRaw();

    const skill = mapper.mapToDomain(skillEntity);

    expect(skill.getId()).toBe(skillEntity.id);

    expect(skill.getState()).toEqual({
      name: skillEntity.name,
    });
  });
});
