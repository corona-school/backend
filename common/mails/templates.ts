import { DEFAULTSENDERS } from "./config";

export type TemplateMail = {
    type: string;
    id: number;
    sender?: string;
    title?: string;
    disabled: boolean;
    variables: object;
    attachements?: {
        contentType: string,
        filename: string,
        base64Content: string
    }[]
};

export const mailjet = {
    VERIFICATION: (variables: {
        confirmationURL: string;
        personFirstname: string;
    }) => {
        return <TemplateMail>{
            type: "verification",
            id: 1336516,
            sender: DEFAULTSENDERS.support,
            title: "Lern-Fair - Verifizierung",
            disabled: false,
            variables: variables
        };
    },
    LOGINTOKEN: (variables: {
        dashboardURL: string;
        personFirstname: string;
    }) => {
        return <TemplateMail>{
            type: "logintoken",
            id: 1337159,
            sender: DEFAULTSENDERS.support,
            title: "Lern-Fair - Dein Account",
            disabled: false,
            variables: variables
        };
    },
    TUTEENEWMATCH: (variables: {
        pupilFirstname: string;
        studentFirstname: string;
        studentEmail: string;
        subjects: string;
        callURL: string;
    }) => {
        return <TemplateMail>{
            type: "pupilmatchmails",
            id: 1336849,
            sender: DEFAULTSENDERS.support,
            title: "Lern-Fair - Match",
            disabled: false,
            variables: variables
        };
    },
    TUTORNEWMATCH: (variables: {
        personFirstname: string;
        pupilFirstname: string;
        pupilEmail: string;
        pupilGrade: string;
        subjects: string;
        callURL: string;
    }) => {
        return <TemplateMail>{
            type: "studentmatchmails",
            id: 1336704,
            sender: DEFAULTSENDERS.support,
            title: "Lern-Fair - Match",
            disabled: false,
            variables: variables
        };
    },
    PUPILNEXTSTEPS: (variables: { pupilFirstname: string }) => {
        return <TemplateMail>{
            type: "pupilnextsteps",
            id: 1336558,
            sender: DEFAULTSENDERS.support,
            title: "Lern-Fair - Nächste Schritte",
            disabled: true,
            variables: variables
        };
    },
    STUDENTNEXTSTEPS: (variables: {
        screeningURL: string;
        studentFirstname: string;
    }) => {
        return <TemplateMail>{
            type: "studentnextsteps",
            id: 1336526,
            sender: DEFAULTSENDERS.support,
            title: "Lern-Fair - Nächste Schritte",
            disabled: true,
            variables: variables
        };
    },
    PUPILMATCHDISSOLVED: (variables: {
        studentFirstname: string;
        pupilFirstname: string;
    }) => {
        return <TemplateMail>{
            type: "pupilmatchdissolved",
            id: 1337164,
            sender: DEFAULTSENDERS.support,
            title: "Lern-Fair - Nächstes Mal",
            disabled: false,
            variables: variables
        };
    },
    STUDENTMATCHDISSOLVED: (variables: {
        pupilFirstname: string;
        studentFirstname: string;
    }) => {
        return <TemplateMail>{
            type: "studentmatchdissolved",
            id: 1337161,
            sender: DEFAULTSENDERS.support,
            title: "Lern-Fair - Nächstes Mal",
            disabled: false,
            variables: variables
        };
    },
    OLDAUTHTOKEN: (variables: {
        dashboardURL: string;
        personFirstname: string;
    }) => {
        return <TemplateMail>{
            type: "oldauthtoken",
            id: 1338975,
            sender: DEFAULTSENDERS.support,
            title: "Lern-Fair - Dein Account",
            disabled: false,
            variables: variables
        };
    },
    STUDENTFIRSTSCREENINGINVITATION: (variables: {
        personFirstname: string;
        confirmationURL: string;
    }) => {
        return <TemplateMail>{
            type: "studentfirstscreeninginvitation",
            id: 1362938,
            sender: DEFAULTSENDERS.support,
            title: "Wir möchten dich kennenlernen!",
            disabled: false,
            variables: variables
        };
    },
    STUDENTSCREENINGREMINDER: (variables: {
        personFirstname: string;
        confirmationURL: string;
    }) => {
        return <TemplateMail>{
            type: 'studentscreeningreminder',
            id: 1391548,
            sender: DEFAULTSENDERS.support,
            title: "Erinnerung: Wir möchten dich kennenlernen!",
            disabled: false,
            variables: variables
        };
    },
    INSTRUCTORFIRSTSCREENINGINVITATION: (variables: {
        instructorFirstName: string;
        confirmationURL: string;
    }) => {
        return <TemplateMail>{
            type: "instructorfirstscreeninginvitation",
            id: 1518623,
            sender: DEFAULTSENDERS.support,
            title: "Wir möchten dich kennenlernen!",
            disabled: false,
            variables: variables
        };
    },
    INSTRUCTORSCREENINGREMINDER: (variables: {
        instructorFirstName: string;
        confirmationURL: string;
    }) => {
        return <TemplateMail>{
            type: "instructorscreeningreminder",
            id: 1803949,
            sender: DEFAULTSENDERS.support,
            title: "Erinnerung: Wir möchten dich kennenlernen!",
            disabled: false,
            variables: variables
        };
    },
    COURSESCANCELLED: (variables: {
        participantFirstname: string;
        courseName: string;
        firstLectureDate: string;
        firstLectureTime: string;
    }) => {
        return <TemplateMail>{
            type: "coursecancelledparticipantnotification",
            id: 1498806,
            sender: DEFAULTSENDERS.support,
            title: "Dein Kurs wurde abgesagt!",
            disabled: false,
            variables: variables
        };
    },
    COURSESUPCOMINGREMINDERINSTRUCTOR: (variables: {
        participantFirstname: string;
        courseName: string;
        firstLectureDate: string;
        firstLectureTime: string;
    }) => {
        return <TemplateMail>{
            type: "courseupcomingfirstlecturereminderinstructors",
            id: 1498911,
            sender: DEFAULTSENDERS.support,
            title: "Dein Kurs startet bald!",
            disabled: false,
            variables: variables
        };
    },
    COURSESUPCOMINGREMINDERPARTICIPANT: (variables: {
        participantFirstname: string;
        courseName: string;
        firstLectureDate: string;
        firstLectureTime: string;
    }) => {
        return <TemplateMail>{
            type: "courseupcomingfirstlecturereminderparticipants",
            id: 1498899,
            sender: DEFAULTSENDERS.support,
            title: "Dein Kurs startet bald!",
            disabled: false,
            variables: variables
        };
    },
    COURSESPARTICIPANTREGISTRATIONCONFIRMATION: (variables: {
        participantFirstname: string;
        courseName: string;
        courseId: string;
        authToken: string;
        firstLectureDate: string;
        firstLectureTime: string;
    }) => {
        return <TemplateMail>{
            type: "coursesparticipantregistrationconfirmation",
            id: 2145111,
            disabled: false,
            variables: variables
        };
    },
    COURSESGUESTINVITATION: (variables: {
        guestFirstname: string;
        hostFirstname: string;
        hostEmail: string;
        courseName: string;
        firstLectureDate: string;
        firstLectureTime: string;
        linkVideochat: string;
    }) => {
        return <TemplateMail>{
            type: "coursesguestinvitation",
            id: 2204105,
            disabled: false,
            variables: variables
        };
    },
    CERTIFICATEREQUEST: (variables: { certificateLink: string, studentFirstname: string, pupilFirstname: string }) => (<TemplateMail>{
        type: "certificaterequest",
        id: 2317254,
        disabled: false,
        variables
    }),
    CERTIFICATESIGNED: (variables: { certificateLink: string, studentFirstname: string, pupilFirstname: string }, pdfBase64: string) => (<TemplateMail>{
        type: "certificatesigned",
        id: 2315511,
        disabled: false,
        variables,
        attachements: [{
            contentType: "application/pdf",
            filename: "Teilnahmebescheinigung_Coronaschool.pdf",
            base64Content: pdfBase64
        }]
    }),
    COURSESCERTIFICATE: (variables: {
        participantFirstname: string;
        courseName: string;
    }, pdfBase64: string) => {
        return <TemplateMail>{
            type: "coursescertificate",
            id: 2289687,
            disabled: false,
            variables: variables,
            attachements: [{
                contentType: "application/pdf",
                filename: "Teilnahmebescheinigung_CoronaSchool_Kurse.pdf",
                base64Content: pdfBase64
            }]
        };
    },
    PUPILMATCHFOLLOWUP: (variables: {
        pupilFirstName: string;
        studentFirstName: string;
    }) => {
        return <TemplateMail>{
            type: "pupilmatchfollowup",
            id: 1513038,
            sender: DEFAULTSENDERS.support,
            title: "Wie läuft das gemeinsame Lernen?",
            disabled: false,
            variables: variables
        };
    },
    STUDENTMATCHFOLLOWUP: (variables: {
        studentFirstName: string;
        pupilFirstName: string;
    }) => {
        return <TemplateMail>{
            type: "studentmatchfollowup",
            id: 1513030,
            sender: DEFAULTSENDERS.support,
            title: "Wie läuft das gemeinsame Lernen?",
            disabled: false,
            variables: variables
        };
    },
    PUPILREQUESTFEEDBACK: (variables: {
        pupilFirstName: string;
        studentFirstName: string;
    }) => {
        return <TemplateMail>{
            type: "pupilrequestfeedback",
            id: 1513025,
            sender: DEFAULTSENDERS.support,
            title: "Dein Feedback zu Lern-Fair!",
            disabled: false,
            variables: variables
        };
    },
    STUDENTREQUESTFEEDBACK: (variables: {
        studentFirstName: string;
        pupilFirstName: string;
    }) => {
        return <TemplateMail>{
            type: "studentrequestfeedback",
            id: 1513023,
            sender: DEFAULTSENDERS.support,
            title: "Dein Feedback zu Lern-Fair!",
            disabled: false,
            variables: variables
        };
    },
    COURSEINSTRUCTORGROUPMAIL: (variables: {
        participantFirstName: string;
        instructorFirstName: string;
        courseName: string;
        messageTitle: string;
        messageBody: string;
        instructorMail: string;
    //}, attachments: Express.Multer.File[]) => {
    }, attachments: {
        contentType: string,
        filename: string,
        base64Content: string;
    }[]) => {

        return <TemplateMail>{
            type: "courseinstructorgroupmail",
            id: 1518580,
            sender: DEFAULTSENDERS.support,
            title: "Nachricht zu deinem Kurs",
            disabled: false,
            variables: variables,
            attachements: attachments
        };
    },
    PROJECTCOACHJUFOALUMNIFIRSTSCREENINGINVITATION: (variables: {
        personFirstname: string;
        confirmationURL: string;
    }) => {
        return <TemplateMail>{
            type: "projectcoachjufoalumnifirstscreenininvitation",
            id: 1803499,
            sender: DEFAULTSENDERS.support,
            title: "Wir möchten dich kennenlernen!",
            disabled: false,
            variables: variables
        };
    },
    PROJECTCOACHJUFOALUMNISCREENINGREMINDER: (variables: {
        personFirstname: string;
        confirmationURL: string;
    }) => {
        return <TemplateMail>{
            type: 'projectcoachjufoalumniscreeningreminder',
            id: 1803498,
            sender: DEFAULTSENDERS.support,
            title: "Erinnerung: Wir möchten dich kennenlernen!",
            disabled: false,
            variables: variables
        };
    },
    JUFOALUMNITOVERIFY: (csvBase64: string) => {
        return <TemplateMail>{
            type: 'jufoalumnitoverify',
            id: 1848109,
            sender: DEFAULTSENDERS.noreply,
            title: "[Jufo-Verifizierung] Tägliche Neuregistrierungen",
            disabled: false,
            variables: {},
            attachements: [{
                contentType: "text/csv",
                filename: "AlumnsToVerify.csv",
                base64Content: csvBase64
            }]
        };
    },
    PROJECTCOACHEEMATCHDISSOLVED: (variables: {
        coacheeFirstname: string;
        coachFirstname: string;
    }) => {
        return <TemplateMail>{
            type: 'projectcoacheematchdissolved',
            id: 1894606,
            sender: DEFAULTSENDERS.support,
            title: "Deine Zuteilung wurde aufgelöst",
            disabled: false,
            variables: variables
        };
    },
    PROJECTCOACHMATCHDISSOLVED: (variables: {
        coachFirstname: string;
        coacheeFirstname: string;
    }) => {
        return <TemplateMail>{
            type: 'projectcoachmatchdissolved',
            id: 1894653,
            sender: DEFAULTSENDERS.support,
            title: "Deine Zuteilung wurde aufgelöst",
            disabled: false,
            variables: variables
        };
    },
    COACHEENEWMATCH: (variables: {
        coacheeFirstname: string;
        coachFirstname: string;
        coachEmail: string;
        subjects: string;
        callURL: string;
    }) => {
        return <TemplateMail>{
            type: "coacheenewmatch",
            id: 1949901,
            sender: DEFAULTSENDERS.support,
            title: "Neues Match (Projektcoaching)",
            disabled: false,
            variables: variables
        };
    },
    COACHNEWMATCH: (variables: {
        coachFirstname: string;
        coacheeFirstname: string;
        coacheeEmail: string;
        coacheeGrade: string;
        subjects: string;
        callURL: string;
    }) => {
        return <TemplateMail>{
            type: "coachnewmatch",
            id: 1949895,
            sender: DEFAULTSENDERS.support,
            title: "Neues Match (Projektcoaching)",
            disabled: false,
            variables: variables
        };
    },
    PUPILMATCHREQUESTCONFIRMATION: (variables: {
        firstName: string;
        authToken: string;
        confirmationURL: string;
        refusalURL: string;
    }) => {
        return <TemplateMail>{
            type: "pupilmatchrequestconfirmation",
            id: 2827881,
            sender: DEFAULTSENDERS.support,
            disabled: false,
            variables: variables
        };
    },
    PUPILMATCHREQUESTCONFIRMATIONREMINDER: (variables: {
        firstName: string;
        authToken: string;
        confirmationURL: string;
        refusalURL: string;
    }) => {
        return <TemplateMail>{
            type: "pupilmatchrequestconfirmationreminder",
            id: 2828166,
            sender: DEFAULTSENDERS.support,
            disabled: false,
            variables: variables
        };
    }
};
