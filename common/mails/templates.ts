import { DEFAULTSENDERS } from "./config";

export type TemplateMail = {
    type: string;
    id: number;
    sender: string;
    title: string;
    disabled: boolean;
    variables: object;
};

export const mailjet = {
    VERIFICATION: (variables: {
        confirmationURL: string;
        personFirstname: string;
    }) => {
        return <TemplateMail>{
            type: "verification",
            id: 1336516,
            sender: DEFAULTSENDERS.noreply,
            title: "Corona School - Verifizierung",
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
            sender: DEFAULTSENDERS.noreply,
            title: "Corona School - Dein Account",
            disabled: false,
            variables: variables
        };
    },
    PUPILMATCHMAILS: (variables: {
        pupilFirstname: string;
        studentFirstname: string;
        studentEmail: string;
        subjects: string;
        meetingProposalDate: string;
        meetingProposalTime: string;
        callURL: string;
    }) => {
        return <TemplateMail>{
            type: "pupilmatchmails",
            id: 1336849,
            sender: DEFAULTSENDERS.anmeldung,
            title: "Corona School - Match",
            disabled: false,
            variables: variables
        };
    },
    STUDENTMATCHMAILS: (variables: {
        personFirstname: string;
        pupilFirstname: string;
        pupilEmail: string;
        pupilGrade: string;
        subjects: string;
        meetingProposalDate: string;
        meetingProposalTime: string;
        callURL: string;
    }) => {
        return <TemplateMail>{
            type: "studentmatchmails",
            id: 1336704,
            sender: DEFAULTSENDERS.anmeldung,
            title: "Corona School - Match",
            disabled: false,
            variables: variables
        };
    },
    PUPILNEXTSTEPS: (variables: { pupilFirstname: string }) => {
        return <TemplateMail>{
            type: "pupilnextsteps",
            id: 1336558,
            sender: DEFAULTSENDERS.noreply,
            title: "Corona School - Nächste Schritte",
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
            sender: DEFAULTSENDERS.noreply,
            title: "Corona School - Nächste Schritte",
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
            sender: DEFAULTSENDERS.noreply,
            title: "Corona School - Nächstes Mal",
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
            sender: DEFAULTSENDERS.noreply,
            title: "Corona School - Nächstes Mal",
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
            sender: DEFAULTSENDERS.noreply,
            title: "Corona School - Dein Account",
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
            sender: DEFAULTSENDERS.screening,
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
            sender: DEFAULTSENDERS.screening,
            title: "Erinnerung: Wir möchten dich kennenlernen!",
            disabled: false,
            variables: variables
        };
    },
    INSTRUCTORFIRSTSCREENINGINVITATION: (variables: {
        instructorFirstName: string;
        selectAppointmentURL: string;
    }) => {
        return <TemplateMail>{
            type: "instructorfirstscreeninginvitation",
            id: 1518623,
            sender: DEFAULTSENDERS.screening,
            title: "Wir möchten dich kennenlernen!",
            disabled: false,
            variables: variables
        };
    },
    INSTRUCTORSCREENINGREMINDER: (variables: {
        instructorFirstName: string;
        selectAppointmentURL: string;
    }) => {
        return <TemplateMail>{
            type: "instructorscreeningreminder",
            id: 1803949,
            sender: DEFAULTSENDERS.screening,
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
    PARTICIPANTCOURSEREGISTRATIONCONFIRMATION: (variables: {
        participantFirstname: string;
        courseName: string;
        firstLectureDate: string;
        firstLectureTime: string;
    }) => {
        return <TemplateMail>{
            type: "participantcourseregistrationconfirmation",
            id: 1513027,
            sender: DEFAULTSENDERS.support,
            title: "Du hast dich für einen Kurs angemeldet!",
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
            title: "Dein Feedback zur Corona School!",
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
            title: "Dein Feedback zur Corona School!",
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
    }) => {
        return <TemplateMail>{
            type: "courseinstructorgroupmail",
            id: 1518580,
            sender: DEFAULTSENDERS.support,
            title: "Nachricht zu deinem Kurs",
            disabled: false,
            variables: variables
        };
    },
    PROJECTCOACHJUFOALUMNIFIRSTSCREENINGINVITATION: (variables: {
        personFirstname: string;
        confirmationURL: string;
    }) => {
        return <TemplateMail>{
            type: "projectcoachjufoalumnifirstscreenininvitation",
            id: 1803499,
            sender: DEFAULTSENDERS.screening,
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
            sender: DEFAULTSENDERS.screening,
            title: "Erinnerung: Wir möchten dich kennenlernen!",
            disabled: false,
            variables: variables
        };
    }
};
