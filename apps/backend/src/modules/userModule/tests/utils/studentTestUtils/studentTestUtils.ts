import { TestUtils } from '../../../../../../tests/testUtils.ts';
import type {
  StudentRawEntity,
  StudentRawEntityExtended,
} from '../../../../databaseModule/infrastructure/tables/studentsTable/studentRawEntity.ts';
import { studentsTable } from '../../../../databaseModule/infrastructure/tables/studentsTable/studentsTable.ts';
import type { UserRawEntity } from '../../../../databaseModule/infrastructure/tables/usersTable/userRawEntity.ts';
import { usersTable } from '../../../../databaseModule/infrastructure/tables/usersTable/usersTable.ts';
import type { DatabaseClient } from '../../../../databaseModule/types/databaseClient.ts';
import { StudentTestFactory } from '../../factories/studentTestFactory/studentTestFactory.ts';
import { UserTestFactory } from '../../factories/userTestFactory/userTestFactory.ts';

interface CreateAndPersistPayload {
  readonly studentInput?: Partial<StudentRawEntity>;
  readonly userInput?: Partial<UserRawEntity>;
}

interface FindPayload {
  readonly id: string;
}

interface FindByEmailPayload {
  readonly email: string;
}

export class StudentTestUtils extends TestUtils {
  private readonly userTestFactory = new UserTestFactory();
  private readonly studentTestFactory = new StudentTestFactory();

  public constructor(databaseClient: DatabaseClient) {
    super(databaseClient, usersTable.name);
  }

  public async createAndPersist(payload: CreateAndPersistPayload = {}): Promise<StudentRawEntityExtended> {
    const { studentInput, userInput } = payload;

    const user = this.userTestFactory.createRaw({
      ...userInput,
      role: 'student',
    });

    const student = this.studentTestFactory.createRaw({
      ...studentInput,
      id: user.id,
    });

    await this.databaseClient.transaction(async (transaction) => {
      await transaction<UserRawEntity>(usersTable.name).insert(user);

      await transaction<StudentRawEntity>(studentsTable.name).insert(student);
    });

    return this.findById({ id: user.id }) as Promise<StudentRawEntityExtended>;
  }

  public async findById(payload: FindPayload): Promise<StudentRawEntityExtended | undefined> {
    const { id } = payload;

    const rawEntity = await this.databaseClient(studentsTable.name)
      .select([
        usersTable.allColumns,
        studentsTable.columns.first_name,
        studentsTable.columns.last_name,
        studentsTable.columns.birth_date,
        studentsTable.columns.phone_number,
      ])
      .join(usersTable.name, studentsTable.columns.id, '=', usersTable.columns.id)
      .where(usersTable.columns.id, id)
      .first();

    if (!rawEntity) {
      return undefined;
    }

    return rawEntity as StudentRawEntityExtended;
  }

  public async findByEmail(payload: FindByEmailPayload): Promise<StudentRawEntityExtended | undefined> {
    const { email: emailInput } = payload;

    const email = emailInput.toLowerCase();

    const rawEntity = await this.databaseClient(studentsTable.name)
      .select([
        usersTable.allColumns,
        studentsTable.columns.first_name,
        studentsTable.columns.last_name,
        studentsTable.columns.birth_date,
        studentsTable.columns.phone_number,
      ])
      .join(usersTable.name, studentsTable.columns.id, '=', usersTable.columns.id)
      .where(usersTable.columns.email, email)
      .first();

    if (!rawEntity) {
      return undefined;
    }

    return rawEntity as StudentRawEntityExtended;
  }
}
