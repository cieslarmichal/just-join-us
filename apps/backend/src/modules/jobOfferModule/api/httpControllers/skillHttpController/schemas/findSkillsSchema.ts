import { type Static, Type } from '@sinclair/typebox';

import { type HttpRouteSchema } from '../../../../../../common/http/httpRoute.ts';
import { httpStatusCodes } from '../../../../../../common/http/httpStatusCode.ts';

import { skillSchema } from './skillSchema.ts';

export const findSkillsQueryParamsSchema = Type.Object({
  name: Type.Optional(Type.String({ minLength: 1 })),
  page: Type.Optional(Type.Integer({ minimum: 1 })),
  pageSize: Type.Optional(Type.Integer({ minimum: 1 })),
});

export type FindSkillsQueryParams = Static<typeof findSkillsQueryParamsSchema>;

const findSkillsResponseBodySchema = Type.Object({
  data: Type.Array(skillSchema),
  metadata: Type.Object({
    page: Type.Integer({ minimum: 1 }),
    pageSize: Type.Integer({ minimum: 1 }),
    total: Type.Integer({ minimum: 0 }),
  }),
});

export type FindSkillsResponseBody = Static<typeof findSkillsResponseBodySchema>;

export const findSkillsSchema = {
  request: {
    queryParams: findSkillsQueryParamsSchema,
  },
  response: {
    [httpStatusCodes.ok]: {
      schema: findSkillsResponseBodySchema,
      description: 'Skills found',
    },
  },
} satisfies HttpRouteSchema;
