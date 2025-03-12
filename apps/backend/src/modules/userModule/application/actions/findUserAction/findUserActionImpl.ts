import { ResourceNotFoundError } from '../../../../../common/errors/resourceNotFoundError.ts';
import type { UserRole } from '../../../../../common/types/userRole.ts';
import type { Company } from '../../../domain/entities/company/company.ts';
import type { Student } from '../../../domain/entities/student/student.ts';
import type { User } from '../../../domain/entities/user/user.ts';
import type { CompanyRepository } from '../../../domain/repositories/companyRepository/companyRepository.ts';
import type { StudentRepository } from '../../../domain/repositories/studentRepository/studentRepository.ts';
import { type UserRepository } from '../../../domain/repositories/userRepository/userRepository.ts';

import { type FindUserAction, type FindUserActionPayload, type FindUserActionResult } from './findUserAction.ts';

export class FindUserActionImpl implements FindUserAction {
  private readonly userRepository: UserRepository;
  private readonly studentRepository: StudentRepository;
  private readonly companyRepository: CompanyRepository;

  public constructor(
    userRepository: UserRepository,
    studentRepository: StudentRepository,
    companyRepository: CompanyRepository,
  ) {
    this.userRepository = userRepository;
    this.studentRepository = studentRepository;
    this.companyRepository = companyRepository;
  }

  public async execute(payload: FindUserActionPayload): Promise<FindUserActionResult> {
    const { id, role } = payload;

    const user = role ? await this.getUserByRole(id, role) : await this.getUserById(id);

    return { user };
  }

  public async getUserByRole(id: string, role: UserRole): Promise<Student | Company | User> {
    if (role === 'student') {
      const student = await this.studentRepository.findStudent({ id });

      if (!student) {
        throw new ResourceNotFoundError({
          resource: 'Student',
          id,
        });
      }

      return student;
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

  public async getUserById(id: string): Promise<Student | Company | User> {
    const user = await this.userRepository.findUser({ id });

    if (!user) {
      throw new ResourceNotFoundError({
        resource: 'User',
        id,
      });
    }

    if (user.getRole() === 'student') {
      const student = await this.studentRepository.findStudent({ id });

      return student as Student;
    } else if (user.getRole() === 'company') {
      const company = await this.companyRepository.findCompany({ id });

      return company as Company;
    }

    return user;
  }
}
