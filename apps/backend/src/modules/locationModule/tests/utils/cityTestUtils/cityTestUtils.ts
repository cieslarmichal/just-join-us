import { TestUtils } from '../../../../../../tests/testUtils.ts';
import { citiesTable } from '../../../../databaseModule/infrastructure/tables/citiesTable/citiesTable.ts';
import type { CityRawEntity } from '../../../../databaseModule/infrastructure/tables/citiesTable/cityRawEntity.ts';
import type { DatabaseClient } from '../../../../databaseModule/types/databaseClient.ts';
import { CityTestFactory } from '../../factories/cityTestFactory/cityTestFactory.ts';

interface CreateAndPersistPayload {
  readonly input?: Partial<CityRawEntity>;
}

interface FindByNamePayload {
  readonly name: string;
}

interface FindByIdPayload {
  readonly id: string;
}

export class CityTestUtils extends TestUtils {
  private readonly cityTestFactory = new CityTestFactory();

  public constructor(databaseClient: DatabaseClient) {
    super(databaseClient, citiesTable.name);
  }

  public async createAndPersist(payload: CreateAndPersistPayload = {}): Promise<CityRawEntity> {
    const { input } = payload;

    const city = this.cityTestFactory.createRaw(input);

    const rawEntities = await this.databaseClient<CityRawEntity>(citiesTable.name).insert(city, '*');

    const rawEntity = rawEntities[0] as CityRawEntity;

    return rawEntity;
  }

  public async findByName(payload: FindByNamePayload): Promise<CityRawEntity> {
    const { name } = payload;

    const rawEntity = await this.databaseClient<CityRawEntity>(citiesTable.name).select('*').where({ name }).first();

    return rawEntity as CityRawEntity;
  }

  public async findById(payload: FindByIdPayload): Promise<CityRawEntity> {
    const { id } = payload;

    const rawEntity = await this.databaseClient<CityRawEntity>(citiesTable.name).select('*').where({ id }).first();

    return rawEntity as CityRawEntity;
  }
}
