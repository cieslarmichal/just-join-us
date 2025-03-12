import { compare, genSalt, hash } from 'bcrypt';

import { type Config } from '../../../../../core/config.ts';

import { type ComparePayload, type HashPayload, type HashService } from './hashService.ts';

export class HashServiceImpl implements HashService {
  private readonly config: Config;

  public constructor(config: Config) {
    this.config = config;
  }

  public async hash(payload: HashPayload): Promise<string> {
    const { plainData } = payload;

    const salt = await genSalt(this.config.hashSaltRounds);

    return hash(plainData, salt);
  }

  public async compare(payload: ComparePayload): Promise<boolean> {
    const { plainData, hashedData } = payload;

    return compare(plainData, hashedData);
  }
}
