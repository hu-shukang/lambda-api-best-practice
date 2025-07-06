import { Logger } from '@aws-lambda-powertools/logger';
import { search } from '@aws-lambda-powertools/logger/correlationId';
import { injectLambdaContext } from '@aws-lambda-powertools/logger/middleware';
import { parser } from '@aws-lambda-powertools/parser/middleware';
import middy from '@middy/core';
import httpErrorHandler from '@middy/http-error-handler';
import { APIGatewayProxyResult } from 'aws-lambda';

import { ExtendedAPIGatewayEvent, schema } from './schema';

const logger = new Logger({ serviceName: 'ユーザ一覧取得', correlationIdSearchFn: search });

const functionHandler = async (event: ExtendedAPIGatewayEvent): Promise<APIGatewayProxyResult> => {
  const { name, offset, limit } = event.queryStringParameters;
  logger.info(`name: ${name}, offset: ${offset}, limit: ${limit}`);
  return {
    statusCode: 200,
    body: JSON.stringify({ list: [{ name: 'test' }], count: 1 }),
  };
};

// Wrap the handler with middy and apply the middlewares
export const handler = middy(functionHandler)
  .use(httpErrorHandler())
  .use(injectLambdaContext(logger, { logEvent: true, correlationIdPath: 'requestContext.requestId' }))
  .use(parser({ schema: schema }));
