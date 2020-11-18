/**
 * @apiDefine ProjectMatchDissolveReason
 * @apiVersion 1.0.1
 *
 * @apiSuccess (ProjectMatchDissolveReason Object) {number} reason Reason for dissolving. Should be an integer between 1 and the maximum allowed reason.
 *
 * @apiSuccessExample {json} Pupil / Student
 *      {
 *          "reason": 1
 *      }
 */
export class ApiProjectMatchDissolveReason {
    reason: number;
}
