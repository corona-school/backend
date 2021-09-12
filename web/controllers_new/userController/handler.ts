import {Student} from "../../../common/entity/Student";
import {EnumReverseMappings} from "../../../common/util/enumReverseMapping";
import {ServiceError} from "../../custom_error_handlers/ServiceError";
import {ApiProjectFieldInfo} from "../../controllers/userController/format";
import {Pupil} from "../../../common/entity/Pupil";


export function checkPostUserRoleProjectCoachHandlerValidity(req, res) {
    if (!(res.locals.user instanceof Student
        && req.params.id != undefined
        && req.body.projectFields instanceof Array
        && req.body.projectFields.length > 0
        && (req.body.wasJufoParticipant == null || (typeof req.body.wasJufoParticipant === "string" && EnumReverseMappings.TutorJufoParticipationIndication(req.body.wasJufoParticipant)))
        && (req.body.isUniversityStudent == null || typeof req.body.isUniversityStudent === "boolean")
        && (req.body.hasJufoCertificate == null || typeof req.body.hasJufoCertificate === "boolean")
        && (req.body.jufoPastParticipationInfo == null || typeof req.body.jufoPastParticipationInfo === "string"))) {
        throw new ServiceError("invalidRequest", "Missing request parameters for roleProjectCoach.");
    } else {
        //check project fields for validity
        const projectFields = req.body.projectFields as ApiProjectFieldInfo[];
        const unknownProjectField = projectFields.find(s => !EnumReverseMappings.ProjectField(s.name));
        if (unknownProjectField) {
            throw new ServiceError("invalidRequest", `Post User Role Project Coach has invalid project field '${JSON.stringify(unknownProjectField)}'`);
        }
    }
}


export function checkPostUserRoleProjectCoacheeHandlerValidity(req, res) {
    if (!(res.locals.user instanceof Pupil
        && req.params.id != undefined
        && req.body.projectFields instanceof Array
        && typeof req.body.isJufoParticipant === "string"
        && typeof req.body.projectMemberCount === "number")) {
        throw new ServiceError("invalidRequest", "Missing request parameters for roleProjectCoachee.");
    }

    if (req.body.projectFields.length <= 0) {
        throw new ServiceError("invalidRequest", "Post User Role Project Coachee expects projectFields");
    }
    const projectFields = req.body.projectFields as string[];
    const unknownProjectField = projectFields.find(s => !EnumReverseMappings.ProjectField(s));
    if (unknownProjectField) {
        throw new ServiceError("invalidRequest", `Post User Role Project Coachee has invalid project field ${JSON.stringify(unknownProjectField)}`);
    }

    // check isJufoParticipant for validity
    if (!EnumReverseMappings.TuteeJufoParticipationIndication(req.body.isJufoParticipant)) {
        throw new ServiceError("invalidRequest", `Post User Role Project Coachee has invalid value for jufo participation: '${req.body.isJufoParticipant}'`);
    }

    //check projectMemberCount for validity
    const projectMemberCount: number = req.body.projectMemberCount;
    if (projectMemberCount < 1 || projectMemberCount > 3) {
        throw new ServiceError("invalidRequest", `Post User Role Project Coachee has invalid value for projectMemberCount: ${projectMemberCount}`);
    }
}