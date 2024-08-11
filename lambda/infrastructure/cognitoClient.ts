import {
  AdminUpdateUserAttributesCommand,
  CognitoIdentityProvider,
} from "@aws-sdk/client-cognito-identity-provider";

export class CognitoClient {
  private provider: CognitoIdentityProvider;

  constructor(
    private userPoolID: string,
    private userName: string
  ) {
    this.provider = new CognitoIdentityProvider({ region: "ap-northeast-1" });
  }

  async updateUserAttributes(
    attributes: {
      [key in "Name" | "Value"]: string;
    }[]
  ) {
    await this.provider.send(
      new AdminUpdateUserAttributesCommand({
        UserPoolId: this.userPoolID,
        Username: this.userName,
        UserAttributes: [...attributes],
      })
    );
  }
}
