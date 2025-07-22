import { Logger } from '@aws-lambda-powertools/logger';
import { RDSData } from '@aws-sdk/client-rds-data';
import { CamelCasePlugin, Kysely, ParseJSONResultsPlugin } from 'kysely';
import { DataApiDialect } from 'kysely-data-api';

import { Database } from './types';

const dataApi = new DataApiDialect({
  mode: 'mysql',
  driver: {
    client: new RDSData({}),
    database: '<database name>',
    secretArn: '<arn of secret containing credentials',
    resourceArn: '<arn of database>',
  },
});

export const createKysely = (logger: Logger) => {
  return new Kysely<Database>({
    dialect: dataApi,
    log(event): void {
      logger.info(`SQL: ${event.query.sql.split('\n').join(' ').replace(/\s+/g, ' ')}`);
      logger.info(`Parameters: ${JSON.stringify(event.query.parameters)}`);
      logger.info(`Duration: ${event.queryDurationMillis.toFixed(0)} ms`);
    },
    plugins: [new CamelCasePlugin(), new ParseJSONResultsPlugin()],
  });
};
