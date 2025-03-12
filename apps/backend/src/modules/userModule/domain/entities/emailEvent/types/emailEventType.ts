export const emailEventTypes = {
  resetPassword: 'resetPassword',
  verifyEmail: 'verifyEmail',
} as const;

export type EmailEventType = (typeof emailEventTypes)[keyof typeof emailEventTypes];
