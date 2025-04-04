import { beforeEach, afterEach, expect, describe, it } from 'vitest';

import { Generator } from '../../../../../../tests/generator.ts';
import { TestContainer } from '../../../../../../tests/testContainer.ts';
import { RepositoryError } from '../../../../../common/errors/repositoryError.ts';
import { databaseSymbols } from '../../../../databaseModule/symbols.ts';
import type { DatabaseClient } from '../../../../databaseModule/types/databaseClient.ts';
import { type CompanyRepository } from '../../../domain/repositories/companyRepository/companyRepository.ts';
import { symbols } from '../../../symbols.ts';
import { CompanyTestFactory } from '../../../tests/factories/companyTestFactory/companyTestFactory.ts';
import { CompanyTestUtils } from '../../../tests/utils/companyTestUtils/companyTestUtils.ts';

describe('CompanyRepositoryImpl', () => {
  let companyRepository: CompanyRepository;

  let databaseClient: DatabaseClient;

  let companyTestUtils: CompanyTestUtils;

  const companyTestFactory = new CompanyTestFactory();

  beforeEach(async () => {
    const container = await TestContainer.create();

    companyRepository = container.get<CompanyRepository>(symbols.companyRepository);

    databaseClient = container.get<DatabaseClient>(databaseSymbols.databaseClient);

    companyTestUtils = new CompanyTestUtils(databaseClient);

    await companyTestUtils.truncate();
  });

  afterEach(async () => {
    await companyTestUtils.truncate();

    await databaseClient.destroy();
  });

  describe('Create', () => {
    it('creates a Company', async () => {
      const createdCompany = companyTestFactory.create();

      const company = await companyRepository.createCompany({
        data: {
          email: createdCompany.getEmail(),
          password: createdCompany.getPassword(),
          isEmailVerified: createdCompany.getIsEmailVerified(),
          isDeleted: createdCompany.getIsDeleted(),
          role: createdCompany.getRole(),
          name: createdCompany.getName(),
          phone: createdCompany.getPhone(),
          description: createdCompany.getDescription(),
          logoUrl: createdCompany.getLogoUrl(),
        },
      });

      const foundCompany = await companyTestUtils.findByName({ name: company.getName() });

      expect(foundCompany).toBeDefined();
    });

    it('throws an error when a Company with the same email already exists', async () => {
      const email = Generator.email();

      await companyTestUtils.createAndPersist({ userInput: { email } });

      const createdCompany = companyTestFactory.create({ email });

      try {
        await companyRepository.createCompany({
          data: {
            email: createdCompany.getEmail(),
            password: createdCompany.getPassword(),
            isEmailVerified: createdCompany.getIsEmailVerified(),
            isDeleted: createdCompany.getIsDeleted(),
            role: createdCompany.getRole(),
            name: createdCompany.getName(),
            phone: createdCompany.getPhone(),
            description: createdCompany.getDescription(),
            logoUrl: createdCompany.getLogoUrl(),
          },
        });
      } catch (error) {
        expect(error).toBeInstanceOf(RepositoryError);

        return;
      }

      expect.fail();
    });

    it("updates Company's data", async () => {
      const companyRawEntity = await companyTestUtils.createAndPersist();

      const company = companyTestFactory.create({
        id: companyRawEntity.id,
        email: companyRawEntity.email,
        password: companyRawEntity.password,
        name: companyRawEntity.name,
        description: companyRawEntity.description,
        logoUrl: companyRawEntity.logo_url,
        phone: companyRawEntity.phone,
        isEmailVerified: companyRawEntity.is_email_verified,
        isDeleted: companyRawEntity.is_deleted,
        role: companyRawEntity.role,
        createdAt: companyRawEntity.created_at,
      });

      const password = Generator.password();
      const isEmailVerified = Generator.boolean();
      const isDeleted = Generator.boolean();
      const logoUrl = Generator.imageUrl();
      const phone = Generator.phone();
      const name = Generator.companyName();
      const description = Generator.companyDescription();

      company.setPassword({ password });
      company.setIsEmailVerified({ isEmailVerified });
      company.setIsDeleted({ isDeleted });
      company.setLogoUrl({ logoUrl });
      company.setPhone({ phone });
      company.setName({ name });
      company.setDescription({ description });

      const updatedCompany = await companyRepository.updateCompany({
        company,
      });

      const foundCompany = await companyTestUtils.findById({ id: company.getId() });

      expect(updatedCompany.getState()).toEqual({
        email: company.getEmail(),
        password,
        name,
        description,
        logoUrl,
        phone,
        isEmailVerified,
        isDeleted,
        role: companyRawEntity.role,
        createdAt: companyRawEntity.created_at,
      });

      expect(foundCompany).toEqual({
        id: company.getId(),
        email: company.getEmail(),
        password,
        name,
        description,
        logo_url: logoUrl,
        phone,
        is_email_verified: isEmailVerified,
        is_deleted: isDeleted,
        role: companyRawEntity.role,
        created_at: companyRawEntity.created_at,
      });
    });
  });

  describe('Find', () => {
    it('finds a Company by id', async () => {
      const company = await companyTestUtils.createAndPersist();

      const foundCompany = await companyRepository.findCompany({ id: company.id });

      expect(foundCompany?.getState()).toEqual({
        email: company.email,
        password: company.password,
        name: company.name,
        description: company.description,
        logoUrl: company.logo_url,
        phone: company.phone,
        isEmailVerified: company.is_email_verified,
        isDeleted: company.is_deleted,
        role: company.role,
        createdAt: company.created_at,
      });
    });

    it('returns null if a Company with given id does not exist', async () => {
      const createdCompany = companyTestFactory.create();

      const company = await companyRepository.findCompany({ id: createdCompany.getId() });

      expect(company).toBeNull();
    });
  });

  describe('Find Many', () => {
    it('finds all Companies', async () => {
      const company1 = await companyTestUtils.createAndPersist();

      const company2 = await companyTestUtils.createAndPersist();

      const companies = await companyRepository.findCompanies({
        page: 1,
        pageSize: 10,
      });

      expect(companies).toHaveLength(2);

      expect(companies[0]?.getId()).toEqual(company2.id);

      expect(companies[1]?.getId()).toEqual(company1.id);
    });

    it('finds Companies by name', async () => {
      const company = await companyTestUtils.createAndPersist({ companyInput: { name: 'Towersoft' } });

      await companyTestUtils.createAndPersist({ companyInput: { name: 'Advertisoft' } });

      const companies = await companyRepository.findCompanies({
        page: 1,
        pageSize: 10,
        name: 'tow',
      });

      expect(companies).toHaveLength(1);

      expect(companies[0]?.getState()).toEqual({
        email: company.email,
        password: company.password,
        name: company.name,
        description: company.description,
        logoUrl: company.logo_url,
        phone: company.phone,
        isEmailVerified: company.is_email_verified,
        isDeleted: company.is_deleted,
        role: company.role,
        createdAt: company.created_at,
      });
    });
  });

  describe('Count', () => {
    it('counts Companies', async () => {
      await companyTestUtils.createAndPersist();

      await companyTestUtils.createAndPersist();

      const count = await companyRepository.countCompanies({});

      expect(count).toEqual(2);
    });

    it('counts Companies by name', async () => {
      await companyTestUtils.createAndPersist({ companyInput: { name: 'Towersoft' } });

      await companyTestUtils.createAndPersist({ companyInput: { name: 'Advertisoft' } });

      const count = await companyRepository.countCompanies({ name: 'tower' });

      expect(count).toEqual(1);
    });
  });
});
