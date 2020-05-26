/**
 * @apiDefine UserPersonal
 * @apiVersion 1.0.0
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
