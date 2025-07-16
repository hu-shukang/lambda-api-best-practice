import { Stack } from 'aws-cdk-lib';
import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as node from 'aws-cdk-lib/aws-lambda-nodejs';
import path from 'path';

import { Context } from '../../bin/context';
import { ResourceFactory } from './resource.factory';

export class LambdaFactory {
  private scope: Stack;
  private context: Context;
  private resourceFactory: ResourceFactory;

  private constructor(scope: Stack, context: Context, resourceFactory: ResourceFactory) {
    this.scope = scope;
    this.context = context;
    this.resourceFactory = resourceFactory;
  }

  static init(scope: Stack, context: Context, resourceFactory: ResourceFactory) {
    return new LambdaFactory(scope, context, resourceFactory);
  }

  private getEnvs() {
    return {
      runtime: lambda.Runtime.NODEJS_22_X,
      role: this.resourceFactory.getLambdaAccessRole(),
      timeout: cdk.Duration.minutes(15),
      memorySize: 1024,
      handler: 'handler',
      bundling: {
        format: node.OutputFormat.CJS,
      },
    } as node.NodejsFunctionProps;
  }

  public createUserPostLambda() {
    const { apiName, suffix } = this.context;
    return new node.NodejsFunction(this.scope, `${apiName}-user-post-lambda${suffix}`, {
      ...this.getEnvs(),
      functionName: `${apiName}-user-post-lambda${suffix}`,
      entry: path.join(__dirname, '../../src/functions/user/post/index.ts'),
    });
  }

  public createUserListLambda() {
    const { apiName, suffix } = this.context;
    return new node.NodejsFunction(this.scope, `${apiName}-user-list-lambda${suffix}`, {
      ...this.getEnvs(),
      functionName: `${apiName}-user-list-lambda${suffix}`,
      entry: path.join(__dirname, '../../src/functions/user/list/index.ts'),
    });
  }
}
