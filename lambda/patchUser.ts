import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { CognitoIdentityProvider } from "@aws-sdk/client-cognito-identity-provider";
import { CognitoClient } from "./infrastructure/cognitoClient";

const provider = new CognitoIdentityProvider({ region: "ap-northeast-1" });

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  console.log("PatchUser event", event);
  console.log(
    "requestContext.authorizer",
    (event.requestContext as any).authorizer.claims
  );

  const requestBody = JSON.parse(event.body ?? "{}");
  const enabledMFA = requestBody.enabledMFA;

  const authorizerClaims = (event.requestContext as any).authorizer.claims;
  const userPoolID = authorizerClaims.iss.split("/")[3];
  const cognitoClient = new CognitoClient(
    userPoolID,
    authorizerClaims["cognito:username"]
  );
  await cognitoClient.updateUserAttributes([
    {
      Name: "custom:enabledMFA",
      Value: `${enabledMFA}`,
    },
  ]);

  return {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "OPTIONS,PATCH",
    },
    body: JSON.stringify({
      enabledMFA,
    }),
  };
};
