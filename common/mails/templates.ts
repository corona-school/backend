import { DEFAULTSENDERS } from './config';

export type TemplateMail = {
    type: string;
    id: number;
    sender?: string;
    title?: string;
    disabled: boolean;
    variables: object;
    attachements?: {
        contentType: string;
        filename: string;
        base64Content: string;
    }[];
};

export const mailjet = {
    COURSESCANCELLED: (variables: { participantFirstname: string; courseName: string; firstLectureDate: string; firstLectureTime: string }) => {
        return <TemplateMail>{
            type: 'coursecancelledparticipantnotification',
            id: 1498806,
            sender: DEFAULTSENDERS.support,
            title: 'Dein Kurs wurde abgesagt!',
            disabled: false,
            variables: variables,
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
            type: 'coursesparticipantregistrationconfirmation',
            id: 2145111,
            disabled: false,
            variables: variables,
        };
    },
    CERTIFICATEREQUEST: (variables: { certificateLink: string; studentFirstname: string; pupilFirstname: string }) =>
        <TemplateMail>{
            type: 'certificaterequest',
            id: 2317254,
            disabled: false,
            variables,
        },
    CERTIFICATESIGNED: (variables: { certificateLink: string; studentFirstname: string; pupilFirstname: string }, pdfBase64: string) =>
        <TemplateMail>{
            type: 'certificatesigned',
            id: 2315511,
            disabled: false,
            variables,
            attachements: [
                {
                    contentType: 'application/pdf',
                    filename: 'Teilnahmebescheinigung_Coronaschool.pdf',
                    base64Content: pdfBase64,
                },
            ],
        },
};
