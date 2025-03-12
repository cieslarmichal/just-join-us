import { RepositoryError } from '../../../../../common/errors/repositoryError.ts';
import { type UuidService } from '../../../../../common/uuid/uuidService.ts';
import type { EmailEventRawEntity } from '../../../../databaseModule/infrastructure/tables/emailEventsTable/emailEventRawEntity.ts';
import { emailEventsTable } from '../../../../databaseModule/infrastructure/tables/emailEventsTable/emailEventsTable.ts';
import type { DatabaseClient } from '../../../../databaseModule/types/databaseClient.ts';
import { type EmailEventDraft, type EmailEvent } from '../../../domain/entities/emailEvent/emailEvent.ts';
import { emailEventStatuses } from '../../../domain/entities/emailEvent/types/emailEventStatus.ts';
import {
  type UpdateStatusPayload,
  type EmailEventRepository,
  type FindAllCreatedAfterPayload,
} from '../../../domain/repositories/emailEventRepository/emailEventRepository.ts';

import { type EmailEventMapper } from './mappers/emailEventMapper/emailEventMapper.ts';

export class EmailEventRepositoryImpl implements EmailEventRepository {
  private readonly databaseClient: DatabaseClient;
  private readonly uuidService: UuidService;
  private readonly emailEventMapper: EmailEventMapper;

  public constructor(databaseClient: DatabaseClient, uuidService: UuidService, emailEventMapper: EmailEventMapper) {
    this.databaseClient = databaseClient;
    this.uuidService = uuidService;
    this.emailEventMapper = emailEventMapper;
  }

  public async findAllCreatedAfter(payload: FindAllCreatedAfterPayload): Promise<EmailEvent[]> {
    const { after } = payload;

    let rawEntities: EmailEventRawEntity[];

    try {
      rawEntities = await this.databaseClient<EmailEventRawEntity>(emailEventsTable.name)
        .where(emailEventsTable.columns.created_at, '>=', after)
        .select('*');
    } catch (error) {
      throw new RepositoryError({
        entity: 'EmailEvent',
        operation: 'find',
        originalError: error,
      });
    }

    return rawEntities.map((rawEntity) => this.emailEventMapper.map(rawEntity));
  }

  public async findAllPending(): Promise<EmailEvent[]> {
    let rawEntities: EmailEventRawEntity[];

    try {
      rawEntities = await this.databaseClient<EmailEventRawEntity>(emailEventsTable.name)
        .where({ status: emailEventStatuses.pending })
        .select('*');
    } catch (error) {
      throw new RepositoryError({
        entity: 'EmailEvent',
        operation: 'find',
        originalError: error,
      });
    }

    return rawEntities.map((rawEntity) => this.emailEventMapper.map(rawEntity));
  }

  public async updateStatus(payload: UpdateStatusPayload): Promise<void> {
    const { id, status } = payload;

    try {
      await this.databaseClient<EmailEventRawEntity>(emailEventsTable.name).where({ id }).update({
        status,
      });
    } catch (error) {
      throw new RepositoryError({
        entity: 'EmailEvent',
        operation: 'update',
        originalError: error,
      });
    }
  }

  public async create(entity: EmailEventDraft): Promise<void> {
    try {
      await this.databaseClient<EmailEventRawEntity>(emailEventsTable.name).insert({
        id: this.uuidService.generateUuid(),
        payload: JSON.stringify(entity.getPayload()),
        status: emailEventStatuses.pending,
        event_name: entity.getEmailEventName(),
      });
    } catch (error) {
      throw new RepositoryError({
        entity: 'EmailEvent',
        operation: 'create',
        originalError: error,
      });
    }
  }

  public async deleteProcessed(): Promise<void> {
    try {
      await this.databaseClient<EmailEventRawEntity>(emailEventsTable.name)
        .where({ status: emailEventStatuses.processed })
        .delete();
    } catch (error) {
      throw new RepositoryError({
        entity: 'EmailEvent',
        operation: 'delete',
        originalError: error,
      });
    }
  }
}
