/**
 * @apiDefine VerifyToken
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
 *
 * @apiParam (Auth Token) {string} token Authentication token
 * @apiParamExample {json} Response Body
 *      {
 *          "token": "some-semi-persistent-auth-token"
 *      }
 */
