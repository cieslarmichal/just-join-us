import { RepositoryError } from '../../../../../common/errors/repositoryError.ts';
import { type UuidService } from '../../../../../common/uuid/uuidService.ts';
import type {
  CandidateRawEntity,
  CandidateRawEntityExtended,
} from '../../../../databaseModule/infrastructure/tables/candidatesTable/candidateRawEntity.ts';
import { candidatesTable } from '../../../../databaseModule/infrastructure/tables/candidatesTable/candidatesTable.ts';
import type { UserRawEntity } from '../../../../databaseModule/infrastructure/tables/usersTable/userRawEntity.ts';
import { usersTable } from '../../../../databaseModule/infrastructure/tables/usersTable/usersTable.ts';
import type { DatabaseClient } from '../../../../databaseModule/types/databaseClient.ts';
import { type Candidate } from '../../../domain/entities/candidate/candidate.ts';
import {
  type FindCandidatesPayload,
  type FindCandidatePayload,
  type CreateCandidatePayload,
  type CandidateRepository,
  type UpdateCandidatePayload,
} from '../../../domain/repositories/candidateRepository/candidateRepository.ts';

import { type CandidateMapper } from './candidateMapper/candidateMapper.ts';

export class CandidateRepositoryImpl implements CandidateRepository {
  private readonly databaseClient: DatabaseClient;
  private readonly candidateMapper: CandidateMapper;
  private readonly uuidService: UuidService;

  public constructor(databaseClient: DatabaseClient, candidateMapper: CandidateMapper, uuidService: UuidService) {
    this.databaseClient = databaseClient;
    this.candidateMapper = candidateMapper;
    this.uuidService = uuidService;
  }

  public async createCandidate(payload: CreateCandidatePayload): Promise<Candidate> {
    const {
      data: {
        email,
        password,
        isEmailVerified,
        isDeleted,
        role,
        firstName,
        lastName,
        githubUrl,
        linkedinUrl,
        resumeUrl,
      },
    } = payload;

    const id = this.uuidService.generateUuid();

    try {
      await this.databaseClient.transaction(async (transaction) => {
        await transaction<UserRawEntity>(usersTable.name).insert({
          id,
          email,
          password,
          is_email_verified: isEmailVerified,
          is_deleted: isDeleted,
          role,
        });

        await transaction<CandidateRawEntity>(candidatesTable.name).insert({
          id,
          first_name: firstName,
          last_name: lastName,
          github_url: githubUrl,
          linkedin_url: linkedinUrl,
          resume_url: resumeUrl,
        });
      });
    } catch (error) {
      throw new RepositoryError({
        entity: 'Candidate',
        operation: 'create',
        originalError: error,
      });
    }

    const createdCandidate = await this.findCandidate({ id });

    return createdCandidate as Candidate;
  }

  public async updateCandidate(payload: UpdateCandidatePayload): Promise<Candidate> {
    const { candidate } = payload;

    const { password, isDeleted, isEmailVerified } = candidate.getUserState();

    const { firstName, lastName, resumeUrl, githubUrl, linkedinUrl } = candidate.getCandidateState();

    try {
      await this.databaseClient.transaction(async (transaction) => {
        await transaction<UserRawEntity>(usersTable.name)
          .update({
            password,
            is_email_verified: isEmailVerified,
            is_deleted: isDeleted,
          })
          .where({ id: candidate.getId() });

        await transaction<CandidateRawEntity>(candidatesTable.name)
          .update({
            first_name: firstName,
            last_name: lastName,
            github_url: githubUrl,
            linkedin_url: linkedinUrl,
            resume_url: resumeUrl,
          })
          .where({ id: candidate.getId() });
      });
    } catch (error) {
      throw new RepositoryError({
        entity: 'Candidate',
        operation: 'update',
        originalError: error,
      });
    }

    const updatedCandidate = await this.findCandidate({ id: candidate.getId() });

    return updatedCandidate as Candidate;
  }

  public async findCandidate(payload: FindCandidatePayload): Promise<Candidate | null> {
    const { id, email } = payload;

    let rawEntity: CandidateRawEntityExtended | undefined;

    try {
      const query = this.databaseClient<CandidateRawEntityExtended>(candidatesTable.name)
        .select([
          usersTable.allColumns,
          candidatesTable.columns.first_name,
          candidatesTable.columns.last_name,
          candidatesTable.columns.resume_url,
          candidatesTable.columns.linkedin_url,
          candidatesTable.columns.github_url,
        ])
        .join(usersTable.name, candidatesTable.columns.id, '=', usersTable.columns.id);

      if (id) {
        query.where(usersTable.columns.id, id);
      }

      if (email) {
        query.where(usersTable.columns.email, email);
      }

      rawEntity = await query.first();
    } catch (error) {
      throw new RepositoryError({
        entity: 'Candidate',
        operation: 'find',
        originalError: error,
      });
    }

    if (!rawEntity) {
      return null;
    }

    return this.candidateMapper.mapToDomain(rawEntity);
  }

  public async findCandidates(payload: FindCandidatesPayload): Promise<Candidate[]> {
    const { page, pageSize } = payload;

    let rawEntities: CandidateRawEntityExtended[];

    try {
      const query = this.databaseClient<CandidateRawEntityExtended>(candidatesTable.name)
        .select([
          usersTable.allColumns,
          candidatesTable.columns.first_name,
          candidatesTable.columns.last_name,
          candidatesTable.columns.resume_url,
          candidatesTable.columns.linkedin_url,
          candidatesTable.columns.github_url,
        ])
        .join(usersTable.name, candidatesTable.columns.id, '=', usersTable.columns.id)
        .orderBy(candidatesTable.columns.id, 'desc');

      rawEntities = await query.limit(pageSize).offset((page - 1) * pageSize);
    } catch (error) {
      throw new RepositoryError({
        entity: 'Candidate',
        operation: 'find',
        originalError: error,
      });
    }

    return rawEntities.map((rawEntity) => this.candidateMapper.mapToDomain(rawEntity));
  }

  public async countCandidates(): Promise<number> {
    try {
      const query = this.databaseClient<CandidateRawEntity>(candidatesTable.name);

      const countResult = await query.count().first();

      const count = countResult?.['count'];

      if (count === undefined) {
        throw new RepositoryError({
          entity: 'Candidate',
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
        entity: 'Candidate',
        operation: 'count',
        originalError: error,
      });
    }
  }
}
