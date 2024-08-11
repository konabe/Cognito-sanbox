import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as iam from "aws-cdk-lib/aws-iam";
import * as cognito from "aws-cdk-lib/aws-cognito";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as lambda_nodejs from "aws-cdk-lib/aws-lambda-nodejs";
import * as api_gateway from "aws-cdk-lib/aws-apigateway";
import path = require("path");
import { create } from "domain";

const createName = (name: string) => `cognito-sandbox-${name}`;

export class CognitoSandboxStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const lambdaRole = new iam.Role(this, "LambdaRole", {
      roleName: createName("lambda-role"),
      assumedBy: new iam.ServicePrincipal("lambda.amazonaws.com"),
      inlinePolicies: {
        policy: new iam.PolicyDocument({
          statements: [
            new iam.PolicyStatement({
              effect: iam.Effect.ALLOW,
              actions: [
                "logs:CreateLogGroup",
                "logs:CreateLogStream",
                "logs:PutLogEvents",
                "cognito-idp:AdminUpdateUserAttributes",
                "ses:SendEmail",
              ],
              resources: ["*"],
            }),
          ],
        }),
      },
    });
    const lambdaCommonProps: cdk.aws_lambda_nodejs.NodejsFunctionProps = {
      runtime: lambda.Runtime.NODEJS_20_X,
      handler: "handler",
      role: lambdaRole,
      environment: {
        EMAIL_SOURCE: process.env.EMAIL_SOURCE ?? "",
      },
    };
    const defineAuthChallengeFunction = new lambda_nodejs.NodejsFunction(
      this,
      "DefineAuthChallengeFunction",
      {
        ...lambdaCommonProps,
        functionName: createName("define-auth-challenge"),
        entry: path.join(__dirname, "../lambda/defineAuthChallenge.ts"),
      }
    );
    const createAuthChallengeFunction = new lambda_nodejs.NodejsFunction(
      this,
      "CreateAuthChallengeFunction",
      {
        ...lambdaCommonProps,
        functionName: createName("create-auth-challenge"),
        entry: path.join(__dirname, "../lambda/createAuthChallenge.ts"),
      }
    );
    const verifyAuthChallengeResponseFunction =
      new lambda_nodejs.NodejsFunction(
        this,
        "VerifyAuthChallengeresponseFunction",
        {
          ...lambdaCommonProps,
          functionName: createName("verify-auth-challenge-response"),
          entry: path.join(
            __dirname,
            "../lambda/verifyAuthChallengeRepsonse.ts"
          ),
        }
      );
    const postAuthenticationFunction = new lambda_nodejs.NodejsFunction(
      this,
      "PostAuthenticationFunction",
      {
        ...lambdaCommonProps,
        functionName: createName("post-authentication"),
        entry: path.join(__dirname, "../lambda/postAuthentication.ts"),
      }
    );
    const preAuthenticationFunction = new lambda_nodejs.NodejsFunction(
      this,
      "PreAuthenticationFunction",
      {
        ...lambdaCommonProps,
        functionName: createName("pre-authentication"),
        entry: path.join(__dirname, "../lambda/preAuthentication.ts"),
      }
    );
    const patchUserFunction = new lambda_nodejs.NodejsFunction(
      this,
      "PatchUserFunction",
      {
        ...lambdaCommonProps,
        functionName: createName("patch-user"),
        entry: path.join(__dirname, "../lambda/patchUser.ts"),
      }
    );

    const userPool = new cognito.UserPool(this, "UserPool", {
      userPoolName: createName("user-pool"),
      selfSignUpEnabled: true,
      signInAliases: {
        email: true,
      },
      lambdaTriggers: {
        defineAuthChallenge: defineAuthChallengeFunction,
        createAuthChallenge: createAuthChallengeFunction,
        verifyAuthChallengeResponse: verifyAuthChallengeResponseFunction,
        preAuthentication: preAuthenticationFunction,
        postAuthentication: postAuthenticationFunction,
      },
      customAttributes: {
        enabledMFA: new cognito.BooleanAttribute({ mutable: true }),
        lastLoginAt: new cognito.NumberAttribute({ mutable: true }),
      },
      deletionProtection: false, // 実験的な物なので削除可
    });
    const userPoolClient = new cognito.UserPoolClient(this, "UserPoolClient", {
      userPool,
      userPoolClientName: createName("user-pool-client"),
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
      preventUserExistenceErrors: false, // 学習のためエラーの詳細がわかるようにする。
    });
    const identityPool = new cognito.CfnIdentityPool(this, "IdentityPool", {
      identityPoolName: createName("identity-pool"),
      allowUnauthenticatedIdentities: true,
      cognitoIdentityProviders: [
        {
          clientId: userPoolClient.userPoolClientId,
          providerName: userPool.userPoolProviderName,
        },
      ],
    });

    const assumedBy = new iam.FederatedPrincipal(
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
    );
    const authenticatedRole = new iam.Role(this, "authRole", {
      roleName: createName("auth-role"),
      assumedBy,
      inlinePolicies: {
        policy: new iam.PolicyDocument({
          statements: [
            new iam.PolicyStatement({
              effect: iam.Effect.ALLOW,
              actions: ["cognito-sync:*", "cognito-identity:*"],
              resources: ["*"],
            }),
          ],
        }),
      },
    });
    const unauthenticatedRole = new iam.Role(this, "unauthRole", {
      roleName: createName("unauth-role"),
      assumedBy,
      inlinePolicies: {
        policy: new iam.PolicyDocument({
          statements: [
            new iam.PolicyStatement({
              effect: iam.Effect.ALLOW,
              actions: ["cognito-sync:*"],
              resources: ["*"],
            }),
          ],
        }),
      },
    });
    new cognito.CfnIdentityPoolRoleAttachment(this, "roleAttachment", {
      identityPoolId: identityPool.ref,
      roles: {
        authenticated: authenticatedRole.roleArn,
        unauthenticated: unauthenticatedRole.roleArn,
      },
    });

    const cognitoAuthorizer = new api_gateway.CognitoUserPoolsAuthorizer(
      this,
      createName("cognito-authorizer"),
      {
        cognitoUserPools: [userPool],
      }
    );
    const apiGateWayRestAPI = new api_gateway.RestApi(this, "ApiGateway", {
      restApiName: createName("api-gateway"),
      deployOptions: { stageName: "v1" },
      defaultCorsPreflightOptions: {
        allowOrigins: api_gateway.Cors.ALL_ORIGINS,
        allowMethods: api_gateway.Cors.ALL_METHODS,
        allowHeaders: api_gateway.Cors.DEFAULT_HEADERS,
        statusCode: 200,
      },
    });
    apiGateWayRestAPI.root
      .addResource("user")
      .addMethod(
        "PATCH",
        new api_gateway.LambdaIntegration(patchUserFunction),
        { authorizer: cognitoAuthorizer }
      );
  }
}
