import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { testSymbols } from '../../../../../../tests/symbols.ts';
import { TestContainer } from '../../../../../../tests/testContainer.ts';
import { databaseSymbols } from '../../../../databaseModule/symbols.ts';
import type { DatabaseClient } from '../../../../databaseModule/types/databaseClient.ts';
import { EmailEventDraft } from '../../../domain/entities/emailEvent/emailEvent.ts';
import { emailEventTypes } from '../../../domain/entities/emailEvent/types/emailEventType.ts';
import { symbols } from '../../../symbols.ts';
import { type UserTestUtils } from '../../../tests/utils/userTestUtils/userTestUtils.ts';
import { type EmailMessageBus } from '../../messageBuses/emailMessageBus/emailMessageBus.ts';

import { type SendVerificationEmailAction } from './sendVerificationEmailAction.ts';

describe('SendVerificationEmailAction', () => {
  let action: SendVerificationEmailAction;

  let databaseClient: DatabaseClient;

  let emailMessageBus: EmailMessageBus;

  let userTestUtils: UserTestUtils;

  beforeEach(async () => {
    const container = await TestContainer.create();

    action = container.get<SendVerificationEmailAction>(symbols.sendVerificationEmailAction);

    databaseClient = container.get<DatabaseClient>(databaseSymbols.databaseClient);

    userTestUtils = container.get<UserTestUtils>(testSymbols.userTestUtils);

    emailMessageBus = container.get<EmailMessageBus>(symbols.emailMessageBus);

    await userTestUtils.truncate();
  });

  afterEach(async () => {
    await userTestUtils.truncate();

    await databaseClient.destroy();
  });

  it('sends verification email', async () => {
    const user = await userTestUtils.createAndPersist({
      input: {
        is_email_verified: false,
      },
    });

    const sendEmailSpy = vi.spyOn(emailMessageBus, 'sendEvent');

    await action.execute({ email: user.email });

    expect(sendEmailSpy).toHaveBeenCalledWith(
      new EmailEventDraft({
        eventName: emailEventTypes.verifyEmail,
        payload: {
          recipientEmail: user.email,
          emailVerificationLink: expect.any(String),
          name: user.email,
        },
      }),
    );
  });
});
