/**
 * @apiDefine ContactExpert
 * @apiVersion 1.0.1
 *
 * @apiSuccess (ContactExpert Object) {string} emailText The text of the email to be sent
 * @apiSuccess (ContactExpert Object) {string} subject <em>(optional)</em> The subject of the email to be sent. An empty string is taken by default.
 */
export interface ApiContactExpert {
    emailText: string;
    subject?: string;
}

/**
 * @apiDefine Expert
 * @apiVersion 1.0.1
 *
 * @apiSuccess (Expert Object) {number} id The ID of the expert.
 * @apiSuccess (Expert Object) {string} lastName The last name of the expert.
 * @apiSuccess (Expert Object) {string} firstName The first name of the expert.
 * @apiSuccess (Expert Object) {string} description <em>(optional)</em> A description provided by the expert.
 * @apiSuccess (Expert Object) {string[]} expertiseTags Tags describing the expert's fields of expertise.
 */
export class ApiGetExpert {
    id: number;
    lastName: string;
    firstName: string;
    description?: string;
    expertiseTags: string[];
}

/**
 * @apiDefine PutExpert
 * @apiVersion 1.0.1
 *
 * @apiSuccess (Expert Object) {string} contactEmail <em>(optional)</em> The email adress on which the expert can be contacted from pupils. If none is given, the original email will be taken.
 * @apiSuccess (Expert Object) {string} description <em>(optional)</em> A description provided by the expert.
 * @apiSuccess (Expert Object) {string[]} expertiseTags Tags describing the expert's fields of expertise.
 * @apiSuccess (Expert Object) {boolean} active If true the person consents that her/ his data will be accessible by other users.
 */
export interface ApiPutExpert {
    contactEmail?: string;
    description?: string;
    expertiseTags: string[];
    active: boolean;
}

/**
 * @apiDefine GetExpertiseTag
 * @apiVersion 1.0.1
 *
 * @apiSuccess (Expert Object) {string} name The name of the tag.
 * @apiSuccess (Expert Object) {number[]} experts The unique of the experts who chose thies particular tag
 */
export interface ApiGetExpertiseTag {
    name: string;
    experts: number[];
}