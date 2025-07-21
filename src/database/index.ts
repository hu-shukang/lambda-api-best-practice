import { RDSData } from '@aws-sdk/client-rds-data';
import { Kysely } from 'kysely';
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

export const db = new Kysely<Database>({ dialect: dataApi });
