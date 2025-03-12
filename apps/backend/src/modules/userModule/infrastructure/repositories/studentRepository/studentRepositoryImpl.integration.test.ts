import { beforeEach, afterEach, expect, describe, it } from 'vitest';

import { Generator } from '../../../../../../tests/generator.ts';
import { TestContainer } from '../../../../../../tests/testContainer.ts';
import { RepositoryError } from '../../../../../common/errors/repositoryError.ts';
import { databaseSymbols } from '../../../../databaseModule/symbols.ts';
import type { DatabaseClient } from '../../../../databaseModule/types/databaseClient.ts';
import { type StudentRepository } from '../../../domain/repositories/studentRepository/studentRepository.ts';
import { symbols } from '../../../symbols.ts';
import { StudentTestFactory } from '../../../tests/factories/studentTestFactory/studentTestFactory.ts';
import { StudentTestUtils } from '../../../tests/utils/studentTestUtils/studentTestUtils.ts';

describe('StudentRepositoryImpl', () => {
  let studentRepository: StudentRepository;

  let databaseClient: DatabaseClient;

  let studentTestUtils: StudentTestUtils;

  const studentTestFactory = new StudentTestFactory();

  beforeEach(async () => {
    const container = await TestContainer.create();

    studentRepository = container.get<StudentRepository>(symbols.studentRepository);

    databaseClient = container.get<DatabaseClient>(databaseSymbols.databaseClient);

    studentTestUtils = new StudentTestUtils(databaseClient);

    await studentTestUtils.truncate();
  });

  afterEach(async () => {
    await studentTestUtils.truncate();

    await databaseClient.destroy();
  });

  describe('Create', () => {
    it('creates a Student', async () => {
      const createdStudent = studentTestFactory.create();

      const student = await studentRepository.createStudent({
        data: {
          email: createdStudent.getEmail(),
          password: createdStudent.getPassword(),
          isEmailVerified: createdStudent.getIsEmailVerified(),
          isDeleted: createdStudent.getIsDeleted(),
          role: createdStudent.getRole(),
          firstName: createdStudent.getFirstName(),
          lastName: createdStudent.getLastName(),
          birthDate: createdStudent.getBirthDate(),
          phoneNumber: createdStudent.getPhoneNumber(),
        },
      });

      const foundStudent = await studentTestUtils.findByEmail({ email: student.getEmail() });

      expect(foundStudent).toBeDefined();
    });

    it('throws an error when a Student with the same email already exists', async () => {
      const email = Generator.email();

      await studentTestUtils.createAndPersist({ userInput: { email } });

      const createdStudent = studentTestFactory.create({ email });

      try {
        await studentRepository.createStudent({
          data: {
            email: createdStudent.getEmail(),
            password: createdStudent.getPassword(),
            isEmailVerified: createdStudent.getIsEmailVerified(),
            isDeleted: createdStudent.getIsDeleted(),
            role: createdStudent.getRole(),
            firstName: createdStudent.getFirstName(),
            lastName: createdStudent.getLastName(),
            birthDate: createdStudent.getBirthDate(),
            phoneNumber: createdStudent.getPhoneNumber(),
          },
        });
      } catch (error) {
        expect(error).toBeInstanceOf(RepositoryError);

        return;
      }

      expect.fail();
    });

    it("updates Student's data", async () => {
      const studentRawEntity = await studentTestUtils.createAndPersist();

      const student = studentTestFactory.create({
        id: studentRawEntity.id,
        email: studentRawEntity.email,
        password: studentRawEntity.password,
        role: studentRawEntity.role,
        isEmailVerified: studentRawEntity.is_email_verified,
        isDeleted: studentRawEntity.is_deleted,
        firstName: studentRawEntity.first_name,
        lastName: studentRawEntity.last_name,
        phoneNumber: studentRawEntity.phone_number,
        birthDate: studentRawEntity.birth_date,
      });

      const password = Generator.password();

      const firstName = Generator.firstName();

      const lastName = Generator.lastName();

      const birthDate = Generator.birthDate();

      const phoneNumber = Generator.phoneNumber();

      const isEmailVerified = Generator.boolean();

      const isDeleted = Generator.boolean();

      student.setPassword({ password });

      student.setIsEmailVerified({ isEmailVerified });

      student.setIsDeleted({ isDeleted });

      student.setFirstName({ firstName });

      student.setLastName({ lastName });

      student.setBirthDate({ birthDate });

      student.setPhoneNumber({ phoneNumber });

      const updatedStudent = await studentRepository.updateStudent({ student });

      const foundStudent = await studentTestUtils.findById({ id: student.getId() });

      expect(updatedStudent.getState()).toEqual({
        email: student.getEmail(),
        password,
        firstName,
        lastName,
        birthDate,
        phoneNumber,
        isEmailVerified,
        isDeleted,
        role: studentRawEntity.role,
        createdAt: studentRawEntity.created_at,
      });

      expect(foundStudent).toEqual({
        id: student.getId(),
        email: student.getEmail(),
        password,
        first_name: firstName,
        last_name: lastName,
        birth_date: birthDate,
        phone_number: phoneNumber,
        is_email_verified: isEmailVerified,
        is_deleted: isDeleted,
        role: studentRawEntity.role,
        created_at: studentRawEntity.created_at,
      });
    });
  });

  describe('Find', () => {
    it('finds a Student by id', async () => {
      const student = await studentTestUtils.createAndPersist();

      const foundStudent = await studentRepository.findStudent({ id: student.id });

      expect(foundStudent?.getState()).toEqual({
        email: student.email,
        password: student.password,
        firstName: student.first_name,
        lastName: student.last_name,
        birthDate: student.birth_date,
        phoneNumber: student.phone_number,
        isEmailVerified: student.is_email_verified,
        isDeleted: student.is_deleted,
        role: student.role,
        createdAt: student.created_at,
      });
    });

    it('finds a Student by email', async () => {
      const student = await studentTestUtils.createAndPersist();

      const foundStudent = await studentRepository.findStudent({ email: student.email });

      expect(foundStudent?.getState()).toEqual({
        email: student.email,
        password: student.password,
        firstName: student.first_name,
        lastName: student.last_name,
        birthDate: student.birth_date,
        phoneNumber: student.phone_number,
        isEmailVerified: student.is_email_verified,
        isDeleted: student.is_deleted,
        role: student.role,
        createdAt: student.created_at,
      });
    });

    it('returns null if a Student with given id does not exist', async () => {
      const createdStudent = studentTestFactory.create();

      const student = await studentRepository.findStudent({ id: createdStudent.getId() });

      expect(student).toBeNull();
    });
  });

  describe('FindAll', () => {
    it('finds all Students', async () => {
      const student1 = await studentTestUtils.createAndPersist();

      const student2 = await studentTestUtils.createAndPersist();

      const students = await studentRepository.findStudents({
        page: 1,
        pageSize: 10,
      });

      expect(students).toHaveLength(2);

      expect(students[0]?.getState()).toEqual({
        email: student2.email,
        password: student2.password,
        firstName: student2.first_name,
        lastName: student2.last_name,
        birthDate: student2.birth_date,
        phoneNumber: student2.phone_number,
        isEmailVerified: student2.is_email_verified,
        isDeleted: student2.is_deleted,
        role: student2.role,
        createdAt: student2.created_at,
      });

      expect(students[1]?.getState()).toEqual({
        email: student1.email,
        password: student1.password,
        firstName: student1.first_name,
        lastName: student1.last_name,
        birthDate: student1.birth_date,
        phoneNumber: student1.phone_number,
        isEmailVerified: student1.is_email_verified,
        isDeleted: student1.is_deleted,
        role: student1.role,
        createdAt: student1.created_at,
      });
    });
  });

  describe('Count', () => {
    it('counts Students', async () => {
      await studentTestUtils.createAndPersist();

      await studentTestUtils.createAndPersist();

      const count = await studentRepository.countStudents();

      expect(count).toEqual(2);
    });
  });
});
