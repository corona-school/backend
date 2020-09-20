/**
 * @apiDefine ContactMentor
 * @apiVersion 1.1.0
 *
 * @apiSuccess (ContactMentor Object) {string} category The category of the mentoring/mentor team to contact. Allowed values are  <code>"language"</code>, <code>"subjects"</code>, <code>"didactic"</code>, <code>"tech"</code>, <code>"selforga"</code>, <code>"other"</code>
 * @apiSuccess (ContactMentor Object) {string} emailText The text of the email that is sent. It must be non-empty.
 * @apiSuccess (ContactMentor Object) {string} subject <em>(optional)</em> The subject of the email that is sent. If not given, the default will be the empty string.
 *
 */
export interface ApiContactMentor {
    category: string;
    emailText: string;
    subject?: string;
}