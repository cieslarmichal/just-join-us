import { Generator } from '../../../../../../tests/generator.ts';
import { TestUtils } from '../../../../../../tests/testUtils.ts';
import type { JobOfferSkillRawEntity } from '../../../../databaseModule/infrastructure/tables/jobOfferSkillsTable/jobOfferSkillRawEntity.ts';
import { jobOfferSkillsTable } from '../../../../databaseModule/infrastructure/tables/jobOfferSkillsTable/jobOfferSkillsTable.ts';
import type { JobOfferRawEntity } from '../../../../databaseModule/infrastructure/tables/jobOffersTable/jobOfferRawEntity.ts';
import { jobOffersTable } from '../../../../databaseModule/infrastructure/tables/jobOffersTable/jobOffersTable.ts';
import type { DatabaseClient } from '../../../../databaseModule/types/databaseClient.ts';
import type { Transaction } from '../../../../databaseModule/types/transaction.ts';
import { JobOfferTestFactory } from '../../factories/jobOfferTestFactory/jobOfferTestFactory.ts';

interface CreateAndPersistPayload {
  readonly input: {
    readonly jobOffer: Partial<JobOfferRawEntity> & Pick<JobOfferRawEntity, 'company_id' | 'category_id'>;
    readonly skillIds?: string[] | undefined;
  };
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

  public async createAndPersist(payload: CreateAndPersistPayload): Promise<JobOfferRawEntity> {
    const { input } = payload;

    const jobOffer = this.jobOfferTestFactory.createRaw(input.jobOffer);

    let rawEntities: JobOfferRawEntity[] = [];

    await this.databaseClient.transaction(async (transaction: Transaction) => {
      rawEntities = await transaction<JobOfferRawEntity>(jobOffersTable.name).insert(jobOffer, '*');

      if (input.skillIds) {
        await transaction.batchInsert<JobOfferSkillRawEntity>(
          jobOfferSkillsTable.name,
          input.skillIds.map((skillId) => ({
            id: Generator.uuid(),
            job_offer_id: jobOffer.id,
            skill_id: skillId,
          })),
        );
      }
    });

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
