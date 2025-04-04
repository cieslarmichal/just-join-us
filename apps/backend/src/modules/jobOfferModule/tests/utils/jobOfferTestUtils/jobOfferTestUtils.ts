import { TestUtils } from '../../../../../../tests/testUtils.ts';
import type { JobOfferRawEntity } from '../../../../databaseModule/infrastructure/tables/jobOffersTable/jobOfferRawEntity.ts';
import { jobOffersTable } from '../../../../databaseModule/infrastructure/tables/jobOffersTable/jobOffersTable.ts';
import type { DatabaseClient } from '../../../../databaseModule/types/databaseClient.ts';
import { JobOfferTestFactory } from '../../factories/jobOfferTestFactory/jobOfferTestFactory.ts';

interface CreateAndPersistPayload {
  readonly input?: Partial<JobOfferRawEntity>;
}

interface FindByNamePayload {
  readonly companyId: string;
  readonly name: string;
}

interface FindByIdPayload {
  readonly id: string;
}

export class JobOfferTestUtils extends TestUtils {
  private readonly jobOfferTestFactory = new JobOfferTestFactory();

  public constructor(databaseClient: DatabaseClient) {
    super(databaseClient, jobOffersTable.name);
  }

  public async createAndPersist(payload: CreateAndPersistPayload = {}): Promise<JobOfferRawEntity> {
    const { input } = payload;

    const jobOffer = this.jobOfferTestFactory.createRaw(input);

    const rawEntities = await this.databaseClient<JobOfferRawEntity>(jobOffersTable.name).insert(jobOffer, '*');

    const rawEntity = rawEntities[0] as JobOfferRawEntity;

    return rawEntity;
  }

  public async findByName(payload: FindByNamePayload): Promise<JobOfferRawEntity | undefined> {
    const { name, companyId } = payload;

    const rawEntity = await this.databaseClient<JobOfferRawEntity>(jobOffersTable.name)
      .select('*')
      .where({ name, company_id: companyId })
      .first();

    if (!rawEntity) {
      return undefined;
    }

    return rawEntity;
  }

  public async findById(payload: FindByIdPayload): Promise<JobOfferRawEntity | undefined> {
    const { id } = payload;

    const rawEntity = await this.databaseClient<JobOfferRawEntity>(jobOffersTable.name)
      .select('*')
      .where({ id })
      .first();

    if (!rawEntity) {
      return undefined;
    }

    return rawEntity;
  }
}
