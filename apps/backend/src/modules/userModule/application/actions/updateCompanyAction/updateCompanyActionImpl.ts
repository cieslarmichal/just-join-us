import { OperationNotValidError } from '../../../../../common/errors/operationNotValidError.ts';
import { type LoggerService } from '../../../../../common/logger/loggerService.ts';
import { type CompanyRepository } from '../../../domain/repositories/companyRepository/companyRepository.ts';

import {
  type UpdateCompanyActionResult,
  type UpdateCompanyAction,
  type UpdateCompanyActionPayload,
} from './updateCompanyAction.ts';

export class UpdateCompanyActionImpl implements UpdateCompanyAction {
  private readonly companyRepository: CompanyRepository;
  private readonly loggerService: LoggerService;

  public constructor(companyRepository: CompanyRepository, loggerService: LoggerService) {
    this.companyRepository = companyRepository;
    this.loggerService = loggerService;
  }

  public async execute(payload: UpdateCompanyActionPayload): Promise<UpdateCompanyActionResult> {
    const { id, name, description, phone, isDeleted, logoUrl } = payload;

    this.loggerService.debug({
      message: 'Updating company...',
      id,
      name,
      description,
      phone,
      logoUrl,
    });

    const company = await this.companyRepository.findCompany({ id });

    if (!company) {
      throw new OperationNotValidError({
        reason: 'Company not found.',
        id,
      });
    }

    if (name !== undefined) {
      company.setName({ name });
    }

    if (description !== undefined) {
      company.setDescription({ description });
    }

    if (phone !== undefined) {
      company.setPhone({ phone });
    }

    if (isDeleted !== undefined) {
      company.setIsDeleted({ isDeleted });
    }

    if (logoUrl !== undefined) {
      company.setLogoUrl({ logoUrl });
    }

    await this.companyRepository.updateCompany({ company });

    return { company };
  }
}
