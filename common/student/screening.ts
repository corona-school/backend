import { student as Student, screener as Screener } from "@prisma/client";
import { prisma } from "../prisma";
import * as Notification from "../notification";
import { getLogger } from "log4js";

interface ScreeningInput {
    success: boolean;
    comment?: string;
    knowsCoronaSchoolFrom?: string;
}

const logger = getLogger("Student Screening");

export async function addInstructorScreening(screener: Screener, student: Student, screening: ScreeningInput) {
    await prisma.instructor_screening.create({
        data: {
            ...screening,
            screenerId: screener.id,
            studentId: student.id
        }
    });

    if (screening.success) {
        await Notification.actionTaken(student, "instructor_screening_success", {});
    } else {
        await Notification.actionTaken(student, "instructor_screening_rejection", {});
    }

    logger.info(`Screener(${screener.id}) instructor screened Student(${student.id})`, screening);

}

export async function addTutorScreening(screener: Screener, student: Student, screening: ScreeningInput) {
    await prisma.screening.create({
        data: {
            ...screening,
            screenerId: screener.id,
            studentId: student.id
        }
    });

    if (screening.success) {
        await Notification.actionTaken(student, "tutor_screening_success", {});
    } else {
        await Notification.actionTaken(student, "tutor_screening_rejection", {});
    }

    logger.info(`Screener(${screener.id}) tutor screened Student(${student.id})`, screening);

}