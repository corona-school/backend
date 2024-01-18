import { createNewStudent } from './01_user';
import { test } from './base';
import { screenerOne } from './02_screening';
import { adminClient } from './base/clients';
import { prisma } from '../common/prisma';
import { achievement_template_for_enum, achievement_type_enum, achievement_action_type_enum } from '@prisma/client';
import { getUser } from '../common/user';
import { getLogger } from '../common/logger/logger';

const logger = getLogger('Token');

void test('Reward onboarding achievement sequence', async () => {
    await adminClient.request(`mutation ResetRateLimits { _resetRateLimits }`);
    await createStudentOnboardingTemplates();

    // Verify Email
    const { student } = await createNewStudent();
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
// void test('Reward final sequential achievement', async () => {});

// void test('Reward tiered achievement', async () => {});

// void test('Reward new record streak achievement', async () => {});
// void test('Broken Streak', async () => {});

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
