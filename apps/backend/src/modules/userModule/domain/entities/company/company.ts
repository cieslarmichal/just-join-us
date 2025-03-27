import { User, type UserState, type UserDraft } from '../user/user.ts';

export interface CompanyDraft extends UserDraft {
  readonly taxId: string;
  readonly name: string;
  readonly phone: string;
  readonly isVerified: boolean;
  readonly logoUrl: string;
}

export interface CompanyState {
  readonly taxId: string;
  readonly name: string;
  phone: string;
  isVerified: boolean;
  logoUrl: string;
}

interface SetPhonePayload {
  readonly phone: string;
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
      taxId,
      logoUrl,
      phone,
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
      taxId,
      name,
      isVerified,
      phone,
      logoUrl,
    };
  }

  public setPhone(payload: SetPhonePayload): void {
    const { phone } = payload;

    this.companyState.phone = phone;
  }

  public setIsVerified(payload: SetIsVerifiedPayload): void {
    const { isVerified } = payload;

    this.companyState.isVerified = isVerified;
  }

  public setLogoUrl(payload: SetLogoUrlPayload): void {
    const { logoUrl } = payload;

    this.companyState.logoUrl = logoUrl;
  }

  public getPhone(): string {
    return this.companyState.phone;
  }

  public getIsVerified(): boolean {
    return this.companyState.isVerified;
  }

  public getLogoUrl(): string {
    return this.companyState.logoUrl;
  }

  public getTaxId(): string {
    return this.companyState.taxId;
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
