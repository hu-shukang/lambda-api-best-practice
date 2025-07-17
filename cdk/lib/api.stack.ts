import * as cdk from 'aws-cdk-lib';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import { Construct } from 'constructs';

import { Context } from '../bin/context';
import { LambdaFactory } from './utils/lambda.factory';
import { ResourceFactory } from './utils/resource.factory';

export class APIStack extends cdk.Stack {
  constructor(scope: Construct, id: string, context: Context, props?: cdk.StackProps) {
    super(scope, id, props);

    const { apiName, suffix } = context;

    const resourceFactory = ResourceFactory.init(this, context);
    const lambdaFactory = LambdaFactory.init(this, context, resourceFactory);

    const userPostLambda = lambdaFactory.createUserPostLambda();
    const userListLambda = lambdaFactory.createUserListLambda();

    const api = new apigateway.RestApi(this, `${apiName}${suffix}`, {
      restApiName: `${apiName}-api${suffix}`,
    });

    const userResource = api.root.addResource('user');
    userResource.addMethod('POST', new apigateway.LambdaIntegration(userPostLambda));
    userResource.addMethod('GET', new apigateway.LambdaIntegration(userListLambda));
  }
}
