import { Stack } from 'aws-cdk-lib';
import { Role } from 'aws-cdk-lib/aws-iam';
import { Bucket } from 'aws-cdk-lib/aws-s3';

import { Context } from '../bin/context';

const getRoles = (stack: Stack, context: Context) => {
  const { apiName, env } = context;
  const lambdaAccessRole = Role.fromRoleArn(
    stack,
    `${apiName}-lambda-access-role-${env}`,
    context.lambdaAccessRoleArn,
    {
      mutable: true,
    },
  );

  const codepipelineRole = Role.fromRoleArn(stack, `${apiName}-codepipeline-role-${env}`, context.codePipelineRoleArn, {
    mutable: true,
  });

  const eventBridgeRole = Role.fromRoleArn(stack, `${apiName}-eventbridge-role-${env}`, context.eventBridgeRoleArn, {
    mutable: true,
  });

  return {
    lambdaAccessRole,
    codepipelineRole,
    eventBridgeRole,
  };
};

const getBuckets = (stack: Stack, context: Context) => {
  const { apiName, env } = context;

  const fileAssetsBucket = Bucket.fromBucketName(
    stack,
    `${apiName}-file-assets-bucket-${env}`,
    context.fileAssetsBucketName,
  );

  return {
    fileAssetsBucket,
  };
};

export const Utils = {
  getRoles,
  getBuckets,
};
