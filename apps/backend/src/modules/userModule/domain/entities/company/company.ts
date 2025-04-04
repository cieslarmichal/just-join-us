import { User, type UserState, type UserDraft } from '../user/user.ts';

export interface CompanyDraft extends UserDraft {
  readonly name: string;
  readonly description: string;
  readonly phone: string;
  readonly logoUrl: string;
}

export interface CompanyState {
  name: string;
  description: string;
  phone: string;
  logoUrl: string;
}

interface SetNamePayload {
  readonly name: string;
}

interface SetPhonePayload {
  readonly phone: string;
}

interface SetDescriptionPayload {
  readonly description: string;
}

interface SetLogoUrlPayload {
  readonly logoUrl: string;
}

export class Company extends User {
  private companyState: CompanyState;

  public constructor(draft: CompanyDraft) {
    const { id, email, password, isEmailVerified, isDeleted, role, createdAt, name, logoUrl, phone, description } =
      draft;

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
      name,
      phone,
      logoUrl,
      description,
    };
  }

  public setPhone(payload: SetPhonePayload): void {
    const { phone } = payload;

    this.companyState.phone = phone;
  }

  public setDescription(payload: SetDescriptionPayload): void {
    const { description } = payload;

    this.companyState.description = description;
  }

  public setLogoUrl(payload: SetLogoUrlPayload): void {
    const { logoUrl } = payload;

    this.companyState.logoUrl = logoUrl;
  }

  public setName(payload: SetNamePayload): void {
    const { name } = payload;

    this.companyState.name = name;
  }

  public getPhone(): string {
    return this.companyState.phone;
  }

  public getLogoUrl(): string {
    return this.companyState.logoUrl;
  }

  public getDescription(): string {
    return this.companyState.description;
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
