import { SendEmailCommand, SES } from "@aws-sdk/client-ses";

export class Notifier {
  private ses: SES;

  constructor() {
    this.ses = new SES({ region: "ap-northeast-1" });
  }

  async sendEmail(to: string, source: string, subject: string, body: string) {
    const commonCharSet = "UTF-8";
    await this.ses.send(
      new SendEmailCommand({
        Destination: {
          ToAddresses: [to],
        },
        Message: {
          Subject: {
            Charset: commonCharSet,
            Data: subject,
          },
          Body: {
            Text: {
              Charset: commonCharSet,
              Data: body,
            },
          },
        },
        Source: source,
      })
    );
  }
}
