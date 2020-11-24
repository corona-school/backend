/**
 * @apiDefine ContactExpert
 * @apiVersion 1.1.0
 *
 * @apiSuccess (ContactExpert Object) {string} emailText The text of the email to be sent
 * @apiSuccess (ContactExpert Object) {string} subject <em>(optional)</em> The subject of the email to be sent. An empty string is taken by default.
 */
export interface ApiContactExpert {
    emailText: string;
    subject?: string;
}