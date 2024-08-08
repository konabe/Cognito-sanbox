import { CreateAuthChallengeTriggerHandler } from "aws-lambda";
import { Notifier } from "./infrastructure/notifier";

export const handler: CreateAuthChallengeTriggerHandler = async (event) => {
  console.log("CreateAuthChallenge event", event);

  if (event.request.challengeName === "CUSTOM_CHALLENGE") {
    event.response.publicChallengeParameters = {
      questionType: "code",
    };
    const code = Math.random().toString(16).slice(-6).toUpperCase();
    const notifier = new Notifier();
    await notifier.sendEmail(
      event.request.userAttributes.email,
      process.env.EMAIL_SOURCE ?? "",
      `認証コード ${code}`,
      `Cognito sampleの認証コードは ${code} です。`
    );
    event.response.privateChallengeParameters = {
      answer: code,
    };
    event.response.challengeMetadata = "CODE";
  }
  return event;
};
