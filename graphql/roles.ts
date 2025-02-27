import { pupil as Pupil, student as Student } from '@prisma/client';
import { prisma } from '../common/prisma';
import { Role } from '../common/user/roles';
import { getLogger } from '../common/logger/logger';
import { Screener } from './generated';

export { Role } from '../common/user/roles';

const logger = getLogger('Roles');

export function evaluatePupilRoles(pupil: Pupil, roles: Role[]) {
    roles.push(Role.UNAUTHENTICATED, Role.USER, Role.PUPIL);

    // In general we only trust users who have validated their email to perform advanced actions (e.g. as a TUTEE)
    if (!pupil.verifiedAt) {
        logger.info(`Pupil(${pupil.id}) was not verified yet, they should re authenticate`);
        return;
    }

    if (!pupil.active) {
        logger.info(`Pupil(${pupil.id}) had deactivated their account, no roles granted`);
        return;
    }

    if (pupil.isPupil) {
        roles.push(Role.TUTEE);
        logger.info(`Pupil(${pupil.id}) has TUTEE role`);
    }

    if (pupil.isParticipant) {
        roles.push(Role.PARTICIPANT);
        logger.info(`Pupil(${pupil.id}) has PARTICIPANT role`);
    }

    if (pupil.teacherEmailAddress) {
        roles.push(Role.STATE_PUPIL);
        logger.info(`Pupil(${pupil.id}) has STATE_PUPIL role`);
    }
}

export async function evaluateStudentRoles(student: Student, roles: Role[]) {
    roles.push(Role.UNAUTHENTICATED, Role.USER, Role.STUDENT);

    // In general we only trust users who have validated their email to perform advanced actions (e.g. as an INSTRUCTOR)
    if (!student.verifiedAt) {
        logger.info(`Student(${student.id}) was not verified yet, they should re authenticate`);
        return;
    }

    if (!student.active) {
        logger.info(`Student(${student.id}) had deactivated their account, no roles granted`);
        return;
    }

    if (student.isStudent) {
        // the user wants to be a tutor or project coach, let's check if they were screened and are authorized to do so
        const wasScreened = (await prisma.screening.count({ where: { studentId: student.id, success: true } })) > 0;
        if (wasScreened) {
            logger.info(`Student(${student.id}) was screened and has TUTOR role`);
            roles.push(Role.TUTOR);
        } else {
            roles.push(Role.WANNABE_TUTOR);
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
}
