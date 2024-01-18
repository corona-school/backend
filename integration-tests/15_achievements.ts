import { createNewPupil, createNewStudent, pupilTwo, studentOne } from './01_user';
import { test } from './base';
import { v4 as generateUUID } from 'uuid';
import { screenerOne } from './02_screening';
import { adminClient } from './base/clients';
import { prisma } from '../common/prisma';
import { achievement_template_for_enum, achievement_type_enum, achievement_action_type_enum, lecture_appointmenttype_enum } from '@prisma/client';
import { User, getUser } from '../common/user';
import { getLogger } from '../common/logger/logger';
import { Match } from '../graphql/generated';
import { _createFixedToken } from '../common/secret/token';

const logger = getLogger('Token');

void test('Reward student onboarding achievement sequence', async () => {
    await adminClient.request(`mutation ResetRateLimits { _resetRateLimits }`);
    await createStudentOnboardingTemplates();

    // Verify Email
    const { student, client } = await createNewStudent();
    const user = await getUser(student.userID);

    const student_onboarding_1 = await prisma.user_achievement.findFirst({
        where: {
            group: 'student_onboarding',
            groupOrder: 1,
            achievedAt: { not: null },
            userId: user.userID,
        },
    });
    if (!student_onboarding_1) {
        throw new Error(`There was no achievement created or found during or after the email verification process.`);
    }
    logger.info('The Achievement 1 for group student_onboarding was created and found when verifying a users E-Mail.');

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
    const student_onboarding_2 = await prisma.user_achievement.findFirst({
        where: {
            group: 'student_onboarding',
            groupOrder: 3,
            achievedAt: { not: null },
            userId: user.userID,
        },
    });
    if (!student_onboarding_2) {
        throw new Error(`There was no achievement created or found during or after the screening process`);
    }
    logger.info('The Achievement 3 for group student_onboarding was created and found when screeing a tutor');

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
    const student_onboarding_3 = await prisma.user_achievement.findFirst({
        where: {
            group: 'student_onboarding',
            groupOrder: 4,
            achievedAt: { not: null },
            userId: user.userID,
        },
    });
    const student_onboarding_4 = await prisma.user_achievement.findFirst({
        where: {
            group: 'student_onboarding',
            groupOrder: 5,
            userId: user.userID,
        },
    });
    if (!student_onboarding_3) {
        throw new Error(`There was no achievement created or found during or after the creation of a CoC`);
    } else if (!student_onboarding_4) {
        throw new Error(`There was no final achievement created or found after the creation of a CoC`);
    }
    logger.info('The Achievement 4 adn 5 for group student_onboarding were created and found when creating a CoC');
});

void test('Reward pupil onboarding achievement sequence', async () => {
    await adminClient.request(`mutation ResetRateLimits { _resetRateLimits }`);
    await createPupilOnboardingTemplates();

    // Verify Email
    const { pupil } = await createNewPupil();
    const user = await getUser(pupil.userID);

    const pupil_onboarding_1 = await prisma.user_achievement.findFirst({
        where: {
            group: 'pupil_onboarding',
            groupOrder: 1,
            achievedAt: { not: null },
            userId: user.userID,
        },
    });
    if (!pupil_onboarding_1) {
        throw new Error(`There was no achievement created or found during or after the email verification process.`);
    }
    logger.info('The Achievement 1 for group pupil_onboarding was created and found when verifying a users E-Mail.');
    // Screening
    await adminClient.request(`
        mutation RequestScreening { pupilCreateScreening(pupilId: ${pupil.pupil.id})}
    `);
    const pupil_onboarding_2 = await prisma.user_achievement.findFirst({
        where: {
            group: 'pupil_onboarding',
            groupOrder: 3,
            achievedAt: { not: null },
            userId: user.userID,
        },
    });
    const pupil_onboarding_3 = await prisma.user_achievement.findFirst({
        where: {
            group: 'pupil_onboarding',
            groupOrder: 4,
            userId: user.userID,
        },
    });
    if (!pupil_onboarding_2) {
        throw new Error(`There was no achievement created or found during or after the screening process`);
    } else if (!pupil_onboarding_3) {
        throw new Error(`There was no final achievement created or found after the screening process`);
    }
    logger.info('The Achievement 3 and 4 for group pupil_onboarding were created and found when screeing a pupil');
});

void test('Reward student conducted match appointment', async () => {
    await adminClient.request(`mutation ResetRateLimits { _resetRateLimits }`);
    await createStudentConductedMatchAppointmentTemplates();
    const { student, client } = await studentOne;
    const user = await getUser(student.userID);
    await _createFixedToken(user, `authtokenStudent`);
    await client.request(`
        mutation auth { loginToken(token: "authtokenStudent") }
    `);

    const uuid = generateUUID();
    const match = await prisma.match.create({
        data: {
            uuid,
            source: 'matchedinternal',
            matchPool: 'lern-fair-now',
            studentId: student.student.id,
            pupilId: 1,
        },
    });
    const dates = createDates();
    generateLectures(dates, match, user);
    await client.request(`
        mutation StudentJoinMatchMeeting { matchMeetingJoin(matchId:${match.id}) }
    `);

    const student_joined_match_meeting_achievements = await prisma.user_achievement.findMany({
        where: {
            group: 'student_conduct_match_appointment',
            userId: user.userID,
        },
    });
    if (student_joined_match_meeting_achievements.length === 0) {
        throw new Error(`There was no achievement created for the tierd achievement of group student_conducted_match_appointment`);
    }
    logger.info(
        `There were ${student_joined_match_meeting_achievements.length} achivements of the group student_conducted_match_appointment found, after joining a match meeting`
    );
});

void test('Reward pupil conducted match appointment', async () => {
    await adminClient.request(`mutation ResetRateLimits { _resetRateLimits }`);
    await createPupilConductedMatchMeetingTemplates();
    const { pupil, client } = await pupilTwo;
    const user = await getUser(pupil.userID);

    const match = await prisma.match.findFirst({
        where: {
            pupilId: pupil.pupil.id,
            dissolved: false,
        },
        select: { id: true },
    });
    await client.request(`
        mutation StudentJoinMatchMeeting { matchMeetingJoin(matchId:${match.id}) }
    `);
    const pupil_joined_match_meeting_achievements = await prisma.user_achievement.findMany({
        where: {
            group: 'pupil_conduct_match_appointment',
            userId: user.userID,
        },
    });
    logger.info(
        `There were ${pupil_joined_match_meeting_achievements.length} achivements of the group pupil_conducted_match_appointment found, after joining a match meeting`
    );
});

/* -------------- additional functions for template and data creation ------------- */
function createDates(): Date[] {
    const today = new Date();
    const dates: Date[] = [];
    for (let i = 0; i < 5; i++) {
        dates[i] = new Date(today);
        dates[i].setDate(today.getDate() + i * 7);
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
            metrics: ['student_onboarding_verified'],
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
            metrics: ['student_onboarding_appointment_booked'],
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
            metrics: ['student_onboarding_screened'],
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
            metrics: ['student_onboarding_coc_success'],
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
            metrics: ['student_onboarding_coc_success'],
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
            metrics: ['pupil_onboarding_verified'],
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
            metrics: ['pupil_onboarding_appointment_booked'],
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
            metrics: ['pupil_onboarding_screened'],
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
            metrics: ['pupil_onboarding_screened'],
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
            metrics: ['student_conducted_match_appointment'],
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
            metrics: ['student_conducted_match_appointment'],
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
            metrics: ['student_conducted_match_appointment'],
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
            metrics: ['student_conducted_match_appointment'],
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
            metrics: ['student_conducted_match_appointment'],
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
            metrics: ['student_conducted_match_appointment'],
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
            metrics: ['pupil_conducted_match_appointment'],
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
            metrics: ['pupil_conducted_match_appointment'],
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
            metrics: ['pupil_conducted_match_appointment'],
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
            metrics: ['pupil_conducted_match_appointment'],
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
            metrics: ['pupil_conducted_match_appointment'],
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
            metrics: ['pupil_conducted_match_appointment'],
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
