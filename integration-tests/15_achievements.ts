import { createNewPupil, createNewStudent, pupilTwo, studentOne } from './01_user';
import { test } from './base';
import { screenerOne } from './02_screening';
import { adminClient } from './base/clients';
import { prisma } from '../common/prisma';
import { achievement_template_for_enum, achievement_type_enum, achievement_action_type_enum, lecture_appointmenttype_enum } from '@prisma/client';
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

    const studentOnboarding1 = await prisma.user_achievement.findFirst({
        where: {
            achievedAt: { not: null },
            userId: student.userID,
            template: { group: 'student_onboarding', groupOrder: 1 },
        },
        include: { template: true },
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
            achievedAt: { not: null },
            userId: student.userID,
            template: { group: 'student_onboarding', groupOrder: 3 },
        },
        include: { template: true },
    });
    assert.ok(studentOnboarding2);

    // Create Certificate of Conduct
    const newDate = new Date().toISOString();
    await adminClient.request(`
        mutation CreateCertificateOfConduct {
            certificateOfConductCreate(
                dateOfInspection: "${newDate}",
                dateOfIssue: "${newDate}",
                criminalRecords: false,
                studentId: ${student.student.id},
            )
        }
    `);
    const studentOnboarding3 = await prisma.user_achievement.findFirst({
        where: {
            achievedAt: { not: null },
            userId: student.userID,
            template: { group: 'student_onboarding', groupOrder: 4 },
        },
        include: { template: true },
    });
    const studentOnboarding4 = await prisma.user_achievement.findFirst({
        where: {
            userId: student.userID,
            template: { group: 'student_onboarding', groupOrder: 5 },
        },
        include: { template: true },
    });
    assert.ok(studentOnboarding3);
    assert.ok(studentOnboarding4);
});

void test('Reward pupil onboarding achievement sequence', async () => {
    await adminClient.request(`mutation ResetRateLimits { _resetRateLimits }`);

    // Verify Email
    const { pupil } = await createNewPupil();

    const pupilOnboarding1 = await prisma.user_achievement.findFirst({
        where: {
            achievedAt: { not: null },
            userId: pupil.userID,
            template: { group: 'pupil_onboarding', groupOrder: 1 },
        },
        include: { template: true },
    });
    assert.ok(pupilOnboarding1);
    // Screening
    await adminClient.request(`
        mutation RequestScreening { pupilCreateScreening(pupilId: ${pupil.pupil.id})}
    `);
    const pupilOnboarding2 = await prisma.user_achievement.findFirst({
        where: {
            achievedAt: { not: null },
            userId: pupil.userID,
            template: { group: 'pupil_onboarding', groupOrder: 3 },
        },
        include: { template: true },
    });
    const pupilOnboarding3 = await prisma.user_achievement.findFirst({
        where: {
            userId: pupil.userID,
            template: { group: 'pupil_onboarding', groupOrder: 4 },
        },
        include: { template: true },
    });
    assert.ok(pupilOnboarding2);
    assert.ok(pupilOnboarding3);
});

void test('Reward student conducted match appointment', async () => {
    await adminClient.request(`mutation ResetRateLimits { _resetRateLimits }`);
    const { student, client } = await studentOne;

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
    const appointments = await generateLectures(dates, match, student.userID);
    await client.request(`
        mutation StudentJoinMatchMeeting { appointmentTrackJoin(appointmentId:${appointments[0].id}) }
    `);

    const studentJoinedMatchMeetingAchievements = await prisma.user_achievement.findMany({
        where: {
            userId: student.userID,
            template: { group: 'student_conduct_match_appointment' },
        },
        include: { template: true },
    });
    assert.ok(studentJoinedMatchMeetingAchievements[0]);
    assert.notStrictEqual(studentJoinedMatchMeetingAchievements.length, 0);
});

void test('Reward pupil conducted match appointment', async () => {
    await adminClient.request(`mutation ResetRateLimits { _resetRateLimits }`);
    const { student } = await studentOne;
    const { pupil, client } = await pupilTwo;

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

    const dates = createDates();
    const appointments = await generateLectures(dates, match, student.userID, pupil.userID);
    await client.request(`
        mutation PupilJoinMatchMeeting { appointmentTrackJoin(appointmentId:${appointments[0].id}) }
    `);
    const pupilJoinedMatchMeetingAchievements = await prisma.user_achievement.findMany({
        where: {
            userId: pupil.userID,
            template: { group: 'pupil_conduct_match_appointment' },
        },
        include: { template: true },
    });
    assert.ok(pupilJoinedMatchMeetingAchievements);
    assert.notStrictEqual(pupilJoinedMatchMeetingAchievements.length, 0);
});

void test('Reward student regular learning', async () => {
    await adminClient.request(`mutation ResetRateLimits { _resetRateLimits }`);

    const { student, client } = await studentOne;
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
    const dates = createDates();
    const appointments = await generateLectures(dates, match, student.userID);
    await client.request(`
        mutation StudentJoinMatchMeeting { appointmentTrackJoin(appointmentId:${appointments[0].id}) }
    `);
    const allAchievements = await prisma.user_achievement.findMany({
        where: {
            userId: student.userID,
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
            userId: student.userID,
            metric: metric,
            value: 1,
            createdAt: date,
            action: 'student_joined_match_meeting',
            relation: '',
        },
    });
    // request to set the achievements record value to 2 due to the past event generated
    await client.request(`
        mutation StudentJoinMatchMeeting { appointmentTrackJoin(appointmentId:${appointments[1].id}) }
    `);

    const studentMatchRegularLearningRecord = await prisma.user_achievement.findFirst({
        where: {
            userId: student.userID,
            achievedAt: { not: null },
            recordValue: 2,
            template: { group: 'student_match_regular_learning' },
        },
        include: { template: true },
    });
    assert.ok(studentMatchRegularLearningRecord);

    await prisma.achievement_event.deleteMany({
        where: {
            userId: student.userID,
            metric: metric,
            relation: `match/${match.id}`,
        },
    });

    await client.request(`
        mutation StudentJoinMatchMeeting { appointmentTrackJoin(appointmentId:${appointments[2].id}) }
    `);

    const studentMatchRegularLearning = await prisma.user_achievement.findFirst({
        where: {
            userId: student.userID,
            achievedAt: null,
            recordValue: 2,
            template: { group: 'student_match_regular_learning' },
        },
        include: { template: true },
    });
    assert.ok(studentMatchRegularLearning);
});

void test('Reward pupil regular learning', async () => {
    await adminClient.request(`mutation ResetRateLimits { _resetRateLimits }`);

    const { pupil, client } = await pupilTwo;
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
    const dates = createDates();
    const appointments = await generateLectures(dates, match, pupil.userID);

    // request to generate the achievement with initial record value 1
    await client.request(`
        mutation PupilJoinMatchMeeting { appointmentTrackJoin(appointmentId:${appointments[0].id}) }
    `);
    const achievements = await prisma.user_achievement.findMany({
        where: {
            userId: pupil.userID,
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
            userId: pupil.userID,
            metric: metric,
            value: 1,
            createdAt: date,
            action: 'pupil_joined_match_meeting',
            relation: '',
        },
    });
    // request to set the achievements record value to 2 due to the past event generated
    await client.request(`
        mutation PupilJoinMatchMeeting { appointmentTrackJoin(appointmentId:${appointments[1].id}) }
    `);

    await prisma.achievement_event.deleteMany({
        where: {
            userId: pupil.userID,
            metric: 'pupil_match_regular_learning',
        },
    });
    await client.request(`
        mutation PupilJoinMatchMeeting { appointmentTrackJoin(appointmentId:${appointments[3].id}) }
    `);

    const pupilMatchRegularLearning = await prisma.user_achievement.findFirst({
        where: {
            userId: pupil.userID,
            achievedAt: null,
            recordValue: 2,
            template: { group: 'pupil_match_regular_learning' },
        },
        include: { template: true },
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

function generateLectures(dates: Date[], match: Match, organizerID: string, participantID?: string) {
    return Promise.all(
        dates.map(async (date) => {
            return await prisma.lecture.create({
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
                    organizerIds: [organizerID],
                    participantIds: participantID ? [participantID] : [],
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
        })
    );
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
            description: '',
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
            description:
                'Hurra! Am {{date}} haben wir eine E-Mail an deine Adresse {{email}} gesendet. Um deine E-Mail zu bestätigen, klicke einfach auf den Button in der Nachricht. Solltest du unsere E-Mail nicht finden, kannst du hier eine erneute Zustellung anfordern und voller Vorfreude auf unser Weiterkommen warten.',
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
            description:
                'Wir sind gespannt darauf, dich kennenzulernen! In einem kurzen, 15-minütigen Zoom-Gespräch möchten wir dir gerne unsere vielfältigen Engagement-Möglichkeiten vorstellen und alle deine Fragen beantworten. Buche einfach einen Termin, um mehr zu erfahren und dann voller Tatendrang direkt durchzustarten. Falls dir etwas dazwischen kommt, sage den Termin bitte ab und buche dir einen neuen.',
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
            description:
                'Der Schutz von Kindern und Jugendlichen liegt uns sehr am Herzen, daher benötigen wir von allen Ehrenamtlichen ein erweitertes Führungszeugnis. Im nächsten Schritt findest du eine Anleitung zur Beantragung sowie eine Bescheinigung zur Kostenübernahme für das erweiterte Führungszeugnis. Um deinen Account aktiv zu halten, bitten wir dich, das erweiterte Führungszeugnis bis zum {{date}} bei uns einzureichen. Gemeinsam setzen wir uns für eine sichere Umgebung ein, in der alle sich wohl und geschützt fühlen können.',
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
            description:
                'Herzlichen Glückwunsch! Du hast alle Onboarding-Schritte erfolgreich gemeistert und dir das Abflugticket für Loki gesichert. Wir sind begeistert, dass du nun Teil unseres Teams bist und Schüler:innen auf ihrem Lernweg begleitest. Gemeinsam setzen wir uns für eine bessere Bildung in Deutschland ein. Du bist bereits jetzt ein:e Lern-Fair Held:in! ❤️ Danke für dein Engagement und deine Begeisterung!',
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
            description:
                'Hurra! Am {{date}} haben wir eine E-Mail an deine Adresse {{email}} gesendet. Um deine E-Mail zu bestätigen, klicke einfach auf den Button in der Nachricht. Solltest du unsere E-Mail nicht finden, kannst du hier eine erneute Zustellung anfordern und voller Vorfreude auf unser Weiterkommen warten.',
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
            description:
                'Hurra! Am {{date}} haben wir eine E-Mail an deine Adresse {{email}} gesendet. Um deine E-Mail zu bestätigen, klicke einfach auf den Button in der Nachricht. Solltest du unsere E-Mail nicht finden, kannst du hier eine erneute Zustellung anfordern und voller Vorfreude auf unser Weiterkommen warten.',
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
            description:
                'Wir sind gespannt darauf, dich kennenzulernen! In einem kurzen, 15-minütigen Zoom-Gespräch möchten wir dir gerne unsere vielfältigen kostenlose Angebote vorstellen und dir die beste Unterstützung ermöglichen sowie alle deine Fragen beantworten. Buche einfach einen Termin, um mehr zu erfahren und dann voller Tatendrang direkt durchzustarten. Falls dir etwas dazwischen kommt, sage den Termin bitte ab und buche dir einen neuen.',
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
            description:
                'Herzlichen Glückwunsch! Du hast alle Onboarding-Schritte erfolgreich gemeistert und dir das Abflugticket für Loki gesichert. Wir sind begeistert, dass du nun Teil unserer Lerncommunity bist und hoffen dich gut auf deiner Lernreise begleiten zu können. Loki und unser Team werden immer für dich da sein!',
            image: 'Flugticket',
            achievedImage: '',
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
            description:
                'Du hast {{num}} Woche(n) in Folge mit {{name}} gelernt! Um diese Serie aufrechtzuerhalten, setze deine gemeinsamen Lernsessions mit {{name}} weiter fort. Regelmäßiges Lernen bringt eine Fülle an Vorteilen mit sich, von verbessertem Wissen und Verständnis bis hin zu gesteigerter Effizienz und Selbstvertrauen. Ihr seid definitiv auf dem richtigen Weg, um eure Ziele zu erreichen!',
            image: 'gamification/achievements/tmp/streaks/regular_learning_set.png',
            achievedImage: 'gamification/achievements/tmp/streaks/regular_learning_achieved.png',
            actionName: 'Noch {{num}} Woche(n) bis zum neuen Rekord!',
            actionRedirectLink: null,
            actionType: null,
            achievedText: 'Juhu! Rekord gebrochen.',
            progressDescription: 'Noch {{eventsToBeatStreak}} Woche(n) bis zum neuen Rekord!',
            streakProgress: 'Du warst bei {{progress}} Termin(en) in Folge anwesend!',
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
            description:
                'Du hast {{progress}} Woche(n) in Folge mit {{name}} gelernt! Um diese Serie aufrechtzuerhalten, setze deine gemeinsamen Lernsessions mit {{name}} weiter fort. Regelmäßiges Lernen bringt eine Fülle an Vorteilen mit sich, von verbessertem Wissen und Verständnis bis hin zu gesteigerter Effizienz und Selbstvertrauen. Ihr seid definitiv auf dem richtigen Weg, um eure Ziele zu erreichen!',
            image: 'gamification/achievements/tmp/streaks/regular_learning_set.png',
            achievedImage: 'gamification/achievements/tmp/streaks/regular_learning_achieved.png',
            actionName: 'Noch {{progress}} Woche(n) bis zum neuen Rekord!',
            actionRedirectLink: null,
            actionType: null,
            achievedText: 'Juhu! Rekord gebrochen.',
            progressDescription: 'Noch {{eventsToBeatStreak}} Woche(n) bis zum neuen Rekord!',
            streakProgress: 'Du warst bei {{progress}} Termin(en) in Folge anwesend!',
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
