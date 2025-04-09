import type { CompanyLocation } from '../../../../locationModule/domain/entities/companyLocation/companyLocation.ts';
import type { Category } from '../category/category.ts';
import type { Skill } from '../skill/skill.ts';

interface JobOfferCompanyState {
  readonly name: string;
  readonly logoUrl: string;
}

interface JobOfferCategoryState {
  readonly name: string;
}

interface JobOfferSkillState {
  readonly id: string;
  readonly name: string;
}

interface JobOfferLocationState {
  readonly id: string;
  readonly isRemote: boolean;
  readonly city?: string | undefined;
}

export interface JobOfferDraft {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly isHidden: boolean;
  readonly categoryId: string;
  readonly category?: JobOfferCategoryState;
  readonly companyId: string;
  readonly company?: JobOfferCompanyState;
  readonly createdAt: Date;
  readonly employmentType: string;
  readonly workingTime: string;
  readonly experienceLevel: string;
  readonly minSalary: number;
  readonly maxSalary: number;
  readonly skills?: JobOfferSkillState[] | undefined;
  readonly locations?: JobOfferLocationState[] | undefined;
}

export interface JobOfferState {
  name: string;
  description: string;
  isHidden: boolean;
  categoryId: string;
  category?: JobOfferCategoryState;
  employmentType: string;
  workingTime: string;
  experienceLevel: string;
  minSalary: number;
  maxSalary: number;
  skills?: JobOfferSkillState[] | undefined;
  locations?: JobOfferLocationState[] | undefined;
  readonly companyId: string;
  readonly company?: JobOfferCompanyState;
  readonly createdAt: Date;
}

export interface SetNamePayload {
  readonly name: string;
}

export interface SetDescriptionPayload {
  readonly description: string;
}

export interface SetIsHiddenPayload {
  readonly isHidden: boolean;
}

export interface SetCategoryPayload {
  readonly category: Category;
}

export interface SetEmploymentTypePayload {
  readonly employmentType: string;
}

export interface SetWorkingTimePayload {
  readonly workingTime: string;
}

export interface SetExperienceLevelPayload {
  readonly experienceLevel: string;
}

export interface SetMinSalaryPayload {
  readonly minSalary: number;
}

export interface SetMaxSalaryPayload {
  readonly maxSalary: number;
}

export interface SetSkillsPayload {
  readonly skills: Skill[];
}

export interface SetLocationsPayload {
  readonly locations: CompanyLocation[];
}

export class JobOffer {
  private id: string;
  private state: JobOfferState;

  public constructor(draft: JobOfferDraft) {
    const {
      id,
      name,
      description,
      isHidden,
      categoryId,
      companyId,
      createdAt,
      category,
      company,
      minSalary,
      maxSalary,
      employmentType,
      experienceLevel,
      workingTime,
      locations,
      skills,
    } = draft;

    this.id = id;

    let jobOfferState: JobOfferState = {
      name,
      description,
      isHidden,
      categoryId,
      companyId,
      createdAt,
      minSalary,
      maxSalary,
      employmentType,
      workingTime,
      experienceLevel,
      locations,
      skills,
    };

    if (category) {
      jobOfferState = { ...jobOfferState, category };
    }

    if (company) {
      jobOfferState = { ...jobOfferState, company };
    }

    this.state = jobOfferState;
  }

  public getId(): string {
    return this.id;
  }

  public getName(): string {
    return this.state.name;
  }

  public getDescription(): string {
    return this.state.description;
  }

  public getIsHidden(): boolean {
    return this.state.isHidden;
  }

  public getCategoryId(): string {
    return this.state.categoryId;
  }

  public getCategory(): JobOfferCategoryState | undefined {
    return this.state.category;
  }

  public getCompanyId(): string {
    return this.state.companyId;
  }

  public getCompany(): JobOfferCompanyState | undefined {
    return this.state.company;
  }

  public getSkills(): JobOfferSkillState[] | undefined {
    return this.state.skills;
  }

  public getLocations(): JobOfferLocationState[] | undefined {
    return this.state.locations;
  }

  public getEmploymentType(): string {
    return this.state.employmentType;
  }

  public getWorkingTime(): string {
    return this.state.workingTime;
  }

  public getExperienceLevel(): string {
    return this.state.experienceLevel;
  }

  public getMinSalary(): number {
    return this.state.minSalary;
  }

  public getMaxSalary(): number {
    return this.state.maxSalary;
  }

  public getCreatedAt(): Date {
    return this.state.createdAt;
  }

  public getState(): JobOfferState {
    return this.state;
  }

  public setName(payload: SetNamePayload): void {
    this.state.name = payload.name;
  }

  public setDescription(payload: SetDescriptionPayload): void {
    this.state.description = payload.description;
  }

  public setIsHidden(payload: SetIsHiddenPayload): void {
    this.state.isHidden = payload.isHidden;
  }

  public setCategory(payload: SetCategoryPayload): void {
    this.state.categoryId = payload.category.getId();
    this.state.category = { name: payload.category.getName() };
  }

  public setEmploymentType(payload: SetEmploymentTypePayload): void {
    this.state.employmentType = payload.employmentType;
  }

  public setWorkingTime(payload: SetWorkingTimePayload): void {
    this.state.workingTime = payload.workingTime;
  }

  public setExperienceLevel(payload: SetExperienceLevelPayload): void {
    this.state.experienceLevel = payload.experienceLevel;
  }

  public setMinSalary(payload: SetMinSalaryPayload): void {
    this.state.minSalary = payload.minSalary;
  }

  public setMaxSalary(payload: SetMaxSalaryPayload): void {
    this.state.maxSalary = payload.maxSalary;
  }

  public setSkills(payload: SetSkillsPayload): void {
    this.state.skills = payload.skills.map((skill) => ({
      id: skill.getId(),
      name: skill.getName(),
    }));
  }

  public setLocations(payload: SetLocationsPayload): void {
    this.state.locations = payload.locations.map((location) => ({
      id: location.getId(),
      isRemote: location.getIsRemote(),
      city: location.getCityId(),
    }));
  }
}
