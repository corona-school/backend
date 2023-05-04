/* eslint-disable camelcase */
import { course_coursestate_enum, student as Student } from '@prisma/client';
import { prisma } from '../prisma';
import { dissolveMatch, dissolveProjectMatch } from '../match/dissolve';
import { getTransactionLog } from '../transactionlog';
import DeActivateEvent from '../transactionlog/types/DeActivateEvent';
import * as Notification from '../notification';
import { getZoomUser } from '../zoom/zoom-user';
import { deleteZoomUser } from '../zoom/zoom-user';
import { deleteZoomMeeting } from '../zoom/zoom-scheduled-meeting';

export async function deactivateStudent(student: Student, silent: boolean = false, reason?: string) {
    //TODO: Delete Zoom meeting
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
        // match.meetingId && await deleteZoomMeeting(match.meetingId);
    }

    let projectMatches = await prisma.project_match.findMany({
        where: {
            studentId: student.id,
            dissolved: false,
        },
    });

    for (const match of projectMatches) {
        await dissolveProjectMatch(match, 0, student);
        // match.meetingId && await deleteZoomMeeting(match.meetingId);
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
        // courses[i].meetingId && await deleteZoomMeeting(courses[i].meetingId);
    }

    const zoomUser = await getZoomUser(student.email);

    if (zoomUser) {
        await deleteZoomUser(process.env.ZOOM_USER_ID);
    }

    const updatedStudent = await prisma.student.update({
        data: { active: false },
        where: { id: student.id },
    });

    await getTransactionLog().log(new DeActivateEvent(student, false, reason));

    return updatedStudent;
}
