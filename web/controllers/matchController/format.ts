/**
 * @apiDefine DissolveReason
 *
 * @apiSuccess (DissolveReason Object) {number} reason Reason for dissolving. Should be an integer between 1 and the maximum allowed reason.
 *
 * @apiSuccessExample {json} Pupil / Student
 *      {
 *          "reason": 1
 *      }
 */
export class ApiDissolveReason {
    reason: number;
}
