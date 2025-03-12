import { Generator } from '../../../../../../tests/generator.ts';
import { type BlacklistTokenDraft, BlacklistToken } from '../../../domain/entities/blacklistToken/blacklistToken.ts';

export class BlacklistTokenTestFactory {
  public create(input: Partial<BlacklistTokenDraft> = {}): BlacklistToken {
    return new BlacklistToken({
      id: Generator.uuid(),
      token: Generator.alphaString(32),
      expiresAt: Generator.futureDate(),
      ...input,
    });
  }
}
