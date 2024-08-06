import { PostAuthenticationTriggerHandler } from "aws-lambda";
import {
  AdminUpdateUserAttributesCommand,
  CognitoIdentityProvider,
} from "@aws-sdk/client-cognito-identity-provider";

const provider = new CognitoIdentityProvider({ region: "ap-northeast-1" });

export const handler: PostAuthenticationTriggerHandler = async (event) => {
  console.log("PostAuthentication event", event);
  // ログイン完了通知

  await provider.send(
    new AdminUpdateUserAttributesCommand({
      UserAttributes: [
        {
          Name: "custom:lastLoginAt",
          Value: Math.floor(Date.now() / 1_000).toString(),
        },
      ],
      UserPoolId: event.userPoolId,
      Username: event.userName,
    })
  );

  return event;
};
