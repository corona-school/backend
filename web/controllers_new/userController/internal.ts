import {Student} from "../../../common/entity/Student";
import {ApiUserRoleProjectCoach, ApiUserRoleProjectCoachee} from "../../controllers/userController/format";
import {TutorJufoParticipationIndication} from "../../../common/jufo/participationIndication";
import {getManager} from "typeorm";
import {ProjectFieldWithGradeInfoType} from "../../../common/jufo/projectFieldWithGradeInfoType";
import {
    sendFirstScreeningInvitationToProjectCoachingJufoAlumni,
    sendFirstScreeningInvitationToTutor
} from "../../../common/administration/screening/initial-invitations";
import {getLogger} from "log4js";
import {Pupil} from "../../../common/entity/Pupil";

const logger = getLogger();

export async function postUserRoleProjectCoach(wixId: string, student: Student, info: ApiUserRoleProjectCoach): Promise<number> {
    if (wixId != student.wix_id) {
        logger.warn("Person with id " + student.wix_id + " tried to access data from id " + wixId);
        return 403;
    }

    if (student.isProjectCoach) {
        logger.warn("Current user already is a project coach");
        return 400;
    }

    //other validity checks, only required if current user is no student
    if (student.isStudent === false && !info.isUniversityStudent) {
        if (info.isUniversityStudent == undefined) {
            logger.warn(`User ${student.email} requires indication of whether or not s*he is a university student`);
            return 400;
        }
        //if here, the info's isUniversityStudent is false
        if (!info.wasJufoParticipant) {
            //then expect info on university student
            logger.warn(`User ${student.email} requires indication on jufo participation!`);
            return 400;
        }
        if (info.wasJufoParticipant === TutorJufoParticipationIndication.NO) {
            logger.warn(`User ${student.email} cannot be no jufo participant and no university student at the same time!`);
            return 400;
        }
        //if here, the user was a jufo participant
        if (info.hasJufoCertificate == undefined) {
            logger.warn(`User ${student.email} which was a jufo participant requires info on whether a jufo certificate exists!`);
            return 400;
        }
        if (info.hasJufoCertificate === false && !info.jufoPastParticipationInfo) {
            logger.warn(`User ${student.email} which was a jufo participant and which has no jufo certificate requires other information about her past jufo participation!`);
            return 400;
        }
        //if here, the user is no student, no university student, was a past jufo participant and has a jufo certificate or provided some info on his past jufo participation -> that is valid
    }

    const entityManager = getManager();
    //TODO: Implement transactionLog

    try {
        student.isProjectCoach = true;
        await student.setProjectFields(info.projectFields as ProjectFieldWithGradeInfoType[]);
        student.wasJufoParticipant = info.wasJufoParticipant;
        student.isUniversityStudent = info.isUniversityStudent;
        student.hasJufoCertificate = info.hasJufoCertificate;
        student.jufoPastParticipationInfo = info.jufoPastParticipationInfo;

        // TODO: transaction log
        await entityManager.save(Student, student);
    } catch (e) {
        logger.error("Unable to update student status: " + e.message);
        return 500;
    }

    //send screening invitations, if necessary (it's necessary only if the person is not a student and not a person registered in a university while being a jufo participant without still having a certificate)
    try {
        if (!student.isStudent && !(student.isUniversityStudent === false && student.wasJufoParticipant === TutorJufoParticipationIndication.YES && student.hasJufoCertificate === false)) {
            if (student.isUniversityStudent) {
                //send usual tutor screening invitation
                await sendFirstScreeningInvitationToTutor(entityManager, student);
            } else if (student.wasJufoParticipant === TutorJufoParticipationIndication.YES && student.hasJufoCertificate === true) {
                //invite to jufo specific screening
                await sendFirstScreeningInvitationToProjectCoachingJufoAlumni(entityManager, student);
            }
        }
    } catch (e) {
        logger.error(`Cannot send screening invitation (after adding role) to ${student.email}... ${e}`);
    }

    return 204;
}




export async function postUserRoleProjectCoachee(wixId: string, pupil: Pupil, info: ApiUserRoleProjectCoachee): Promise<number> {
    if (wixId != pupil.wix_id) {
        logger.warn("Person with id " + pupil.wix_id + " tried to access data from id " + wixId);
        return 403;
    }

    if (pupil.isProjectCoachee) {
        logger.warn("Current user already is a project coachee");
        return 400;
    }

    const entityManager = getManager();

    try {
        pupil.isProjectCoachee = true;
        pupil.projectFields = info.projectFields;
        pupil.isJufoParticipant = info.isJufoParticipant;
        pupil.projectMemberCount = info.projectMemberCount;

        // TODO: transaction log
        await entityManager.save(Pupil, pupil);
    } catch (e) {
        logger.error("Unable to update pupil status: " + e.message);
        return 500;
    }

    return 204;
}
