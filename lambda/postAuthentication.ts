import { PostAuthenticationTriggerHandler } from "aws-lambda";
import {
  AdminUpdateUserAttributesCommand,
  CognitoIdentityProvider,
} from "@aws-sdk/client-cognito-identity-provider";
import { SES, SendEmailCommand } from "@aws-sdk/client-ses";

const provider = new CognitoIdentityProvider({ region: "ap-northeast-1" });
const ses = new SES({ region: "ap-northeast-1" });

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
  await ses.send(
    new SendEmailCommand({
      Destination: {
        ToAddresses: [event.request.userAttributes.email],
      },
      Message: {
        Subject: {
          Charset: "UTF-8",
          Data: "ログインのお知らせ",
        },
        Body: {
          Text: {
            Charset: "UTF-8",
            Data: `${event.userName}さんがログイン完了しました。
            見覚えがない場合は速やかにサポートにお問い合わせください。`,
          },
        },
      },
      Source: process.env.EMAIL_SOURCE,
    })
  );

  return event;
};
