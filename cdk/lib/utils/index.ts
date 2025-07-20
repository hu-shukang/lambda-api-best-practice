import { IResource, Stack } from 'aws-cdk-lib';
import { Role } from 'aws-cdk-lib/aws-iam';
import { Bucket } from 'aws-cdk-lib/aws-s3';

import { Context } from '../../bin/context';
import { LambdaFactory } from './lambda.factory';

export class Util {
  private scope: Stack;
  private context: Context;
  private cache: Map<string, IResource>;

  private constructor(scope: Stack, context: Context) {
    this.scope = scope;
    this.context = context;
    this.cache = new Map<string, IResource>();
  }

  static init(scope: Stack, context: Context) {
    return new Util(scope, context);
  }

  private getFromCache<T extends IResource>(key: string, func: () => T): T {
    const resource = this.cache.get(key);
    if (resource) {
      return resource as T;
    }

    const newResource = func();
    this.cache.set(key, newResource);
    return newResource;
  }

  public getLambdaFactory() {
    return LambdaFactory.init(this.scope, this.context, this);
  }

  public getCodePipelineRole() {
    const { apiName, suffix, codePipelineRoleArn } = this.context;
    return this.getFromCache(codePipelineRoleArn, () => {
      return Role.fromRoleArn(this.scope, `${apiName}-codepipeline-role${suffix}`, codePipelineRoleArn, {
        mutable: true,
      });
    });
  }

  public getEventBridgeRole() {
    const { apiName, suffix, eventBridgeRoleArn } = this.context;

    return this.getFromCache(eventBridgeRoleArn, () => {
      return Role.fromRoleArn(this.scope, `${apiName}-eventbridge-role${suffix}`, eventBridgeRoleArn, {
        mutable: true,
      });
    });
  }

  public getLambdaAccessRole() {
    const { apiName, suffix, lambdaAccessRoleArn } = this.context;
    return this.getFromCache(lambdaAccessRoleArn, () => {
      return Role.fromRoleArn(this.scope, `${apiName}-lambda-access-role${suffix}`, lambdaAccessRoleArn, {
        mutable: true,
      });
    });
  }

  public getFileAssetsBucket() {
    const { apiName, suffix, fileAssetsBucketName } = this.context;
    return this.getFromCache(fileAssetsBucketName, () => {
      return Bucket.fromBucketName(this.scope, `${apiName}-file-assets-bucket${suffix}`, fileAssetsBucketName);
    });
  }
}
