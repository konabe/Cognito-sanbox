import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as cognito from "aws-cdk-lib/aws-cognito";

export class CognitoSandboxStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const userPool = new cognito.UserPool(this, "UserPool", {
      userPoolName: "cognito-sandbox-user-pool",
      selfSignUpEnabled: true,
      signInAliases: {
        email: true,
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
  }
}
