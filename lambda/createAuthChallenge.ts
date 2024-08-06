import { CreateAuthChallengeTriggerHandler } from "aws-lambda";

export const handler: CreateAuthChallengeTriggerHandler = async (event) => {
  console.log("CreateAuthChallenge event", event);

  if (event.request.challengeName === "CUSTOM_CHALLENGE") {
    event.response.publicChallengeParameters = {
      questionType: "code",
    };
    const code = Math.random().toString(16).slice(-6).toUpperCase();
    console.log("CODE is", code);
    event.response.privateChallengeParameters = {
      answer: code,
    };
    event.response.challengeMetadata = "CODE";
  }
  return event;
};
