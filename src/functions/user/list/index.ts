import { Logger } from '@aws-lambda-powertools/logger';
import { search } from '@aws-lambda-powertools/logger/correlationId';
import { injectLambdaContext } from '@aws-lambda-powertools/logger/middleware';
import { parser } from '@aws-lambda-powertools/parser/middleware';
import middy from '@middy/core';

import { httpErrorHandler } from '@/utils/error-handler.util';
import { httpResponseSerializer } from '@/utils/http-response-serializer.util';

import { ExtendedAPIGatewayEvent, schema } from './schema';

const logger = new Logger({ serviceName: 'ユーザ一覧取得', correlationIdSearchFn: search });

const functionHandler = async (event: ExtendedAPIGatewayEvent) => {
  const { name, offset, limit } = event.queryStringParameters;
  logger.info(`name: ${name}, offset: ${offset}, limit: ${limit}`);
  return { list: [{ name: 'test' }], count: 1 };
};

export const handler = middy(functionHandler)
  .use(httpErrorHandler({ logger }))
  .use(parser({ schema: schema }))
  .use(injectLambdaContext(logger, { logEvent: true, correlationIdPath: 'requestContext.requestId' }))
  .use(httpResponseSerializer());
