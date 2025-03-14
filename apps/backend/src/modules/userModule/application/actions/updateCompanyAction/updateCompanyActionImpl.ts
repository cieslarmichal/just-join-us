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
    const { id, isVerified, phoneNumber, isDeleted, logoUrl } = payload;

    this.loggerService.debug({
      message: 'Updating company...',
      id,
      isVerified,
      phoneNumber,
      logoUrl,
    });

    const company = await this.companyRepository.findCompany({ id });

    if (!company) {
      throw new OperationNotValidError({
        reason: 'Company not found.',
        id,
      });
    }

    if (isVerified !== undefined) {
      company.setIsVerified({ isVerified });
    }

    if (phoneNumber !== undefined) {
      company.setPhoneNumber({ phoneNumber });
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
