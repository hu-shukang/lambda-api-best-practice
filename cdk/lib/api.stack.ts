import * as cdk from 'aws-cdk-lib';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import { Construct } from 'constructs';

import { Context } from '../bin/context';
import { Util } from './utils';

export class APIStack extends cdk.Stack {
  constructor(scope: Construct, id: string, context: Context, props?: cdk.StackProps) {
    super(scope, id, props);

    const { apiName, suffix } = context;
    const util = Util.init(this, context);

    const lambdaFactory = util.getLambdaFactory();
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
