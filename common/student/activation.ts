/* eslint-disable camelcase */
import { course_coursestate_enum, dissolve_reason, dissolved_by_enum, student as Student } from '@prisma/client';
import { prisma } from '../prisma';
import { dissolveMatch } from '../match/dissolve';
import * as Notification from '../notification';
import { deleteZoomUser } from '../zoom/user';
import { PrerequisiteError } from '../util/error';
import { logTransaction } from '../transactionlog/log';
import { isZoomFeatureActive } from '../zoom/util';
import { userForStudent } from '../user';
import { CertificateState } from '../certificate';

export async function deactivateStudent(student: Student, silent = false, reason?: string) {
    if (!student.active) {
        throw new Error('Student was already deactivated');
    }

    if (!silent) {
        await Notification.actionTaken(userForStudent(student), 'student_account_deactivated', {});
    }

    await Notification.cancelRemindersFor(userForStudent(student));
    // Setting 'active' to false will not send out any notifications during deactivation
    student.active = false;

    // Dissolve matches for the student.
    const matches = await prisma.match.findMany({
        where: {
            studentId: student.id,
            dissolved: false,
        },
    });
    for (const match of matches) {
        await dissolveMatch(match, [dissolve_reason.accountDeactivated], student, dissolved_by_enum.student);
    }

    // Remove any pending certificates, so that they no longer show up in pupil dashboards
    await prisma.participation_certificate.updateMany({
        where: { studentId: student.id, state: CertificateState.awaitingApproval },
        data: { state: CertificateState.manual },
    });

    //Delete course records for the student.
    const courses = await prisma.course.findMany({
        where: {
            course_instructors_student: {
                some: {
                    studentId: student.id,
                },
            },
        },
        include: {
            course_instructors_student: true,
        },
    });

    for (let i = 0; i < courses.length; i++) {
        if (courses[i].course_instructors_student.length > 1) {
            await prisma.course.update({
                where: {
                    id: courses[i].id,
                },
                data: {
                    course_instructors_student: {
                        deleteMany: {
                            studentId: student.id,
                        },
                    },
                },
            });
        } else {
            await prisma.course.update({
                where: {
                    id: courses[i].id,
                },
                data: {
                    subcourse: {
                        updateMany: {
                            where: {},
                            data: {
                                cancelled: true,
                            },
                        },
                    },
                    courseState: course_coursestate_enum.cancelled,
                },
            });
            // TODO Notify participants
        }
    }

    if (isZoomFeatureActive() && student.zoomUserId) {
        await deleteZoomUser(student);
    }

    const updatedStudent = await prisma.student.update({
        data: { active: false },
        where: { id: student.id },
    });

    await logTransaction('deActivate', student, { newStatus: false, deactivationReason: reason });

    return updatedStudent;
}

export async function reactivateStudent(student: Student, reason: string) {
    if (student.active) {
        throw new PrerequisiteError('Student is already active!');
    }
    if (student.isRedacted) {
        throw new PrerequisiteError('Student already got redacted, too late... :(');
    }
    await prisma.student.update({ where: { id: student.id }, data: { active: true } });
    await logTransaction('deActivate', student, { newStatus: true, deactivationReason: reason });
}
