import { registerPupilHook, registerStudentHook } from './hook';

// Hooks from the Notification System to other parts of the codebase are collected here,
//  this ensures that the hooks are always registered when the Notification is loaded (i.e. in the jobs Deno, which only loads parts of the backend)
import { deactivateStudent } from '../student/activation';
import { cancelRemissionRequest } from '../remission-request';

registerStudentHook(
    'deactivate-student',
    'Account gets deactivated, matches are dissolved, courses are cancelled',
    async (student) => {
        await deactivateStudent(student, true, 'missing coc');
    } // the hook does not send out a notification again, the user already knows that their account was deactivated
);

registerStudentHook('cancel-remission-request', 'Cancels the remission request(s) of a student; called upon cancelling the CoC reminder', async (student) => {
    await cancelRemissionRequest(student);
});

import { deletePupilMatchRequest } from '../match/request';
import { deactivatePupil } from '../pupil/activation';
registerPupilHook('revoke-pupil-match-request', 'Match Request is taken back, pending Pupil Screenings are invalidated', async (pupil) => {
    await deletePupilMatchRequest(pupil);
});

registerPupilHook('deactivate-pupil', 'Account gets deactivated, matches are dissolved, courses are left', async (pupil) => {
    await deactivatePupil(pupil);
});
