import { ResourceNotFoundError } from '../../../../../common/errors/resourceNotFoundError.ts';
import type { UserRole } from '../../../../../common/types/userRole.ts';
import type { Company } from '../../../domain/entities/company/company.ts';
import type { Candidate } from '../../../domain/entities/candidate/candidate.ts';
import type { User } from '../../../domain/entities/user/user.ts';
import type { CompanyRepository } from '../../../domain/repositories/companyRepository/companyRepository.ts';
import type { CandidateRepository } from '../../../domain/repositories/candidateRepository/candidateRepository.ts';
import { type UserRepository } from '../../../domain/repositories/userRepository/userRepository.ts';

import { type FindUserAction, type FindUserActionPayload, type FindUserActionResult } from './findUserAction.ts';

export class FindUserActionImpl implements FindUserAction {
  private readonly userRepository: UserRepository;
  private readonly candidateRepository: CandidateRepository;
  private readonly companyRepository: CompanyRepository;

  public constructor(
    userRepository: UserRepository,
    candidateRepository: CandidateRepository,
    companyRepository: CompanyRepository,
  ) {
    this.userRepository = userRepository;
    this.candidateRepository = candidateRepository;
    this.companyRepository = companyRepository;
  }

  public async execute(payload: FindUserActionPayload): Promise<FindUserActionResult> {
    const { id, role } = payload;

    const user = role ? await this.getUserByRole(id, role) : await this.getUserById(id);

    return { user };
  }

  public async getUserByRole(id: string, role: UserRole): Promise<Candidate | Company | User> {
    if (role === 'candidate') {
      const candidate = await this.candidateRepository.findCandidate({ id });

      if (!candidate) {
        throw new ResourceNotFoundError({
          resource: 'Candidate',
          id,
        });
      }

      return candidate;
    } else if (role === 'company') {
      const company = await this.companyRepository.findCompany({ id });

      if (!company) {
        throw new ResourceNotFoundError({
          resource: 'Company',
          id,
        });
      }

      return company;
    } else {
      const user = await this.userRepository.findUser({ id });

      if (!user) {
        throw new ResourceNotFoundError({
          resource: 'User',
          id,
        });
      }

      return user;
    }
  }

  public async getUserById(id: string): Promise<Candidate | Company | User> {
    const user = await this.userRepository.findUser({ id });

    if (!user) {
      throw new ResourceNotFoundError({
        resource: 'User',
        id,
      });
    }

    if (user.getRole() === 'candidate') {
      const candidate = await this.candidateRepository.findCandidate({ id });

      return candidate as Candidate;
    } else if (user.getRole() === 'company') {
      const company = await this.companyRepository.findCompany({ id });

      return company as Company;
    }

    return user;
  }
}
