import { beforeEach, afterEach, expect, it, describe } from 'vitest';

import { testSymbols } from '../../../../../../tests/symbols.ts';
import { TestContainer } from '../../../../../../tests/testContainer.ts';
import { databaseSymbols } from '../../../../databaseModule/symbols.ts';
import type { DatabaseClient } from '../../../../databaseModule/types/databaseClient.ts';
import { symbols } from '../../../symbols.ts';
import type { SkillTestUtils } from '../../../tests/utils/skillTestUtils/skillTestUtils.ts';

import { type FindSkillsAction } from './findSkillsAction.ts';

describe('FindSkillsAction', () => {
  let action: FindSkillsAction;

  let databaseClient: DatabaseClient;

  let skillTestUtils: SkillTestUtils;

  beforeEach(async () => {
    const container = await TestContainer.create();

    action = container.get<FindSkillsAction>(symbols.findSkillsAction);

    databaseClient = container.get<DatabaseClient>(databaseSymbols.databaseClient);

    skillTestUtils = container.get<SkillTestUtils>(testSymbols.skillTestUtils);

    await skillTestUtils.truncate();
  });

  afterEach(async () => {
    await skillTestUtils.truncate();

    await databaseClient.destroy();
  });

  it('finds all skills', async () => {
    const skill1 = await skillTestUtils.createAndPersist({ input: { name: 'C++' } });
    const skill2 = await skillTestUtils.createAndPersist({ input: { name: 'Go' } });
    const skill3 = await skillTestUtils.createAndPersist({ input: { name: 'Javascript' } });

    const { data: skills, total } = await action.execute({ page: 1, pageSize: 10 });

    expect(skills).toHaveLength(3);
    expect(skills[0]?.getId()).toBe(skill1.id);
    expect(skills[1]?.getId()).toBe(skill2.id);
    expect(skills[2]?.getId()).toBe(skill3.id);
    expect(total).toBe(3);
  });

  it('finds skills by name', async () => {
    const skill1 = await skillTestUtils.createAndPersist({ input: { name: 'Net' } });
    await skillTestUtils.createAndPersist({ input: { name: 'AI/ML' } });
    await skillTestUtils.createAndPersist({ input: { name: 'Data' } });

    const { data: skills, total } = await action.execute({ name: 'net', page: 1, pageSize: 10 });

    expect(skills).toHaveLength(1);
    expect(skills[0]?.getId()).toBe(skill1.id);
    expect(total).toBe(1);
  });
});
