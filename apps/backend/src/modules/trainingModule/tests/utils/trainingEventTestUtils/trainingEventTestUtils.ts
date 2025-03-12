import { TestUtils } from '../../../../../../tests/testUtils.ts';
import type { TrainingEventRawEntity } from '../../../../databaseModule/infrastructure/tables/trainingEventTable/trainingEventRawEntity.ts';
import { trainingEventsTable } from '../../../../databaseModule/infrastructure/tables/trainingEventTable/trainingEventsTable.ts';
import type { DatabaseClient } from '../../../../databaseModule/types/databaseClient.ts';
import { TrainingEventTestFactory } from '../../factories/trainingEventTestFactory/trainingEventTestFactory.ts';

interface CreateAndPersistPayload {
  readonly input?: Partial<TrainingEventRawEntity>;
}

interface FindByIdPayload {
  readonly id: string;
}

interface FindByTrainingIdPayload {
  readonly trainingId: string;
}

export class TrainingEventTestUtils extends TestUtils {
  private readonly trainingEventTestFactory = new TrainingEventTestFactory();

  public constructor(databaseClient: DatabaseClient) {
    super(databaseClient, trainingEventsTable.name);
  }

  public async createAndPersist(payload: CreateAndPersistPayload = {}): Promise<TrainingEventRawEntity> {
    const { input } = payload;

    const { id, latitude, longitude, ...rest } = this.trainingEventTestFactory.createRaw(input);

    await this.databaseClient<TrainingEventRawEntity>(trainingEventsTable.name).insert({
      id,
      geolocation: this.databaseClient.raw(`ST_GeomFromText('POINT(' || ? || ' ' || ? || ')', 4326)`, [
        latitude,
        longitude,
      ]),
      ...rest,
    });

    const rawEntity = await this.findById({ id });

    return rawEntity as TrainingEventRawEntity;
  }

  public async findById(payload: FindByIdPayload): Promise<TrainingEventRawEntity | undefined> {
    const { id } = payload;

    const rawEntity = await this.databaseClient(trainingEventsTable.name)
      .select([
        trainingEventsTable.columns.id,
        trainingEventsTable.columns.city,
        trainingEventsTable.columns.place,
        trainingEventsTable.columns.cent_price,
        trainingEventsTable.columns.starts_at,
        trainingEventsTable.columns.ends_at,
        trainingEventsTable.columns.is_hidden,
        trainingEventsTable.columns.created_at,
        this.databaseClient.raw('ST_X(geolocation) as latitude'),
        this.databaseClient.raw('ST_Y(geolocation) as longitude'),
        trainingEventsTable.columns.training_id,
      ])
      .where(trainingEventsTable.columns.id, id)
      .first();

    if (!rawEntity) {
      return undefined;
    }

    return rawEntity as TrainingEventRawEntity;
  }

  public async findByTrainingId(payload: FindByTrainingIdPayload): Promise<TrainingEventRawEntity | undefined> {
    const { trainingId } = payload;

    const rawEntity = await this.databaseClient(trainingEventsTable.name)
      .select([
        trainingEventsTable.columns.id,
        trainingEventsTable.columns.city,
        trainingEventsTable.columns.place,
        trainingEventsTable.columns.cent_price,
        trainingEventsTable.columns.starts_at,
        trainingEventsTable.columns.ends_at,
        trainingEventsTable.columns.is_hidden,
        trainingEventsTable.columns.created_at,
        this.databaseClient.raw('ST_X(geolocation) as latitude'),
        this.databaseClient.raw('ST_Y(geolocation) as longitude'),
        trainingEventsTable.columns.training_id,
      ])
      .where(trainingEventsTable.columns.training_id, trainingId)
      .first();

    if (!rawEntity) {
      return undefined;
    }

    return rawEntity as TrainingEventRawEntity;
  }
}
