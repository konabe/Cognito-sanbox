import { CreateAuthChallengeTriggerHandler } from "aws-lambda";
import { SES, SendEmailCommand } from "@aws-sdk/client-ses";
const ses = new SES({ region: "ap-northeast-1" });

export const handler: CreateAuthChallengeTriggerHandler = async (event) => {
  console.log("CreateAuthChallenge event", event);

  if (event.request.challengeName === "CUSTOM_CHALLENGE") {
    event.response.publicChallengeParameters = {
      questionType: "code",
    };
    const code = Math.random().toString(16).slice(-6).toUpperCase();
    await ses.send(
      new SendEmailCommand({
        Destination: {
          ToAddresses: [event.request.userAttributes.email],
        },
        Message: {
          Subject: {
            Charset: "UTF-8",
            Data: `認証コード ${code}`,
          },
          Body: {
            Text: {
              Charset: "UTF-8",
              Data: `Cognito sampleの認証コードは ${code} です。`,
            },
          },
        },
        Source: process.env.EMAIL_SOURCE,
      })
    );
    event.response.privateChallengeParameters = {
      answer: code,
    };
    event.response.challengeMetadata = "CODE";
  }
  return event;
};
