import { TestUtils } from '../../../../../../tests/testUtils.ts';
import { companiesLocationsTable } from '../../../../databaseModule/infrastructure/tables/companiesLocationsTable/companiesLocationsTable.ts';
import type { CompanyLocationRawEntity } from '../../../../databaseModule/infrastructure/tables/companiesLocationsTable/companyLocationRawEntity.ts';
import type { DatabaseClient } from '../../../../databaseModule/types/databaseClient.ts';
import { LocationTestFactory } from '../../factories/locationTestFactory/locationTestFactory.ts';

interface CreateAndPersistPayload {
  readonly input?: Partial<CompanyLocationRawEntity>;
}

interface FindByIdPayload {
  readonly id: string;
}

interface FindByNamePayload {
  readonly companyId: string;
  readonly name: string;
}

export class LocationTestUtils extends TestUtils {
  private readonly trainingEventTestFactory = new LocationTestFactory();

  public constructor(databaseClient: DatabaseClient) {
    super(databaseClient, companiesLocationsTable.name);
  }

  public async createAndPersist(payload: CreateAndPersistPayload = {}): Promise<CompanyLocationRawEntity> {
    const { input } = payload;

    const { id, latitude, longitude, ...rest } = this.trainingEventTestFactory.createRaw(input);

    await this.databaseClient<CompanyLocationRawEntity>(companiesLocationsTable.name).insert({
      id,
      geolocation: this.databaseClient.raw(`ST_GeomFromText('POINT(' || ? || ' ' || ? || ')', 4326)`, [
        latitude,
        longitude,
      ]),
      ...rest,
    });

    const rawEntity = await this.findById({ id });

    return rawEntity as CompanyLocationRawEntity;
  }

  public async findById(payload: FindByIdPayload): Promise<CompanyLocationRawEntity | undefined> {
    const { id } = payload;

    const rawEntity = await this.databaseClient(companiesLocationsTable.name)
      .select([
        companiesLocationsTable.columns.id,
        companiesLocationsTable.columns.city_id,
        companiesLocationsTable.columns.company_id,
        companiesLocationsTable.columns.is_remote,
        companiesLocationsTable.columns.address,
        companiesLocationsTable.columns.name,
        this.databaseClient.raw('ST_X(geolocation) as latitude'),
        this.databaseClient.raw('ST_Y(geolocation) as longitude'),
      ])
      .where(companiesLocationsTable.columns.id, id)
      .first();

    if (!rawEntity) {
      return undefined;
    }

    return rawEntity as CompanyLocationRawEntity;
  }

  public async findByName(payload: FindByNamePayload): Promise<CompanyLocationRawEntity | undefined> {
    const { companyId, name } = payload;

    const rawEntity = await this.databaseClient(companiesLocationsTable.name)
      .select([
        companiesLocationsTable.columns.id,
        companiesLocationsTable.columns.city_id,
        companiesLocationsTable.columns.company_id,
        companiesLocationsTable.columns.is_remote,
        companiesLocationsTable.columns.address,
        companiesLocationsTable.columns.name,
        this.databaseClient.raw('ST_X(geolocation) as latitude'),
        this.databaseClient.raw('ST_Y(geolocation) as longitude'),
      ])
      .where(companiesLocationsTable.columns.company_id, companyId)
      .where(companiesLocationsTable.columns.name, name)
      .first();

    if (!rawEntity) {
      return undefined;
    }

    return rawEntity as CompanyLocationRawEntity;
  }
}
