export const tokenTypes = {
  access: 'access',
  refresh: 'refresh',
  emailVerification: 'emailVerification',
  passwordReset: 'passwordReset',
} as const;

export type TokenType = (typeof tokenTypes)[keyof typeof tokenTypes];
