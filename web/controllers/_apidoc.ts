/**
 * @apiDefine Authentication
 *
 * @apiHeader (Authentication) {string} Token HTTP Header: Authentication Token of a valid user
 * @apiHeaderExample Token
 *      Token: longAuthenticationToken_With_Var10u5_Ch4r4ct3r5
 */

/**
 * @apiDefine ContentType
 *
 * @apiHeader (HTTP Header) {string} Content-Type <code>application/json</code>
 * @apiHeaderExample Content-Type
 *      Content-Type: application/json
 */

/**
 * @apiDefine StatusOk
 *
 * @apiError (HTTP Status Codes) 200 The request was successful and contains a response
 * @apiErrorExample {json} OK
 *      HTTP/1.1 200 OK
 *      (response)
 */

/**
 * @apiDefine StatusNoContent
 *
 * @apiError (HTTP Status Codes) 204 The request was successful, but generated no response
 * @apiErrorExample {empty} No Content
 *      HTTP/1.1 204 No Content
 *      (empty body)
 */

/**
 * @apiDefine StatusBadRequest
 *
 * @apiError (HTTP Status Codes) 400 The request was malformed and thus rejected.
 * @apiErrorExample {empty} Bad Request
 *      HTTP/1.1 400 Bad Request
 *      (empty body)
 */

/**
 * @apiDefine StatusUnauthorized
 *
 * @apiError (HTTP Status Codes) 403 The user is not authenticated
 * @apiErrorExample {empty} Unauthorized
 *      HTTP/1.1 403 Unauthorized
 *      (empty body)
 */

/**
 * @apiDefine StatusNotFound
 *
 * @apiError (HTTP Status Codes) 404 The requested resource was not found.
 * @apiErrorExample {empty} Not Found
 *      HTTP/1.1 404 Not Found
 *      (empty body)
 */

/**
 * @apiDefine StatusInternalServerError
 *
 * @apiError (HTTP Status Codes) 500 This should not happen. Report this issue to the maintainer or ask your favorite super hero for help.
 * @apiErrorExample {empty} Internal Server Error
 *      HTTP/1.1 500 Internal Server Error
 *      (empty body)
 */
