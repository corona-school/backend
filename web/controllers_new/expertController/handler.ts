import {Request, Response} from "express";
import {Student} from "../../../common/entity/Student";
import {Pupil} from "../../../common/entity/Pupil";
import {ServiceError} from "../../custom_error_handlers/ServiceError";

export function checkPutExpertsHandlerValidity(req: Request, res: Response) {
    if (!(res.locals.user instanceof Student
        && req.params.id != undefined
        && (req.body.contactEmail === undefined || typeof req.body.contactEmail === "string")
        && (req.body.description === undefined || typeof req.body.description === "string")
        && req.body.expertiseTags instanceof Array
        && typeof req.body.active === "boolean")) {
        throw new ServiceError("invalidRequest", "Invalid request parameters for PUT /expert/:id");
    } else {
        for (let i = 0; i < req.body.expertiseTags.length; i++) {
            if (typeof req.body.expertiseTags[i] !== "string") {
                throw new ServiceError("improperParameters", `Invalid expertise tag ${JSON.stringify(req.body.expertiseTags[i])}`);
            }
        }
    }
}


export function checkgetExpertsHandlerValidity(req: Request, res:Response) {
    if (!(res.locals.user instanceof Student || res.locals.user instanceof Pupil)) {
        throw new ServiceError("unauthorisedOrigin", "Someone who is neither student or pupil wanted to access the expert data.");
    }
}

export function checkPostContactExpertValidity(req: Request, res: Response) {
    if (!((res.locals.user instanceof Student || res.locals.user instanceof Pupil)
    && (typeof req.params.id === 'string' && Number.isInteger(+req.params.id))
    && typeof req.body.emailText == 'string')) {
        throw new ServiceError("invalidRequest", "Invalid request for POST /expert/:id/contact");
    } else if (req.body.emailText.length === 0) {
        throw new ServiceError("improperParameters", `Empty email text specified when trying to send mentor-contact-mail!`);
    } else if (req.body.subject?.length > 255) {
        throw new ServiceError("improperParameters", 'E-Mail subject has more than 255 characters.');
    }

}


export function checkGetUsedTagsHandlerValidity(req, res) {
    if (!(res.locals.user instanceof Student || res.locals.user instanceof Pupil)) {
        throw new ServiceError("unauthorisedOrigin", "Someone who is neither student or pupil wanted to access the expertise tags.");
    }

}