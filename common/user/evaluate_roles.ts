import { pupil as Pupil, student as Student, screener as Screener } from '@prisma/client';
import { prisma } from '../prisma';
import { Role } from '../user/roles';
import { getLogger } from '../logger/logger';
import { getStudent, getPupil, getScreener, User } from '.';

const logger = getLogger('Roles');

export async function evaluateUserRoles(user: User): Promise<Role[]> {
    const roles: Role[] = [];
    if (user.studentId) {
        const student = await getStudent(user);
        await evaluateStudentRoles(student, roles);
    }

    if (user.pupilId) {
        const pupil = await getPupil(user);
        await evaluatePupilRoles(pupil, roles);
    }

    if (user.screenerId) {
        const screener = await getScreener(user);
        evaluateScreenerRoles(screener, roles);
    }

    return roles;
}

export async function evaluatePupilRoles(pupil: Pupil, roles: Role[]) {
    roles.push(Role.UNAUTHENTICATED, Role.USER, Role.PUPIL);

    // In general we only trust users who have validated their email to perform advanced actions (e.g. as a TUTEE)
    // NOTE: Due to historic reasons, there are users with both unset verifiedAt and verification
    if (!pupil.verifiedAt && pupil.verification) {
        logger.info(`Pupil(${pupil.id}) was not verified yet, they should re authenticate`);
        return;
    }

    if (!pupil.active) {
        logger.info(`Pupil(${pupil.id}) had deactivated their account, no roles granted`);
        return;
    }

    if (process.env.REQUIRE_PUPIL_SCREENING === 'true') {
        // From Q1 2024 onwards we require pupils to be screened before they can join courses or get a match
        const wasSuccessfullyScreened = (await prisma.pupil_screening.count({ where: { pupilId: pupil.id, status: 'success' } })) > 0;
        // Pupils that registered before and were not yet screened can continue to use the app as they used to
        const alreadyHasMatch = (await prisma.match.count({ where: { pupilId: pupil.id } })) > 0;
        const alreadyJoinedCourse = (await prisma.subcourse_participants_pupil.count({ where: { pupilId: pupil.id } })) > 0;

        if (!wasSuccessfullyScreened && !alreadyHasMatch && !alreadyJoinedCourse) {
            logger.info(`Pupil(${pupil.id}) was not yet successfully screened, no roles granted`);
            return;
        }
    }

    if (pupil.isPupil) {
        roles.push(Role.TUTEE);
        logger.info(`Pupil(${pupil.id}) has TUTEE role`);
    }

    if (pupil.isParticipant) {
        roles.push(Role.PARTICIPANT);
        logger.info(`Pupil(${pupil.id}) has PARTICIPANT role`);
    }

    if (pupil.isProjectCoachee) {
        roles.push(Role.PROJECT_COACHEE);
        logger.info(`Pupil(${pupil.id}) has PROJECT_COACHEE role`);
    }

    if (pupil.teacherEmailAddress) {
        roles.push(Role.STATE_PUPIL);
        logger.info(`Pupil(${pupil.id}) has STATE_PUPIL role`);
    }
}

export async function evaluateStudentRoles(student: Student, roles: Role[]) {
    roles.push(Role.UNAUTHENTICATED, Role.USER, Role.STUDENT);

    // In general we only trust users who have validated their email to perform advanced actions (e.g. as an INSTRUCTOR)
    // NOTE: Due to historic reasons, there are users with both unset verifiedAt and verification
    if (!student.verifiedAt && student.verification) {
        logger.info(`Student(${student.id}) was not verified yet, they should re authenticate`);
        return;
    }

    if (!student.active) {
        logger.info(`Student(${student.id}) had deactivated their account, no roles granted`);
        return;
    }

    if (student.isStudent || student.isProjectCoach) {
        // the user wants to be a tutor or project coach, let's check if they were screened and are authorized to do so
        const wasScreened = (await prisma.screening.count({ where: { studentId: student.id, success: true } })) > 0;
        if (wasScreened) {
            logger.info(`Student(${student.id}) was screened and has TUTOR role`);
            roles.push(Role.TUTOR);
        } else {
            roles.push(Role.WANNABE_TUTOR);
        }
    }

    if (student.isProjectCoach) {
        const wasCoachScreened = (await prisma.project_coaching_screening.count({ where: { studentId: student.id, success: true } })) > 0;
        if (wasCoachScreened) {
            logger.info(`Student(${student.id}) was screened and has PROJECT_COACH role`);
            roles.push(Role.PROJECT_COACH);
        }
    }

    if (student.isInstructor) {
        // the user wants to be a course instructor, let's check if they were screened and are authorized to do so
        const wasInstructorScreened = (await prisma.instructor_screening.count({ where: { studentId: student.id, success: true } })) > 0;
        if (wasInstructorScreened) {
            logger.info(`Student(${student.id}) was instructor screened and has INSTRUCTOR role`);
            roles.push(Role.INSTRUCTOR);
        } else {
            roles.push(Role.WANNABE_INSTRUCTOR);
        }
    }
}

export function evaluateScreenerRoles(screener: Screener, roles: Role[]) {
    roles.push(Role.USER, Role.SCREENER, Role.UNAUTHENTICATED);
    logger.info(`Screener(${screener.id}) was granted SCREENER role`);
    if (screener.is_trusted) {
        roles.push(Role.TRUSTED_SCREENER);
        logger.info(`Screener(${screener.id}) has TRUSTED_SCREENER role`);
    }
    if (screener.is_course_screener) {
        roles.push(Role.COURSE_SCREENER);
        logger.info(`Screener(${screener.id}) has COURSE_SCREENER role`);
    }
    if (screener.is_pupil_screener) {
        roles.push(Role.PUPIL_SCREENER);
        logger.info(`Screener(${screener.id}) has PUPIL_SCREENER role`);
    }
    if (screener.is_student_screener) {
        roles.push(Role.STUDENT_SCREENER);
        logger.info(`Screener(${screener.id}) has STUDENT_SCREENER role`);
    }
}
