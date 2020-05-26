import { ApiSubject } from "../../web/controllers/userController/format";

/**
 * @apiDefine ScreeningResult
 *
 * @apiSuccess {string} verified Verification
 * @apiSuccess {string} phone Phone number
 * @apiSuccess {Date} birthday Birthday
 * @apiSuccess {string} commentScreener a comment made by the screener
 * @apiSuccess {string} knowscsfrom how did the student get to know corona school?
 * @apiSuccess {string} screenerEmail the email address of the screener
 * @apiSuccess {string} feedback feedback on corona school given by the screened students
 */
export class ApiScreeningResult {
    verified: boolean;
    phone?: string;
    birthday?: Date;
    commentScreener?: string;
    knowscsfrom?: string;
    screenerEmail: string;
    subjects?: string;
    feedback?: string;
    constructor(requestBody: any) {
        this.verified = requestBody.verified;
        this.phone = requestBody.phone;
        this.birthday = requestBody.birthday;
        this.commentScreener = requestBody.commentScreener;
        this.knowscsfrom = requestBody.knowscsfrom;
        this.screenerEmail = requestBody.screenerEmail;
        this.subjects = requestBody.subjects;
        this.feedback = requestBody.feedback;
    }
    isValid(): boolean {
        let isValid: boolean = true;

        isValid = this.verified == null ? false : isValid;
        isValid = this.screenerEmail == null ? false : isValid;

        return isValid;
    }
}
