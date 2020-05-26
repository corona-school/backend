/**
 * @apiDefine VerifyToken
 * @apiVersion 1.0.1
 *
 * @apiParam (Verify Token) {string} token Verification token
 * @apiParamExample {json} Request Body
 *      {
 *          "token": "OogeiQuah8uu6ohz1oc8iihaifaixahR"
 *      }
 */
export class ApiVerifyToken {
    token: string;
}

/**
 * @apiDefine AuthToken
 * @apiVersion 1.0.1
 *
 * @apiParam (Auth Token) {string} token Authentication token
 * @apiParamExample {json} Response Body
 *      {
 *          "token": "some-semi-persistent-auth-token"
 *      }
 */
