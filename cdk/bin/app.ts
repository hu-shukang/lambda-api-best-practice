#!/usr/bin/env node
import 'source-map-support/register';

import { App } from 'aws-cdk-lib';
import * as cdk from 'aws-cdk-lib';

import { APIStack } from '../lib/api.stack';
import { Env, contextMap } from './context';

const app = new App();
const env = app.node.tryGetContext('env') as Env;
const context = contextMap.get(env);

if (!context) {
  throw new Error('no context data');
}

const { apiName, fileAssetsBucketName, account, region } = context;

const synthesizer = new cdk.CliCredentialsStackSynthesizer({
  fileAssetsBucketName: fileAssetsBucketName,
  bucketPrefix: `cdk-${apiName}-${env}`,
  qualifier: `cdk-${apiName}-${env}`,
});

new APIStack(app, `${apiName}-api-stack-${env}`, context, {
  env: { account, region },
  synthesizer,
});
