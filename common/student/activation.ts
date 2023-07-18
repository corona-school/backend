/* eslint-disable camelcase */
import { course_coursestate_enum, student as Student } from '@prisma/client';
import { prisma } from '../prisma';
import { dissolveMatch } from '../match/dissolve';
import * as Notification from '../notification';
import { getZoomUser } from '../zoom/zoom-user';
import { deleteZoomUser } from '../zoom/zoom-user';
import { deleteZoomMeeting } from '../zoom/zoom-scheduled-meeting';
import { PrerequisiteError } from '../util/error';
import { isZoomFeatureActive } from '../zoom';
import { logTransaction } from '../transactionlog/log';

export async function deactivateStudent(student: Student, silent: boolean = false, reason?: string) {
    if (!student.active) {
        throw new Error('Student was already deactivated');
    }

    if (!silent) {
        await Notification.actionTaken(student, 'student_account_deactivated', {});
    }

    await Notification.cancelRemindersFor(student);
    // Setting 'active' to false will not send out any notifications during deactivation
    student.active = false;

    // Dissolve matches for the student.
    let matches = await prisma.match.findMany({
        where: {
            studentId: student.id,
            dissolved: false,
        },
    });
    for (const match of matches) {
        await dissolveMatch(match, 0, student);
    }

    //Delete course records for the student.
    let courses = await prisma.course.findMany({
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
