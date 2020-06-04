/**
 * @api {POST} /register/instructor RegisterInstructor
 * @apiVersion 1.1.0
 * @apiDescription
 * Register a user as an instructor.
 *
 * @apiName RegisterInstructor
 * @apiGroup Registration
 *
 * @apiUse ContentType
 *
 * @apiExample {curl} Curl
 * curl -k -i -X POST -H "Content-Type: application/json" https://api.corona-school.de/api/register/instructor -d "<REQUEST>"
 *
 * @apiUse StatusNoContent
 * @apiUse StatusBadRequest
 * @apiUse StatusInternalServerError
 */

/**
 * @api {POST} /register/teacher RegisterTeacher
 * @apiVersion 1.1.0
 * @apiDescription
 * Register a user as an teacher.
 *
 * @apiName RegisterTeacher
 * @apiGroup Registration
 *
 * @apiUse ContentType
 *
 * @apiExample {curl} Curl
 * curl -k -i -X POST -H "Content-Type: application/json" https://api.corona-school.de/api/register/teacher -d "<REQUEST>"
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
 * @apiExample {curl} Curl
 * curl -k -i -X POST -H "Content-Type: application/json" https://api.corona-school.de/api/register/tutee -d "<REQUEST>"
 *
 * @apiUse StatusNoContent
 * @apiUse StatusBadRequest
 * @apiUse StatusInternalServerError
 */

