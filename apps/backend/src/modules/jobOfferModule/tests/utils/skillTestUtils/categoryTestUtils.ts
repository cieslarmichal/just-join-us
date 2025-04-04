import { TestUtils } from '../../../../../../tests/testUtils.ts';
import type { SkillRawEntity } from '../../../../databaseModule/infrastructure/tables/skillsTable/skillRawEntity.ts';
import { skillsTable } from '../../../../databaseModule/infrastructure/tables/skillsTable/skillsTable.ts';
import type { DatabaseClient } from '../../../../databaseModule/types/databaseClient.ts';
import { SkillTestFactory } from '../../factories/skillTestFactory/skillTestFactory.ts';

interface CreateAndPersistPayload {
  readonly input?: Partial<SkillRawEntity>;
}

interface FindByNamePayload {
  readonly name: string;
}

interface FindByIdPayload {
  readonly id: string;
}

export class SkillTestUtils extends TestUtils {
  private readonly skillTestFactory = new SkillTestFactory();

  public constructor(databaseClient: DatabaseClient) {
    super(databaseClient, skillsTable.name);
  }

  public async createAndPersist(payload: CreateAndPersistPayload = {}): Promise<SkillRawEntity> {
    const { input } = payload;

    const skill = this.skillTestFactory.createRaw(input);

    const rawEntities = await this.databaseClient<SkillRawEntity>(skillsTable.name).insert(skill, '*');

    const rawEntity = rawEntities[0] as SkillRawEntity;

    return rawEntity;
  }

  public async findByName(payload: FindByNamePayload): Promise<SkillRawEntity> {
    const { name } = payload;

    const rawEntity = await this.databaseClient<SkillRawEntity>(skillsTable.name).select('*').where({ name }).first();

    return rawEntity as SkillRawEntity;
  }

  public async findById(payload: FindByIdPayload): Promise<SkillRawEntity> {
    const { id } = payload;

    const rawEntity = await this.databaseClient<SkillRawEntity>(skillsTable.name).select('*').where({ id }).first();

    return rawEntity as SkillRawEntity;
  }
}
