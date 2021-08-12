import {Request, Response} from "express";
import {Student} from "../../../common/entity/Student";
import {Pupil} from "../../../common/entity/Pupil";

export function checkValidity(req: Request, res: Response) {
    return res.locals.user instanceof Student
    && req.params.id != undefined
    && (req.body.contactEmail === undefined || typeof req.body.contactEmail === "string")
    && (req.body.description === undefined || typeof req.body.description === "string")
    && req.body.expertiseTags instanceof Array
    && typeof req.body.active === "boolean";
}


export function checkPostContactExpertValidity(req: Request, res: Response) {
    if ((res.locals.user instanceof Student || res.locals.user instanceof Pupil)
    && (typeof req.params.id === 'string' && Number.isInteger(+req.params.id))
    && typeof req.body.emailText == 'string') {
        throw new RESTError(400, "Invalid request for POST /expert/:id/contact");
    } else if (req.body.emailText.length === 0) {
        throw new RESTError(400, `Empty email text specified when trying to send mentor-contact-mail!`);
    } else if (req.body.subject?.length > 255) {
        throw new RESTError(400, 'E-Mail subject has more than 255 characters.');
    }

}
