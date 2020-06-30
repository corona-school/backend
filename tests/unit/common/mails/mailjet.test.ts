// TODO rewrite for mocha and move to tests directory.
// import mailjet from "./mailjet";
//
// test("send mail via mailjet API", async () => {
//     const subject = "testmail";
//     const sender = '"Gero von der Corona School" <gero@corona-school.de>';
//     const receiver = "testmailadr@cmail.com";
//     const templateID = 1336704;
//     const variables = {
//         personFirstname: "Gero",
//         pupilFirstname: "Christopher",
//         pupilEmail: "chris@coole-mail.de",
//         pupilGrade: "2. Klasse",
//         subjects: "Englisch/Deutsch",
//         meetingProposalDate: "18. April 2020",
//         meetingProposalTime: "15.42 Uhr",
//         callURL: "https://meet.jit.si/christopheristcoolcoronaschool"
//     };
//
//     const result = await mailjet.send(
//         subject,
//         sender,
//         receiver,
//         templateID,
//         variables,
//         true
//     );
//
//     expect(result["response"]).toMatchObject({
//         request: {
//             method: "POST",
//             url: "https://api.mailjet.com/v3.1/send",
//             header: {
//                 "user-agent": "mailjet-api-v3-nodejs/3.3.1",
//                 "Content-type": "application/json"
//             },
//             _data: {
//                 SandboxMode: true,
//                 Messages: [
//                     {
//                         From: {
//                             Email: sender
//                         },
//                         To: [
//                             {
//                                 Email: receiver
//                             }
//                         ],
//                         TemplateID: templateID,
//                         TemplateLanguage: true,
//                         Variables: variables,
//                         Subject: subject
//                     }
//                 ]
//             }
//         },
//         header: {
//             "content-length": "196",
//             "content-type": "application/json; charset=UTF-8",
//             connection: "close"
//         },
//         status: 200,
//         text: `{"Messages":[{"Status":"success","CustomID":"","To":[{"Email":"${receiver}","MessageUUID":"","MessageID":0,"MessageHref":"https://api.mailjet.com/v3/REST/message/0"}],"Cc":[],"Bcc":[]}]}`
//     });
// });
