import { test } from './base';
import { adminClient } from './base/clients';
import { pupilOne, studentOne } from './01_user';
import * as assert from 'assert';
import { screenedInstructorOne, screenedInstructorTwo } from './02_screening';
import { ChatType } from '../common/chat/types';
import { expectFetch } from './base/mock';
import { course_coursestate_enum as CourseState } from '@prisma/client';
import { prisma } from '../common/prisma';

const appointmentTitle = 'Group Appointment 1';

const courseOne = test('Create Course One', async () => {
    const { client } = await screenedInstructorOne;
    const {
        courseCreate: { id: courseId, isInstructor, courseState },
    } = await client.request(`
        mutation CreateCourse {
            courseCreate(course:{
            name: "Wie schreibe ich Integrationstests"
            outline: "Am besten gar nicht, ist viel zu viel Arbeit"
            description: "Why should I test if my users can do that for me in production?"
            category: club
            allowContact: true
            subject: Informatik
            schooltype: gymnasium
        }) {
            id
            isInstructor
            courseState
        }
        }
    `);

    assert.ok(isInstructor);
    assert.strictEqual(courseState, 'created');

    await client.request(`mutation SubmitCourse { courseSubmit(courseId: ${courseId}) }`);

    const {
        me: {
            student: { coursesInstructing },
        },
    } = await client.request(`
        query GetCoursesInstructing {
            me {
                student {
                    coursesInstructing {
                        id
                        courseState
                    }
                }
            }
        }
    `);

    assert.ok(coursesInstructing.some((it) => it.id === courseId && it.courseState === 'submitted'));

    // Admin Course Search
    const { courseSearch } = await adminClient.request(`
        query AdminFindsCourseByName {
            courseSearch(search: "integrationstest", take: 100) { id }
        }
    `);
    assert.ok(courseSearch.some((it) => it.id === courseId));

    const { courseSearch: courseSearch2 } = await adminClient.request(`
        query AdminFindsCourseByOutline {
            courseSearch(search: "zu viel arbeit", take: 100) { id }
        }
    `);
    assert.ok(courseSearch2.some((it) => it.id === courseId));

    const { courseSearch: courseSearch3 } = await adminClient.request(`
        query AdminFindsCourseBySubject {
            courseSearch(search: "informatik", take: 100) { id }
        }
    `);
    assert.ok(courseSearch3.some((it) => it.id === courseId));

    await adminClient.request(`
        mutation AllowCourse {
            courseAllow(courseId: ${courseId} screeningComment: "Kreative Kursbeschreibung!")
        }
    `);

    const {
        me: {
            student: { coursesInstructing: coursesInstructing2 },
        },
    } = await client.request(`
        query GetCoursesInstructing {
            me {
                student {
                    coursesInstructing {
                        id
                        courseState
                    }
                }
            }
        }
    `);

    assert.ok(coursesInstructing2.some((it) => it.id === courseId && it.courseState === 'allowed'));

    return { courseId };
});

const courseTwo = test('Create Course Two', async () => {
    const { client } = await screenedInstructorOne;
    const {
        courseCreate: { id: courseId, isInstructor, courseState },
    } = await client.request(`
        mutation CreateCourse {
            courseCreate(course:{
            name: "Wie schreibe ich Integrationstests"
            outline: "Am besten gar nicht, ist viel zu viel Arbeit"
            description: "Why should I test if my users can do that for me in production?"
            category: club
            allowContact: true
            subject: Informatik
            schooltype: gymnasium
        }) {
            id
            isInstructor
            courseState
        }
        }
    `);

    assert.ok(isInstructor);
    assert.strictEqual(courseState, 'created');

    await client.request(`mutation SubmitCourse { courseSubmit(courseId: ${courseId}) }`);

    const {
        me: {
            student: { coursesInstructing },
        },
    } = await client.request(`
        query GetCoursesInstructing {
            me {
                student {
                    coursesInstructing {
                        id
                        courseState
                    }
                }
            }
        }
    `);

    assert.ok(coursesInstructing.some((it) => it.id === courseId && it.courseState === 'submitted'));

    // Admin Course Search
    const { courseSearch } = await adminClient.request(`
        query AdminFindsCourseByName {
            courseSearch(search: "integrationstest", take: 100) { id }
        }
    `);
    assert.ok(courseSearch.some((it) => it.id === courseId));

    const { courseSearch: courseSearch2 } = await adminClient.request(`
        query AdminFindsCourseByOutline {
            courseSearch(search: "zu viel arbeit", take: 100) { id }
        }
    `);
    assert.ok(courseSearch2.some((it) => it.id === courseId));

    const { courseSearch: courseSearch3 } = await adminClient.request(`
        query AdminFindsCourseBySubject {
            courseSearch(search: "informatik", take: 100) { id }
        }
    `);
    assert.ok(courseSearch3.some((it) => it.id === courseId));

    await adminClient.request(`
        mutation AllowCourse {
            courseAllow(courseId: ${courseId} screeningComment: "Kreative Kursbeschreibung!")
        }
    `);

    const {
        me: {
            student: { coursesInstructing: coursesInstructing2 },
        },
    } = await client.request(`
        query GetCoursesInstructing {
            me {
                student {
                    coursesInstructing {
                        id
                        courseState
                    }
                }
            }
        }
    `);

    assert.ok(coursesInstructing2.some((it) => it.id === courseId && it.courseState === 'allowed'));

    return { courseId };
});

export const subcourseOne = test('Create Subcourse one', async () => {
    const nextMinute = new Date();
    nextMinute.setMinutes(nextMinute.getMinutes() + 1);
    const nextMonth = new Date();
    nextMonth.setMonth(nextMonth.getMonth() + 1);

    const { client, instructor } = await screenedInstructorOne;
    const { courseId } = await courseOne;
    const { student } = await studentOne;

    const {
        subcourseCreate: { id: subcourseId },
    } = await client.request(`
        mutation CreateSubcourse {
            subcourseCreate(courseId: ${courseId}, subcourse: {
                minGrade: 5
                maxGrade: 10
                maxParticipants: 1
                joinAfterStart: true
                allowChatContactProspects: true
                allowChatContactParticipants: true
                groupChatType: ${ChatType.NORMAL}
            })
  		{id}
  }
    `);

    const { subcoursesPublic } = await client.request(`
        query PublicSubcourses {
            subcoursesPublic(take: 100) { id }
        }
    `);

    // Does not yet appear in public subcourses
    assert.ok(!subcoursesPublic.some((it) => it.id === subcourseId));

    return { subcourseId, client, instructor, courseId };
});

export const subcourseTwo = test('Create Subcourse two', async () => {
    const nextMinute = new Date();
    nextMinute.setMinutes(nextMinute.getMinutes() + 1);
    const nextMonth = new Date();
    nextMonth.setMonth(nextMonth.getMonth() + 1);

    const { client, instructor } = await screenedInstructorOne;
    const { courseId } = await courseTwo;

    const {
        subcourseCreate: { id: subcourseId },
    } = await client.request(`
        mutation CreateSubcourse {
            subcourseCreate(courseId: ${courseId} subcourse: {
                minGrade: 5
                maxGrade: 10
                maxParticipants: 1
                joinAfterStart: true
                allowChatContactProspects: true
                allowChatContactParticipants: true
                groupChatType: ${ChatType.NORMAL}
            }) { id }
        }
    `);

    const { subcoursesPublic } = await client.request(`
        query PublicSubcourses {
            subcoursesPublic(take: 100) { id }
        }
    `);

    // Does not yet appear in public subcourses
    assert.ok(!subcoursesPublic.some((it) => it.id === subcourseId));

    return { subcourseId, client, instructor, courseId };
});

export const addAppointmentToSubcourse = test('Create an appointment for a subcourse', async () => {
    const { subcourseId, client, instructor, courseId } = await subcourseOne;
    const next = new Date();
    next.setDate(new Date().getDate() + 8);

    expectFetch({
        url: 'https://api.zoom.us/oauth/token?grant_type=account_credentials&account_id=ZOOM_ACCOUNT_ID',
        method: 'POST',
        responseStatus: 200,
        response: { access_token: 'ZOOM_ACCESS_TOKEN' },
    });

    expectFetch({
        url: `https://api.zoom.us/v2/users/${instructor.email.toLowerCase()}`,
        method: 'GET',
        responseStatus: 200,
        response: {
            id: '123',
            first_name: instructor.firstname,
            last_name: instructor.lastname,
            email: instructor.email,
            display_name: instructor.firstname + ' ' + instructor.lastname,
            personal_meeting_url: 'https://meet',
        },
    });

    expectFetch({
        url: 'https://api.zoom.us/v2/users/123/meetings',
        method: 'POST',
        body: '{"agenda":"My Meeting","default_password":false,"duration":60,"start_time":"*","timezone":"Europe/Berlin","type":2,"mute_upon_entry":true,"join_before_host":true,"waiting_room":true,"breakout_room":true,"settings":{"alternative_hosts":"","alternative_hosts_email_notification":false}}',
        responseStatus: 201,
        response: { id: 10 },
    });

    const res = await client.request(`
        mutation creategroupAppointments {
            appointmentsGroupCreate(subcourseId: ${parseInt(subcourseId)}, appointments: [
                {
                    title: "${appointmentTitle}"
                    start: "${next.toISOString()}"
                    duration: 60
                    subcourseId: ${subcourseId}
                    appointmentType: group
                }])
            }
            `);
    assert.ok(res.appointmentsGroupCreate);

    return { subcourseId, client, instructor, courseId };
});

const publishedSubcourse = test('Publish Subcourse', async () => {
    const { client, subcourseId, instructor, courseId } = await addAppointmentToSubcourse;

    await client.request(`
        mutation PublishSubcourse { subcoursePublish(subcourseId: ${subcourseId})}
    `);

    const {
        me: {
            student: { subcoursesInstructing },
        },
    } = await client.request(`
        query GetCoursesInstructing {
            me {
                student {
                    subcoursesInstructing {
                        id
                        course { id name description courseState }
                        published
                        lectures { start duration }
                    }
                }
            }
        }
    `);

    const subcourse = subcoursesInstructing.find((it) => it.id === subcourseId);
    assert.ok(subcourse);
    assert.ok(subcourse.course.id === courseId);
    assert.ok(subcourse.published);

    // Different client here as the response is cached ...
    /* const { subcoursesPublic: subcoursesPublicAfter } = await defaultClient.request(`
        query PublicSubcourses {
            subcoursesPublic(take: 100) { id }
        }
    `);

    // Now appears in public subcourses
    assert.ok(subcoursesPublicAfter.some(it => it.id === subcourseId)); */

    return { client, subcourseId, instructor, courseId };
});

void test('Search further instructors', async () => {
    const { client } = await screenedInstructorOne;
    const { instructor: instructor2 } = await screenedInstructorTwo;

    // Partial searches yield no result to not leak infos
    const partialSearch = await client.request(`query { otherInstructors(search: "${instructor2.firstname}", take: 100, skip: 0) { id }}`);
    assert.ok(partialSearch.otherInstructors.length === 0);

    const partialEmailSearch = await client.request(`query { otherInstructors(search: "@lern-fair.de", take: 100, skip: 0) { id }}`);
    assert.ok(partialEmailSearch.otherInstructors.length === 0);

    const fullNameSearch = await client.request(
        `query { otherInstructors(search: "${instructor2.firstname} ${instructor2.lastname}", take: 100, skip: 0) { firstname lastname }}`
    );
    assert.strictEqual(fullNameSearch.otherInstructors.length, 1);
    assert.strictEqual(fullNameSearch.otherInstructors[0].firstname, instructor2.firstname);

    const fullEmailSearch = await client.request(`query { otherInstructors(search: "${instructor2.email}", take: 100, skip: 0) { firstname lastname }}`);
    assert.strictEqual(fullEmailSearch.otherInstructors.length, 1);
    assert.strictEqual(fullEmailSearch.otherInstructors[0].firstname, instructor2.firstname);
});

void test('Public Course Suggestions', async () => {
    const { client, pupil } = await pupilOne;
    // const { pupilsGrade } = await pupilUpdated;

    const { subcoursesPublic } = await client.request(`
    query PublicSubcourseSuggestions {
        subcoursesPublic(take: 20, excludeKnown: true, onlyJoinable: true )
        {
            id
            published
            cancelled
            minGrade
            maxGrade
            isParticipant
            participantsCount
            maxParticipants
            course {
                courseState
            }
        }
    }`);

    assert.ok(
        subcoursesPublic.some(
            (subcourse) =>
                subcourse.published &&
                !subcourse.cancelled &&
                subcourse.course.courseState === CourseState.allowed &&
                // subcourse.minGrade <= pupilsGrade &&
                // subcourse.maxGrade >= pupilsGrade &&
                !subcourse.isParticipant &&
                subcourse.participantsCount < subcourse.maxParticipants
        )
    );
});

void test('Add / Remove another instructor', async () => {
    const { instructor: instructor2 } = await screenedInstructorTwo;
    const { subcourseId, client } = await publishedSubcourse;

    expectFetch({
        url: 'https://api.zoom.us/oauth/token?grant_type=account_credentials&account_id=ZOOM_ACCOUNT_ID',
        method: 'POST',
        responseStatus: 200,
        response: { access_token: 'ACCESS_TOKEN', expires_in: 0 },
    });

    expectFetch({
        url: `https://api.zoom.us/v2/users/${instructor2.email.toLowerCase()}`,
        method: 'GET',
        responseStatus: 200,
        response: {
            id: '123',
            first_name: instructor2.firstname,
            last_name: instructor2.lastname,
            email: instructor2.email.toLowerCase(),
            display_name: instructor2.firstname + ' ' + instructor2.lastname,
            personal_meeting_url: 'https://meet',
        },
    });

    expectFetch({
        url: 'https://api.zoom.us/v2/meetings/10',
        method: 'GET',
        responseStatus: 200,
        response: {
            agenda: 'My Meeting',
            default_password: false,
            duration: 60,
            start_time: new Date().toISOString(),
            timezone: 'Europe/Berlin',
            type: 2,
            mute_upon_entry: true,
            join_before_host: true,
            waiting_room: true,
            breakout_room: true,
            settings: { alternative_hosts: '', alternative_hosts_email_notification: false },
        },
    });

    expectFetch({
        url: 'https://api.zoom.us/v2/meetings/10',
        method: 'PATCH',
        body: `{"start_time":"*","timezone":"Europe/Berlin","settings":{"alternative_hosts":"${instructor2.email.toLowerCase()}"}}`,
        responseStatus: 200,
        response: '{}',
    });

    await client.request(`mutation AddInstructorToSubcourse {
        subcourseAddInstructor(subcourseId: ${subcourseId} studentId: ${instructor2.student.id})
    }`);

    expectFetch({
        url: 'https://api.zoom.us/oauth/token?grant_type=account_credentials&account_id=ZOOM_ACCOUNT_ID',
        method: 'POST',
        responseStatus: 200,
        response: { access_token: 'ACCESS_TOKEN', expires_in: 0 },
    });

    expectFetch({
        url: 'https://api.zoom.us/v2/meetings/10',
        method: 'GET',
        responseStatus: 200,
        response: {
            id: 10,
            agenda: 'My Meeting',
            default_password: false,
            duration: 60,
            start_time: new Date().toISOString(),
            timezone: 'Europe/Berlin',
            type: 2,
            mute_upon_entry: true,
            join_before_host: true,
            waiting_room: true,
            breakout_room: true,
            settings: { alternative_hosts: instructor2.email.toLowerCase(), alternative_hosts_email_notification: false },
        },
    });

    expectFetch({
        url: 'https://api.zoom.us/v2/meetings/10',
        method: 'PATCH',
        body: '{"start_time":"*","timezone":"Europe/Berlin","settings":{"alternative_hosts":""}}',
        responseStatus: 200,
        response: '{}',
    });

    await client.request(`mutation RemoveInstructorFromSubcourse {
        subcourseDeleteInstructor(subcourseId: ${subcourseId} studentId: ${instructor2.student.id})
    }`);
});

void test('Delete course', async () => {
    const { courseId, client: courseClient, subcourseId } = await subcourseTwo;

    await courseClient.requestShallFail(
        `
        mutation DeleteCourseWithSubcourses {courseDelete(courseId: ${courseId})}      
    `
    );

    await prisma.subcourse.updateMany({ where: { id: subcourseId }, data: { published: false } });

    await courseClient.request(
        `
        mutation DeleteSubcourse {subcourseDelete(subcourseId: ${subcourseId})}      
    `
    );
    const subcourse = await prisma.subcourse.findUnique({ where: { id: subcourseId } });
    assert.ok(!subcourse);

    //Test deletion of empty course => should work

    await courseClient.request(
        `
        mutation DeleteEmptyCourse {courseDelete(courseId: ${courseId})}      
    `
    );
});
void test('Find shared course', async () => {
    const { instructor: instructor2, client: instructor2client } = await screenedInstructorTwo;
    const { courseId, client, instructor: subcourseInstructor } = await subcourseOne;

    await client.request(`
        mutation MarkCourseShared {
            courseMarkShared(courseId: ${courseId}, shared: true){id}
        }
    `);

    const { templateCourses: templateCoursesEmptySearch } = await instructor2client.request(`
        query FindSharedCourses {
            templateCourses(search: "", take: 1) {
              id
            }
        }
    `);
    // Instructor from subcourseOne creates subcourse, Different instructor (instructor2) must find it.
    assert.ok(templateCoursesEmptySearch.some((it) => it.id === courseId));

    const course = await prisma.course.findUnique({
        where: { id: courseId },
    });

    const { templateCourses: templateCoursesNonEmptySearch } = await instructor2client.request(`
    query FindSharedCourses {
        templateCourses(search: "${course.name}", take: 1) {
          id
        }
    }
`);
    // Instructor 2 must be able to find shared course by name
    assert.ok(templateCoursesNonEmptySearch.some((it) => it.id === courseId));

    await client.request(`
    mutation MarkCourseShared {
        courseMarkShared(courseId: ${courseId}, shared: false){id}
    }
`);

    const { templateCourses: courseSearch } = await adminClient.request(`
    query FindSharedCourses {
        templateCourses(studentId: ${instructor2.student.id}, search: "", take: 10) { id }
    }
    `);

    //Subcourse is not shared anymore. Instructor 2 must not find the course since it was created
    //by the subcourseInstructor
    assert.ok(courseSearch.every((it) => it.id != courseId));

    const { templateCourses: courseSearch2 } = await adminClient.request(`
    query FindSharedCourses {
        templateCourses(studentId: ${subcourseInstructor.student.id}, search: "", take: 10) { id }
    }
`);

    //SubcourseOneInstructor must be able to find his own subcourse, even if it is not shared
    assert.ok(courseSearch2.some((it) => it.id === courseId));
});
