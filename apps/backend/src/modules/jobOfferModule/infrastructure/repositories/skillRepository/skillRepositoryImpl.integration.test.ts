import { beforeEach, afterEach, expect, describe, it } from 'vitest';

import { Generator } from '../../../../../../tests/generator.ts';
import { testSymbols } from '../../../../../../tests/symbols.ts';
import { TestContainer } from '../../../../../../tests/testContainer.ts';
import { RepositoryError } from '../../../../../common/errors/repositoryError.ts';
import { databaseSymbols } from '../../../../databaseModule/symbols.ts';
import type { DatabaseClient } from '../../../../databaseModule/types/databaseClient.ts';
import { type SkillRepository } from '../../../domain/repositories/skillRepository/skillRepository.ts';
import { symbols } from '../../../symbols.ts';
import { SkillTestFactory } from '../../../tests/factories/skillTestFactory/skillTestFactory.ts';
import type { SkillTestUtils } from '../../../tests/utils/skillTestUtils/categoryTestUtils.ts';

describe('SkillRepositoryImpl', () => {
  let skillRepository: SkillRepository;

  let databaseClient: DatabaseClient;

  let skillTestUtils: SkillTestUtils;

  const skillTestFactory = new SkillTestFactory();

  beforeEach(async () => {
    const container = await TestContainer.create();

    skillRepository = container.get<SkillRepository>(symbols.skillRepository);

    databaseClient = container.get<DatabaseClient>(databaseSymbols.databaseClient);

    skillTestUtils = container.get<SkillTestUtils>(testSymbols.skillTestUtils);

    await skillTestUtils.truncate();
  });

  afterEach(async () => {
    await skillTestUtils.truncate();

    await databaseClient.destroy();
  });

  describe('Create', () => {
    it('creates a Skill', async () => {
      const { name } = skillTestFactory.createRaw();

      const createdSkill = await skillRepository.createSkill({ data: { name } });

      const foundSkill = await skillTestUtils.findByName({ name });

      expect(createdSkill.getName()).toEqual(name);

      expect(foundSkill).toEqual({
        id: createdSkill.getId(),
        name,
      });
    });

    it('throws an error when a Skill with the same name already exists', async () => {
      const existingSkill = await skillTestUtils.createAndPersist();

      try {
        await skillRepository.createSkill({ data: { name: existingSkill.name } });
      } catch (error) {
        expect(error).toBeInstanceOf(RepositoryError);

        return;
      }

      expect.fail();
    });
  });

  describe('Find', () => {
    it('finds a Skill by id', async () => {
      const skill = await skillTestUtils.createAndPersist();

      const foundSkill = await skillRepository.findSkill({ id: skill.id });

      expect(foundSkill).not.toBeNull();
    });

    it('returns null if a Skill with given id does not exist', async () => {
      const id = Generator.uuid();

      const foundSkill = await skillRepository.findSkill({ id });

      expect(foundSkill).toBeNull();
    });

    it('finds Skills by name', async () => {
      const skill = await skillTestUtils.createAndPersist({ input: { name: 'Docker' } });
      await skillTestUtils.createAndPersist({ input: { name: 'Kubernetes' } });

      const foundSkills = await skillRepository.findSkills({ name: 'kub', page: 1, pageSize: 10 });

      expect(foundSkills).toHaveLength(1);
      expect(foundSkills[0]?.getId()).toEqual(skill.id);
      expect(foundSkills[0]?.getName()).toEqual(skill.name);
    });
  });

  describe('Count', () => {
    it('counts all Skills', async () => {
      await skillTestUtils.createAndPersist();
      await skillTestUtils.createAndPersist();
      await skillTestUtils.createAndPersist();

      const count = await skillRepository.countSkills({});

      expect(count).toEqual(3);
    });

    it('counts Skills by name', async () => {
      await skillTestUtils.createAndPersist({ input: { name: 'Docker' } });
      await skillTestUtils.createAndPersist({ input: { name: 'Kubernetes' } });

      const count = await skillRepository.countSkills({ name: 'doc' });

      expect(count).toEqual(1);
    });
  });
});
