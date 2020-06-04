/**
 * @api {POST} /register/tutor RegisterTutor
 * @apiVersion 1.1.0
 * @apiDescription
 * Register a user as a tutor.
 *
 * @apiName RegisterTutor
 * @apiGroup Registration
 *
 * @apiUse ContentType
 *
 * @apiUse AddTutor
 * @apiUse AddTutorSubject
 *
 * @apiExample {curl} Curl
 * curl -k -i -X POST -H "Content-Type: application/json" https://api.corona-school.de/api/register/tutor -d "<REQUEST>"
 *
 * @apiUse StatusNoContent
 * @apiUse StatusBadRequest
 * @apiUse StatusInternalServerError
 */

/**
 * @api {POST} /register/tutee RegisterTutee
 * @apiVersion 1.1.0
 * @apiDescription
 * Register a user as a tutee.
 *
 * @apiName RegisterTutee
 * @apiGroup Registration
 *
 * @apiUse ContentType
 *
 * @apiUse AddTutee
 * @apiUse AddTuteeSubject
 *
 * @apiExample {curl} Curl
 * curl -k -i -X POST -H "Content-Type: application/json" https://api.corona-school.de/api/register/tutee -d "<REQUEST>"
 *
 * @apiUse StatusNoContent
 * @apiUse StatusBadRequest
 * @apiUse StatusInternalServerError
 */

