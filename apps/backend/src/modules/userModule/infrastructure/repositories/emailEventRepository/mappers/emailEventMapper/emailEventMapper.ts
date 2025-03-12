import type { EmailEventRawEntity } from '../../../../../../databaseModule/infrastructure/tables/emailEventsTable/emailEventRawEntity.ts';
import { EmailEvent } from '../../../../../domain/entities/emailEvent/emailEvent.ts';
import { type EmailEventStatus } from '../../../../../domain/entities/emailEvent/types/emailEventStatus.ts';
import { type EmailEventType } from '../../../../../domain/entities/emailEvent/types/emailEventType.ts';

export class EmailEventMapper {
  public map(rawEntity: EmailEventRawEntity): EmailEvent {
    const { created_at: createdAt, id, payload, status, event_name: eventName } = rawEntity;

    return new EmailEvent({
      createdAt,
      id,
      payload: JSON.parse(payload),
      status: status as EmailEventStatus,
      eventName: eventName as EmailEventType,
    });
  }
}
