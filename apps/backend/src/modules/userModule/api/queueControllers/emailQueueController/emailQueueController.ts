import { ExponentialBackoff, type IDisposable, handleAll, retry } from 'cockatiel';

import type { EmailService } from '../../../../../common/emailService/emailService.ts';
import { type LoggerService } from '../../../../../common/logger/loggerService.ts';
import { type QueueChannel, type QueueMessagePayload } from '../../../../../common/types/queueChannel.ts';
import { type QueueController } from '../../../../../common/types/queueController.ts';
import { type QueueHandler } from '../../../../../common/types/queueHandler.ts';
import { QueuePath } from '../../../../../common/types/queuePath.ts';
import { type EmailEvent } from '../../../domain/entities/emailEvent/emailEvent.ts';
import { emailEventStatuses } from '../../../domain/entities/emailEvent/types/emailEventStatus.ts';
import { emailEventTypes } from '../../../domain/entities/emailEvent/types/emailEventType.ts';
import { type EmailEventRepository } from '../../../domain/repositories/emailEventRepository/emailEventRepository.ts';

interface ProcessEmailEventPayload {
  readonly data: EmailEvent;
  readonly eventName: string;
}

export class EmailQueueController implements QueueController {
  private readonly emailEventRepository: EmailEventRepository;
  private readonly emailService: EmailService;
  private readonly loggerService: LoggerService;

  public constructor(
    emailEventRepository: EmailEventRepository,
    emailService: EmailService,
    loggerService: LoggerService,
  ) {
    this.emailEventRepository = emailEventRepository;
    this.emailService = emailService;
    this.loggerService = loggerService;
  }

  private eventName = 'email';

  private retryPolicy = retry(handleAll, {
    backoff: new ExponentialBackoff({
      exponent: 2,
      initialDelay: 1000,
    }),
    maxAttempts: 3,
  });

  public getQueuePaths(): QueuePath[] {
    return [
      QueuePath.create({
        handler: this.processEmailEvent.bind(this) as unknown as QueueHandler,
        queuePath: this.eventName,
      }),
    ];
  }

  public getChannels(): QueueChannel[] {
    return [
      {
        getMessages: async (): Promise<QueueMessagePayload[]> => {
          const emailEvents = await this.emailEventRepository.findAllPending();

          return emailEvents.map((emailEvent) => ({
            data: emailEvent as unknown as Record<string, unknown>,
            eventName: this.eventName,
          }));
        },
      },
    ];
  }

  private async processEmailEvent(payload: ProcessEmailEventPayload): Promise<void> {
    const { data: emailEvent } = payload;

    let retryListener: IDisposable;

    switch (emailEvent.getEmailEventName()) {
      case emailEventTypes.verifyEmail: {
        await this.emailEventRepository.updateStatus({
          id: emailEvent.getId(),
          status: emailEventStatuses.processing,
        });

        retryListener = this.retryPolicy.onFailure((reason) => {
          this.loggerService.error({
            message: 'Failed to send verification email.',
            emailEventId: emailEvent.getId(),
            reason,
          });
        });

        try {
          await this.retryPolicy.execute(async () => {
            await this.emailService.sendEmail({
              toEmail: emailEvent.getRecipientEmail(),
              template: {
                name: 'verifyEmail',
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                data: emailEvent.getPayload() as any,
              },
            });
            this.loggerService.debug({
              message: 'Sent verification email.',
              emailEventId: emailEvent.getId(),
              recipient: emailEvent.getRecipientEmail(),
            });
          });
        } catch (error) {
          await this.emailEventRepository.updateStatus({
            id: emailEvent.getId(),
            status: emailEventStatuses.failed,
          });

          retryListener.dispose();

          throw error;
        }

        retryListener.dispose();

        await this.emailEventRepository.updateStatus({
          id: emailEvent.getId(),
          status: emailEventStatuses.processed,
        });

        break;
      }

      case emailEventTypes.resetPassword: {
        retryListener = this.retryPolicy.onFailure((reason) => {
          this.loggerService.error({
            message: 'Failed to send reset password email.',
            emailEventId: emailEvent.getId(),
            reason,
          });
        });

        await this.emailEventRepository.updateStatus({
          id: emailEvent.getId(),
          status: emailEventStatuses.processing,
        });

        try {
          await this.retryPolicy.execute(async () => {
            await this.emailService.sendEmail({
              toEmail: emailEvent.getRecipientEmail(),
              template: {
                name: 'resetPassword',
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                data: emailEvent.getPayload() as any,
              },
            });

            this.loggerService.debug({
              message: 'Sent reset password email.',
              emailEventId: emailEvent.getId(),
              recipient: emailEvent.getRecipientEmail(),
            });
          });
        } catch (error) {
          await this.emailEventRepository.updateStatus({
            id: emailEvent.getId(),
            status: emailEventStatuses.failed,
          });

          retryListener.dispose();

          throw error;
        }

        retryListener.dispose();

        await this.emailEventRepository.updateStatus({
          id: emailEvent.getId(),
          status: emailEventStatuses.processed,
        });

        break;
      }
    }
  }
}
