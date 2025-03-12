import { type EmailMessageBus } from '../../../application/messageBuses/emailMessageBus/emailMessageBus.ts';
import { type EmailEventDraft } from '../../../domain/entities/emailEvent/emailEvent.ts';
import { type EmailEventRepository } from '../../../domain/repositories/emailEventRepository/emailEventRepository.ts';

export class EmailMessageBusImpl implements EmailMessageBus {
  private readonly emailEventRepository: EmailEventRepository;

  public constructor(emailEventRepository: EmailEventRepository) {
    this.emailEventRepository = emailEventRepository;
  }

  public async sendEvent(emailEvent: EmailEventDraft): Promise<void> {
    await this.emailEventRepository.create(emailEvent);
  }
}
