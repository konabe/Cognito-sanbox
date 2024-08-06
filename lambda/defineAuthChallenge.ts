import { DefineAuthChallengeTriggerHandler } from "aws-lambda";

export const handler: DefineAuthChallengeTriggerHandler = async (event) => {
  return {
    ...event,
    response: {
      ...event.response,
      issueToken: true,
      failAuthentication: false,
    },
  };
};
