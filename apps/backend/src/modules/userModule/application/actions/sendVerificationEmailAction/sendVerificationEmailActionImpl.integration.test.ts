import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { testSymbols } from '../../../../../../tests/symbols.ts';
import { TestContainer } from '../../../../../../tests/testContainer.ts';
import { userRoles } from '../../../../../common/types/userRole.ts';
import { databaseSymbols } from '../../../../databaseModule/symbols.ts';
import type { DatabaseClient } from '../../../../databaseModule/types/databaseClient.ts';
import { EmailEventDraft } from '../../../domain/entities/emailEvent/emailEvent.ts';
import { emailEventTypes } from '../../../domain/entities/emailEvent/types/emailEventType.ts';
import { symbols } from '../../../symbols.ts';
import type { CandidateTestUtils } from '../../../tests/utils/candidateTestUtils/candidateTestUtils.ts';
import { type EmailMessageBus } from '../../messageBuses/emailMessageBus/emailMessageBus.ts';

import { type SendVerificationEmailAction } from './sendVerificationEmailAction.ts';

describe('SendVerificationEmailAction', () => {
  let action: SendVerificationEmailAction;

  let databaseClient: DatabaseClient;

  let emailMessageBus: EmailMessageBus;

  let candidateTestUtils: CandidateTestUtils;

  beforeEach(async () => {
    const container = await TestContainer.create();

    action = container.get<SendVerificationEmailAction>(symbols.sendVerificationEmailAction);

    databaseClient = container.get<DatabaseClient>(databaseSymbols.databaseClient);

    candidateTestUtils = container.get<CandidateTestUtils>(testSymbols.candidateTestUtils);

    emailMessageBus = container.get<EmailMessageBus>(symbols.emailMessageBus);

    await candidateTestUtils.truncate();
  });

  afterEach(async () => {
    await candidateTestUtils.truncate();

    await databaseClient.destroy();
  });

  it('sends verification email', async () => {
    const candidate = await candidateTestUtils.createAndPersist({
      userInput: {
        is_email_verified: false,
        role: userRoles.candidate,
      },
    });

    const sendEmailSpy = vi.spyOn(emailMessageBus, 'sendEvent');

    await action.execute({ email: candidate.email });

    expect(sendEmailSpy).toHaveBeenCalledWith(
      new EmailEventDraft({
        eventName: emailEventTypes.verifyEmail,
        payload: {
          recipientEmail: candidate.email,
          emailVerificationLink: expect.any(String),
          name: `${candidate.first_name} ${candidate.last_name}`,
        },
      }),
    );
  });
});
