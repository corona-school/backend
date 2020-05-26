/**
 * @api {DELETE} /user/:id/matches/:uuid dissolveMatch
 * @apiVersion 0.1.0
 * @apiDescription
 * Dissolve the specified Match.
 *
 * This endpoint can be used to signal, that a user wants to dissolve his match.
 * The matched partner will be notified of this action.
 * Both students and pupils are only authorized to dissolve matches, where they are a part of.
 * @apiName deleteMatch
 * @apiGroup Match
 *
 * @apiUse Authentication
 *
 * @apiExample {curl} Curl
 * curl -k -i -X DELETE -H "Token: <AUTHTOKEN>"-H "Content-Type: application/json"  https://dashboard.corona-school.de/api/user/<ID>/matches/<UUID>
 *
 * @apiParam (URL Parameter) {string} id User Id
 * @apiParam (URL Parameter) {string} uuid UUID of the Match
 *
 * @apiUse DissolveReason
 *
 * @apiUse StatusNoContent
 * @apiUse StatusBadRequest
 * @apiUse StatusUnauthorized
 * @apiUse StatusInternalServerError
 *
 */
/**
 * @apiDefine UserPersonal
 * @apiVersion 0.1.0
 *
 * @apiParam (User Personal) {string} firstname First name
 * @apiParam (User Personal) {string} lastname Last name
 * @apiParam (User Personal) {number} grade <i>Only for pupils:</i> Grade of the pupil
 * @apiParam (User Personal) {number} matchesRequested <i>Only for students:</i> Number of requested <b>additional matches</b>
 * @apiParamExample {json} Pupil
 *      {
 *          "firstname": "John",
 *          "lastname": "Doe",
 *          "grade": 3
 *      }
 *
 * @apiParamExample {json} Student
 *      {
 *          "firstname": "Jane",
 *          "lastname": "Doe",
 *          "matchesRequested": 0
 *      }
 */
