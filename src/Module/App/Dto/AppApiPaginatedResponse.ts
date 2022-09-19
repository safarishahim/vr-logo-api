import { applyDecorators, Type } from '@nestjs/common';
import { ApiOkResponse, getSchemaPath } from '@nestjs/swagger';
import { PaginatedDto } from './PaginatedDto';

export const AppApiPaginatedResponse = <TModel extends Type<any>>(
  model: TModel,
) => {
  return applyDecorators(
    ApiOkResponse({
      schema: {
        allOf: [
          {
            properties: {
              results: {
                type: 'array',
                items: { $ref: getSchemaPath(model) },
              },
              meta: {
                type: 'object',
                allOf: [{ $ref: getSchemaPath(PaginatedDto) }],
              },
              links: {
                type: 'object',
                properties: {
                  first: {
                    type: 'string',
                  },
                  previous: {
                    type: 'string',
                  },
                  current: {
                    type: 'string',
                  },
                  next: {
                    type: 'string',
                  },
                  last: {
                    type: 'string',
                  },
                },
              },
              statusCode: {
                type: 'string',
              },
              error: {
                type: 'string',
              },
            },
          },
        ],
      },
    }),
  );
};
