import { CreateAuthChallengeTriggerHandler } from "aws-lambda";
import { Notifier } from "./infrastructure/notifier";

export const handler: CreateAuthChallengeTriggerHandler = async (event) => {
  console.log("CreateAuthChallenge event", event);

  if (event.request.challengeName === "CUSTOM_CHALLENGE") {
    const code = Math.random().toString(16).slice(-6).toUpperCase();
    const notifier = new Notifier(process.env.EMAIL_SOURCE ?? "");
    await notifier.sendEmail(
      event.request.userAttributes.email,
      `認証コード ${code}`,
      `Cognito sampleの認証コードは ${code} です。`
    );
    event.response.publicChallengeParameters = {
      questionType: "code",
    };
    event.response.privateChallengeParameters = {
      answer: code,
    };
    event.response.challengeMetadata = "CODE";
  }
  return event;
};
