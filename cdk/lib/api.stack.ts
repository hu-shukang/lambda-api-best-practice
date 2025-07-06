import * as cdk from 'aws-cdk-lib';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction, NodejsFunctionProps, OutputFormat } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Construct } from 'constructs';
import path from 'path';

import { Context } from '../bin/context';
import { Utils } from './util';

export class APIStack extends cdk.Stack {
  constructor(scope: Construct, id: string, context: Context, props?: cdk.StackProps) {
    super(scope, id, props);

    const { apiName, suffix } = context;

    const { lambdaAccessRole } = Utils.getRoles(this, context);

    const lambdaCommonProps: NodejsFunctionProps = {
      runtime: lambda.Runtime.NODEJS_22_X,
      role: lambdaAccessRole,
      timeout: cdk.Duration.minutes(15),
      memorySize: 1024,
      handler: 'handler',
      bundling: {
        format: OutputFormat.ESM,
      },
    };

    const userPostLambda = new NodejsFunction(this, `${apiName}-user-post-lambda${suffix}`, {
      ...lambdaCommonProps,
      functionName: `${apiName}-user-post-lambda${suffix}`,
      entry: path.join(__dirname, '../../src/functions/user/post/index.ts'),
    });

    const userListLambda = new NodejsFunction(this, `${apiName}-user-list-lambda${suffix}`, {
      ...lambdaCommonProps,
      functionName: `${apiName}-user-list-lambda${suffix}`,
      entry: path.join(__dirname, '../../src/functions/user/list/index.ts'),
    });

    const api = new apigateway.RestApi(this, `${apiName}${suffix}`, {
      restApiName: `${apiName}-api${suffix}`,
    });

    const userResource = api.root.addResource('user');
    userResource.addMethod('POST', new apigateway.LambdaIntegration(userPostLambda));
    userResource.addMethod('GET', new apigateway.LambdaIntegration(userListLambda));
  }
}
