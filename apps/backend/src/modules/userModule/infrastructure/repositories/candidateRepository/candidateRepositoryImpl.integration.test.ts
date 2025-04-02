import { beforeEach, afterEach, expect, describe, it } from 'vitest';

import { Generator } from '../../../../../../tests/generator.ts';
import { TestContainer } from '../../../../../../tests/testContainer.ts';
import { RepositoryError } from '../../../../../common/errors/repositoryError.ts';
import { databaseSymbols } from '../../../../databaseModule/symbols.ts';
import type { DatabaseClient } from '../../../../databaseModule/types/databaseClient.ts';
import { type CandidateRepository } from '../../../domain/repositories/candidateRepository/candidateRepository.ts';
import { symbols } from '../../../symbols.ts';
import { CandidateTestFactory } from '../../../tests/factories/candidateTestFactory/candidateTestFactory.ts';
import { CandidateTestUtils } from '../../../tests/utils/candidateTestUtils/candidateTestUtils.ts';

describe('CandidateRepositoryImpl', () => {
  let candidateRepository: CandidateRepository;

  let databaseClient: DatabaseClient;

  let candidateTestUtils: CandidateTestUtils;

  const candidateTestFactory = new CandidateTestFactory();

  beforeEach(async () => {
    const container = await TestContainer.create();

    candidateRepository = container.get<CandidateRepository>(symbols.candidateRepository);

    databaseClient = container.get<DatabaseClient>(databaseSymbols.databaseClient);

    candidateTestUtils = new CandidateTestUtils(databaseClient);

    await candidateTestUtils.truncate();
  });

  afterEach(async () => {
    await candidateTestUtils.truncate();

    await databaseClient.destroy();
  });

  describe('Create', () => {
    it('creates a Candidate', async () => {
      const createdCandidate = candidateTestFactory.create();

      const candidate = await candidateRepository.createCandidate({
        data: {
          email: createdCandidate.getEmail(),
          password: createdCandidate.getPassword(),
          isEmailVerified: createdCandidate.getIsEmailVerified(),
          isDeleted: createdCandidate.getIsDeleted(),
          role: createdCandidate.getRole(),
          firstName: createdCandidate.getFirstName(),
          lastName: createdCandidate.getLastName(),
          birthDate: createdCandidate.getBirthDate(),
          phone: createdCandidate.getPhone(),
        },
      });

      const foundCandidate = await candidateTestUtils.findByEmail({ email: candidate.getEmail() });

      expect(foundCandidate).toBeDefined();
    });

    it('throws an error when a Candidate with the same email already exists', async () => {
      const email = Generator.email();

      await candidateTestUtils.createAndPersist({ userInput: { email } });

      const createdCandidate = candidateTestFactory.create({ email });

      try {
        await candidateRepository.createCandidate({
          data: {
            email: createdCandidate.getEmail(),
            password: createdCandidate.getPassword(),
            isEmailVerified: createdCandidate.getIsEmailVerified(),
            isDeleted: createdCandidate.getIsDeleted(),
            role: createdCandidate.getRole(),
            firstName: createdCandidate.getFirstName(),
            lastName: createdCandidate.getLastName(),
            birthDate: createdCandidate.getBirthDate(),
            phone: createdCandidate.getPhone(),
          },
        });
      } catch (error) {
        expect(error).toBeInstanceOf(RepositoryError);

        return;
      }

      expect.fail();
    });

    it("updates Candidate's data", async () => {
      const candidateRawEntity = await candidateTestUtils.createAndPersist();

      const candidate = candidateTestFactory.create({
        id: candidateRawEntity.id,
        email: candidateRawEntity.email,
        password: candidateRawEntity.password,
        role: candidateRawEntity.role,
        isEmailVerified: candidateRawEntity.is_email_verified,
        isDeleted: candidateRawEntity.is_deleted,
        firstName: candidateRawEntity.first_name,
        lastName: candidateRawEntity.last_name,
        phone: candidateRawEntity.phone,
        birthDate: candidateRawEntity.birth_date,
      });

      const password = Generator.password();

      const firstName = Generator.firstName();

      const lastName = Generator.lastName();

      const birthDate = Generator.birthDate();

      const phone = Generator.phone();

      const isEmailVerified = Generator.boolean();

      const isDeleted = Generator.boolean();

      candidate.setPassword({ password });

      candidate.setIsEmailVerified({ isEmailVerified });

      candidate.setIsDeleted({ isDeleted });

      candidate.setFirstName({ firstName });

      candidate.setLastName({ lastName });

      candidate.setBirthDate({ birthDate });

      candidate.setPhone({ phone });

      const updatedCandidate = await candidateRepository.updateCandidate({ candidate });

      const foundCandidate = await candidateTestUtils.findById({ id: candidate.getId() });

      expect(updatedCandidate.getState()).toEqual({
        email: candidate.getEmail(),
        password,
        firstName,
        lastName,
        birthDate,
        phone,
        isEmailVerified,
        isDeleted,
        role: candidateRawEntity.role,
        createdAt: candidateRawEntity.created_at,
      });

      expect(foundCandidate).toEqual({
        id: candidate.getId(),
        email: candidate.getEmail(),
        password,
        first_name: firstName,
        last_name: lastName,
        birth_date: birthDate,
        phone: phone,
        is_email_verified: isEmailVerified,
        is_deleted: isDeleted,
        role: candidateRawEntity.role,
        created_at: candidateRawEntity.created_at,
      });
    });
  });

  describe('Find', () => {
    it('finds a Candidate by id', async () => {
      const candidate = await candidateTestUtils.createAndPersist();

      const foundCandidate = await candidateRepository.findCandidate({ id: candidate.id });

      expect(foundCandidate?.getState()).toEqual({
        email: candidate.email,
        password: candidate.password,
        firstName: candidate.first_name,
        lastName: candidate.last_name,
        birthDate: candidate.birth_date,
        phone: candidate.phone,
        isEmailVerified: candidate.is_email_verified,
        isDeleted: candidate.is_deleted,
        role: candidate.role,
        createdAt: candidate.created_at,
      });
    });

    it('finds a Candidate by email', async () => {
      const candidate = await candidateTestUtils.createAndPersist();

      const foundCandidate = await candidateRepository.findCandidate({ email: candidate.email });

      expect(foundCandidate?.getState()).toEqual({
        email: candidate.email,
        password: candidate.password,
        firstName: candidate.first_name,
        lastName: candidate.last_name,
        birthDate: candidate.birth_date,
        phone: candidate.phone,
        isEmailVerified: candidate.is_email_verified,
        isDeleted: candidate.is_deleted,
        role: candidate.role,
        createdAt: candidate.created_at,
      });
    });

    it('returns null if a Candidate with given id does not exist', async () => {
      const createdCandidate = candidateTestFactory.create();

      const candidate = await candidateRepository.findCandidate({ id: createdCandidate.getId() });

      expect(candidate).toBeNull();
    });
  });

  describe('FindAll', () => {
    it('finds all Candidates', async () => {
      const candidate1 = await candidateTestUtils.createAndPersist();

      const candidate2 = await candidateTestUtils.createAndPersist();

      const candidates = await candidateRepository.findCandidates({
        page: 1,
        pageSize: 10,
      });

      expect(candidates).toHaveLength(2);

      expect(candidates[0]?.getState()).toEqual({
        email: candidate2.email,
        password: candidate2.password,
        firstName: candidate2.first_name,
        lastName: candidate2.last_name,
        birthDate: candidate2.birth_date,
        phone: candidate2.phone,
        isEmailVerified: candidate2.is_email_verified,
        isDeleted: candidate2.is_deleted,
        role: candidate2.role,
        createdAt: candidate2.created_at,
      });

      expect(candidates[1]?.getState()).toEqual({
        email: candidate1.email,
        password: candidate1.password,
        firstName: candidate1.first_name,
        lastName: candidate1.last_name,
        birthDate: candidate1.birth_date,
        phone: candidate1.phone,
        isEmailVerified: candidate1.is_email_verified,
        isDeleted: candidate1.is_deleted,
        role: candidate1.role,
        createdAt: candidate1.created_at,
      });
    });
  });

  describe('Count', () => {
    it('counts Candidates', async () => {
      await candidateTestUtils.createAndPersist();

      await candidateTestUtils.createAndPersist();

      const count = await candidateRepository.countCandidates();

      expect(count).toEqual(2);
    });
  });
});
