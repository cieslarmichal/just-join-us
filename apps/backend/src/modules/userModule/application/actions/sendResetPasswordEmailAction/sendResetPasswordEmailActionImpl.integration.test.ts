import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { testSymbols } from '../../../../../../tests/symbols.ts';
import { TestContainer } from '../../../../../../tests/testContainer.ts';
import { userRoles } from '../../../../../common/types/userRole.ts';
import { databaseSymbols } from '../../../../databaseModule/symbols.ts';
import type { DatabaseClient } from '../../../../databaseModule/types/databaseClient.ts';
import { EmailEventDraft } from '../../../domain/entities/emailEvent/emailEvent.ts';
import { emailEventTypes } from '../../../domain/entities/emailEvent/types/emailEventType.ts';
import { symbols } from '../../../symbols.ts';
import { UserTestFactory } from '../../../tests/factories/userTestFactory/userTestFactory.ts';
import type { CandidateTestUtils } from '../../../tests/utils/candidateTestUtils/candidateTestUtils.ts';
import { type EmailMessageBus } from '../../messageBuses/emailMessageBus/emailMessageBus.ts';

import { type SendResetPasswordEmailAction } from './sendResetPasswordEmailAction.ts';

describe('SendResetPasswordEmailAction', () => {
  let action: SendResetPasswordEmailAction;

  let databaseClient: DatabaseClient;

  let emailMessageBus: EmailMessageBus;

  let candidateTestUtils: CandidateTestUtils;

  const userTestFactory = new UserTestFactory();

  beforeEach(async () => {
    const container = await TestContainer.create();

    action = container.get<SendResetPasswordEmailAction>(symbols.sendResetPasswordEmailAction);

    databaseClient = container.get<DatabaseClient>(databaseSymbols.databaseClient);

    candidateTestUtils = container.get<CandidateTestUtils>(testSymbols.candidateTestUtils);

    emailMessageBus = container.get<EmailMessageBus>(symbols.emailMessageBus);

    await candidateTestUtils.truncate();
  });

  afterEach(async () => {
    await candidateTestUtils.truncate();

    await databaseClient.destroy();
  });

  it('sends ResetPasswordEmail', async () => {
    const user = userTestFactory.create();

    const candidate = await candidateTestUtils.createAndPersist({
      userInput: {
        email: user.getEmail(),
        id: user.getId(),
        is_email_verified: true,
        password: user.getPassword(),
        role: userRoles.candidate,
      },
    });

    const sendEmailSpy = vi.spyOn(emailMessageBus, 'sendEvent');

    await action.execute({ email: user.getEmail() });

    expect(sendEmailSpy).toHaveBeenCalledWith(
      new EmailEventDraft({
        eventName: emailEventTypes.resetPassword,
        payload: {
          recipientEmail: user.getEmail(),
          resetPasswordLink: expect.any(String),
          name: `${candidate.first_name} ${candidate.last_name}`,
        },
      }),
    );
  });
});
