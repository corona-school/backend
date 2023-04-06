import { registerPupilHook, registerStudentHook } from './hook';

// Hooks from the Notification System to other parts of the codebase are collected here,
//  this ensures that the hooks are always registered when the Notification is loaded (i.e. in the jobs Deno, which only loads parts of the backend)
import { deactivateStudent } from '../student/activation';
registerStudentHook(
    'deactivate-student',
    'Account gets deactivated, matches are dissolved, courses are cancelled',
    async (student) => {
        await deactivateStudent(student, true, 'missing coc');
    } // the hook does not send out a notification again, the user already knows that their account was deactivated
);

import { deletePupilMatchRequest } from '../match/request';
registerPupilHook('revoke-pupil-match-request', 'Match Request is taken back, pending Pupil Screenings are invalidated', async (pupil) => {
    await deletePupilMatchRequest(pupil);
});
