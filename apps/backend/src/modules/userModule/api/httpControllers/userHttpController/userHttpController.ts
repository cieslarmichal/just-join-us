import { OperationNotValidError } from '../../../../../common/errors/operationNotValidError.ts';
import { type HttpController } from '../../../../../common/http/httpController.ts';
import { httpMethodNames } from '../../../../../common/http/httpMethodName.ts';
import { type HttpRequest } from '../../../../../common/http/httpRequest.ts';
import { type HttpCreatedResponse, type HttpOkResponse } from '../../../../../common/http/httpResponse.ts';
import { HttpRoute } from '../../../../../common/http/httpRoute.ts';
import { httpStatusCodes } from '../../../../../common/http/httpStatusCode.ts';
import { type AccessControlService } from '../../../../authModule/application/services/accessControlService/accessControlService.ts';
import { type ChangeUserPasswordAction } from '../../../application/actions/changeUserPasswordAction/changeUserPasswordAction.ts';
import { type FindUserAction } from '../../../application/actions/findUserAction/findUserAction.ts';
import { type LoginUserAction } from '../../../application/actions/loginUserAction/loginUserAction.ts';
import { type LogoutUserAction } from '../../../application/actions/logoutUserAction/logoutUserAction.ts';
import { type RefreshUserTokensAction } from '../../../application/actions/refreshUserTokensAction/refreshUserTokensAction.ts';
import { type RegisterCompanyAction } from '../../../application/actions/registerCompanyAction/registerCompanyAction.ts';
import { type RegisterStudentAction } from '../../../application/actions/registerStudentAction/registerStudentAction.ts';
import { type SendResetPasswordEmailAction } from '../../../application/actions/sendResetPasswordEmailAction/sendResetPasswordEmailAction.ts';
import { type SendVerificationEmailAction } from '../../../application/actions/sendVerificationEmailAction/sendVerificationEmailAction.ts';
import { type UpdateCompanyAction } from '../../../application/actions/updateCompanyAction/updateCompanyAction.ts';
import { type UpdateStudentAction } from '../../../application/actions/updateStudentAction/updateStudentAction.ts';
import { type VerifyUserEmailAction } from '../../../application/actions/verifyUserEmailAction/verifyUserEmailAction.ts';
import { Company } from '../../../domain/entities/company/company.ts';
import { Student } from '../../../domain/entities/student/student.ts';
import { type User } from '../../../domain/entities/user/user.ts';

import {
  type ChangeUserPasswordBody,
  type ChangeUserPasswordResponseBody,
  changeUserPasswordSchema,
} from './schemas/changeUserPasswordSchema.ts';
import { type CompanyDto } from './schemas/companySchema.ts';
import { type FindMyUserResponseBody, findMyUserSchema } from './schemas/findMyUserSchema.ts';
import { type LoginUserBody, type LoginUserResponseBody, loginUserSchema } from './schemas/loginUserSchema.ts';
import {
  type LogoutUserBody,
  type LogoutUserPathParams,
  type LogoutUserResponseBody,
  logoutUserSchema,
} from './schemas/logoutUserSchema.ts';
import {
  refreshUserTokensSchema,
  type RefreshUserTokensBody,
  type RefreshUserTokensResponseBody,
} from './schemas/refreshUserTokensSchema.ts';
import {
  registerCompanySchema,
  type RegisterCompanyRequestBody,
  type RegisterCompanyResponseBody,
} from './schemas/registerCompanySchema.ts';
import {
  registerStudentSchema,
  type RegisterStudentRequestBody,
  type RegisterStudentResponseBody,
} from './schemas/registerStudentSchema.ts';
import {
  type ResetUserPasswordBody,
  type ResetUserPasswordResponseBody,
  resetUserPasswordSchema,
} from './schemas/resetUserPasswordSchema.ts';
import {
  type SendVerificationEmailBody,
  type SendVerificationEmailResponseBody,
  sendVerificationEmailSchema,
} from './schemas/sendVerificationEmailSchema.ts';
import { type StudentDto } from './schemas/studentSchema.ts';
import {
  type UpdateCompanyRequestBody,
  type UpdateCompanyPathParams,
  type UpdateCompanyResponseBody,
  updateCompanySchema,
} from './schemas/updateCompanySchema.ts';
import {
  type UpdateStudentRequestBody,
  type UpdateStudentPathParams,
  type UpdateStudentResponseBody,
  updateStudentSchema,
} from './schemas/updateStudentSchema.ts';
import { type UserDto } from './schemas/userSchema.ts';
import {
  verifyUserEmailSchema,
  type VerifyUserEmailBody,
  type VerifyUserEmailResponseBody,
} from './schemas/verifyUserEmailSchema.ts';

export class UserHttpController implements HttpController {
  public readonly tags = ['User'];
  private readonly registerCompanyAction: RegisterCompanyAction;
  private readonly registerStudentAction: RegisterStudentAction;
  private readonly loginUserAction: LoginUserAction;
  private readonly updateCompanyAction: UpdateCompanyAction;
  private readonly updateStudentAction: UpdateStudentAction;
  private readonly findUserAction: FindUserAction;
  private readonly accessControlService: AccessControlService;
  private readonly verifyUserEmailAction: VerifyUserEmailAction;
  private readonly resetUserPasswordAction: SendResetPasswordEmailAction;
  private readonly changeUserPasswordAction: ChangeUserPasswordAction;
  private readonly logoutUserAction: LogoutUserAction;
  private readonly refreshUserTokensAction: RefreshUserTokensAction;
  private readonly sendVerificationEmailAction: SendVerificationEmailAction;

  public constructor(
    registerCompanyAction: RegisterCompanyAction,
    registerStudentAction: RegisterStudentAction,
    loginUserAction: LoginUserAction,
    updateCompanyAction: UpdateCompanyAction,
    updateStudentAction: UpdateStudentAction,
    findUserAction: FindUserAction,
    accessControlService: AccessControlService,
    verifyUserEmailAction: VerifyUserEmailAction,
    resetUserPasswordAction: SendResetPasswordEmailAction,
    changeUserPasswordAction: ChangeUserPasswordAction,
    logoutUserAction: LogoutUserAction,
    refreshUserTokensAction: RefreshUserTokensAction,
    sendVerificationEmailAction: SendVerificationEmailAction,
  ) {
    this.registerCompanyAction = registerCompanyAction;
    this.registerStudentAction = registerStudentAction;
    this.loginUserAction = loginUserAction;
    this.updateCompanyAction = updateCompanyAction;
    this.updateStudentAction = updateStudentAction;
    this.findUserAction = findUserAction;
    this.accessControlService = accessControlService;
    this.verifyUserEmailAction = verifyUserEmailAction;
    this.resetUserPasswordAction = resetUserPasswordAction;
    this.changeUserPasswordAction = changeUserPasswordAction;
    this.logoutUserAction = logoutUserAction;
    this.refreshUserTokensAction = refreshUserTokensAction;
    this.sendVerificationEmailAction = sendVerificationEmailAction;
  }

  public getHttpRoutes(): HttpRoute[] {
    return [
      new HttpRoute({
        method: httpMethodNames.post,
        path: '/companies/register',
        handler: this.registerCompany.bind(this),
        schema: registerCompanySchema,
        description: 'Register company',
      }),
      new HttpRoute({
        method: httpMethodNames.post,
        path: '/students/register',
        handler: this.registerStudent.bind(this),
        schema: registerStudentSchema,
        description: 'Register student',
      }),
      new HttpRoute({
        method: httpMethodNames.post,
        path: '/users/login',
        handler: this.loginUser.bind(this),
        schema: loginUserSchema,
        description: 'Login user',
      }),
      new HttpRoute({
        method: httpMethodNames.post,
        path: '/users/reset-password',
        handler: this.resetUserPassword.bind(this),
        description: 'Reset user password',
        schema: resetUserPasswordSchema,
      }),
      new HttpRoute({
        method: httpMethodNames.post,
        path: '/users/change-password',
        description: 'Change user password',
        handler: this.changeUserPassword.bind(this),
        schema: changeUserPasswordSchema,
      }),
      new HttpRoute({
        method: httpMethodNames.get,
        path: '/users/me',
        handler: this.findMyUser.bind(this),
        schema: findMyUserSchema,
        description: 'Find user by token',
      }),
      new HttpRoute({
        method: httpMethodNames.post,
        path: '/users/send-verification-email',
        handler: this.sendVerificationEmail.bind(this),
        schema: sendVerificationEmailSchema,
        description: 'Send verification email',
      }),
      new HttpRoute({
        method: httpMethodNames.post,
        path: '/users/verify-email',
        handler: this.verifyUserEmail.bind(this),
        schema: verifyUserEmailSchema,
        description: 'Verify user email',
      }),
      new HttpRoute({
        method: httpMethodNames.post,
        path: '/users/:userId/logout',
        handler: this.logoutUser.bind(this),
        schema: logoutUserSchema,
        description: 'Logout user',
      }),
      new HttpRoute({
        method: httpMethodNames.patch,
        path: '/students/:studentId',
        handler: this.updateStudent.bind(this),
        schema: updateStudentSchema,
        description: 'Update student',
      }),
      new HttpRoute({
        method: httpMethodNames.patch,
        path: '/companies/:companyId',
        handler: this.updateCompany.bind(this),
        schema: updateCompanySchema,
        description: 'Update company',
      }),
      new HttpRoute({
        method: httpMethodNames.post,
        path: '/users/refresh-token',
        handler: this.refreshUserTokens.bind(this),
        schema: refreshUserTokensSchema,
        description: 'Refresh user tokens',
      }),
    ];
  }

  private async registerStudent(
    request: HttpRequest<RegisterStudentRequestBody>,
  ): Promise<HttpCreatedResponse<RegisterStudentResponseBody>> {
    const { email, password, firstName, lastName, birthDate, phone } = request.body;

    const { student } = await this.registerStudentAction.execute({
      email,
      password,
      firstName,
      lastName,
      birthDate: new Date(birthDate),
      phone,
    });

    return {
      statusCode: httpStatusCodes.created,
      body: this.mapStudentToDto(student),
    };
  }

  private async registerCompany(
    request: HttpRequest<RegisterCompanyRequestBody>,
  ): Promise<HttpCreatedResponse<RegisterCompanyResponseBody>> {
    const { email, password, name, taxId, phone, logoUrl } = request.body;

    const { company } = await this.registerCompanyAction.execute({
      email,
      password,
      name,
      taxId,
      phone,
      logoUrl,
    });

    return {
      statusCode: httpStatusCodes.created,
      body: this.mapCompanyToDto(company),
    };
  }

  private async loginUser(request: HttpRequest<LoginUserBody>): Promise<HttpOkResponse<LoginUserResponseBody>> {
    const { email, password } = request.body;

    const { accessToken, refreshToken } = await this.loginUserAction.execute({
      email,
      password,
    });

    return {
      statusCode: httpStatusCodes.ok,
      body: {
        accessToken,
        refreshToken,
      },
    };
  }

  private async resetUserPassword(
    request: HttpRequest<ResetUserPasswordBody, null, null>,
  ): Promise<HttpOkResponse<ResetUserPasswordResponseBody>> {
    const { email } = request.body;

    await this.resetUserPasswordAction.execute({
      email,
    });

    return {
      statusCode: httpStatusCodes.ok,
      body: null,
    };
  }

  private async changeUserPassword(
    request: HttpRequest<ChangeUserPasswordBody, null, null>,
  ): Promise<HttpOkResponse<ChangeUserPasswordResponseBody>> {
    const { password, token } = request.body;

    let userId: string | undefined;

    try {
      const result = await this.accessControlService.verifyBearerToken({ requestHeaders: request.headers });

      userId = result.userId;
    } catch (error) {
      userId = undefined;
    }

    let identifier: { userId: string } | { resetPasswordToken: string };

    if (userId) {
      identifier = { userId };
    } else {
      if (!token) {
        throw new OperationNotValidError({
          reason: 'Reset password token is required.',
        });
      }

      identifier = { resetPasswordToken: token };
    }

    await this.changeUserPasswordAction.execute({
      newPassword: password,
      identifier,
    });

    return {
      statusCode: httpStatusCodes.ok,
      body: null,
    };
  }

  private async findMyUser(request: HttpRequest): Promise<HttpOkResponse<FindMyUserResponseBody>> {
    const { userId, role } = await this.accessControlService.verifyBearerToken({ requestHeaders: request.headers });

    const { user } = await this.findUserAction.execute({
      id: userId,
      role,
    });

    return {
      statusCode: httpStatusCodes.ok,
      body: this.mapUserToDto(user),
    };
  }

  private async updateStudent(
    request: HttpRequest<UpdateStudentRequestBody, undefined, UpdateStudentPathParams>,
  ): Promise<HttpOkResponse<UpdateStudentResponseBody>> {
    const { studentId } = request.pathParams;

    const { firstName, lastName, birthDate, phone, isDeleted } = request.body;

    await this.accessControlService.verifyBearerToken({
      requestHeaders: request.headers,
      expectedUserId: studentId,
    });

    const { student } = await this.updateStudentAction.execute({
      id: studentId,
      firstName,
      lastName,
      birthDate: birthDate ? new Date(birthDate) : undefined,
      phone,
      isDeleted,
    });

    return {
      statusCode: httpStatusCodes.ok,
      body: this.mapStudentToDto(student),
    };
  }

  private async updateCompany(
    request: HttpRequest<UpdateCompanyRequestBody, undefined, UpdateCompanyPathParams>,
  ): Promise<HttpOkResponse<UpdateCompanyResponseBody>> {
    const { companyId } = request.pathParams;

    const { phone, isDeleted, logoUrl } = request.body;

    await this.accessControlService.verifyBearerToken({
      requestHeaders: request.headers,
      expectedUserId: companyId,
    });

    const { company } = await this.updateCompanyAction.execute({
      id: companyId,
      phone,
      isDeleted,
      logoUrl,
    });

    return {
      statusCode: httpStatusCodes.ok,
      body: this.mapCompanyToDto(company),
    };
  }

  private async verifyUserEmail(
    request: HttpRequest<VerifyUserEmailBody, undefined, undefined>,
  ): Promise<HttpOkResponse<VerifyUserEmailResponseBody>> {
    const { token } = request.body;

    await this.verifyUserEmailAction.execute({ emailVerificationToken: token });

    return {
      statusCode: httpStatusCodes.ok,
      body: null,
    };
  }

  private async sendVerificationEmail(
    request: HttpRequest<SendVerificationEmailBody, undefined, undefined>,
  ): Promise<HttpOkResponse<SendVerificationEmailResponseBody>> {
    const { email } = request.body;

    await this.sendVerificationEmailAction.execute({
      email: email.toLowerCase(),
    });

    return {
      statusCode: httpStatusCodes.ok,
      body: null,
    };
  }

  private async logoutUser(
    request: HttpRequest<LogoutUserBody, undefined, LogoutUserPathParams>,
  ): Promise<HttpOkResponse<LogoutUserResponseBody>> {
    const { userId } = request.pathParams;

    const { refreshToken, accessToken } = request.body;

    await this.accessControlService.verifyBearerToken({
      requestHeaders: request.headers,
      expectedUserId: userId,
    });

    await this.logoutUserAction.execute({
      userId,
      refreshToken,
      accessToken,
    });

    return {
      statusCode: httpStatusCodes.ok,
      body: null,
    };
  }

  private async refreshUserTokens(
    request: HttpRequest<RefreshUserTokensBody>,
  ): Promise<HttpOkResponse<RefreshUserTokensResponseBody>> {
    const { refreshToken: inputRefreshToken } = request.body;

    const { accessToken, refreshToken } = await this.refreshUserTokensAction.execute({
      refreshToken: inputRefreshToken,
    });

    return {
      statusCode: httpStatusCodes.ok,
      body: {
        accessToken,
        refreshToken,
      },
    };
  }

  private mapUserToDto(user: User): UserDto | StudentDto | CompanyDto {
    if (user instanceof Student) {
      return this.mapStudentToDto(user);
    } else if (user instanceof Company) {
      return this.mapCompanyToDto(user);
    }

    return {
      id: user.getId(),
      email: user.getEmail(),
      isEmailVerified: user.getIsEmailVerified(),
      isDeleted: user.getIsDeleted(),
      role: user.getRole(),
      createdAt: user.getCreatedAt().toISOString(),
    };
  }

  private mapStudentToDto(student: Student): StudentDto {
    return {
      id: student.getId(),
      email: student.getEmail(),
      isEmailVerified: student.getIsEmailVerified(),
      isDeleted: student.getIsDeleted(),
      role: student.getRole(),
      createdAt: student.getCreatedAt().toISOString(),
      firstName: student.getFirstName(),
      lastName: student.getLastName(),
      birthDate: student.getBirthDate().toISOString(),
      phone: student.getPhone(),
    };
  }

  private mapCompanyToDto(company: Company): CompanyDto {
    return {
      id: company.getId(),
      email: company.getEmail(),
      isEmailVerified: company.getIsEmailVerified(),
      isDeleted: company.getIsDeleted(),
      role: company.getRole(),
      createdAt: company.getCreatedAt().toISOString(),
      name: company.getName(),
      taxId: company.getTaxId(),
      phone: company.getPhone(),
      isVerified: company.getIsVerified(),
      logoUrl: company.getLogoUrl(),
    };
  }
}
