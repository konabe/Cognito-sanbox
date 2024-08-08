import { PostAuthenticationTriggerHandler } from "aws-lambda";
import {
  AdminUpdateUserAttributesCommand,
  CognitoIdentityProvider,
} from "@aws-sdk/client-cognito-identity-provider";
import { Notifier } from "./infrastructure/notifier";

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
  const notifier = new Notifier();
  await notifier.sendEmail(
    event.request.userAttributes.email,
    process.env.EMAIL_SOURCE ?? "",
    "ログインのお知らせ",
    `${event.userName}さんがログイン完了しました。
    見覚えがない場合は速やかにサポートにお問い合わせください。`
  );

  return event;
};
