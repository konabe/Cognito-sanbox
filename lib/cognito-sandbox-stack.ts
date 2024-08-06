import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as iam from "aws-cdk-lib/aws-iam";
import * as cognito from "aws-cdk-lib/aws-cognito";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as lambda_nodejs from "aws-cdk-lib/aws-lambda-nodejs";
import path = require("path");

export class CognitoSandboxStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const defineAuthChallengeFunction = new lambda_nodejs.NodejsFunction(
      this,
      "DefineAuthChallengeFunction",
      {
        functionName: "cognito-sandbox-define-auth-challenge",
        entry: path.join(__dirname, "../lambda/defineAuthChallenge.ts"),
        runtime: lambda.Runtime.NODEJS_20_X,
        handler: "handler",
      }
    );

    const userPool = new cognito.UserPool(this, "UserPool", {
      userPoolName: "cognito-sandbox-user-pool",
      selfSignUpEnabled: true,
      signInAliases: {
        email: true,
      },
      lambdaTriggers: {
        defineAuthChallenge: defineAuthChallengeFunction,
      },
      deletionProtection: false, // 実験的な物なので削除可
    });
    const userPoolClient = new cognito.UserPoolClient(this, "UserPoolClient", {
      userPool,
      userPoolClientName: "cognito-sandbox-user-pool-client",
      authFlows: {
        adminUserPassword: true,
        custom: true,
        userPassword: true,
        userSrp: true,
      },
      authSessionValidity: cdk.Duration.minutes(3),
      accessTokenValidity: cdk.Duration.minutes(5),
      refreshTokenValidity: cdk.Duration.minutes(60),
      idTokenValidity: cdk.Duration.minutes(20),
      preventUserExistenceErrors: true,
    });

    const identityPool = new cognito.CfnIdentityPool(this, "IdentityPool", {
      identityPoolName: "cognito-sandbox-identity-pool",
      allowUnauthenticatedIdentities: true,
      cognitoIdentityProviders: [
        {
          clientId: userPoolClient.userPoolClientId,
          providerName: userPool.userPoolProviderName,
        },
      ],
    });
    const authenticatedPolicyDocument = new iam.PolicyDocument({
      statements: [
        new iam.PolicyStatement({
          effect: iam.Effect.ALLOW,
          actions: ["cognito-sync:*", "cognito-identity:*"],
          resources: ["*"],
        }),
      ],
    });

    const unauthenticatedPolicyDocument = new iam.PolicyDocument({
      statements: [
        new iam.PolicyStatement({
          effect: iam.Effect.ALLOW,
          actions: ["cognito-sync:*"],
          resources: ["*"],
        }),
      ],
    });
    const authenticatedRole = new iam.Role(this, "authRole", {
      roleName: "cognito-sandbox-auth-role",
      assumedBy: new iam.FederatedPrincipal(
        "cognito-identity.amazonaws.com",
        {
          StringEquals: {
            "cognito-identity.amazonaws.com:aud": identityPool.ref,
          },
          "ForAnyValue:StringLike": {
            "cognito-identity.amazonaws.com:amr": "authenticated",
          },
        },
        "sts:AssumeRoleWithWebIdentity"
      ),
      inlinePolicies: { policy: authenticatedPolicyDocument },
    });

    const unauthenticatedRole = new iam.Role(this, "unauthRole", {
      roleName: "cognito-sandbox-unauth-role",
      assumedBy: new iam.FederatedPrincipal(
        "cognito-identity.amazonaws.com",
        {
          StringEquals: {
            "cognito-identity.amazonaws.com:aud": identityPool.ref,
          },
          "ForAnyValue:StringLike": {
            "cognito-identity.amazonaws.com:amr": "unauthenticated",
          },
        },
        "sts:AssumeRoleWithWebIdentity"
      ),
      inlinePolicies: { policy: unauthenticatedPolicyDocument },
    });

    new cognito.CfnIdentityPoolRoleAttachment(this, "roleAttachment", {
      identityPoolId: identityPool.ref,
      roles: {
        authenticated: authenticatedRole.roleArn,
        unauthenticated: unauthenticatedRole.roleArn,
      },
    });
  }
}
