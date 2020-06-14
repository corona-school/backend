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
            variables: variables,
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
            variables: variables,
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
            variables: variables,
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
            variables: variables,
        };
    },
    PUPILNEXTSTEPS: (variables: { pupilFirstname: string }) => {
        return <TemplateMail>{
            type: "pupilnextsteps",
            id: 1336558,
            sender: DEFAULTSENDERS.noreply,
            title: "Corona School - Nächste Schritte",
            disabled: true,
            variables: variables,
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
            variables: variables,
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
            variables: variables,
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
            variables: variables,
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
            variables: variables,
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
            variables: variables,
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
            variables: variables,
        };
    },
};
