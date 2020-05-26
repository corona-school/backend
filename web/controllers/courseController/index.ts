/**
 * @api {GET} /courses GetCourses
 * @apiDescription
 * Request a list of all available courses.
 *
 * <p>This endpoint can be called with authentication as well as without.
 * Authentication unlocks some additional fields and request parameters (see below).
 * The request has to specify if additional fields should be included.
 * Additionally some search parameters can be used to limit the result to matching courses.</p>
 *
 * @apiName GetCourses
 * @apiGroup Courses
 *
 * @apiUse OptionalAuthentication
 *
 * @apiParam (Query Parameter) {string?} fields Comma seperated list of additionally requested fields (<code>id</code> will be always included). Example: <code>fields=name,outline,category,startDate</code>
 * @apiParam (Query Parameter) {string?} state Default: <code>allowed</code>. Comma seperated list of possible states of the course. Requires the <code>instructor</code> parameter to be set.
 * @apiParam (Query Parameter) {string?} instructor Id of an instructor. Return only courses by this instructor. This parameter requires authentication as the specified instructor.
 *
 * @apiUse Courses
 * @apiUse Course
 *
 * @apiExample {curl} Curl
 * curl -k -i -X GET "https://dashboard.corona-school.de/api/courses?fields=name,outline,category,startDate"
 *
 * @apiUse StatusOk
 * @apiUse StatusUnauthorized
 * @apiUse StatusForbidden
 * @apiUse StatusInternalServerError
 */


/**
 * @api {POST} /course AddCourse
 * @apiDescription
 * Add a new course.
 *
 * This endpoint allows adding a new course.
 * If successful the ID of the newly created course will be returned.
 *
 * @apiName AddCourse
 * @apiGroup Courses
 *
 * @apiUse Authentication
 * @apiUse ContentType
 *
 * @apiUse PostCourse
 * @apiUse PostCourseReturn
 *
 * @apiExample {curl} Curl
 * curl -k -i -X POST -H "Token: <AUTHTOKEN>" -H "Content-Type: application/json" https://dashboard.corona-school.de/api/course/ -d "<REQUEST>"
 *
 * @apiUse StatusNoContent
 * @apiUse StatusBadRequest
 * @apiUse StatusUnauthorized
 * @apiUse StatusForbidden
 * @apiUse StatusInternalServerError
 */

/**
 * @api {PUT} /user/:id/description PutStudentDescription
 * @apiDescription
 * Set the description of the user.
 *
 * This endpoint allows editing of the description of a student.
 * Setting a description will automatically make the student an instructor.
 * If a user is an instructor the description can't be removed
 *
 * @apiName PutStudentDescription
 * @apiGroup User
 *
 * @apiUse Authentication
 * @apiUse ContentType
 *
 * @apiExample {curl} Curl
 * curl -k -i -X PUT -H "Token: <AUTHTOKEN>" -H "Content-Type: application/json" https://dashboard.corona-school.de/api/user/<ID>/description -d "<REQUEST>"
 *
 * @apiParam (URL Parameter) {string} id User Id
 *
 * @apiUse UserSubjects
 * @apiUse Subject
 *
 * @apiUse StatusNoContent
 * @apiUse StatusBadRequest
 * @apiUse StatusUnauthorized
 * @apiUse StatusForbidden
 * @apiUse StatusInternalServerError
 */