import { User, type UserState, type UserDraft } from '../user/user.ts';

export interface CompanyDraft extends UserDraft {
  readonly taxIdNumber: string;
  readonly name: string;
  readonly phoneNumber: string;
  readonly isVerified: boolean;
  readonly logoUrl: string;
}

export interface CompanyState {
  readonly taxIdNumber: string;
  readonly name: string;
  phoneNumber: string;
  isVerified: boolean;
  logoUrl: string;
}

interface SetPhoneNumberPayload {
  readonly phoneNumber: string;
}

interface SetIsVerifiedPayload {
  readonly isVerified: boolean;
}

interface SetLogoUrlPayload {
  readonly logoUrl: string;
}

export class Company extends User {
  private companyState: CompanyState;

  public constructor(draft: CompanyDraft) {
    const {
      id,
      email,
      password,
      isEmailVerified,
      isDeleted,
      role,
      createdAt,
      isVerified,
      name,
      taxIdNumber,
      logoUrl,
      phoneNumber,
    } = draft;

    super({
      id,
      email,
      password,
      isEmailVerified,
      isDeleted,
      role,
      createdAt,
    });

    this.companyState = {
      taxIdNumber,
      name,
      isVerified,
      phoneNumber,
      logoUrl,
    };
  }

  public setPhoneNumber(payload: SetPhoneNumberPayload): void {
    const { phoneNumber } = payload;

    this.companyState.phoneNumber = phoneNumber;
  }

  public setIsVerified(payload: SetIsVerifiedPayload): void {
    const { isVerified } = payload;

    this.companyState.isVerified = isVerified;
  }

  public setLogoUrl(payload: SetLogoUrlPayload): void {
    const { logoUrl } = payload;

    this.companyState.logoUrl = logoUrl;
  }

  public getPhoneNumber(): string {
    return this.companyState.phoneNumber;
  }

  public getIsVerified(): boolean {
    return this.companyState.isVerified;
  }

  public getLogoUrl(): string {
    return this.companyState.logoUrl;
  }

  public getTaxIdNumber(): string {
    return this.companyState.taxIdNumber;
  }

  public getName(): string {
    return this.companyState.name;
  }

  public getCompanyState(): CompanyState {
    return this.companyState;
  }

  public getState(): CompanyState & UserState {
    return {
      ...this.companyState,
      ...super.getUserState(),
    };
  }
}
