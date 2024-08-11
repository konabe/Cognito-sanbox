import { PostAuthenticationTriggerHandler } from "aws-lambda";
import { CognitoIdentityProvider } from "@aws-sdk/client-cognito-identity-provider";
import { Notifier } from "./infrastructure/notifier";
import { CognitoClient } from "./infrastructure/cognitoClient";

const provider = new CognitoIdentityProvider({ region: "ap-northeast-1" });

export const handler: PostAuthenticationTriggerHandler = async (event) => {
  console.log("PostAuthentication event", event);

  const cognitoClient = new CognitoClient(event.userPoolId, event.userName);
  await cognitoClient.updateUserAttributes([
    {
      Name: "custom:enabledMFA",
      Value: "false",
    },
  ]);
  const notifier = new Notifier(process.env.EMAIL_SOURCE ?? "");
  await notifier.sendEmail(
    event.request.userAttributes.email,
    "ログインのお知らせ",
    `${event.userName}さんがログイン完了しました。
    見覚えがない場合は速やかにサポートにお問い合わせください。`
  );

  return event;
};
