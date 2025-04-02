import { TestUtils } from '../../../../../../tests/testUtils.ts';
import type {
  CandidateRawEntity,
  CandidateRawEntityExtended,
} from '../../../../databaseModule/infrastructure/tables/candidatesTable/candidateRawEntity.ts';
import { candidatesTable } from '../../../../databaseModule/infrastructure/tables/candidatesTable/candidatesTable.ts';
import type { UserRawEntity } from '../../../../databaseModule/infrastructure/tables/usersTable/userRawEntity.ts';
import { usersTable } from '../../../../databaseModule/infrastructure/tables/usersTable/usersTable.ts';
import type { DatabaseClient } from '../../../../databaseModule/types/databaseClient.ts';
import { CandidateTestFactory } from '../../factories/candidateTestFactory/candidateTestFactory.ts';
import { UserTestFactory } from '../../factories/userTestFactory/userTestFactory.ts';

interface CreateAndPersistPayload {
  readonly candidateInput?: Partial<CandidateRawEntity>;
  readonly userInput?: Partial<UserRawEntity>;
}

interface FindPayload {
  readonly id: string;
}

interface FindByEmailPayload {
  readonly email: string;
}

export class CandidateTestUtils extends TestUtils {
  private readonly userTestFactory = new UserTestFactory();
  private readonly candidateTestFactory = new CandidateTestFactory();

  public constructor(databaseClient: DatabaseClient) {
    super(databaseClient, usersTable.name);
  }

  public async createAndPersist(payload: CreateAndPersistPayload = {}): Promise<CandidateRawEntityExtended> {
    const { candidateInput, userInput } = payload;

    const user = this.userTestFactory.createRaw({
      ...userInput,
      role: 'candidate',
    });

    const candidate = this.candidateTestFactory.createRaw({
      ...candidateInput,
      id: user.id,
    });

    await this.databaseClient.transaction(async (transaction) => {
      await transaction<UserRawEntity>(usersTable.name).insert(user);

      await transaction<CandidateRawEntity>(candidatesTable.name).insert(candidate);
    });

    return this.findById({ id: user.id }) as Promise<CandidateRawEntityExtended>;
  }

  public async findById(payload: FindPayload): Promise<CandidateRawEntityExtended | undefined> {
    const { id } = payload;

    const rawEntity = await this.databaseClient(candidatesTable.name)
      .select([
        usersTable.allColumns,
        candidatesTable.columns.first_name,
        candidatesTable.columns.last_name,
        candidatesTable.columns.birth_date,
        candidatesTable.columns.phone,
      ])
      .join(usersTable.name, candidatesTable.columns.id, '=', usersTable.columns.id)
      .where(usersTable.columns.id, id)
      .first();

    if (!rawEntity) {
      return undefined;
    }

    return rawEntity as CandidateRawEntityExtended;
  }

  public async findByEmail(payload: FindByEmailPayload): Promise<CandidateRawEntityExtended | undefined> {
    const { email: emailInput } = payload;

    const email = emailInput.toLowerCase();

    const rawEntity = await this.databaseClient(candidatesTable.name)
      .select([
        usersTable.allColumns,
        candidatesTable.columns.first_name,
        candidatesTable.columns.last_name,
        candidatesTable.columns.birth_date,
        candidatesTable.columns.phone,
      ])
      .join(usersTable.name, candidatesTable.columns.id, '=', usersTable.columns.id)
      .where(usersTable.columns.email, email)
      .first();

    if (!rawEntity) {
      return undefined;
    }

    return rawEntity as CandidateRawEntityExtended;
  }
}
