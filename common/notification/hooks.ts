import { registerPupilHook, registerStudentHook } from './hook';

// Hooks from the Notification System to other parts of the codebase are collected here,
//  this ensures that the hooks are always registered when the Notification is loaded (i.e. in the jobs Deno, which only loads parts of the backend)
import { deactivateStudent } from '../student/activation';
import { cancelRemissionRequest } from '../remission-request';
import { prisma } from '../prisma';
import { userForStudent } from '../user';
import * as Notification from '../../common/notification';
import { SpecificNotificationContext } from './actions';
import { dissolve_reason } from '@prisma/client';

registerStudentHook(
    'deactivate-student',
    'Account gets deactivated, matches are dissolved, courses are cancelled',
    async (student) => {
        await deactivateStudent(student, true, 'missing coc', [dissolve_reason.accountDeactivatedNoCoC]);
    } // the hook does not send out a notification again, the user already knows that their account was deactivated
);

registerStudentHook('cancel-remission-request', 'Cancels the remission request(s) of a student; called upon cancelling the CoC reminder', async (student) => {
    await cancelRemissionRequest(student);
});

registerStudentHook(
    'attempt-invite-instructor-to-reflection-meeting',
    'Instructors (without matches) are invited to participate in a reflection meeting after their very first group appointment',
    async (student, context) => {
        const activeMatches = await prisma.match.count({ where: { studentId: student.id, dissolved: false } });
        if (activeMatches > 0) {
            return;
        }
        const user = userForStudent(student);
        const appointmentContext = context as SpecificNotificationContext<'student_group_appointment_starts'>;
        const triggeredAppointmentId = Number(context.uniqueId);
        const firstInstructorAppointment = await prisma.lecture.findFirst({
            where: { organizerIds: { has: user.userID }, isCanceled: false, appointmentType: 'group' },
            orderBy: { start: 'asc' },
        });
        const isFirstInstructorAppointment = triggeredAppointmentId === firstInstructorAppointment.id;
        if (isFirstInstructorAppointment) {
            await Notification.actionTaken(user, 'instructor_first_appointment_completed', appointmentContext);
        }
    }
);

import { deletePupilMatchRequest } from '../match/request';
import { deactivatePupil } from '../pupil/activation';
import { invalidateAllScreeningsOfPupil } from '../pupil/screening';
registerPupilHook('revoke-pupil-match-request', 'Match Request is taken back, pending Pupil Screenings are invalidated', async (pupil) => {
    await deletePupilMatchRequest(pupil);
    await invalidateAllScreeningsOfPupil(pupil.id);
});

registerPupilHook('deactivate-pupil', 'Account gets deactivated, matches are dissolved, courses are left', async (pupil) => {
    await deactivatePupil(pupil, true, 'deactivated by admin', true);
});
