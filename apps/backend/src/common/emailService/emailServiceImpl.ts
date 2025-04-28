import type { Config } from '../../core/config.ts';
import { httpHeaders } from '../http/httpHeader.ts';
import { httpMediaTypes } from '../http/httpMediaType.ts';
import { httpMethodNames } from '../http/httpMethodName.ts';
import type { HttpService } from '../httpService/httpService.ts';

import type { EmailService, EmailTemplateName, SendEmailPayload } from './emailService.ts';

const sendGridTemplateIds: Record<EmailTemplateName, string> = {
  resetPassword: 'd-8c576f003d5c4380aa275a2a6bb4cefb',
  verifyEmail: 'd-bb1da3e98804442db343cf72fab23f0a',
};

export class EmailServiceImpl implements EmailService {
  private readonly config: Config;
  private readonly httpService: HttpService;

  public constructor(httpService: HttpService, config: Config) {
    this.httpService = httpService;
    this.config = config;
  }

  public async sendEmail(payload: SendEmailPayload): Promise<void> {
    const { toEmail, template } = payload;

    const url = 'https://api.sendgrid.com/v3/mail/send';

    const requestBody = {
      from: {
        email: this.config.sendGrid.senderEmail,
      },
      personalizations: [
        {
          dynamic_template_data: template.data,
          to: [
            {
              email: toEmail,
            },
          ],
        },
      ],
      template_id: sendGridTemplateIds[template.name],
    };

    const requestHeaders = {
      [httpHeaders.authorization]: `Bearer ${this.config.sendGrid.apiKey}`,
      [httpHeaders.contentType]: httpMediaTypes.applicationJson,
    };

    await this.httpService.sendRequest({
      body: requestBody,
      headers: requestHeaders,
      method: httpMethodNames.post,
      url,
    });
  }
}
