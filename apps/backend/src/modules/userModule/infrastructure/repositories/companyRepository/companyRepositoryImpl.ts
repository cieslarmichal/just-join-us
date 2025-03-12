import { RepositoryError } from '../../../../../common/errors/repositoryError.ts';
import { type UuidService } from '../../../../../common/uuid/uuidService.ts';
import { companiesTable } from '../../../../databaseModule/infrastructure/tables/companiesTable/companiesTable.ts';
import type {
  CompanyRawEntity,
  CompanyRawEntityExtended,
} from '../../../../databaseModule/infrastructure/tables/companiesTable/companyRawEntity.ts';
import type { UserRawEntity } from '../../../../databaseModule/infrastructure/tables/usersTable/userRawEntity.ts';
import { usersTable } from '../../../../databaseModule/infrastructure/tables/usersTable/usersTable.ts';
import type { DatabaseClient } from '../../../../databaseModule/types/databaseClient.ts';
import { type Company } from '../../../domain/entities/company/company.ts';
import {
  type FindCompanyPayload,
  type CompanyRepository,
  type FindCompaniesPayload,
  type CountCompaniesPayload,
  type CreateCompanyPayload,
  type UpdateCompanyPayload,
} from '../../../domain/repositories/companyRepository/companyRepository.ts';

import { type CompanyMapper } from './companyMapper/companyMapper.ts';

export class CompanyRepositoryImpl implements CompanyRepository {
  private readonly databaseClient: DatabaseClient;
  private readonly companyMapper: CompanyMapper;
  private readonly uuidService: UuidService;

  public constructor(databaseClient: DatabaseClient, companyMapper: CompanyMapper, uuidService: UuidService) {
    this.databaseClient = databaseClient;
    this.companyMapper = companyMapper;
    this.uuidService = uuidService;
  }

  public async createCompany(payload: CreateCompanyPayload): Promise<Company> {
    const {
      data: { email, password, isEmailVerified, isDeleted, role, isVerified, name, phoneNumber, taxIdNumber, logoUrl },
    } = payload;

    const id = this.uuidService.generateUuid();

    try {
      await this.databaseClient.transaction(async (transaction) => {
        await transaction<UserRawEntity>(usersTable.name).insert({
          id,
          email,
          password,
          is_email_verified: isEmailVerified,
          is_deleted: isDeleted,
          role,
        });

        await transaction<CompanyRawEntity>(companiesTable.name).insert({
          id,
          name,
          tax_id_number: taxIdNumber,
          phone_number: phoneNumber,
          is_verified: isVerified,
          logo_url: logoUrl,
        });
      });
    } catch (error) {
      throw new RepositoryError({
        entity: 'Company',
        operation: 'create',
        originalError: error,
      });
    }

    const createdCompany = await this.findCompany({ id });

    return createdCompany as Company;
  }

  public async updateCompany(payload: UpdateCompanyPayload): Promise<Company> {
    const { company } = payload;

    const { password, isDeleted, isEmailVerified } = company.getUserState();

    const { phoneNumber, isVerified, logoUrl } = company.getCompanyState();

    try {
      await this.databaseClient.transaction(async (transaction) => {
        await transaction<UserRawEntity>(usersTable.name)
          .update({
            password,
            is_email_verified: isEmailVerified,
            is_deleted: isDeleted,
          })
          .where({ id: company.getId() });

        await transaction<CompanyRawEntity>(companiesTable.name)
          .update({
            phone_number: phoneNumber,
            is_verified: isVerified,
            logo_url: logoUrl,
          })
          .where({ id: company.getId() });
      });
    } catch (error) {
      throw new RepositoryError({
        entity: 'Company',
        operation: 'update',
        originalError: error,
      });
    }

    const updatedCompany = await this.findCompany({ id: company.getId() });

    return updatedCompany as Company;
  }

  public async findCompany(payload: FindCompanyPayload): Promise<Company | null> {
    const { id, email } = payload;

    let rawEntity: CompanyRawEntityExtended | undefined;

    try {
      const query = this.databaseClient<CompanyRawEntityExtended>(companiesTable.name)
        .select([
          usersTable.allColumns,
          companiesTable.columns.name,
          companiesTable.columns.tax_id_number,
          companiesTable.columns.phone_number,
          companiesTable.columns.is_verified,
          companiesTable.columns.logo_url,
        ])
        .join(usersTable.name, companiesTable.columns.id, '=', usersTable.columns.id);

      if (id) {
        query.where(usersTable.columns.id, id);
      }

      if (email) {
        query.where(usersTable.columns.email, email);
      }

      rawEntity = await query.first();
    } catch (error) {
      throw new RepositoryError({
        entity: 'Company',
        operation: 'find',
        originalError: error,
      });
    }

    if (!rawEntity) {
      return null;
    }

    return this.companyMapper.mapToDomain(rawEntity);
  }

  public async findCompanies(payload: FindCompaniesPayload): Promise<Company[]> {
    const { name, page, pageSize } = payload;

    let rawEntities: CompanyRawEntityExtended[];

    try {
      const query = this.databaseClient<CompanyRawEntityExtended>(companiesTable.name)
        .select([
          usersTable.allColumns,
          companiesTable.columns.name,
          companiesTable.columns.tax_id_number,
          companiesTable.columns.phone_number,
          companiesTable.columns.is_verified,
          companiesTable.columns.logo_url,
        ])
        .join(usersTable.name, companiesTable.columns.id, '=', usersTable.columns.id);

      if (name) {
        query.whereRaw(`${companiesTable.columns.name} ILIKE ?`, `%${name}%`);
      }

      query.orderBy(companiesTable.columns.id, 'desc');

      rawEntities = await query.limit(pageSize).offset((page - 1) * pageSize);
    } catch (error) {
      throw new RepositoryError({
        entity: 'Company',
        operation: 'find',
        originalError: error,
      });
    }

    return rawEntities.map((rawEntity) => this.companyMapper.mapToDomain(rawEntity));
  }

  public async countCompanies(payload: CountCompaniesPayload): Promise<number> {
    const { name } = payload;

    try {
      const query = this.databaseClient<CompanyRawEntity>(companiesTable.name);

      if (name) {
        query.whereRaw(`${companiesTable.columns.name} ILIKE ?`, `%${name}%`);
      }

      const countResult = await query.count().first();

      const count = countResult?.['count'];

      if (count === undefined) {
        throw new RepositoryError({
          entity: 'Company',
          operation: 'count',
          countResult,
        });
      }

      if (typeof count === 'string') {
        return parseInt(count, 10);
      }

      return count;
    } catch (error) {
      throw new RepositoryError({
        entity: 'Company',
        operation: 'count',
        originalError: error,
      });
    }
  }
}
