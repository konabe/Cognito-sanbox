import { VerifyAuthChallengeResponseTriggerHandler } from "aws-lambda";

export const handler: VerifyAuthChallengeResponseTriggerHandler = async (
  event
) => {
  console.log("VerifyAuthChallengeResponse event", event);

  event.response.answerCorrect =
    event.request.privateChallengeParameters.answer ===
    event.request.challengeAnswer;
  return event;
};
