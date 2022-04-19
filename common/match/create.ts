import { student as Student, pupil as Pupil } from "@prisma/client";
import { prisma } from "../prisma";
import { v4 as generateUUID } from "uuid";
import { mailjetTemplates, sendTemplateMail } from "../mails";
import { getPupilGradeAsString } from "../pupil";
import * as Notification from "../notification";
import { getJitsiTutoringLink, getMatchHash, getOverlappingSubjects } from "./util";
import { getLogger } from "log4js";
import { PrerequisiteError } from "../util/error";
import type { MatchPool } from "./pool";

const logger = getLogger("Match");

export async function createMatch(pupil: Pupil, student: Student, pool: MatchPool) {
    const uuid = generateUUID();

    if (pupil.openMatchRequestCount < 1) {
        throw new PrerequisiteError(`Cannot create Match for Pupil without open match requests`);
    }

    if (student.openMatchRequestCount < 1) {
        throw new PrerequisiteError(`Cannot create Match for Student without open match request count`);
    }

    const match = await prisma.match.create({
        data: {
            uuid,
            pupilId: pupil.id,
            studentId: student.id,
            matchPool: pool.name
        }
    });

    await prisma.pupil.update({
        where: { id: pupil.id },
        data: {
            openMatchRequestCount: { decrement: 1 }
        }
    });

    await prisma.student.update({
        where: { id: student.id },
        data: {
            openMatchRequestCount: { decrement: 1 }
        }
    });

    const callURL = getJitsiTutoringLink(match);
    const subjects = getOverlappingSubjects(pupil, student)
        .map(it => it.name)
        .join("/");

    const tutorMail = mailjetTemplates.TUTORNEWMATCH({
        pupilFirstname: pupil.firstname,
        personFirstname: student.firstname,
        pupilEmail: pupil.email,
        pupilGrade: getPupilGradeAsString(pupil),
        subjects,
        callURL
    });

    const tutorFirstMatch = await prisma.match.count({ where: { studentId: student.id } }) === 1;
    const tuteeFirstMatch = await prisma.match.count({ where: { pupilId: pupil.id } }) === 1;


    const matchHash = getMatchHash(match);
    // NOTE: JSON numbers which are larger than 32 bit integers crash mailjet internally, so strings need to be used here
    const matchDate = "" + (+match.createdAt);

    await sendTemplateMail(tutorMail, student.email);
    if (pool.name !== "lern-fair-plus") {
        await Notification.actionTaken(student, "tutor_matching_success", {
            uniqueId: "" + match.id,
            pupil,
            pupilGrade: getPupilGradeAsString(pupil),
            subjects,
            callURL,
            firstMatch: tutorFirstMatch,
            matchHash,
            matchDate
        });
    }

    const tuteeMail = mailjetTemplates.TUTEENEWMATCH({
        pupilFirstname: pupil.firstname,
        studentFirstname: student.firstname,
        studentEmail: student.email,
        subjects,
        callURL
    });

    await sendTemplateMail(tuteeMail, pupil.email);
    if (pool.name !== "lern-fair-plus") {
        await Notification.actionTaken(pupil, "tutee_matching_success", {
            uniqueId: "" + match.id,
            student,
            subjects,
            callURL,
            firstMatch: tuteeFirstMatch,
            matchHash,
            matchDate
        });
    }

    logger.info(`Created Match(${match.uuid}) for Student(${student.id}) and Pupil(${pupil.id})`);
}