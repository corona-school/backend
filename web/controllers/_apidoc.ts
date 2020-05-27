/**
 * @apiDefine Authentication
 * @apiVersion 1.0.1
 *
 * @apiHeader (Authentication) {string} Token HTTP Header: Authentication Token of a valid user
 * @apiHeaderExample Token
 *      Token: longAuthenticationToken_With_Var10u5_Ch4r4ct3r5
 */

/**
 * @apiDefine OptionalAuthentication
 * @apiVersion 1.1.0
 *
 * @apiHeader (Optional Authentication) {string} Token HTTP Header: Authentication Token of a valid user <em>(optional)</em>
 * @apiHeaderExample Token
 *      Token: longAuthenticationToken_With_Var10u5_Ch4r4ct3r5
 */

/**
 * @apiDefine ContentType
 * @apiVersion 1.0.1
 *
 * @apiHeader (HTTP Header) {string} Content-Type <code>application/json</code>
 * @apiHeaderExample Content-Type
 *      Content-Type: application/json
 */

/**
 * @apiDefine StatusOk
 * @apiVersion 1.0.1
 *
 * @apiError (HTTP Status Codes) 200 The request was successful and contains a response
 * @apiErrorExample {json} OK
 *      HTTP/1.1 200 OK
 *      (response)
 */

/**
 * @apiDefine StatusNoContent
 * @apiVersion 1.0.1
 *
 * @apiError (HTTP Status Codes) 204 The request was successful, but generated no response
 * @apiErrorExample {empty} No Content
 *      HTTP/1.1 204 No Content
 *      (empty body)
 */

/**
 * @apiDefine StatusBadRequest
 * @apiVersion 1.0.1
 *
 * @apiError (HTTP Status Codes) 400 The request was malformed and thus rejected
 * @apiErrorExample {empty} Bad Request
 *      HTTP/1.1 400 Bad Request
 *      (empty body)
 */

/**
 * @apiDefine StatusForbidden
 * @apiVersion 1.1.0
 *
 * @apiError (HTTP Status Codes) 401 The user is authenticated, but may not access this resource
 * @apiErrorExample {empty} Forbidden
 *      HTTP/1.1 401 Forbidden
 *      (empty body)
 */

/**
 * @apiDefine StatusUnauthorized
 * @apiVersion 1.0.1
 *
 * @apiError (HTTP Status Codes) 403 The user is not authenticated
 * @apiErrorExample {empty} Unauthorized
 *      HTTP/1.1 403 Unauthorized
 *      (empty body)
 */

/**
 * @apiDefine StatusNotFound
 * @apiVersion 1.0.1
 *
 * @apiError (HTTP Status Codes) 404 The requested resource was not found
 * @apiErrorExample {empty} Not Found
 *      HTTP/1.1 404 Not Found
 *      (empty body)
 */

/**
 * @apiDefine StatusInternalServerError
 * @apiVersion 1.0.1
 *
 * @apiError (HTTP Status Codes) 500 This should not happen. Report this issue to the maintainer or ask your favorite superhero for help.
 * @apiErrorExample {empty} Internal Server Error
 *      HTTP/1.1 500 Internal Server Error
 *      (empty body)
 */
