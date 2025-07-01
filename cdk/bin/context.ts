export type Env = 'it' | 'st' | 'prod';

export type CommonContext = {
  apiName: string;
  region: string;
  codeCommitRepositoryName: string;
  buildSpecFileName: string;
  codePipelineRoleArn: string;
  eventBridgeRoleArn: string;
  lambdaAccessRoleArn: string;
};

export type SpecialContext = {
  account: string;
  env: Env;
  suffix: string;
  branch: string;
  fileAssetsBucketName: string;
};

export type Context = SpecialContext & CommonContext;

export type Option = SpecialContext & Partial<CommonContext>;

const generateContext = (option: Option): Context => {
  return {
    apiName: 'bp',
    region: 'ap-northeast-1',
    codeCommitRepositoryName: 'lambda-api-best-practice',
    buildSpecFileName: 'buildspec.yml',
    codePipelineRoleArn: `arn:aws:iam::${option.account}:role/CodePipelineRole`,
    eventBridgeRoleArn: `arn:aws:iam::${option.account}:role/EventBridgeForCodePipelineRole`,
    lambdaAccessRoleArn: `arn:aws:iam::${option.account}:role/LambdaAccessRole`,
    ...option,
  };
};

export const itContext = generateContext({
  account: '471112651100',
  env: 'it',
  suffix: '-it',
  branch: 'it',
  fileAssetsBucketName: 'hsk-work',
});

export const stContext = generateContext({
  account: '471112651100',
  env: 'st',
  suffix: '-st',
  branch: 'st',
  fileAssetsBucketName: 'hsk-work',
});

export const prodContext = generateContext({
  account: '471112651100',
  env: 'prod',
  suffix: '',
  branch: 'main',
  fileAssetsBucketName: 'hsk-work',
});

export const contextMap = new Map<Env, Context>([
  ['it', itContext],
  ['st', stContext],
  ['prod', prodContext],
]);
