import { TestUtils } from '../../../../../../tests/testUtils.ts';
import type { TrainingRawEntity } from '../../../../databaseModule/infrastructure/tables/trainingsTable/trainingRawEntity.ts';
import { trainingsTable } from '../../../../databaseModule/infrastructure/tables/trainingsTable/trainingsTable.ts';
import type { DatabaseClient } from '../../../../databaseModule/types/databaseClient.ts';
import { TrainingTestFactory } from '../../factories/trainingTestFactory/trainingTestFactory.ts';

interface CreateAndPersistPayload {
  readonly input?: Partial<TrainingRawEntity>;
}

interface FindByNamePayload {
  readonly companyId: string;
  readonly name: string;
}

interface FindByIdPayload {
  readonly id: string;
}

export class TrainingTestUtils extends TestUtils {
  private readonly trainingTestFactory = new TrainingTestFactory();

  public constructor(databaseClient: DatabaseClient) {
    super(databaseClient, trainingsTable.name);
  }

  public async createAndPersist(payload: CreateAndPersistPayload = {}): Promise<TrainingRawEntity> {
    const { input } = payload;

    const training = this.trainingTestFactory.createRaw(input);

    const rawEntities = await this.databaseClient<TrainingRawEntity>(trainingsTable.name).insert(training, '*');

    const rawEntity = rawEntities[0] as TrainingRawEntity;

    return rawEntity;
  }

  public async findByName(payload: FindByNamePayload): Promise<TrainingRawEntity | undefined> {
    const { name, companyId } = payload;

    const rawEntity = await this.databaseClient<TrainingRawEntity>(trainingsTable.name)
      .select('*')
      .where({ name, company_id: companyId })
      .first();

    if (!rawEntity) {
      return undefined;
    }

    return rawEntity;
  }

  public async findById(payload: FindByIdPayload): Promise<TrainingRawEntity | undefined> {
    const { id } = payload;

    const rawEntity = await this.databaseClient<TrainingRawEntity>(trainingsTable.name)
      .select('*')
      .where({ id })
      .first();

    if (!rawEntity) {
      return undefined;
    }

    return rawEntity;
  }
}
