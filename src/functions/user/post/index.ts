import { Logger } from '@aws-lambda-powertools/logger';
import { search } from '@aws-lambda-powertools/logger/correlationId';
import { injectLambdaContext } from '@aws-lambda-powertools/logger/middleware';
import { parser } from '@aws-lambda-powertools/parser/middleware';
import middy from '@middy/core';

import { httpErrorHandler } from '@/utils/error-handler.util';
import { httpResponseSerializer } from '@/utils/http-response-serializer.util';

import { ExtendedAPIGatewayEvent, schema } from './schema';

const logger = new Logger({ serviceName: 'ユーザ登録', correlationIdSearchFn: search });

const functionHandler = async (event: ExtendedAPIGatewayEvent) => {
  const { age, name } = event.body;
  logger.info(`name: ${name}, age: ${age}`);
  return { message: 'success' };
};

export const handler = middy(functionHandler)
  .use(httpErrorHandler({ logger }))
  .use(parser({ schema: schema }))
  .use(injectLambdaContext(logger, { logEvent: true, correlationIdPath: 'requestContext.requestId' }))
  .use(httpResponseSerializer());
