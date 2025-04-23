import { RepositoryError } from '../../../../../common/errors/repositoryError.ts';
import { type UuidService } from '../../../../../common/uuid/uuidService.ts';
import type { SkillRawEntity } from '../../../../databaseModule/infrastructure/tables/skillsTable/skillRawEntity.ts';
import { skillsTable } from '../../../../databaseModule/infrastructure/tables/skillsTable/skillsTable.ts';
import type { DatabaseClient } from '../../../../databaseModule/types/databaseClient.ts';
import { type Skill } from '../../../domain/entities/skill/skill.ts';
import {
  type SkillRepository,
  type CountSkillsPayload,
  type CreateSkillPayload,
  type FindSkillsPayload,
  type FindSkillPayload,
} from '../../../domain/repositories/skillRepository/skillRepository.ts';

import { type SkillMapper } from './skillMapper/skillMapper.ts';

export class SkillRepositoryImpl implements SkillRepository {
  private readonly databaseClient: DatabaseClient;
  private readonly skillMapper: SkillMapper;
  private readonly uuidService: UuidService;

  public constructor(databaseClient: DatabaseClient, skillMapper: SkillMapper, uuidService: UuidService) {
    this.databaseClient = databaseClient;
    this.skillMapper = skillMapper;
    this.uuidService = uuidService;
  }

  public async createSkill(payload: CreateSkillPayload): Promise<Skill> {
    const {
      data: { name, slug },
    } = payload;

    let rawEntities: SkillRawEntity[];

    try {
      rawEntities = await this.databaseClient<SkillRawEntity>(skillsTable.name).insert(
        {
          id: this.uuidService.generateUuid(),
          name,
          slug,
        },
        '*',
      );
    } catch (error) {
      throw new RepositoryError({
        entity: 'Skill',
        operation: 'create',
        originalError: error,
      });
    }

    const rawEntity = rawEntities[0] as SkillRawEntity;

    return this.skillMapper.mapToDomain(rawEntity);
  }

  public async findSkill(payload: FindSkillPayload): Promise<Skill | null> {
    const { id } = payload;

    let rawEntity: SkillRawEntity | undefined;

    try {
      rawEntity = await this.databaseClient<SkillRawEntity>(skillsTable.name).select('*').where({ id }).first();
    } catch (error) {
      throw new RepositoryError({
        entity: 'Skill',
        operation: 'find',
        originalError: error,
      });
    }

    if (!rawEntity) {
      return null;
    }

    return this.skillMapper.mapToDomain(rawEntity);
  }

  public async findSkills(payload: FindSkillsPayload): Promise<Skill[]> {
    const { name, page, pageSize, ids } = payload;

    let rawEntities: SkillRawEntity[];

    try {
      const query = this.databaseClient<SkillRawEntity>(skillsTable.name).select('*');

      if (name) {
        query.whereRaw(`${skillsTable.columns.name} ILIKE ?`, `%${name}%`);
      }

      if (ids?.length) {
        query.whereIn(skillsTable.columns.id, ids);
      }

      rawEntities = await query
        .orderBy(skillsTable.columns.name, 'asc')
        .limit(pageSize)
        .offset((page - 1) * pageSize);
    } catch (error) {
      throw new RepositoryError({
        entity: 'Skill',
        operation: 'find',
        originalError: error,
      });
    }

    return rawEntities.map((rawEntity) => this.skillMapper.mapToDomain(rawEntity));
  }

  public async countSkills(payload: CountSkillsPayload): Promise<number> {
    const { name } = payload;

    try {
      const query = this.databaseClient<SkillRawEntity>(skillsTable.name);

      if (name) {
        query.whereRaw(`${skillsTable.columns.name} ILIKE ?`, `%${name}%`);
      }

      const countResult = await query.count().first();

      const count = countResult?.['count'];

      if (count === undefined) {
        throw new RepositoryError({
          entity: 'Skill',
          operation: 'count',
          countResult,
        });
      }

      if (typeof count === 'string') {
        return parseInt(count, 10);
      }

      return count;
    } catch (error) {
      throw new RepositoryError({
        entity: 'Skill',
        operation: 'count',
        originalError: error,
      });
    }
  }
}
