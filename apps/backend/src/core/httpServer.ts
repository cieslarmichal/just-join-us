/* eslint-disable @typescript-eslint/no-explicit-any */

import { fastifyCors } from '@fastify/cors';
import { fastifyHelmet } from '@fastify/helmet';
import { fastifyMultipart } from '@fastify/multipart';
import { fastifySwagger } from '@fastify/swagger';
import { fastifySwaggerUi } from '@fastify/swagger-ui';
import { type TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import { fastify, type FastifyInstance } from 'fastify';
import type { FastifySchemaValidationError } from 'fastify/types/schema.js';

import { type DependencyInjectionContainer } from '../common/dependencyInjection/dependencyInjectionContainer.ts';
import { ForbiddenAccessError } from '../common/errors/forbiddenAccessError.ts';
import { InputNotValidError } from '../common/errors/inputNotValidError.ts';
import { OperationNotValidError } from '../common/errors/operationNotValidError.ts';
import { ResourceAlreadyExistsError } from '../common/errors/resourceAlreadyExistsError.ts';
import { ResourceNotFoundError } from '../common/errors/resourceNotFoundError.ts';
import { serializeError } from '../common/errors/serializeError.ts';
import { UnauthorizedAccessError } from '../common/errors/unathorizedAccessError.ts';
import { type HttpController } from '../common/http/httpController.ts';
import { httpStatusCodes } from '../common/http/httpStatusCode.ts';
import { type LoggerService } from '../common/logger/loggerService.ts';
import type { ApplicationHttpController } from '../modules/applicationModule/api/httpControllers/applicationHttpController/applicationHttpController.ts';
import { applicationSymbols } from '../modules/applicationModule/symbols.ts';
import type { CategoryHttpController } from '../modules/jobOfferModule/api/httpControllers/categoryHttpController/categoryHttpController.ts';
import type { JobOfferHttpController } from '../modules/jobOfferModule/api/httpControllers/jobOfferHttpController/jobOfferHttpController.ts';
import type { SkillHttpController } from '../modules/jobOfferModule/api/httpControllers/skillHttpController/skillHttpController.ts';
import { jobOfferSymbols } from '../modules/jobOfferModule/symbols.ts';
import type { CityHttpController } from '../modules/locationModule/api/httpControllers/cityHttpController/cityHttpController.ts';
import type { LocationHttpController } from '../modules/locationModule/api/httpControllers/locationHttpController/locationHttpController.ts';
import { locationSymbols } from '../modules/locationModule/symbols.ts';
import { type UserHttpController } from '../modules/userModule/api/httpControllers/userHttpController/userHttpController.ts';
import { userSymbols } from '../modules/userModule/symbols.ts';

import { type Config } from './config.ts';
import { HttpRouter } from './httpRouter.ts';

export class HttpServer {
  public readonly fastifyServer: FastifyInstance;
  private readonly httpRouter: HttpRouter;
  private readonly container: DependencyInjectionContainer;
  private readonly loggerService: LoggerService;
  private readonly config: Config;

  public constructor(container: DependencyInjectionContainer) {
    this.container = container;

    this.loggerService = this.container.get<LoggerService>(applicationSymbols.loggerService);

    this.config = container.get<Config>(applicationSymbols.config);

    this.fastifyServer = fastify({ bodyLimit: 10 * 1024 * 1024 }).withTypeProvider<TypeBoxTypeProvider>();

    this.httpRouter = new HttpRouter(this.fastifyServer);
  }

  private getControllers(): HttpController[] {
    return [
      this.container.get<ApplicationHttpController>(applicationSymbols.applicationHttpController),
      this.container.get<UserHttpController>(userSymbols.userHttpController),
      this.container.get<JobOfferHttpController>(jobOfferSymbols.jobOfferHttpController),
      this.container.get<CategoryHttpController>(jobOfferSymbols.categoryHttpController),
      this.container.get<SkillHttpController>(jobOfferSymbols.skillHttpController),
      this.container.get<CityHttpController>(locationSymbols.cityHttpController),
      this.container.get<LocationHttpController>(locationSymbols.locationHttpController),
    ];
  }

  public async start(): Promise<void> {
    const { host, port } = this.config.server;

    this.setupErrorHandler();

    await this.initSwagger();

    await this.fastifyServer.register(fastifyMultipart, {
      limits: {
        fileSize: 1024 * 1024 * 1024 * 4,
      },
    });

    await this.fastifyServer.register(fastifyHelmet);

    await this.fastifyServer.register(fastifyCors, {
      origin: '*',
      methods: '*',
      allowedHeaders: '*',
    });

    this.fastifyServer.addHook('onRequest', (request, _reply, done) => {
      if (request.url.includes('/docs') || request.url.includes('/health')) {
        done();
        return;
      }

      this.loggerService.info({
        message: 'HTTP request received.',
        endpoint: `${request.method} ${request.url}`,
      });

      done();
    });

    this.fastifyServer.addHook('onSend', (request, reply, _payload, done) => {
      if (request.url.includes('/docs') || request.url.includes('/health')) {
        done();
        return;
      }

      this.loggerService.info({
        message: 'HTTP response sent.',
        endpoint: `${request.method} ${request.url}`,
        statusCode: reply.statusCode,
      });

      done();
    });

    this.fastifyServer.setSerializerCompiler(() => {
      return (data): string => JSON.stringify(data);
    });

    this.addRequestPreprocessing();

    this.httpRouter.registerControllers({
      controllers: this.getControllers(),
    });

    await this.fastifyServer.listen({
      port,
      host,
    });

    this.loggerService.info({
      message: 'HTTP Server started.',
      port,
      host,
    });
  }

  public async stop(): Promise<void> {
    await this.fastifyServer.close();

    this.loggerService.info({
      message: 'HTTP Server stopped.',
    });
  }

  private setupErrorHandler(): void {
    this.fastifyServer.setSchemaErrorFormatter((errors, dataVar) => {
      const { instancePath, message } = errors[0] as FastifySchemaValidationError;

      return new InputNotValidError({
        reason: `${dataVar}${instancePath} ${message || 'error'}`,
        value: undefined,
      });
    });

    this.fastifyServer.setErrorHandler((error, request, reply) => {
      const serializedError = serializeError(error);

      this.loggerService.error({
        message: 'Caught an error in HTTP server.',
        endpoint: `${request.method} ${request.url}`,
        error: serializedError,
      });

      const responseError = {
        ...serializedError,
        stack: undefined,
        cause: undefined,
        context: {
          ...(serializedError['context'] ? (serializedError['context'] as Record<string, unknown>) : {}),
          originalError: undefined,
        },
      };

      if (error instanceof InputNotValidError) {
        return reply.status(httpStatusCodes.badRequest).send(responseError);
      }

      if (error instanceof ResourceNotFoundError) {
        return reply.status(httpStatusCodes.notFound).send(responseError);
      }

      if (error instanceof OperationNotValidError) {
        return reply.status(httpStatusCodes.badRequest).send(responseError);
      }

      if (error instanceof ResourceAlreadyExistsError) {
        return reply.status(httpStatusCodes.conflict).send(responseError);
      }

      if (error instanceof UnauthorizedAccessError) {
        return reply.status(httpStatusCodes.unauthorized).send(responseError);
      }

      if (error instanceof ForbiddenAccessError) {
        return reply.status(httpStatusCodes.forbidden).send(responseError);
      }

      return reply.status(httpStatusCodes.internalServerError).send({
        name: 'InternalServerError',
        message: 'Internal server error',
      });
    });
  }

  private async initSwagger(): Promise<void> {
    await this.fastifyServer.register(fastifySwagger, {
      openapi: {
        info: {
          title: 'Backend API',
          version: '1.0.0',
        },
      },
    });

    await this.fastifyServer.register(fastifySwaggerUi, {
      routePrefix: '/docs',
      uiConfig: {
        defaultModelRendering: 'model',
        defaultModelsExpandDepth: 3,
        defaultModelExpandDepth: 3,
      },
      staticCSP: true,
    });
  }

  private addRequestPreprocessing(): void {
    this.fastifyServer.addHook('preValidation', (request, _reply, next) => {
      const body = request.body as Record<string, unknown>;

      this.trimStringProperties(body);

      next();
    });
  }

  private trimStringProperties(obj: Record<string, any>): void {
    for (const key in obj) {
      if (typeof obj[key] === 'string') {
        obj[key] = obj[key].trim();
      } else if (typeof obj[key] === 'object' && obj[key] !== null) {
        if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
          this.trimStringProperties(obj[key] as Record<string, any>);
        }
      }
    }
  }
}
