export const httpMediaTypes = {
  applicationJson: 'application/json',
  textXml: 'text/xml',
  textCsv: 'text/csv',
  textPlain: 'text/plain',
  textHtml: 'text/html',
} as const;

export type HttpMediaType = (typeof httpMediaTypes)[keyof typeof httpMediaTypes];
