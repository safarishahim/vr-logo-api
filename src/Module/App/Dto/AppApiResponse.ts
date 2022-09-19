import { applyDecorators, Type } from '@nestjs/common';
import { ApiOkResponse, getSchemaPath } from '@nestjs/swagger';

export const AppApiResponse = <
  TModel extends Type<any>,
  TMeta extends Type<any>,
>(
  model: TModel,
  meta: TMeta = undefined,
) => {
  return applyDecorators(
    ApiOkResponse({
      schema: {
        allOf: [
          {
            properties: {
              data: {
                type: 'object',
                allOf: [{ $ref: getSchemaPath(model) }],
              },
              meta: {
                type: 'object',
                allOf: [{ $ref: getSchemaPath(meta) }],
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
