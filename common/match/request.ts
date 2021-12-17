import { pupil as Pupil, student as Student } from "@prisma/client";
import { RegistrationSource } from "../entity/Person";
import { getLogger } from "log4js";
import { prisma } from "../prisma";
import { assertAllowed, Decision } from "../util/decision";

const logger = getLogger("Match");

const PUPIL_MAX_REQUESTS = 1;
const STUDENT_MAX_REQUESTS = 3;
const PUPIL_MAX_MATCHES = 3;


type RequestBlockReasons = "max-requests" | "max-matches";

export async function canPupilRequestMatch(pupil: Pupil): Promise<Decision<RequestBlockReasons>> {
    // Business Rules as outlined in https://github.com/corona-school/project-user/issues/404

    if (pupil.openMatchRequestCount >= PUPIL_MAX_REQUESTS) {
        return { allowed: false, reason: "max-requests", limit: PUPIL_MAX_REQUESTS };
    }

    if (pupil.registrationSource === "" + RegistrationSource.COOPERATION) {
        return { allowed: true };
    }

    const lastYear = new Date();
    lastYear.setFullYear(lastYear.getFullYear() - 1);

    const matchCountLastYear = await prisma.match.count({ where: { pupilId: pupil.id, createdAt: { gte: lastYear } } });
    if (pupil.openMatchRequestCount + matchCountLastYear >= PUPIL_MAX_MATCHES) {
        return { allowed: false, reason: "max-matches", limit: PUPIL_MAX_MATCHES };
    }

    return { allowed: true };
}

export async function createPupilMatchRequest(pupil: Pupil, adminOverride = false) {
    if (!adminOverride) {
        assertAllowed(await canPupilRequestMatch(pupil));
    }

    const result = await prisma.pupil.update({
        where: { id: pupil.id },
        data: { openMatchRequestCount: { increment: 1 } }
    });

    logger.info(`Created match request for Pupil(${pupil.id}), now has ${result.openMatchRequestCount} requests, was admin: ${adminOverride}`);
}

export async function deletePupilMatchRequest(pupil: Pupil) {
    if (pupil.openMatchRequestCount <= 0) {
        throw new Error(`Cannot delete match request for Pupil(${pupil.id}) as pupil has no request left`);
    }

    const result = await prisma.pupil.update({
        where: { id: pupil.id },
        data: { openMatchRequestCount: { decrement: 1 } }
    });

    logger.info(`Deleted match request for pupil, now has ${result.openMatchRequestCount} requests`);
}

export function canStudentRequestMatch(student: Student): Decision<RequestBlockReasons> {
    if (student.openMatchRequestCount >= STUDENT_MAX_REQUESTS) {
        return { allowed: false, reason: "max-requests", limit: STUDENT_MAX_REQUESTS };
    }

    return { allowed: true };
}

export async function createStudentMatchRequest(student: Student, adminOverride = false) {
    if (!adminOverride) {
        assertAllowed(canStudentRequestMatch(student));
    }

    const result = await prisma.student.update({
        where: { id: student.id },
        data: { openMatchRequestCount: { increment: 1 } }
    });

    logger.info(`Created match request for Student(${student.id}), now has ${result.openMatchRequestCount} requests, was admin: ${adminOverride}`);
}

export async function deleteStudentMatchRequest(student: Student) {
    if (student.openMatchRequestCount <= 0) {
        throw new Error(`Cannot delete match request for Student(${student.id}) as student has no request left`);
    }

    const result = await prisma.student.update({
        where: { id: student.id },
        data: { openMatchRequestCount: { decrement: 1 } }
    });

    logger.info(`Deleted match request for student, now has ${result.openMatchRequestCount} requests`);
}