import { Stack } from 'aws-cdk-lib';
import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as node from 'aws-cdk-lib/aws-lambda-nodejs';
import * as logs from 'aws-cdk-lib/aws-logs';
import path from 'path';

import { Context } from '../../bin/context';
import { Util } from './index';

export class LambdaFactory {
  private scope: Stack;
  private context: Context;
  private util: Util;

  private constructor(scope: Stack, context: Context, util: Util) {
    this.scope = scope;
    this.context = context;
    this.util = util;
  }

  static init(scope: Stack, context: Context, util: Util) {
    return new LambdaFactory(scope, context, util);
  }

  private createFunction(id: string, entry: string): node.NodejsFunction {
    const { apiName, suffix } = this.context;
    const functionName = `${apiName}-${id}${suffix}`;

    const logGroup = new logs.LogGroup(this.scope, `${id}-log-group`, {
      logGroupName: `/aws/lambda/${functionName}`,
      retention: logs.RetentionDays.ONE_MONTH,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    return new node.NodejsFunction(this.scope, functionName, {
      functionName: functionName,
      entry: path.join(__dirname, entry),
      logGroup,
      runtime: lambda.Runtime.NODEJS_22_X,
      role: this.util.getLambdaAccessRole(),
      timeout: cdk.Duration.minutes(15),
      memorySize: 1024,
      handler: 'handler',
      bundling: {
        format: node.OutputFormat.CJS,
      },
    });
  }

  public createUserPostLambda() {
    return this.createFunction('user-post-lambda', '../../src/functions/user/post/index.ts');
  }

  public createUserListLambda() {
    return this.createFunction('user-list-lambda', '../../src/functions/user/list/index.ts');
  }
}
