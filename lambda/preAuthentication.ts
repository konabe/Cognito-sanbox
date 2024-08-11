import { PreAuthenticationTriggerHandler } from "aws-lambda";

export const handler: PreAuthenticationTriggerHandler = async (event) => {
  console.log("PreAuthentication event", event);

  return event;
};
