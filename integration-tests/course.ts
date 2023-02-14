import { adminClient, defaultClient, test } from "./base";
import { instructorOne } from "./user";
import * as assert from "assert";
import { screenedInstructorOne } from "./screening";

const courseOne = test("Create Course One", async () => {
    const { client } = await screenedInstructorOne;
    const { courseCreate: { id: courseId, isInstructor, courseState } } = await client.request(`
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
    assert.strictEqual(courseState, "created");

    await client.request(`mutation SubmitCourse { courseSubmit(courseId: ${courseId}) }`);

    const { me: { student: { coursesInstructing }}} = await client.request(`
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

    assert.ok(coursesInstructing.some(it => it.id === courseId && it.courseState === "submitted"));

    await adminClient.request(`
        mutation AllowCourse { 
            courseAllow(courseId: ${courseId} screeningComment: "Kreative Kursbeschreibung!")
        }
    `);

    const { me: { student: { coursesInstructing: coursesInstructing2 }}} = await client.request(`
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

    assert.ok(coursesInstructing2.some(it => it.id === courseId && it.courseState === "allowed"));

    return { courseId };
});

const subcourseOne = test("Create Subcourse", async () => {
    const nextMinute = new Date();
    nextMinute.setMinutes(nextMinute.getMinutes() + 1);

    const { client } = await screenedInstructorOne;
    const { courseId } = await courseOne;

    const { subcourseCreate: { id: subcourseId } } = await client.request(`
        mutation CreateSubcourse {
            subcourseCreate(courseId: ${courseId} subcourse: {
                minGrade: 5
                maxGrade: 10
                maxParticipants: 1
                joinAfterStart: true
                lectures: [{ start: "${nextMinute.toISOString()}" duration: 1 }]
            }) { id }
        }
    `);

    const { subcoursesPublic } = await client.request(`
        query PublicSubcourses {
            subcoursesPublic(take: 100) { id }
        }
    `);

    // Does not yet appear in public subcourses
    assert.ok(!subcoursesPublic.some(it => it.id === subcourseId));

    await client.request(`
        mutation PublishSubcourse { subcoursePublish(subcourseId: ${subcourseId})}
    `);

    const { me: { student: { subcoursesInstructing } } } = await client.request(`
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

    const subcourse = subcoursesInstructing.find(it => it.id === subcourseId);
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

});


test("Admin set subcourse meetingURL and join", async () => {
    await adminClient.request(`
        mutation SetURL {
            subcourseSetMeetingURL(subcourseId: 1, meetingURL: "https://example.com")
        }
    `);

    const meetingURL = await adminClient.request(`
        mutation GetURL {
            subcourseJoinMeeting(subcourseId: 1)
        }
    `);

    assert.strictEqual(meetingURL.subcourseJoinMeeting, "https://example.com");
});

test("Search further instructors", async() => {
    const { client } = await screenedInstructorOne;

    // Partial searches yield no result to not leak infos
    const partialSearch = await client.request(`query { otherInstructors(search: "melanie", take: 100, skip: 0) { id }}`);
    assert.ok(partialSearch.otherInstructors.length === 3);

    const partialEmailSearch = await client.request(`query { otherInstructors(search: "@lern-fair.de", take: 100, skip: 0) { id }}`);
    assert.ok(partialEmailSearch.otherInstructors.length === 3);

    const fullNameSearch = await client.request(`query { otherInstructors(search: "melanie meiers", take: 100, skip: 0) { firstname lastname }}`);
    assert.equal(fullNameSearch.otherInstructors.length, 1);
    assert.equal(fullNameSearch.otherInstructors[0].firstname, "Melanie");

    const fullEmailSearch = await client.request(`query { otherInstructors(search: "test+dev+s2@lern-fair.de", take: 100, skip: 0) { firstname lastname }}`);
    assert.equal(fullEmailSearch.otherInstructors.length, 1);
    assert.equal(fullEmailSearch.otherInstructors[0].firstname, "Melanie");
});