import { BaseError, type BaseErrorContext } from './baseError.ts';

export class ConfigurationError extends BaseError {
  public constructor(context: BaseErrorContext) {
    super('ConfigurationError', 'Configuration not valid.', context);
  }
}
