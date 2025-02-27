import assert from 'assert';
import { test } from './base';
import { ChatType } from '../common/chat/types';
import { subcourseOne } from './07_course';
import { expectFetch } from './base/mock';
import { screenedInstructorOne } from './02_screening';
import { pupilOne, pupilTwo } from './01_user';
import { getSubcourse } from '../graphql/util';
import { prisma } from '../common/prisma';

void test('Create Chat for Course', async () => {
    const { client: instructorClient, instructor } = await screenedInstructorOne;
    const { pupil } = await pupilOne;
    const { pupil: pupil2 } = await pupilTwo;
    const { subcourseId } = await subcourseOne;

    const subcourse = await getSubcourse(subcourseId, true);
    const courseDate = new Date(subcourse.lecture[0].start).toISOString();

    await prisma.subcourse_participants_pupil.create({
        data: {
            pupilId: pupil.pupil.id,
            subcourseId: subcourseId,
        },
    });

    await prisma.subcourse_participants_pupil.create({
        data: {
            pupilId: pupil2.pupil.id,
            subcourseId: subcourseId,
        },
    });

    // The pupil does not have one, it gets created:
    expectFetch({
        method: 'GET',
        url: `https://api.talkjs.com/v1/mocked-talkjs-appid/users/pupil_${pupil.pupil.id}`,
        responseStatus: 404,
    });

    // The second pupil does not have one, it gets created:
    expectFetch({
        method: 'GET',
        url: `https://api.talkjs.com/v1/mocked-talkjs-appid/users/pupil_${pupil2.pupil.id}`,
        responseStatus: 404,
    });

    // The student has one:
    expectFetch({
        method: 'GET',
        url: `https://api.talkjs.com/v1/mocked-talkjs-appid/users/student_${instructor.student.id}`,
        responseStatus: 200,
        response: {},
    });

    expectFetch({
        url: `https://api.talkjs.com/v1/mocked-talkjs-appid/users/pupil_${pupil.pupil.id}`,
        method: 'PUT',
        body: JSON.stringify({ name: `${pupil.firstname} ${pupil.lastname.charAt(0).concat('.')}`, email: [pupil.email.toLowerCase()], role: 'pupil' }),
        responseStatus: 200,
    });

    expectFetch({
        url: `https://api.talkjs.com/v1/mocked-talkjs-appid/users/pupil_${pupil2.pupil.id}`,
        method: 'PUT',
        body: JSON.stringify({ name: `${pupil2.firstname} ${pupil2.lastname.charAt(0).concat('.')}`, email: [pupil2.email.toLowerCase()], role: 'pupil' }),
        responseStatus: 200,
    });

    expectFetch({
        method: 'GET',
        url: `https://api.talkjs.com/v1/mocked-talkjs-appid/users/pupil_${pupil.pupil.id}`,
        responseStatus: 200,
        response: {},
    });

    expectFetch({
        method: 'GET',
        url: `https://api.talkjs.com/v1/mocked-talkjs-appid/users/pupil_${pupil2.pupil.id}`,
        responseStatus: 200,
        response: {},
    });

    expectFetch({
        url: 'https://api.talkjs.com/v1/mocked-talkjs-appid/conversations/*',
        method: 'PUT',
        body: `{"subject":"Wie schreibe ich Integrationstests","photoUrl":"","custom":{"start":"${courseDate}","groupType":"${ChatType.NORMAL}","subcourse":"[${subcourseId}]","createdBy":"student/${instructor.student.id}"},"participants":["pupil_${pupil.pupil.id}","pupil_${pupil2.pupil.id}","student_${instructor.student.id}"]}`,
        responseStatus: 200,
    });

    expectFetch({
        url: 'https://api.talkjs.com/v1/mocked-talkjs-appid/conversations/*',
        method: 'GET',
        responseStatus: 200,
        response: { id: 'mocked' },
    });

    expectFetch({
        url: 'https://api.talkjs.com/v1/mocked-talkjs-appid/conversations/*',
        method: 'GET',
        responseStatus: 200,
        response: { id: 'mocked' },
    });

    expectFetch({
        url: 'https://api.talkjs.com/v1/mocked-talkjs-appid/conversations/*/messages',
        method: 'POST',
        body: '[{"text":"*","type":"SystemMessage","custom":{"type":"first"}}]',
        responseStatus: 200,
    });

    const { subcourseGroupChatCreate: conversationID } = await instructorClient.request(`
        mutation GroupChatCreate {
            subcourseGroupChatCreate(subcourseId: ${parseInt(subcourseId)}, groupChatType: "${ChatType.NORMAL}")
        }
    `);

    assert.strictEqual(conversationID, 'mocked');
});
