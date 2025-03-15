export const emailTemplateName = {
  resetPassword: 'resetPassword',
  verifyEmail: 'verifyEmail',
} as const;

export type EmailTemplateName = (typeof emailTemplateName)[keyof typeof emailTemplateName];

export type VerifyEmailEmailTemplate = {
  data: {
    name: string;
    emailVerificationLink: string;
  };
  name: typeof emailTemplateName.verifyEmail;
};

export type ResetPasswordEmailTemplate = {
  data: {
    resetPasswordLink: string;
  };
  name: typeof emailTemplateName.resetPassword;
};

export type EmailTemplate = ResetPasswordEmailTemplate | VerifyEmailEmailTemplate;

export interface SendEmailPayload {
  readonly toEmail: string;
  readonly template: EmailTemplate;
}

export interface EmailService {
  sendEmail(payload: SendEmailPayload): Promise<void>;
}
