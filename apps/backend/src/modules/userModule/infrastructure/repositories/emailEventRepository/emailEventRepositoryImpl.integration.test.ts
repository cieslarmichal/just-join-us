import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { Generator } from '../../../../../../tests/generator.ts';
import { testSymbols } from '../../../../../../tests/symbols.ts';
import { TestContainer } from '../../../../../../tests/testContainer.ts';
import { databaseSymbols } from '../../../../databaseModule/symbols.ts';
import type { DatabaseClient } from '../../../../databaseModule/types/databaseClient.ts';
import { EmailEvent } from '../../../domain/entities/emailEvent/emailEvent.ts';
import { emailEventStatuses } from '../../../domain/entities/emailEvent/types/emailEventStatus.ts';
import { type EmailEventRepository } from '../../../domain/repositories/emailEventRepository/emailEventRepository.ts';
import { symbols } from '../../../symbols.ts';
import { EmailEventTestFactory } from '../../../tests/factories/emailEventTestFactory/emailEventTestFactory.ts';
import { type EmailEventTestUtils } from '../../../tests/utils/emailEventTestUtils/emailEventTestUtils.ts';

describe('EmailEventRepositoryImpl', () => {
  let emailEventRepository: EmailEventRepository;

  let emailEventTestUtils: EmailEventTestUtils;

  let databaseClient: DatabaseClient;

  const emailEventTestFactory = new EmailEventTestFactory();

  beforeEach(async () => {
    const container = await TestContainer.create();

    emailEventRepository = container.get<EmailEventRepository>(symbols.emailEventRepository);

    emailEventTestUtils = container.get<EmailEventTestUtils>(testSymbols.emailEventTestUtils);

    databaseClient = container.get<DatabaseClient>(databaseSymbols.databaseClient);

    await emailEventTestUtils.truncate();
  });

  afterEach(async () => {
    await emailEventTestUtils.truncate();

    await databaseClient.destroy();
  });

  describe('findAllCreatedAfter', () => {
    it('returns all EmailEvents created after the given date', async () => {
      const startingDate = new Date();

      const amountOfEmailEvents = Generator.number(10, 50);

      const emailEvents = Array.from({ length: amountOfEmailEvents }).map((_, index) => {
        return emailEventTestFactory.create({
          createdAt: new Date(startingDate.getTime() + (index + 1) * 1000),
          id: Generator.uuid(),
          status: emailEventStatuses.pending,
        });
      });

      await emailEventTestUtils.createMany(emailEvents);

      const foundEmailEvents = await emailEventRepository.findAllCreatedAfter({
        after: startingDate,
      });

      expect(foundEmailEvents.length).toEqual(emailEvents.length);

      foundEmailEvents.forEach((foundEmailEvent) => {
        expect(foundEmailEvent).toBeInstanceOf(EmailEvent);

        expect(foundEmailEvent.getCreatedAt().getTime()).toBeGreaterThanOrEqual(startingDate.getTime());
      });
    });
  });

  describe('findAllPending', () => {
    it('returns all pending EmailEvents', async () => {
      const amountOfEmailEvents = Generator.number(10, 50);

      const emailEvents = Array.from({ length: amountOfEmailEvents }).map(() => {
        return emailEventTestFactory.create({
          status: emailEventStatuses.pending,
        });
      });

      await emailEventTestUtils.createMany(emailEvents);

      const foundEmailEvents = await emailEventRepository.findAllPending();

      expect(foundEmailEvents.length).toEqual(emailEvents.length);

      foundEmailEvents.forEach((foundEmailEvent) => {
        expect(foundEmailEvent).toBeInstanceOf(EmailEvent);

        expect(foundEmailEvent.getStatus()).toEqual(emailEventStatuses.pending);
      });
    });
  });

  describe('updateStatus', () => {
    it('updates the status of the EmailEvent', async () => {
      const emailEvent = emailEventTestFactory.create({
        status: emailEventStatuses.pending,
      });

      await emailEventTestUtils.create(emailEvent);

      await emailEventRepository.updateStatus({
        id: emailEvent.getId(),
        status: emailEventStatuses.processing,
      });

      const foundEmailEvent = await emailEventTestUtils.findById(emailEvent.getId());

      expect(foundEmailEvent).not.toBeNull();

      expect(foundEmailEvent?.status).toEqual(emailEventStatuses.processing);
    });
  });

  describe('deleteProcessed', () => {
    it('deletes all processed EmailEvents', async () => {
      const amountOfEmailEvents = Generator.number(10, 50);

      const emailEvents = Array.from({ length: amountOfEmailEvents }).map(() => {
        return emailEventTestFactory.create({
          status: emailEventStatuses.processed,
        });
      });

      const pendingEmailEvents = Array.from({ length: amountOfEmailEvents }).map(() => {
        return emailEventTestFactory.create({
          status: emailEventStatuses.pending,
        });
      });

      await emailEventTestUtils.createMany([...emailEvents, ...pendingEmailEvents]);

      await emailEventRepository.deleteProcessed();

      const foundEmailEvents = await emailEventTestUtils.findAll();

      expect(foundEmailEvents.length).toEqual(pendingEmailEvents.length);
    });
  });
});
