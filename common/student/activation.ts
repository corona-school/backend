/* eslint-disable camelcase */
import { course_coursestate_enum, dissolve_reason, dissolved_by_enum, student as Student } from '@prisma/client';
import { prisma } from '../prisma';
import { dissolveMatch } from '../match/dissolve';
import * as Notification from '../notification';
import { deleteZoomUser } from '../zoom/user';
import { PrerequisiteError } from '../util/error';
import { logTransaction } from '../transactionlog/log';
import { isZoomFeatureActive } from '../zoom/util';
import { DeactivationReason, userForStudent } from '../user';
import { CertificateState } from '../certificate';
import { removeAllPushSubcriptions } from '../notification/channels/push';
import { cancelSubcourse, removeSubcourseInstructor, subcourseOver } from '../courses/states';
import { removeSubcourseMentor } from '../courses/participants';

export async function deactivateStudent(
    _student: Student,
    silent = false,
    reason?: DeactivationReason,
    otherReason?: string,
    dissolveReasons: dissolve_reason[] = [dissolve_reason.accountDeactivated]
) {
    if (!_student.active) {
        throw new Error('Student was already deactivated');
    }

    if (!silent) {
        if (reason === DeactivationReason.noMoreInterest) {
            await Notification.actionTaken(userForStudent(_student), 'student_account_deactivated_no_more_interest', {});
        } else {
            await Notification.actionTaken(userForStudent(_student), 'student_account_deactivated', {});
        }
    }

    await Notification.cancelRemindersFor(userForStudent(_student));
    // Setting 'active' to false will not send out any notifications during deactivation
    const student = await prisma.student.update({
        data: { active: false },
        where: { id: _student.id },
    });

    await removeAllPushSubcriptions(userForStudent(student));

    // Dissolve matches for the student.
    const matches = await prisma.match.findMany({
        where: {
            studentId: student.id,
            dissolved: false,
        },
    });
    for (const match of matches) {
        await dissolveMatch(match, dissolveReasons, student, dissolved_by_enum.student);
    }

    // Remove any pending certificates, so that they no longer show up in pupil dashboards
    await prisma.participation_certificate.updateMany({
        where: { studentId: student.id, state: CertificateState.awaitingApproval },
        data: { state: CertificateState.manual },
    });

    // Cancel subcourses
    const subcourses = await prisma.subcourse.findMany({
        where: {
            cancelled: false,
            subcourse_instructors_student: {
                some: {
                    studentId: student.id,
                },
            },
        },
        include: {
            subcourse_instructors_student: true,
        },
    });

    for (const subcourse of subcourses) {
        const isSubcourseOver = await subcourseOver(subcourse);
        // We don't need to update subcourses that are already over
        if (isSubcourseOver) {
            continue;
        }
        // There are multiple instructors, so just remove the student from the subcourse
        if (subcourse.subcourse_instructors_student.length > 1) {
            await removeSubcourseInstructor(userForStudent(student), subcourse, student);
        } else {
            // there is only one instructor, so cancel the subcourse
            await cancelSubcourse(userForStudent(student), subcourse, true);
        }
    }

    // Remove the student from any courses where they were mentors
    const mentoredSubcourses = await prisma.subcourse.findMany({
        where: {
            subcourse_mentors_student: {
                some: {
                    studentId: student.id,
                },
            },
        },
    });
    for (const subcourse of mentoredSubcourses) {
        const isSubcourseOver = await subcourseOver(subcourse);
        // We don't need to update subcourses that are already over
        if (isSubcourseOver) {
            continue;
        }
        await removeSubcourseMentor(userForStudent(student), subcourse, student);
    }

    if (isZoomFeatureActive() && student.zoomUserId) {
        await deleteZoomUser(student);
    }

    await logTransaction('deActivate', userForStudent(student), { newStatus: false, deactivationReason: reason, otherReason });

    return student;
}

export async function reactivateStudent(student: Student, reason: string) {
    if (student.active) {
        throw new PrerequisiteError('Student is already active!');
    }
    if (student.isRedacted) {
        throw new PrerequisiteError('Student already got redacted, too late... :(');
    }
    await prisma.student.update({ where: { id: student.id }, data: { active: true } });
    await logTransaction('deActivate', userForStudent(student), { newStatus: true, deactivationReason: reason });
}
