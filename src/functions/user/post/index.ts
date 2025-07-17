import { Logger } from '@aws-lambda-powertools/logger';
import { search } from '@aws-lambda-powertools/logger/correlationId';
import { injectLambdaContext } from '@aws-lambda-powertools/logger/middleware';
import { parser } from '@aws-lambda-powertools/parser/middleware';
import middy from '@middy/core';
import { APIGatewayProxyResult } from 'aws-lambda';

import { httpErrorHandler } from '@/utils/error-handler.util';

import { ExtendedAPIGatewayEvent, schema } from './schema';

const logger = new Logger({ serviceName: 'ユーザ登録', correlationIdSearchFn: search });

const functionHandler = async (event: ExtendedAPIGatewayEvent): Promise<APIGatewayProxyResult> => {
  const { age, name } = event.body;
  logger.info(`name: ${name}, age: ${age}`);
  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'success' }),
  };
};

// Wrap the handler with middy and apply the middlewares
export const handler = middy(functionHandler)
  .use(httpErrorHandler({ logger }))
  .use(injectLambdaContext(logger, { logEvent: true, correlationIdPath: 'requestContext.requestId' }))
  .use(parser({ schema: schema }));
