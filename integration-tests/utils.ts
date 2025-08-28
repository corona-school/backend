import { adminClient } from './base/clients';
import * as assert from 'assert';
import { screenedInstructorOne, screenedInstructorTwo } from './02_screening';
import { ChatType } from '../common/chat/types';
import { expectFetch } from './base/mock';
import { prisma } from '../common/prisma';

export interface CreateSubcourseOpts {
    name: string;
    joinAfterStart?: boolean;
    minGrade?: number;
    maxGrade?: number;
    lectures: { start?: Date }[];
}
export async function createSubcourse({ name, lectures, joinAfterStart = true, minGrade = 5, maxGrade = 10 }: CreateSubcourseOpts) {
    const { client, instructor } = await screenedInstructorOne;
    const {
        courseCreate: { id: courseId, isInstructor, courseState },
    } = await client.request(`
        mutation CreateCourse {
            courseCreate(course:{
            name: "${name}"
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
            courseSearch(search: "${name}", take: 100) { id }
        }
    `);
    assert.ok(courseSearch.some((it) => it.id === courseId));

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

    const {
        subcourseCreate: { id: subcourseId },
    } = await client.request(`
        mutation CreateSubcourse {
            subcourseCreate(courseId: ${courseId}, subcourse: {
                minGrade: ${minGrade}
                maxGrade: ${maxGrade}
                maxParticipants: 10
                joinAfterStart: ${joinAfterStart}
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

    let lectureCount = 0;
    const nextLectureDate = new Date();
    nextLectureDate.setDate(new Date().getDate() + 8);

    for (const lecture of lectures) {
        lectureCount++;
        const lectureName = `Lecture-${lectureCount}`;
        nextLectureDate.setDate(nextLectureDate.getDate() + 1);

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
            body: `{"topic":"${lectureName}","agenda":"${lectureName}","default_password":false,"duration":60,"start_time":"*","timezone":"Europe/Berlin","type":2,"mute_upon_entry":true,"join_before_host":true,"waiting_room":true,"breakout_room":true,"settings":{"alternative_hosts":"","alternative_hosts_email_notification":false}}`,
            responseStatus: 201,
            response: { id: 10 },
        });

        const res = await client.request(`
        mutation creategroupAppointments {
            appointmentsGroupCreate(subcourseId: ${parseInt(subcourseId)}, appointments: [
                {
                    title: "${lectureName}"
                    start: "${nextLectureDate.toISOString()}"
                    duration: 60
                    subcourseId: ${subcourseId}
                    appointmentType: group
                }])
            }
            `);
        assert.ok(res.appointmentsGroupCreate);
    }

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

    lectureCount = 0;
    for (const lecture of lectures) {
        if (!lecture.start) {
            continue;
        }

        lectureCount++;
        const lectureName = `Lecture-${lectureCount}`;
        // This is required to set back lectures to the past
        const dbLecture = await prisma.lecture.findFirstOrThrow({
            where: {
                subcourseId: subcourseId,
                title: lectureName,
            },
        });
        await prisma.lecture.update({
            where: { id: dbLecture.id },
            data: { start: lecture.start },
        });
    }

    return { subcourseId, client, instructor, courseId };
}
