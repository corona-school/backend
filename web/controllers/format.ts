/**
 * @apiDefine Subject
 * @apiVersion 1.1.0
 *
 * @apiSuccess (Subject Object) {string} name Name of the subject
 * @apiSuccess (Subject Object) {number} minGrade <i>Only available for students:</i> Minimum grade they want to teach
 * @apiSuccess (Subject Object) {number} maxGrade <i>Only available for students:</i> Maximum grade they want to teach
 *
 */
export interface ApiSubject {
    name: string;
    minGrade?: number;
    maxGrade?: number;
}
