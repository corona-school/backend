import mailjet from "../../../../common/mails/mailjet";
import {assert} from "chai";

describe("The mailjet API", function () {
    it("sends mail via mailjet API", function () {
        // Arrange
        const subject: string = "testmail";
        const sender: string = '"Gero von der Corona School" <gero@corona-school.de>';
        const receiver: string = "testmailadr@cmail.com";
        const templateID: number = 1336704;
        const variables: object = {
            personFirstname: "Gero",
            pupilFirstname: "Christopher",
            pupilEmail: "chris@coole-mail.de",
            pupilGrade: "2. Klasse",
            subjects: "Englisch/Deutsch",
            meetingProposalDate: "18. April 2020",
            meetingProposalTime: "15.42 Uhr",
            callURL: "https://meet.jit.si/christopheristcoolcoronaschool"
        };

        const expectedResult: object = {
            request: {
                method: "POST",
                url: "https://api.mailjet.com/v3.1/send",
                header: {
                    "user-agent": "mailjet-api-v3-nodejs/3.3.1",
                    "Content-type": "application/json"
                },
                _data: {
                    SandboxMode: true,
                    Messages: [
                        {
                            From: {
                                Email: sender
                            },
                            To: [
                                {
                                    Email: receiver
                                }
                            ],
                            TemplateID: templateID,
                            TemplateLanguage: true,
                            Variables: variables,
                            Subject: subject
                        }
                    ]
                }
            },
            header: {
                "content-length": "196",
                "content-type": "application/json; charset=UTF-8",
                connection: "close"
            },
            status: 200,
            text: `{"Messages":[{"Status":"success","CustomID":"","To":[{"Email":"${receiver}","MessageUUID":"","MessageID":0,"MessageHref":"https://api.mailjet.com/v3/REST/message/0"}],"Cc":[],"Bcc":[]}]}`
        };

        // Act
        mailjet.send(
            subject,
            sender,
            receiver,
            templateID,
            variables,
            true
        ).then(result => {
            // Assert
            assert.deepStrictEqual(result, expectedResult, "The api result is correct.");
        });
    });
});
