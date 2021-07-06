import { getLogger } from "log4js";
import { Request, Response } from "express";
import { getManager } from "typeorm";
import { Person } from "../../../common/entity/Person";
import { Student } from "../../../common/entity/Student";
import { Pupil } from "../../../common/entity/Pupil";
import { sendTemplateMail, mailjetTemplates } from "../../../common/mails";
import { TemplateMail } from "../../../common/mails/templates";
import { getTransactionLog } from "../../../common/transactionlog";
import { ProjectMatch } from "../../../common/entity/ProjectMatch";
import ProjectMatchDissolveEvent from "../../../common/transactionlog/types/ProjectMatchDissolveEvent";
import * as Notification from "../../../common/notification";

const logger = getLogger();

/**
 * @api {DELETE} /user/:id/projectMatches/:uuid dissolveProjectMatch
 * @apiVersion 1.1.0
 * @apiDescription
 * Dissolve the specified ProjectMatch.
 *
 * This endpoint can be used to signal, that a user wants to dissolve his project match.
 * The matched partner will be notified of this action.
 * Both students and pupils are only authorized to dissolve project matches, where they are a part of.
 * @apiName deleteProjectMatch
 * @apiGroup ProjectMatch
 *
 * @apiUse Authentication
 *
 * @apiExample {curl} Curl
 * curl -k -i -X DELETE -H "Token: <AUTHTOKEN>"-H "Content-Type: application/json"  https://api.corona-school.de/api/user/<ID>/projectMatches/<UUID>
 *
 * @apiParam (URL Parameter) {string} id User Id
 * @apiParam (URL Parameter) {string} uuid UUID of the Project Match
 *
 * @apiUse ProjectMatchDissolveReason
 *
 * @apiUse StatusNoContent
 * @apiUse StatusBadRequest
 * @apiUse StatusUnauthorized
 * @apiUse StatusInternalServerError
 *
 */
export async function deleteHandler(req: Request, res: Response) {
    let status;

    const maxReason = 8;

    try {
        let b = req.body;
        if (req.params.id != undefined &&
            req.params.uuid != undefined &&
            res.locals.user instanceof Person &&
            typeof b.reason == "number" &&
            Number.isInteger(b.reason) &&
            b.reason >= -1 &&
            b.reason <= maxReason) {
            try {
                status = await del(req.params.id, req.params.uuid, b.reason, res.locals.user);
            } catch (e) {
                logger.warn("Error DELETE /match: " + e.message);
                logger.debug(e);
                status = 500;
            }
        } else {
            status = 400;
        }
    } catch (e) {
        logger.error("Unexpected format of express request: " + e.message);
        logger.debug(req, e);
        status = 500;
    }
    res.status(status).end();
}

async function del(wix_id: string, uuid: string, reason: number, person: Pupil | Student): Promise<number> {
    const entityManager = getManager();
    const transactionLog = getTransactionLog();

    if (person == null) {
        logger.error("No authenticated user.");
        return 500;
    }
    // Authorization
    if (person.wix_id != wix_id) {
        logger.warn("Person with id " + person.id + " tried to access data from id " + wix_id);
        return 403;
    }

    let options;
    if (person instanceof Student) {
        options = {
            uuid: uuid,
            student: person,
            dissolved: false
        };
    } else if (person instanceof Pupil) {
        options = {
            uuid: uuid,
            pupil: person,
            dissolved: false
        };
    } else {
        logger.error("Unknown type of person: " + typeof person);
        logger.debug(person);
        return 500;
    }
    try {
        let matches = await entityManager.find(ProjectMatch, options);
        if (matches.length == 0) {
            logger.warn("Person with id " + person.id + " tried to dissolve project match (UUID " + uuid + "), " + "but he has no access or it doesn't exist or it was already dissolved.");
            return 403;
        }
        if (matches.length > 1) {
            logger.warn("Caution: Multiple project matches with uuid " + uuid + " found. Using first");
        }

        await dissolveProjectMatch(matches[0], reason, person);
        await transactionLog.log(new ProjectMatchDissolveEvent(person, matches[0]));
    } catch (e) {
        logger.error("Can't use entity manager to find and delete: " + e.message);
        logger.debug(e);
        return 500;
    }

    return 204;
}

export async function dissolveProjectMatch(projectMatch: ProjectMatch, reason: number, dissolver: Person) {
    const entityManager = getManager();

    projectMatch.dissolved = true;
    projectMatch.dissolveReason = reason;
    await entityManager.save(ProjectMatch, projectMatch);

    // Send notification mail to partner
    if (dissolver instanceof Student) {
        await sendProjectMatchDissolvedMail(projectMatch.pupil, projectMatch.student);
    } else {
        await sendProjectMatchDissolvedMail(projectMatch.student, projectMatch.pupil);
    }
}

export async function sendProjectMatchDissolvedMail(to: Person, dissolver: Person) {
    try {
        let mail: TemplateMail;
        if (to instanceof Pupil) {
            // Send mail to (remaining) coachee
            mail = mailjetTemplates.PROJECTCOACHEEMATCHDISSOLVED({
                coacheeFirstname: to.firstname,
                coachFirstname: dissolver.firstname
            });
            await Notification.actionTaken(to, "coachee_project_match_dissolved", {
                coach: dissolver
            });
        } else {
            // Send mail to (remaining) coach
            mail = mailjetTemplates.PROJECTCOACHMATCHDISSOLVED({
                coachFirstname: to.firstname,
                coacheeFirstname: dissolver.firstname
            });
            await Notification.actionTaken(to, "coach_project_match_dissolved", {
                coachee: dissolver
            });
        }
        //send out mail...
        await sendTemplateMail(mail, to.email);
    } catch (e) {
        logger.error("Can't send project match dissolved mail: ", e.message);
        logger.debug(e);
    }
}
