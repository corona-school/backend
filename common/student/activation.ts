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
import { removeAllPushSubcriptions } from '../notification/channels/push';
import { cancelSubcourse, deleteSubcourseInstructor, subcourseOver } from '../courses/states';

export async function deactivateStudent(
    student: Student,
    silent = false,
    reason?: string,
    dissolveReasons: dissolve_reason[] = [dissolve_reason.accountDeactivated]
) {
    if (!student.active) {
        throw new Error('Student was already deactivated');
    }

    if (!silent) {
        await Notification.actionTaken(userForStudent(student), 'student_account_deactivated', {});
    }

    await Notification.cancelRemindersFor(userForStudent(student));
    // Setting 'active' to false will not send out any notifications during deactivation
    const updatedStudent = await prisma.student.update({
        data: { active: false },
        where: { id: student.id },
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
        // There are multiple instructors, so just remove the student from the subcourse
        if (subcourse.subcourse_instructors_student.length > 1) {
            await deleteSubcourseInstructor(userForStudent(student), subcourse, student);
        } else if (!(await subcourseOver(subcourse))) {
            await cancelSubcourse(userForStudent(student), subcourse, true);
        }
    }

    if (isZoomFeatureActive() && student.zoomUserId) {
        await deleteZoomUser(student);
    }

    await logTransaction('deActivate', userForStudent(student), { newStatus: false, deactivationReason: reason });

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
    await logTransaction('deActivate', userForStudent(student), { newStatus: true, deactivationReason: reason });
}
