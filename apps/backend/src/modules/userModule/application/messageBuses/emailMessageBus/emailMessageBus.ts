import { type EmailEventDraft } from '../../../domain/entities/emailEvent/emailEvent.ts';

export interface EmailMessageBus {
  sendEvent(emailEvent: EmailEventDraft): Promise<void>;
}
