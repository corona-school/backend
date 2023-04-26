import { getLogger } from '../../../common/logger/logger';
import { Request, Response } from "express";
import { getManager } from "typeorm";
import { Person } from "../../../common/entity/Person";
import { Match } from "../../../common/entity/Match";
import { Student } from "../../../common/entity/Student";
import { Pupil } from "../../../common/entity/Pupil";
import { sendTemplateMail, mailjetTemplates } from "../../../common/mails";
import { TemplateMail } from "../../../common/mails/templates";
import { getTransactionLog } from "../../../common/transactionlog";
import MatchDissolveEvent from "../../../common/transactionlog/types/MatchDissolveEvent";
import * as Notification from "../../../common/notification";
import { getMatchHash } from "../../../common/match/util";

const logger = getLogger();

/**
 * @api {DELETE} /user/:id/matches/:uuid dissolveMatch
 * @apiVersion 1.1.0
 * @apiDescription
 * Dissolve the specified Match.
 *
 * This endpoint can be used to signal, that a user wants to dissolve his match.
 * The matched partner will be notified of this action.
 * Both students and pupils are only authorized to dissolve matches, where they are a part of.
 * @apiName deleteMatch
 * @apiGroup Match
 *
 * @apiUse Authentication
 *
 * @apiExample {curl} Curl
 * curl -k -i -X DELETE -H "Token: <AUTHTOKEN>"-H "Content-Type: application/json"  https://api.corona-school.de/api/user/<ID>/matches/<UUID>
 *
 * @apiParam (URL Parameter) {string} id User Id
 * @apiParam (URL Parameter) {string} uuid UUID of the Match
 *
 * @apiUse DissolveReason
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
            (res.locals.user instanceof Pupil || res.locals.user instanceof Student) &&
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
        let matches = await entityManager.find(Match, options);
        if (matches.length == 0) {
            logger.warn("Person with id " + person.id + " tried to dissolve match (UUID " + uuid + "), " + "but he has no access or it doesn't exist.");
            return 403;
        }
        if (matches.length > 1) {
            logger.warn("Caution: Multiple matches with uuid " + uuid + " found. Using first");
        }

        await dissolveMatch(matches[0], reason, person);
        await transactionLog.log(new MatchDissolveEvent(person, matches[0]));
    } catch (e) {
        logger.error("Can't use entity manager to find and delete: " + e.message);
        logger.debug(e);
        return 500;
    }

    return 204;
}

export async function dissolveMatch(match: Match, reason: number, dissolver: Person) {
    const entityManager = getManager();

    match.dissolved = true;
    match.dissolveReason = reason;
    await entityManager.save(Match, match);

    try {
        const matchHash = getMatchHash(match);
        const matchDate = "" + (+match.createdAt);
        const uniqueId = "" + match.id;

        await Notification.actionTaken(match.pupil, "tutee_match_dissolved", {
            student: match.student,
            matchHash,
            matchDate,
            uniqueId
        });
        await Notification.actionTaken(match.student, "tutor_match_dissolved", {
            pupil: match.pupil,
            matchHash,
            matchDate,
            uniqueId
        });
    } catch (e) {
        logger.error("Can't send match dissolved mail: ", e.message);
        logger.debug(e);
    }
}
