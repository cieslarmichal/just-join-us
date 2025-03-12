import { type FastifyInstance, type FastifyReply, type FastifyRequest, type FastifySchema } from 'fastify';
import { createWriteStream } from 'node:fs';
import { pipeline } from 'node:stream';
import { promisify } from 'node:util';

import { type HttpController } from '../common/http/httpController.ts';
import { httpHeaders } from '../common/http/httpHeader.ts';
import { httpMediaTypes } from '../common/http/httpMediaType.ts';
import { type AttachedFile } from '../common/http/httpRequest.ts';
import { type HttpRoute, type HttpRouteSchema } from '../common/http/httpRoute.ts';

const streamPipeline = promisify(pipeline);

export interface RegisterControllersPayload {
  readonly controllers: HttpController[];
}

export interface RegisterRoutesPayload {
  readonly routes: HttpRoute[];
  readonly tags: string[];
}

export interface NormalizePathPayload {
  readonly path: string;
}

export class HttpRouter {
  private readonly fastifyServer: FastifyInstance;

  public constructor(fastifyServer: FastifyInstance) {
    this.fastifyServer = fastifyServer;
  }

  public registerControllers(payload: RegisterControllersPayload): void {
    const { controllers } = payload;

    controllers.forEach((controller) => {
      const { tags } = controller;

      const routes = controller.getHttpRoutes();

      this.registerControllerRoutes({
        routes,
        tags,
      });
    });
  }

  private registerControllerRoutes(payload: RegisterRoutesPayload): void {
    const { routes, tags } = payload;

    routes.map((httpRoute) => {
      const { method, path: endpoint, description, preValidation: preValidationHook } = httpRoute;

      const handler = async (fastifyRequest: FastifyRequest, fastifyReply: FastifyReply): Promise<void> => {
        let attachedFiles: AttachedFile[] | undefined;

        if (fastifyRequest.isMultipart()) {
          attachedFiles = [];

          const files = fastifyRequest.files();

          for await (const file of files) {
            const { filename, file: data } = file;

            const filePath = `/tmp/${filename}`;

            const writer = createWriteStream(filePath);

            await streamPipeline(data, writer);

            attachedFiles.push({
              name: filename,
              filePath,
              contentType: file.mimetype,
            });
          }
        }

        const { statusCode, body: responseBody } = await httpRoute.handler({
          body: fastifyRequest.body,
          pathParams: fastifyRequest.params,
          queryParams: fastifyRequest.query,
          headers: fastifyRequest.headers as Record<string, string>,
          files: attachedFiles,
        });

        fastifyReply.status(statusCode);

        if (responseBody) {
          fastifyReply.header(httpHeaders.contentType, httpMediaTypes.applicationJson).send(responseBody);
        } else {
          fastifyReply.send();
        }

        return fastifyReply;
      };

      this.fastifyServer.route({
        method,
        url: endpoint,
        handler,
        schema: {
          description,
          tags,
          ...this.mapToFastifySchema(httpRoute.schema),
        },
        ...(preValidationHook
          ? {
              preValidation: (request, _reply, next): void => {
                preValidationHook(request);

                next();
              },
            }
          : undefined),
      });
    });
  }

  private mapToFastifySchema(routeSchema: HttpRouteSchema): FastifySchema {
    const { pathParams, queryParams, body } = routeSchema.request;

    const fastifySchema: FastifySchema = {};

    if (pathParams) {
      fastifySchema.params = pathParams;
    }

    if (queryParams) {
      fastifySchema.querystring = queryParams;
    }

    if (body) {
      fastifySchema.body = body;
    }

    fastifySchema.response = Object.entries(routeSchema.response).reduce((agg, [statusCode, statusCodeSchema]) => {
      const { schema, description } = statusCodeSchema;

      return {
        ...agg,
        [statusCode]: {
          ...schema,
          description,
        },
      };
    }, {});

    return fastifySchema;
  }
}
