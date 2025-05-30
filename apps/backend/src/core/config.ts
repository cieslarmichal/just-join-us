import { type Static, Type } from '@sinclair/typebox';
import { TransformDecodeCheckError, Value } from '@sinclair/typebox/value';
import config from 'config';

import { ConfigurationError } from '../common/errors/configurationError.ts';
import { type LogLevel, logLevels } from '../common/logger/logLevel.ts';
import { type AwsRegion, awsRegions } from '../common/types/awsRegion.ts';

const configSchema = Type.Object({
  admin: Type.Object({
    email: Type.String({ minLength: 1 }),
    password: Type.String({ minLength: 1 }),
  }),
  aws: Type.Object({
    accessKeyId: Type.String({ minLength: 1 }),
    secretAccessKey: Type.String({ minLength: 1 }),
    region: Type.Union([...Object.values(awsRegions).map((role) => Type.Literal(role as AwsRegion))]),
    endpoint: Type.Optional(Type.String({ minLength: 1 })),
    bucketName: Type.String({ minLength: 1 }),
    cloudfrontUrl: Type.String({ minLength: 1 }),
  }),
  database: Type.Object({
    host: Type.String({ minLength: 1 }),
    port: Type.Number({
      minimum: 1,
      maximum: 65535,
    }),
    username: Type.String({ minLength: 1 }),
    password: Type.String({ minLength: 1 }),
    name: Type.String({ minLength: 1 }),
  }),
  frontendUrl: Type.String({ minLength: 1 }),
  hashSaltRounds: Type.Number({
    minimum: 5,
    maximum: 12,
  }),
  logLevel: Type.Union([...Object.values(logLevels).map((role) => Type.Literal(role as LogLevel))]),
  token: Type.Object({
    secret: Type.String({ minLength: 1 }),
    access: Type.Object({
      expiresIn: Type.Number({ minimum: 3600 }),
    }),
    refresh: Type.Object({
      expiresIn: Type.Number({ minimum: 86400 }),
    }),
    emailVerification: Type.Object({
      expiresIn: Type.Number({ minimum: 3600 }),
    }),
    resetPassword: Type.Object({
      expiresIn: Type.Number({ minimum: 1800 }),
    }),
  }),
  sendGrid: Type.Object({
    apiKey: Type.String({ minLength: 1 }),
    senderEmail: Type.String({ minLength: 1 }),
  }),
  server: Type.Object({
    host: Type.String({ minLength: 1 }),
    port: Type.Number({
      minimum: 1,
      maximum: 65535,
    }),
  }),
});

export type Config = Static<typeof configSchema>;

export function createConfig(): Config {
  try {
    return Value.Decode(configSchema, config);
  } catch (error) {
    if (error instanceof TransformDecodeCheckError) {
      throw new ConfigurationError({ originalError: error });
    }

    throw error;
  }
}
