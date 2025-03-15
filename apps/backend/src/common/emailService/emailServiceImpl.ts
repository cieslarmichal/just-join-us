import type { Config } from '../../core/config.ts';
import { httpHeaders } from '../http/httpHeader.ts';
import { httpMediaTypes } from '../http/httpMediaType.ts';
import { httpMethodNames } from '../http/httpMethodName.ts';
import type { HttpService } from '../httpService/httpService.ts';

import type { EmailService, EmailTemplateName, SendEmailPayload } from './emailService.ts';

const sendGridTemplateIds: Record<EmailTemplateName, string> = {
  resetPassword: 'd-eef3b04a8e254db68d6ad5fe2a6ec1fe',
  verifyEmail: 'd-0ba737dc1c6a4105bd13dfc7db601a95',
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
