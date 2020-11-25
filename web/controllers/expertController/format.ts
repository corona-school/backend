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