import * as cdk from 'aws-cdk-lib';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { Construct } from 'constructs';
import path from 'path';

import { Context } from '../bin/context';
import { Utils } from './util';

export class APIStack extends cdk.Stack {
  constructor(scope: Construct, id: string, context: Context, props?: cdk.StackProps) {
    super(scope, id, props);

    const { apiName, suffix } = context;

    const { lambdaAccessRole } = Utils.getRoles(this, context);

    const commonLayer = new lambda.LayerVersion(this, `${apiName}-common-layer${suffix}`, {
      layerVersionName: `${apiName}-common-layer${suffix}`,
      compatibleRuntimes: [lambda.Runtime.NODEJS_22_X],
      code: lambda.Code.fromAsset(path.join(__dirname, '../../src/layers/common-layer')),
    });

    const lambdaCommonProps: Omit<lambda.FunctionProps, 'code'> = {
      runtime: lambda.Runtime.NODEJS_22_X,
      layers: [commonLayer],
      role: lambdaAccessRole,
      timeout: cdk.Duration.minutes(15),
      memorySize: 1024,
      handler: 'index.handler',
    };

    const userPostLambda = new lambda.Function(this, `${apiName}-user-post-lambda${suffix}`, {
      ...lambdaCommonProps,
      functionName: `${apiName}-user-post-lambda${suffix}`,
      code: lambda.Code.fromAsset(path.join(__dirname, '../../src/functions/user/post')),
    });

    const userListLambda = new lambda.Function(this, `${apiName}-user-list-lambda${suffix}`, {
      ...lambdaCommonProps,
      functionName: `${apiName}-user-list-lambda${suffix}`,
      code: lambda.Code.fromAsset(path.join(__dirname, '../../src/functions/user/list')),
    });

    const api = new apigateway.RestApi(this, `${apiName}${suffix}`, {
      restApiName: `${apiName}-api${suffix}`,
    });

    const userResource = api.root.addResource('user');
    userResource.addMethod('POST', new apigateway.LambdaIntegration(userPostLambda));
    userResource.addMethod('GET', new apigateway.LambdaIntegration(userListLambda));
  }
}
