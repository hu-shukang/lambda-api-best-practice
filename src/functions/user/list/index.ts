import { Logger } from '@aws-lambda-powertools/logger';
import { search } from '@aws-lambda-powertools/logger/correlationId';
import { injectLambdaContext } from '@aws-lambda-powertools/logger/middleware';
import { parser } from '@aws-lambda-powertools/parser/middleware';
import middy from '@middy/core';
import { SelectQueryBuilder } from 'kysely';

import { db } from '@/database';
import { Database } from '@/database/types';
import { httpErrorHandler } from '@/utils/error-handler.util';
import { httpResponseSerializer } from '@/utils/http-response-serializer.util';

import { ExtendedAPIGatewayEvent, schema } from './schema';

const logger = new Logger({ serviceName: 'ユーザ一覧取得', correlationIdSearchFn: search });

type Query = SelectQueryBuilder<Database, 'userTbl', unknown>;

const queryUser = async <T>(event: ExtendedAPIGatewayEvent, callback: (query: Query) => Promise<T>) => {
  const { name, email, address } = event.queryStringParameters;
  let query = db.selectFrom('userTbl');
  if (name) {
    query = query.where('name', 'like', `%${name}%`);
  }
  if (email) {
    query = query.where('email', 'like', `%${email}%`);
  }
  if (address) {
    query = query.where('address', 'like', `%${address}%`);
  }
  query = query.orderBy('createdAt', 'desc');
  return await callback(query);
};

const functionHandler = async (event: ExtendedAPIGatewayEvent) => {
  const { limit, offset } = event.queryStringParameters;

  const getCountCallback = (query: Query) =>
    query.select((eb) => eb.fn.count('id').as('count')).executeTakeFirstOrThrow();

  const getListCallback = (query: Query) => query.selectAll().limit(limit).offset(offset).execute();

  const [count, list] = await Promise.all([queryUser(event, getCountCallback), queryUser(event, getListCallback)]);

  return { list: list, count: count.count };
};

export const handler = middy(functionHandler)
  .use(httpErrorHandler({ logger }))
  .use(parser({ schema: schema }))
  .use(injectLambdaContext(logger, { logEvent: true, correlationIdPath: 'requestContext.requestId' }))
  .use(httpResponseSerializer());
