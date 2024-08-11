import { DefineAuthChallengeTriggerHandler } from "aws-lambda";

export const handler: DefineAuthChallengeTriggerHandler = async (event) => {
  console.log("DefineAuthChallenge event", event);

  const enabledMFA = event.request.userAttributes["custom:enabledMFA"];
  const lastSession = event.request.session.slice(-1)[0];
  const sessionLength = event.request.session.length;
  event.response.failAuthentication = false;
  event.response.issueTokens = false;

  if (sessionLength === 0) {
    return event;
  }
  if (lastSession.challengeName === "SRP_A") {
    event.response.challengeName = "PASSWORD_VERIFIER";
    return event;
  }
  if (lastSession.challengeName === "PASSWORD_VERIFIER") {
    if (lastSession.challengeResult) {
      if (enabledMFA === undefined || enabledMFA === "false") {
        event.response.issueTokens = true;
        return event;
      }
      event.response.challengeName = "CUSTOM_CHALLENGE";
    }
    return event;
  }
  if (lastSession.challengeName === "CUSTOM_CHALLENGE") {
    if (lastSession.challengeResult) {
      event.response.issueTokens = true;
    }
    event.response.challengeName = "CUSTOM_CHALLENGE";
    return event;
  }
  return event;
};
