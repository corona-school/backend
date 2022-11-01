import { pupil as Pupil, student as Student } from '@prisma/client';
import { User } from '../common/user';
import { prisma } from '../common/prisma';
import type { GraphQLContext } from './context';
import { logInContext } from './logging';

export enum Role {
    /* Elevated Access via Retool */
    ADMIN = 'ADMIN',
    /* Shortcut role for everyone with an account */
    USER = 'USER',
    /* Elevated Access via Screener Admin Interface */
    SCREENER = 'SCREENER',
    /* Access via User Interface, not yet E-Mail verified */
    PUPIL = 'PUPIL',
    STUDENT = 'STUDENT',
    /* Accessible to everyone */
    UNAUTHENTICATED = 'UNAUTHENTICATED',
    /* User owns the entity as defined in graphql/ownership */
    OWNER = 'OWNER',
    /* No one should have access */
    NOBODY = 'NOBODY',

    /* User is a student, requested to be a tutor and was successfully screened (E-Mail also verified) */
    TUTOR = 'TUTOR',
    /* User is a student, requested to be a course instructor and was successfully "instructor screened" (E-Mail also verified) */
    INSTRUCTOR = 'INSTRUCTOR',
    /* User is a student, requested to be a project coach and was successfully screened (E-Mail also verified) */
    PROJECT_COACH = 'PROJECT_COACH',

    /* User is a pupil and requested to receive one-on-one tutoring */
    TUTEE = 'TUTEE',
    /* User is a pupil and requested to participate in courses */
    PARTICIPANT = 'PARTICIPANT',
    /* User is a pupil and requested to participate in project coaching */
    PROJECT_COACHEE = 'PROJECT_COACHEE',
    /* User is a pupil and linked his teacher's email address (matching his school, which is a cooperation school) */
    STATE_PUPIL = 'STATE_PUPIL',
    /* User is a pupil and participant of a specific subcourse */
    SUBCOURSE_PARTICIPANT = 'SUBCOURSE_PARTICIPANT',
}

export async function evaluatePupilRoles(pupil: Pupil, context: GraphQLContext) {
    const logger = logInContext(`GraphQL Authentication`, context);

    context.user.roles = [Role.UNAUTHENTICATED, Role.USER, Role.PUPIL];

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

    if (pupil.isPupil) {
        context.user.roles.push(Role.TUTEE);
        logger.info(`Pupil(${pupil.id}) has TUTEE role`);
    }

    if (pupil.isParticipant) {
        context.user.roles.push(Role.PARTICIPANT);
        logger.info(`Pupil(${pupil.id}) has PARTICIPANT role`);
    }

    if (pupil.isProjectCoachee) {
        context.user.roles.push(Role.PROJECT_COACHEE);
        logger.info(`Pupil(${pupil.id}) has PROJECT_COACHEE role`);
    }

    if (pupil.teacherEmailAddress) {
        context.user.roles.push(Role.STATE_PUPIL);
        logger.info(`Pupil(${pupil.id}) has STATE_PUPIL role`);
    }
}

export async function evaluateStudentRoles(student: Student, context: GraphQLContext) {
    const logger = logInContext(`GraphQL Authentication`, context);

    context.user.roles = [Role.UNAUTHENTICATED, Role.USER, Role.STUDENT];

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
            context.user.roles.push(Role.TUTOR);
        }
    }

    if (student.isProjectCoach) {
        const wasCoachScreened = (await prisma.project_coaching_screening.count({ where: { studentId: student.id, success: true } })) > 0;
        if (wasCoachScreened) {
            logger.info(`Student(${student.id}) was screened and has PROJECT_COACH role`);
            context.user.roles.push(Role.PROJECT_COACH);
        }
    }

    if (student.isInstructor) {
        // the user wants to be a course instructor, let's check if they were screened and are authorized to do so
        const wasInstructorScreened = (await prisma.instructor_screening.count({ where: { studentId: student.id, success: true } })) > 0;
        if (wasInstructorScreened) {
            logger.info(`Student(${student.id}) was instructor screened and has INSTRUCTOR role`);
            context.user.roles.push(Role.INSTRUCTOR);
        }
    }
}

export async function evaluateScreenerRoles(user: User, context: GraphQLContext) {
    const logger = logInContext(`GraphQL Authentication`, context);

    context.user.roles.push(Role.USER, Role.SCREENER, Role.UNAUTHENTICATED);
    logger.info(`Screener(${user.screenerId}) was granted SCREENER role`);
}
