import { getLogger } from "log4js";
import {Request, Response} from "express";
import {postUserRoleProjectCoach, postUserRoleProjectCoachee} from "./internal";
import {checkPostUserRoleProjectCoacheeHandlerValidity, checkPostUserRoleProjectCoachHandlerValidity} from "./handler";
import {ServiceError} from "../../custom_error_handlers/ServiceError";

const logger = getLogger();


export async function postUserRoleProjectCoachHandler(req: Request, res: Response) {
    let status = 204;
    try {
        checkPostUserRoleProjectCoachHandlerValidity(req, res);
        if (status < 300) {
            status = await postUserRoleProjectCoach(req.params.id, res.locals.user, req.body);
        }
    } catch (e) {
        status = 500;
        logger.error("GetExperts failed with ", e.message);
        if (e instanceof ServiceError) {
            status = e.getRESTStatusCode();
        }
    }
    res.status(status).end();
}



export async function postUserRoleProjectCoacheeHandler(req: Request, res: Response) {
    let status = 204;
    try {
        checkPostUserRoleProjectCoacheeHandlerValidity(req, res);
        status = await postUserRoleProjectCoachee(req.params.id, res.locals.user, req.body);
    } catch (e) {
        status = 500;
        logger.error("GetExperts failed with ", e.message);
        if (e instanceof ServiceError) {
            status = e.getRESTStatusCode();
        }
    }
    res.status(status).end();
}


