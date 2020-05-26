// A wrapper for importing student data
export default class StudentWrapper {
    firstname: string;
    lastname: string;
    email: string;
    wixCreatedDate: Date;
    birthday: string; //can happen to be an empty string sometimes, so set to null to avoid data
    subjects: string;
    wixID: string;
    phone: string;
    msg: string;
    verified: boolean;
    screener: string; //that is stored as a string in the old database
    feedback: string;
    knowsCoronaSchoolFrom: string;
    comment: string;
    matchUUID: string;
}
