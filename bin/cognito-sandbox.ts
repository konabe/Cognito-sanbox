#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { CognitoSandboxStack } from "../lib/cognito-sandbox-stack";
import * as dotenv from "dotenv";

dotenv.config();

const app = new cdk.App();
new CognitoSandboxStack(app, "CdkStack", {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: "ap-northeast-1",
  },
});
