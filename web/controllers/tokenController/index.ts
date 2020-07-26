import { getLogger } from "log4js";
import { Request, Response } from "express";
import { getManager } from "typeorm";
import { Person } from "../../../common/entity/Person";
import { Pupil } from "../../../common/entity/Pupil";
import { Student } from "../../../common/entity/Student";
import { mailjetTemplates, sendTemplateMail } from "../../../common/mails";
import { v4 as uuidv4 } from "uuid";
import { hashToken } from "../../../common/util/hashing";
import { getTransactionLog } from "../../../common/transactionlog";
import VerifiedEvent from "../../../common/transactionlog/types/VerifiedEvent";
import * as moment from "moment";
import { sendFirstScreeningInvitationToTutor, sendFirstScreeningInvitationToInstructor } from "../../../common/administration/screening/initial-invitations";

const logger = getLogger();

/**
 * @api {POST} /token verifyToken
 * @apiVersion 1.0.1
 * @apiDescription
 * Try to verify a token.
 *
 * This endpoint allows verifying a newly created user account and generating its first authToken.
 *
 * @apiName verifyToken
 * @apiGroup Token
 *
 * @apiExample {curl} Curl
 * curl -k -i -X POST -H "Content-Type: application/json" https://api.corona-school.de/api/token/ -d "<REQUEST>"
 *
 * @apiUse ContentType
 * @apiUse VerifyToken
 * @apiUse AuthToken
 *
 * @apiUse StatusOk
 * @apiUse StatusBadRequest
 * @apiUse StatusInternalServerError
 */
export async function verifyTokenHandler(req: Request, res: Response) {
    if (req.body.token) {
        let emailToken = req.body.token;

        let authToken = await verifyToken(emailToken);
        if (authToken) {
            return res.status(200).send({ token: authToken });
        } else {
            return res.status(400).end();
        }
    } else {
        // token field missing
        res.status(400).end();
    }
}

export async function verifyToken(token: string): Promise<string | null> {
    try {
        const entityManager = getManager();
        const transactionLog = getTransactionLog();

        // Try to find student
        let student = await entityManager.findOne(Student, {
            verification: token
        });

        if (student instanceof Student) {
            // Found valid student
            student.verification = null;
            student.verifiedAt = new Date();
            logger.info("Token " + token + " verified");

            // Generate UUID
            const uuid = uuidv4();
            student.authToken = hashToken(uuid);
            student.authTokenSent = new Date();
            student.authTokenUsed = false;
            logger.info("Generated and sending UUID " + uuid + " to " + student.email);

            await entityManager.save(student);

            try {
                await sendLoginTokenMail(student, uuid);
                if (student.isInstructor) {
                    // Invite to instructor screening
                    await sendFirstScreeningInvitationToInstructor(entityManager, student);
                } else {
                    // Invite to tutor screening
                    await sendFirstScreeningInvitationToTutor(entityManager, student);
                }
            }
            catch (mailerror) {
                logger.error(
                    `Can't send emails to student ${student.email} after verification due to mail error...`
                );
                logger.debug(mailerror);
            }

            await transactionLog.log(new VerifiedEvent(student));

            return uuid;
        }

        // Try to find pupil instead
        let pupil = await entityManager.findOne(Pupil, { verification: token });

        if (pupil instanceof Pupil) {
            // Found valid pupil
            pupil.verification = null;
            pupil.verifiedAt = new Date();
            logger.info("Token " + token + " verified");

            // Generate UUID
            const uuid = uuidv4();
            pupil.authToken = hashToken(uuid);
            pupil.authTokenSent = new Date();
            pupil.authTokenUsed = false;

            logger.info(
                "Generated and sending UUID " + uuid + " to " + pupil.email
            );

            await sendLoginTokenMail(pupil, uuid);
            await entityManager.save(pupil);
            await transactionLog.log(new VerifiedEvent(pupil));

            return uuid;
        }

        logger.info("Can't verify token " + token);
        return null;
    } catch (e) {
        logger.error("Can't verify token: ", e.message);
        logger.debug(e);
        return null;
    }
}

/**
 * @api {GET} /token requestNewToken
 * @apiVersion 1.0.1
 * @apiDescription
 * Request a new token for the user account specified by email.
 *
 * This endpoint allows requesting a new token send via email to the user.
 * A user can only request a new token, if he doesn't have an unused token from the last 24h.
 *
 * @apiName requestNewToken
 * @apiGroup Token
 *
 * @apiParam (Query Parameter) {string} email Email address of the user (case insensitive)
 * @apiParam (Query Parameter) {string} redirectTo route to the page the Token-Link shall lead to (optional)
 *
 * @apiExample {curl} Curl
 * curl -k -i -X GET "https://api.corona-school.de/api/token?email=info%40example.org&path=/courses/2"
 *
 * @apiUse StatusNoContent
 * @apiUse StatusBadRequest
 * @apiUse StatusUnauthorized
 * @apiUse StatusNotFound
 * @apiUse StatusInternalServerError
 */
export async function getNewTokenHandler(req: Request, res: Response) {
    let status = 204;

    try {
        if (req.query.email) {
            let email = (req.query.email as string).trim().toLowerCase();

            const entityManager = getManager();
            const transactionLog = getTransactionLog();

            let person: (Pupil|Student);
            person = await entityManager.findOne(Student, {email: email});
            if (person == undefined) {
                person = await entityManager.findOne(Pupil, {email: email});
            }

            if (person !== undefined) {
                if (allowedToRequestToken(person)) {
                    if (req.query.redirectTo !== undefined && typeof req.query.redirectTo !== "string")
                        status = 400;

                    logger.info("Sending new auth token to user", person.id);

                    // Generate a new UUID
                    const uuid = uuidv4();
                    person.authToken = hashToken(uuid);
                    person.authTokenSent = new Date();
                    person.authTokenUsed = false;

                    logger.info("Generated and sending UUID " + uuid + " to " + person.email);
                    await sendLoginTokenMail(person, uuid, req.query.redirectTo);


                    // Save new token to database and log action
                    await entityManager.save(person);
                    await transactionLog.log(new VerifiedEvent(person));
                } else {
                    // rate limited
                    logger.info("Not sending auth token: rate limit time not passed yet", person.authTokenSent);
                    status = 403;
                }
            } else {
                // email not found
                logger.info("Not sending auth token: email/person not found", email);
                status = 404;
            }
        } else {
            // E-Mail missing in query
            status = 400;
        }
    } catch (e) {
        logger.error("Failed to send or safe new auth token: ", e.message);
        logger.debug(e);
        status = 500;
    }

    res.status(status).end();
}

function allowedToRequestToken(person: Person): boolean {
    // Deactivated users may not request tokens
    if (person.active == false) {
        logger.debug("Token requested by decativated user");
        return false;
    }

    // Always allow if never sent authTokens (only valid for legacy users)
    if (person.authTokenSent == null) {
        logger.debug("Token allowed, last sent was null");
        return true;
    }

    // If previous reset is less than 24 hours ago, disallow for unused tokens
    if (moment(person.authTokenSent).isAfter(moment().subtract(1, "days")) && !person.authTokenUsed) {
        logger.debug("Token was disallowed, rate-limited while token was unused");
        return false;
    }

    // If time is passed or token was used, alway allow resetting
    logger.debug("Token allowed");
    return true;
}

export async function sendLoginTokenMail(person: Person, token: string, redirectTo?: string) {
    const dashboardURL = `https://my.corona-school.de/login?token=${token}&path=${redirectTo ?? ""}`;

    console.log(dashboardURL);

    try {
        const mail = mailjetTemplates.LOGINTOKEN({
            personFirstname: person.firstname,
            dashboardURL: dashboardURL
        });
        await sendTemplateMail(mail, person.email);
    } catch (e) {
        logger.error("Can't send login token mail: ", e.message);
        logger.debug(e);
    }
}
