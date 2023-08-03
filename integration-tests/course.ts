import { adminClient, defaultClient, test } from './base';
import { pupilOne, pupilUpdated } from './user';
import * as assert from 'assert';
import { screenedInstructorOne, screenedInstructorTwo } from './screening';
import { CourseState } from '../common/entity/Course';
import { ChatType } from '../common/chat/types';

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

export const subcourseOne = test('Create Subcourse', async () => {
    const nextMinute = new Date();
    nextMinute.setMinutes(nextMinute.getMinutes() + 1);

    const { client } = await screenedInstructorOne;
    const { courseId } = await courseOne;

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

    return { subcourseId };

    // Different client here as the response is cached ...
    /* const { subcoursesPublic: subcoursesPublicAfter } = await defaultClient.request(`
        query PublicSubcourses {
            subcoursesPublic(take: 100) { id }
        }
    `);

    // Now appears in public subcourses
    assert.ok(subcoursesPublicAfter.some(it => it.id === subcourseId)); */
});

void test('Search further instructors', async () => {
    const { client } = await screenedInstructorOne;
    const { instructor: instructor2 } = await screenedInstructorTwo;

    // Partial searches yield no result to not leak infos
    const partialSearch = await client.request(`query { otherInstructors(search: "${instructor2.firstname}", take: 100, skip: 0) { id }}`);
    assert.ok(partialSearch.otherInstructors.length === 0);

    const partialEmailSearch = await client.request(`query { otherInstructors(search: "@lern-fair.de", take: 100, skip: 0) { id }}`);
    assert.ok(partialEmailSearch.otherInstructors.length === 0);

    const fullNameSearch = await client.request(`query { otherInstructors(search: "${instructor2.firstname} ${instructor2.lastname}", take: 100, skip: 0) { firstname lastname }}`);
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
                subcourse.course.courseState === CourseState.ALLOWED &&
                // subcourse.minGrade <= pupilsGrade &&
                // subcourse.maxGrade >= pupilsGrade &&
                !subcourse.isParticipant &&
                subcourse.participantsCount < subcourse.maxParticipants
        )
    );
});
