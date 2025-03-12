import { Generator } from '../../../../../../tests/generator.ts';
import {
  EmailEvent,
  EmailEventDraft,
  type EmailEventDraftState,
  type EmailEventState,
} from '../../../domain/entities/emailEvent/emailEvent.ts';
import { emailEventStatuses } from '../../../domain/entities/emailEvent/types/emailEventStatus.ts';
import { emailEventTypes, type EmailEventType } from '../../../domain/entities/emailEvent/types/emailEventType.ts';

export class EmailEventTestFactory {
  public createDraft(overrides: Partial<EmailEventDraftState> = {}): EmailEventDraft {
    return new EmailEventDraft({
      payload: {
        recipientEmail: Generator.email(),
        emailEventType: Generator.arrayElement<EmailEventType>(Object.keys(emailEventTypes) as EmailEventType[]),
        // TODO: fix to student/company name
        name: Generator.word(),
        ...overrides.payload,
      },
      eventName: Generator.arrayElement<EmailEventType>(Object.keys(emailEventTypes) as EmailEventType[]),
    });
  }

  public create(overrides: Partial<EmailEventState> = {}): EmailEvent {
    return new EmailEvent({
      createdAt: Generator.pastDate(),
      id: Generator.uuid(),
      eventName: Generator.arrayElement<EmailEventType>(Object.keys(emailEventTypes) as EmailEventType[]),
      status: emailEventStatuses.pending,
      ...overrides,
      payload: {
        recipientEmail: Generator.email(),
        emailEventType: Generator.arrayElement<EmailEventType>(Object.keys(emailEventTypes) as EmailEventType[]),
        // TODO: fix to student/company name
        name: Generator.word(),
        ...overrides.payload,
      },
    });
  }
}
