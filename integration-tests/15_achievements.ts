import { createNewPupil, createNewStudent, pupilTwo, studentOne } from './01_user';
import { test } from './base';
import { screenerOne } from './02_screening';
import { adminClient } from './base/clients';
import { prisma } from '../common/prisma';
import { achievement_template_for_enum, achievement_type_enum, achievement_action_type_enum, lecture_appointmenttype_enum } from '@prisma/client';
import { User, getUser } from '../common/user';
import { Match } from '../graphql/generated';
import { _createFixedToken } from '../common/secret/token';
import assert from 'assert';
import { purgeAchievementTemplateCache } from '../common/achievement/template';
import { achievement_with_template, ConditionDataAggregations } from '../common/achievement/types';

function findTemplateByMetric(achievements: achievement_with_template[], metric: string) {
    for (const achievement of achievements) {
        const dataAggr = achievement.template.conditionDataAggregations as ConditionDataAggregations;
        for (const key in dataAggr) {
            if (dataAggr[key].metric === metric) {
                return achievement;
            }
        }
    }
    return null;
}

async function createTemplates() {
    purgeAchievementTemplateCache();
    await createStudentOnboardingTemplates();
    await createPupilOnboardingTemplates();
    await createStudentConductedMatchAppointmentTemplates();
    await createPupilConductedMatchMeetingTemplates();
    await createStudentRegularLearningTemplate();
    await createPupilRegularLearningTemplate();
}

void test('Reward student onboarding achievement sequence', async () => {
    await adminClient.request(`mutation ResetRateLimits { _resetRateLimits }`);
    await createTemplates();

    // Verify Email
    const { student } = await createNewStudent();
    const user = await getUser(student.userID);

    const studentOnboarding1 = await prisma.user_achievement.findFirst({
        where: {
            group: 'student_onboarding',
            groupOrder: 1,
            achievedAt: { not: null },
            userId: user.userID,
        },
    });
    assert.ok(studentOnboarding1);

    // Screening
    const { client: screenerClient } = await screenerOne;
    await screenerClient.request(`
        mutation ScreenInstructorOne {
            studentTutorScreeningCreate(
                studentId: ${student.student.id}
                screening: {success: true comment: "" knowsCoronaSchoolFrom: ""}
            )
        }
    `);
    const studentOnboarding2 = await prisma.user_achievement.findFirst({
        where: {
            group: 'student_onboarding',
            groupOrder: 3,
            achievedAt: { not: null },
            userId: user.userID,
        },
    });
    assert.ok(studentOnboarding2);

    // Create Certificate of Conduct
    const newDate = JSON.stringify(new Date());
    await adminClient.request(`
        mutation CreateCertificateOfConduct {
            certificateOfConductCreate(
                dateOfInspection: ${newDate},
                dateOfIssue: ${newDate},
                criminalRecords: false,
                studentId: ${student.student.id},
            )
        }
    `);
    const studentOnboarding3 = await prisma.user_achievement.findFirst({
        where: {
            group: 'student_onboarding',
            groupOrder: 4,
            achievedAt: { not: null },
            userId: user.userID,
        },
    });
    const studentOnboarding4 = await prisma.user_achievement.findFirst({
        where: {
            group: 'student_onboarding',
            groupOrder: 5,
            userId: user.userID,
        },
    });
    assert.ok(studentOnboarding3);
    assert.ok(studentOnboarding4);
});

void test('Reward pupil onboarding achievement sequence', async () => {
    await adminClient.request(`mutation ResetRateLimits { _resetRateLimits }`);

    // Verify Email
    const { pupil } = await createNewPupil();
    const user = await getUser(pupil.userID);

    const pupilOnboarding1 = await prisma.user_achievement.findFirst({
        where: {
            group: 'pupil_onboarding',
            groupOrder: 1,
            achievedAt: { not: null },
            userId: user.userID,
        },
    });
    assert.ok(pupilOnboarding1);
    // Screening
    await adminClient.request(`
        mutation RequestScreening { pupilCreateScreening(pupilId: ${pupil.pupil.id})}
    `);
    const pupilOnboarding2 = await prisma.user_achievement.findFirst({
        where: {
            group: 'pupil_onboarding',
            groupOrder: 3,
            achievedAt: { not: null },
            userId: user.userID,
        },
    });
    const pupilOnboarding3 = await prisma.user_achievement.findFirst({
        where: {
            group: 'pupil_onboarding',
            groupOrder: 4,
            userId: user.userID,
        },
    });
    assert.ok(pupilOnboarding2);
    assert.ok(pupilOnboarding3);
});

void test('Reward student conducted match appointment', async () => {
    await adminClient.request(`mutation ResetRateLimits { _resetRateLimits }`);
    const { student, client } = await studentOne;
    const user = await getUser(student.userID);

    await client.request(`
        mutation {
            studentCreateMatchRequest
        }
    `);

    const {
        me: {
            student: { matches },
        },
    } = await client.request(`
        query StudentWithMatch {
            me {
                student {
                    matches {
                        id
                        uuid
                        dissolved
                        pupil { firstname lastname }
                    }
                }
            }
        }
    `);
    const [match] = matches;

    const dates = createDates();
    generateLectures(dates, match, user);
    await client.request(`
        mutation StudentJoinMatchMeeting { matchMeetingJoin(matchId:${match.id}) }
    `);

    const studentJoinedMatchMeetingAchievements = await prisma.user_achievement.findMany({
        where: {
            group: 'student_conduct_match_appointment',
            userId: user.userID,
        },
    });
    assert.ok(studentJoinedMatchMeetingAchievements[0]);
    assert.notStrictEqual(studentJoinedMatchMeetingAchievements.length, 0);
});

void test('Reward pupil conducted match appointment', async () => {
    await adminClient.request(`mutation ResetRateLimits { _resetRateLimits }`);
    const { student } = await studentOne;
    const { pupil, client } = await pupilTwo;
    const user = await getUser(pupil.userID);

    await client.request(`
        mutation {
            pupilCreateMatchRequest
        }
    `);
    await adminClient.request(`
        mutation CreateManualMatch {
            matchAdd(poolName: "lern-fair-now", studentId: ${student.student.id} pupilId: ${pupil.pupil.id})
        }
    `);
    const {
        me: {
            pupil: { matches },
        },
    } = await client.request(`
        query PupilWithMatch {
            me {
                pupil {
                    matches {
                        id
                    }
                }
            }
        }
    `);
    const [match] = matches;
    await client.request(`
        mutation PupilJoinMatchMeeting { matchMeetingJoin(matchId:${match.id}) }
    `);
    const pupilJoinedMatchMeetingAchievements = await prisma.user_achievement.findMany({
        where: {
            group: 'pupil_conduct_match_appointment',
            userId: user.userID,
        },
    });
    assert.ok(pupilJoinedMatchMeetingAchievements);
    assert.notStrictEqual(pupilJoinedMatchMeetingAchievements.length, 0);
});

void test('Reward student regular learning', async () => {
    await adminClient.request(`mutation ResetRateLimits { _resetRateLimits }`);

    const { student, client } = await studentOne;
    const user = await getUser(student.userID);
    const metric = 'student_match_learned_regular';

    const {
        me: { student: s1 },
    } = await client.request(`
        query StudentWithMatch {
            me {
                student {
                    matches {
                        id
                    }
                }
            }
        }
    `);
    const [match] = s1.matches.filter((el) => !el.dissolved);
    // request to generate the achievement with initial record value 1
    await client.request(`
        mutation StudentJoinMatchMeeting { matchMeetingJoin(matchId:${match.id}) }
    `);
    const allAchievements = await prisma.user_achievement.findMany({
        where: {
            userId: user.userID,
            context: { path: ['relation'], equals: `match/${match.id}` },
        },
        include: { template: true },
    });
    const achievement = findTemplateByMetric(allAchievements, metric);
    assert.notStrictEqual(achievement, null);
    assert.strictEqual(achievement!.recordValue, 1);

    const date = new Date();
    date.setDate(date.getDate() - 7);
    await prisma.achievement_event.create({
        data: {
            userId: user.userID,
            metric: metric,
            value: 1,
            createdAt: date,
            action: 'student_joined_match_meeting',
            relation: `match/${match.id}`,
        },
    });
    // request to set the achievements record value to 2 due to the past event generated
    await client.request(`
        mutation StudentJoinMatchMeeting { matchMeetingJoin(matchId:${match.id}) }
    `);

    const studentMatchRegularLearningRecord = await prisma.user_achievement.findFirst({
        where: {
            userId: user.userID,
            group: 'student_match_regular_learning',
            achievedAt: { not: null },
            recordValue: 2,
        },
    });
    assert.ok(studentMatchRegularLearningRecord);

    await prisma.achievement_event.deleteMany({
        where: {
            userId: user.userID,
            metric: metric,
            relation: `match/${match.id}`,
        },
    });
    await client.request(`
        mutation StudentJoinMatchMeeting { matchMeetingJoin(matchId:${match.id}) }
    `);

    const studentMatchRegularLearning = await prisma.user_achievement.findFirst({
        where: {
            userId: user.userID,
            group: 'student_match_regular_learning',
            achievedAt: null,
            recordValue: 2,
        },
    });
    assert.ok(studentMatchRegularLearning);
});

void test('Reward pupil regular learning', async () => {
    await adminClient.request(`mutation ResetRateLimits { _resetRateLimits }`);

    const { pupil, client } = await pupilTwo;
    const user = await getUser(pupil.userID);
    const metric = 'pupil_match_learned_regular';

    const {
        me: {
            pupil: { matches },
        },
    } = await client.request(`
        query PupilWithMatch {
            me {
                pupil {
                    matches {
                        id
                    }
                }
            }
        }
    `);
    const [match] = matches;
    // request to generate the achievement with initial record value 1
    await client.request(`
        mutation PupilJoinMatchMeeting { matchMeetingJoin(matchId:${match.id}) }
    `);
    const achievements = await prisma.user_achievement.findMany({
        where: {
            userId: user.userID,
            context: { path: ['relation'], equals: `match/${match.id}` },
        },
        include: { template: true },
    });
    const achievement = findTemplateByMetric(achievements, metric);
    assert.notStrictEqual(achievement, null);
    assert.strictEqual(achievement.recordValue, 1);

    const date = new Date();
    date.setDate(date.getDate() - 7);
    await prisma.achievement_event.create({
        data: {
            userId: user.userID,
            metric: metric,
            value: 1,
            createdAt: date,
            action: 'pupil_joined_match_meeting',
            relation: `match/${match.id}`,
        },
    });
    // request to set the achievements record value to 2 due to the past event generated
    await client.request(`
        mutation PupilJoinMatchMeeting { matchMeetingJoin(matchId:${match.id}) }
    `);

    await prisma.achievement_event.deleteMany({
        where: {
            userId: user.userID,
            metric: 'pupil_match_regular_learning',
            relation: `match/${match.id}`,
        },
    });
    await client.request(`
        mutation PupilJoinMatchMeeting { matchMeetingJoin(matchId:${match.id}) }
    `);

    const pupilMatchRegularLearning = await prisma.user_achievement.findFirst({
        where: {
            userId: user.userID,
            group: 'pupil_match_regular_learning',
            achievedAt: null,
            recordValue: 2,
        },
    });
    assert.ok(pupilMatchRegularLearning);
});

void test('Resolver my achievements', async () => {
    await adminClient.request(`mutation ResetRateLimits { _resetRateLimits }`);
    const { client: studentClient } = await studentOne;
    const { client: pupilClient } = await pupilTwo;

    const { me: studentMe } = await studentClient.request(`
        query achievements {
            me {
                achievements {
                    id
                }
            }
        }
    `);
    const { achievements: studentAchievements } = studentMe;
    assert.ok(studentAchievements);
    assert.notStrictEqual(studentAchievements.length, 0);

    const { me: pupilMe } = await pupilClient.request(`
        query achievements {
            me {
                achievements {
                    id
                }
            }
        }
    `);
    const { achievements: pupilAchievements } = pupilMe;
    assert.ok(pupilAchievements);
    assert.notStrictEqual(pupilAchievements.length, 0);
});

void test('Resolver further (INACTIVE) achievements', async () => {
    await adminClient.request(`mutation ResetRateLimits { _resetRateLimits }`);
    const { client: studentClient } = await studentOne;
    const { client: pupilClient } = await pupilTwo;

    const { me: studentMe } = await studentClient.request(`
        query furtherAchievements {
            me {
                furtherAchievements {
                    id
                }
            }
        }
    `);
    const { furtherAchievements: furtherStudentAchievements } = studentMe;
    assert.ok(furtherStudentAchievements);
    assert.notStrictEqual(furtherStudentAchievements.length, 0);

    const { me: pupilMe } = await pupilClient.request(`
        query furtherAchievements {
            me {
                furtherAchievements {
                    id
                }
            }
        }
    `);
    const { furtherAchievements: furtherPupilAchievements } = pupilMe;
    assert.ok(furtherPupilAchievements);
    assert.notStrictEqual(furtherPupilAchievements.length, 0);
});

void test('Resolver next step achievements', async () => {
    await adminClient.request(`mutation ResetRateLimits { _resetRateLimits }`);
    const { client: studentClient } = await studentOne;
    const { client: pupilClient } = await pupilTwo;

    const { me: studentMe } = await studentClient.request(`
        query nextStepAchievements {
            me {
                nextStepAchievements {
                    id
                }
            }
        }
    `);
    const { nextStepAchievements: nextStepStudentAchievements } = studentMe;
    assert.ok(nextStepStudentAchievements);

    const { me: pupilMe } = await pupilClient.request(`
        query nextStepAchievements {
            me {
                nextStepAchievements {
                    id
                }
            }
        }
    `);
    const { nextStepAchievements: nextStepPupilAchievements } = pupilMe;
    assert.ok(nextStepPupilAchievements);
});

void test('Resolver achievement by id', async () => {
    await adminClient.request(`mutation ResetRateLimits { _resetRateLimits }`);
    const { client: studentClient, student } = await studentOne;
    const { client: pupilClient, pupil } = await pupilTwo;

    const { id: studentAchievementId } = await prisma.user_achievement.findFirst({
        where: { userId: student.userID },
        select: { id: true },
    });
    const { me: studentMe } = await studentClient.request(`
        query achievementById {
            me {
                achievement(id:${studentAchievementId}) {
                    id
                }
            }
        }
    `);
    const { achievement: studentAchievement } = studentMe;
    assert.ok(studentAchievement);
    assert.strictEqual(studentAchievement.id, studentAchievementId);

    const { id: pupilAchievementId } = await prisma.user_achievement.findFirst({
        where: { userId: pupil.userID },
        select: { id: true },
    });
    const { me: pupilMe } = await pupilClient.request(`
        query achievementById {
            me {
                achievement(id:${pupilAchievementId}) {
                    id
                }
            }
        }
    `);
    const { achievement: pupilAchievement } = pupilMe;
    assert.ok(pupilAchievement);
    assert.strictEqual(pupilAchievement.id, pupilAchievementId);
});

/* -------------- additional functions for template and data creation ------------- */
function createDates(): Date[] {
    const today = new Date();
    const dates: Date[] = [];
    for (let i = 0; i < 5; i++) {
        dates[i] = new Date(today);
        dates[i].setDate(today.getDate() + (i - 1) * 7);
    }
    return dates;
}

function generateLectures(dates: Date[], match: Match, user: User) {
    dates.forEach(async (date) => {
        await prisma.lecture.create({
            data: {
                createdAt: new Date(),
                updatedAt: new Date(),
                start: date,
                duration: 60,
                subcourseId: null,
                matchId: match.id,

                appointmentType: lecture_appointmenttype_enum.match,
                title: null,
                description: null,
                isCanceled: false,
                organizerIds: [user.userID],
                participantIds: [],
                declinedBy: [],
                zoomMeetingId: null,
                zoomMeetingReport: [],
                instructorId: null,
                override_meeting_link: null,
            },
            select: {
                id: true,
            },
        });
    });
}

const createStudentOnboardingTemplates = async () => {
    await prisma.achievement_template.create({
        data: {
            name: 'Onboarding abschließen',
            templateFor: achievement_template_for_enum.Global,
            group: 'student_onboarding',
            groupOrder: 1,
            stepName: 'Verifizieren',
            type: achievement_type_enum.SEQUENTIAL,
            subtitle: 'Jetzt durchstarten',
            description: 'Dieser Text muss noch geliefert werden.',
            image: 'Puzzle_00',
            achievedImage: '',
            actionName: 'E-Mail erneut senden',
            actionRedirectLink: '',
            actionType: achievement_action_type_enum.Action,
            condition: 'student_verified_events > 0',
            conditionDataAggregations: { student_verified_events: { metric: 'student_onboarding_verified', aggregator: 'count' } },
            isActive: true,
        },
    });
    await prisma.achievement_template.create({
        data: {
            name: 'Onboarding abschließen',
            templateFor: achievement_template_for_enum.Global,
            group: 'student_onboarding',
            groupOrder: 2,
            stepName: 'Kennenlerngespräch buchen',
            type: achievement_type_enum.SEQUENTIAL,
            subtitle: 'Jetzt durchstarten',
            description: 'Dieser Text muss noch geliefert werden.',
            image: 'Puzzle_01',
            achievedImage: '',
            actionName: 'Termin vereinbaren',
            actionRedirectLink: 'https://calendly.com',
            actionType: achievement_action_type_enum.Action,
            condition: 'student_appointment_booked_events > 0',
            conditionDataAggregations: {
                student_appointment_booked_events: { metric: 'student_onboarding_appointment_booked', aggregator: 'count' },
            },
            isActive: false,
        },
    });
    await prisma.achievement_template.create({
        data: {
            name: 'Onboarding abschließen',
            templateFor: achievement_template_for_enum.Global,
            group: 'student_onboarding',
            groupOrder: 3,
            stepName: 'Screening absolvieren',
            type: achievement_type_enum.SEQUENTIAL,
            subtitle: 'Jetzt durchstarten',
            description: 'Dieser Text muss noch geliefert werden.',
            image: 'Puzzle_02',
            achievedImage: '',
            actionName: 'Screening absolvieren',
            actionRedirectLink: '',
            actionType: achievement_action_type_enum.Appointment,
            condition: 'student_screened_events > 0',
            conditionDataAggregations: { student_screened_events: { metric: 'student_onboarding_screened', aggregator: 'count' } },
            isActive: true,
        },
    });
    await prisma.achievement_template.create({
        data: {
            name: 'Onboarding abschließen',
            templateFor: achievement_template_for_enum.Global,
            group: 'student_onboarding',
            groupOrder: 4,
            stepName: 'Führungszeugnis einreichen',
            type: achievement_type_enum.SEQUENTIAL,
            subtitle: 'Jetzt durchstarten',
            description: 'Dieser Text muss noch geliefert werden.',
            image: 'Puzzle_02',
            achievedImage: '',
            actionName: 'Zeugnis einreichen',
            actionRedirectLink: 'mailto:fz@lern-fair.de',
            actionType: achievement_action_type_enum.Action,
            condition: 'student_coc_success_events > 0',
            conditionDataAggregations: { student_coc_success_events: { metric: 'student_onboarding_coc_success', aggregator: 'count' } },
            isActive: true,
        },
    });
    await prisma.achievement_template.create({
        data: {
            name: 'Onboarding abschließen',
            templateFor: achievement_template_for_enum.Global,
            group: 'student_onboarding',
            groupOrder: 5,
            stepName: 'Onboarding abgeschlossen',
            type: achievement_type_enum.SEQUENTIAL,
            subtitle: 'Jetzt durchstarten',
            description: 'Dieser Text muss noch geliefert werden.',
            image: 'Flugticket',
            achievedImage: '',
            actionName: null,
            actionRedirectLink: null,
            actionType: null,
            condition: 'student_coc_success_events > 0',
            conditionDataAggregations: { student_coc_success_events: { metric: 'student_onboarding_coc_success', aggregator: 'count' } },
            isActive: true,
        },
    });
};
const createPupilOnboardingTemplates = async () => {
    await prisma.achievement_template.create({
        data: {
            name: 'Onboarding abschließen',
            templateFor: achievement_template_for_enum.Global,
            group: 'pupil_onboarding',
            groupOrder: 1,
            stepName: 'Verifizieren',
            type: achievement_type_enum.SEQUENTIAL,
            subtitle: 'Jetzt durchstarten',
            description: 'Dieser Text muss noch geliefert werden.',
            image: 'Puzzle_00',
            achievedImage: '',
            actionName: 'E-Mail erneut senden',
            actionRedirectLink: '',
            actionType: achievement_action_type_enum.Action,
            condition: 'pupil_verified_events > 0',
            conditionDataAggregations: { pupil_verified_events: { metric: 'pupil_onboarding_verified', aggregator: 'count' } },
            isActive: true,
        },
    });
    await prisma.achievement_template.create({
        data: {
            name: 'Onboarding abschließen',
            templateFor: achievement_template_for_enum.Global,
            group: 'pupil_onboarding',
            groupOrder: 2,
            stepName: 'Kennenlerngespräch buchen',
            type: achievement_type_enum.SEQUENTIAL,
            subtitle: 'Jetzt durchstarten',
            description: 'Dieser Text muss noch geliefert werden.',
            image: 'Puzzle_01',
            achievedImage: '',
            actionName: 'Termin vereinbaren',
            actionRedirectLink: 'https://calendly.com',
            actionType: achievement_action_type_enum.Action,
            condition: 'pupil_appointment_booked_events > 0',
            conditionDataAggregations: {
                pupil_appointment_booked_events: { metric: 'pupil_onboarding_appointment_booked', aggregator: 'count' },
            },
            isActive: false,
        },
    });
    await prisma.achievement_template.create({
        data: {
            name: 'Onboarding abschließen',
            templateFor: achievement_template_for_enum.Global,
            group: 'pupil_onboarding',
            groupOrder: 3,
            stepName: 'Screening absolvieren',
            type: achievement_type_enum.SEQUENTIAL,
            subtitle: 'Jetzt durchstarten',
            description: 'Dieser Text muss noch geliefert werden.',
            image: 'Puzzle_02',
            achievedImage: '',
            actionName: 'Screening absolvieren',
            actionRedirectLink: '',
            actionType: achievement_action_type_enum.Appointment,
            condition: 'pupil_screened_events > 0',
            conditionDataAggregations: { pupil_screened_events: { metric: 'pupil_onboarding_screened', aggregator: 'count' } },
            isActive: true,
        },
    });

    await prisma.achievement_template.create({
        data: {
            name: 'Onboarding abschließen',
            templateFor: achievement_template_for_enum.Global,
            group: 'pupil_onboarding',
            groupOrder: 4,
            stepName: 'Onboarding abgeschlossen',
            type: achievement_type_enum.SEQUENTIAL,
            subtitle: 'Jetzt durchstarten',
            description: 'Dieser Text muss noch geliefert werden.',
            image: 'Flugticket',
            achievedImage: '',
            actionName: null,
            actionRedirectLink: null,
            actionType: null,
            condition: 'pupil_screened_events > 0',
            conditionDataAggregations: { pupil_screened_events: { metric: 'pupil_onboarding_screened', aggregator: 'count' } },
            isActive: true,
        },
    });
};
const createStudentConductedMatchAppointmentTemplates = async () => {
    await prisma.achievement_template.create({
        data: {
            name: '1. durchgeführter Termin',
            templateFor: achievement_template_for_enum.Global_Matches,
            group: 'student_conduct_match_appointment',
            groupOrder: 1,
            stepName: '',
            type: achievement_type_enum.TIERED,
            subtitle: '1:1 Lernunterstützungen',
            description: 'Dieser Text muss noch geliefert werden.',
            image: 'Polaroid_01',
            achievedImage: '',
            actionName: 'Absolviere deinen ersten Termin, um diesen Erfolg zu erhalten',
            actionRedirectLink: null,
            actionType: achievement_action_type_enum.Action,
            achievedText: 'Juhu! Dieser Text muss noch geliefert werden',
            condition: 'student_match_appointments_count > 0',
            conditionDataAggregations: {
                student_match_appointments_count: { metric: 'student_conducted_match_appointment', aggregator: 'count', valueToAchieve: 1 },
            },
            isActive: true,
        },
    });
    await prisma.achievement_template.create({
        data: {
            name: '3 durchgeführte Termine',
            templateFor: achievement_template_for_enum.Global_Matches,
            group: 'student_conduct_match_appointment',
            groupOrder: 2,
            stepName: '',
            type: achievement_type_enum.TIERED,
            subtitle: '1:1 Lernunterstützungen',
            description: 'Dieser Text muss noch geliefert werden.',
            image: 'Polaroid_02',
            achievedImage: '',
            actionName: null,
            actionRedirectLink: null,
            actionType: null,
            achievedText: 'Juhu! Dieser Text muss noch geliefert werden',
            condition: 'student_match_appointments_count > 2',
            conditionDataAggregations: {
                student_match_appointments_count: { metric: 'student_conducted_match_appointment', aggregator: 'count', valueToAchieve: 3 },
            },
            isActive: true,
        },
    });
    await prisma.achievement_template.create({
        data: {
            name: '5 durchgeführte Termine',
            templateFor: achievement_template_for_enum.Global_Matches,
            group: 'student_conduct_match_appointment',
            groupOrder: 3,
            stepName: '',
            type: achievement_type_enum.TIERED,
            subtitle: '1:1 Lernunterstützungen',
            description: 'Dieser Text muss noch geliefert werden.',
            image: 'Polaroid_03',
            achievedImage: '',
            actionName: null,
            actionRedirectLink: null,
            actionType: null,
            achievedText: 'Juhu! Dieser Text muss noch geliefert werden',
            condition: 'student_match_appointments_count > 4',
            conditionDataAggregations: {
                student_match_appointments_count: { metric: 'student_conducted_match_appointment', aggregator: 'count', valueToAchieve: 5 },
            },
            isActive: true,
        },
    });
    await prisma.achievement_template.create({
        data: {
            name: '10 durchgeführte Termine',
            templateFor: achievement_template_for_enum.Global_Matches,
            group: 'student_conduct_match_appointment',
            groupOrder: 4,
            stepName: '',
            type: achievement_type_enum.TIERED,
            subtitle: '1:1 Lernunterstützungen',
            description: 'Dieser Text muss noch geliefert werden.',
            image: 'Polaroid_04',
            achievedImage: '',
            actionName: null,
            actionRedirectLink: null,
            actionType: null,
            achievedText: 'Juhu! Dieser Text muss noch geliefert werden',
            condition: 'student_match_appointments_count > 9',
            conditionDataAggregations: {
                student_match_appointments_count: { metric: 'student_conducted_match_appointment', aggregator: 'count', valueToAchieve: 10 },
            },
            isActive: true,
        },
    });
    await prisma.achievement_template.create({
        data: {
            name: '15 durchgeführte Termine',
            templateFor: achievement_template_for_enum.Global_Matches,
            group: 'student_conduct_match_appointment',
            groupOrder: 5,
            stepName: '',
            type: achievement_type_enum.TIERED,
            subtitle: '1:1 Lernunterstützungen',
            description: 'Dieser Text muss noch geliefert werden.',
            image: 'Polaroid_05',
            achievedImage: '',
            actionName: null,
            actionRedirectLink: null,
            actionType: null,
            achievedText: 'Juhu! Dieser Text muss noch geliefert werden',
            condition: 'student_match_appointments_count > 14',
            conditionDataAggregations: {
                student_match_appointments_count: { metric: 'student_conducted_match_appointment', aggregator: 'count', valueToAchieve: 15 },
            },
            isActive: true,
        },
    });
    await prisma.achievement_template.create({
        data: {
            name: '25 durchgeführte Termine',
            templateFor: achievement_template_for_enum.Global_Matches,
            group: 'student_conduct_match_appointment',
            groupOrder: 6,
            stepName: '',
            type: achievement_type_enum.TIERED,
            subtitle: '1:1 Lernunterstützungen',
            description: 'Dieser Text muss noch geliefert werden.',
            image: 'Polaroid_06',
            achievedImage: '',
            actionName: null,
            actionRedirectLink: null,
            actionType: null,
            achievedText: 'Juhu! Dieser Text muss noch geliefert werden',
            condition: 'student_match_appointments_count > 24',
            conditionDataAggregations: {
                student_match_appointments_count: { metric: 'student_conducted_match_appointment', aggregator: 'count', valueToAchieve: 25 },
            },
            isActive: true,
        },
    });
};
const createPupilConductedMatchMeetingTemplates = async () => {
    await prisma.achievement_template.create({
        data: {
            name: '1. durchgeführter Termin',
            templateFor: achievement_template_for_enum.Global_Matches,
            group: 'pupil_conduct_match_appointment',
            groupOrder: 1,
            stepName: '',
            type: achievement_type_enum.TIERED,
            subtitle: '1:1 Lernunterstützungen',
            description: 'Dieser Text muss noch geliefert werden.',
            image: 'Polaroid_01',
            achievedImage: '',
            actionName: 'Absolviere deinen ersten Termin, um diesen Erfolg zu erhalten',
            actionRedirectLink: null,
            actionType: achievement_action_type_enum.Action,
            achievedText: 'Juhu! Dieser Text muss noch geliefert werden',
            condition: 'pupil_match_appointments_count > 0',
            conditionDataAggregations: {
                pupil_match_appointments_count: { metric: 'pupil_conducted_match_appointment', aggregator: 'count', valueToAchieve: 1 },
            },
            isActive: true,
        },
    });
    await prisma.achievement_template.create({
        data: {
            name: '3 durchgeführte Termine',
            templateFor: achievement_template_for_enum.Global_Matches,
            group: 'pupil_conduct_match_appointment',
            groupOrder: 2,
            stepName: '',
            type: achievement_type_enum.TIERED,
            subtitle: '1:1 Lernunterstützungen',
            description: 'Dieser Text muss noch geliefert werden.',
            image: 'Polaroid_02',
            achievedImage: '',
            actionName: null,
            actionRedirectLink: null,
            actionType: null,
            achievedText: 'Juhu! Dieser Text muss noch geliefert werden',
            condition: 'pupil_match_appointments_count > 2',
            conditionDataAggregations: {
                pupil_match_appointments_count: { metric: 'pupil_conducted_match_appointment', aggregator: 'count', valueToAchieve: 3 },
            },
            isActive: true,
        },
    });
    await prisma.achievement_template.create({
        data: {
            name: '5 durchgeführte Termine',
            templateFor: achievement_template_for_enum.Global_Matches,
            group: 'pupil_conduct_match_appointment',
            groupOrder: 3,
            stepName: '',
            type: achievement_type_enum.TIERED,
            subtitle: '1:1 Lernunterstützungen',
            description: 'Dieser Text muss noch geliefert werden.',
            image: 'Polaroid_03',
            achievedImage: '',
            actionName: null,
            actionRedirectLink: null,
            actionType: null,
            achievedText: 'Juhu! Dieser Text muss noch geliefert werden',
            condition: 'pupil_match_appointments_count > 4',
            conditionDataAggregations: {
                pupil_match_appointments_count: { metric: 'pupil_conducted_match_appointment', aggregator: 'count', valueToAchieve: 5 },
            },
            isActive: true,
        },
    });
    await prisma.achievement_template.create({
        data: {
            name: '10 durchgeführte Termine',
            templateFor: achievement_template_for_enum.Global_Matches,
            group: 'pupil_conduct_match_appointment',
            groupOrder: 4,
            stepName: '',
            type: achievement_type_enum.TIERED,
            subtitle: '1:1 Lernunterstützungen',
            description: 'Dieser Text muss noch geliefert werden.',
            image: 'Polaroid_04',
            achievedImage: '',
            actionName: null,
            actionRedirectLink: null,
            actionType: null,
            achievedText: 'Juhu! Dieser Text muss noch geliefert werden',
            condition: 'pupil_match_appointments_count > 9',
            conditionDataAggregations: {
                student_conducted_match_appointments: { metric: 'pupil_conducted_match_appointment', aggregator: 'count', valueToAchieve: 10 },
            },
            isActive: true,
        },
    });
    await prisma.achievement_template.create({
        data: {
            name: '15 durchgeführte Termine',
            templateFor: achievement_template_for_enum.Global_Matches,
            group: 'pupil_conduct_match_appointment',
            groupOrder: 5,
            stepName: '',
            type: achievement_type_enum.TIERED,
            subtitle: '1:1 Lernunterstützungen',
            description: 'Dieser Text muss noch geliefert werden.',
            image: 'Polaroid_05',
            achievedImage: '',
            actionName: null,
            actionRedirectLink: null,
            actionType: null,
            achievedText: 'Juhu! Dieser Text muss noch geliefert werden',
            condition: 'pupil_match_appointments_count > 14',
            conditionDataAggregations: {
                pupil_match_appointments_count: { metric: 'pupil_conducted_match_appointment', aggregator: 'count', valueToAchieve: 15 },
            },
            isActive: true,
        },
    });
    await prisma.achievement_template.create({
        data: {
            name: '25 durchgeführte Termine',
            templateFor: achievement_template_for_enum.Global_Matches,
            group: 'pupil_conduct_match_appointment',
            groupOrder: 6,
            stepName: '',
            type: achievement_type_enum.TIERED,
            subtitle: '1:1 Lernunterstützungen',
            description: 'Dieser Text muss noch geliefert werden.',
            image: 'Polaroid_06',
            achievedImage: '',
            actionName: null,
            actionRedirectLink: null,
            actionType: null,
            achievedText: 'Juhu! Dieser Text muss noch geliefert werden',
            condition: 'pupil_match_appointments_count > 24',
            conditionDataAggregations: {
                pupil_match_appointments_count: { metric: 'pupil_conducted_match_appointment', aggregator: 'count', valueToAchieve: 25 },
            },
            isActive: true,
        },
    });
};
const createStudentRegularLearningTemplate = async () => {
    await prisma.achievement_template.create({
        data: {
            name: 'Regelmäßiges Lernen',
            templateFor: achievement_template_for_enum.Match,
            group: 'student_match_regular_learning',
            groupOrder: 1,
            stepName: '',
            type: achievement_type_enum.STREAK,
            subtitle: 'Nachhilfe mit {{matchpartner}}',
            description: 'Dieser Text muss noch geliefert werden.',
            image: 'Hat_grey',
            achievedImage: 'Hat_gold',
            actionName: null,
            actionRedirectLink: null,
            actionType: null,
            achievedText: 'Juhu! Rekord gebrochen.',
            condition: 'student_match_learning_events > recordValue',
            conditionDataAggregations: {
                student_match_learning_events: {
                    metric: 'student_match_learned_regular',
                    aggregator: 'lastStreakLength',
                    createBuckets: 'by_weeks',
                    bucketAggregator: 'presenceOfEvents',
                },
            },
            isActive: true,
        },
    });
};
const createPupilRegularLearningTemplate = async () => {
    await prisma.achievement_template.create({
        data: {
            name: 'Regelmäßiges Lernen',
            templateFor: achievement_template_for_enum.Match,
            group: 'pupil_match_regular_learning',
            groupOrder: 1,
            stepName: '',
            type: achievement_type_enum.STREAK,
            subtitle: 'Nachhilfe mit {{matchpartner}}',
            description: 'Dieser Text muss noch geliefert werden.',
            image: 'Hat_grey',
            achievedImage: 'Hat_gold',
            actionName: null,
            actionRedirectLink: null,
            actionType: null,
            achievedText: 'Juhu! Rekord gebrochen.',
            condition: 'pupil_match_learning_events > recordValue',
            conditionDataAggregations: {
                pupil_match_learning_events: {
                    metric: 'pupil_match_learned_regular',
                    aggregator: 'lastStreakLength',
                    createBuckets: 'by_weeks',
                    bucketAggregator: 'presenceOfEvents',
                },
            },
            isActive: true,
        },
    });
};
