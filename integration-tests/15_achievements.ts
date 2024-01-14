import assert from 'assert';
import { studentOne } from './01_user';
import { test } from './base';
import { screenedInstructorOne } from './02_screening';
import { adminClient } from './base/clients';
import { prisma } from '../common/prisma';

void test('Reward sequential step achievement', async () => {
    const { client, student } = await studentOne;

    const date = new Date();

    await adminClient.request(`
    mutation verifyEmail {
        _verifyEmail(
            userID: "${student.userID}"
        )
    }    
    `);

    await adminClient.request(`
    mutation studentInstructorScreening {
        studentInstructorScreeningCreate(studentId: ${student.student.id}, screening: {
        success: true,
      })
    }
    
    `);

    await adminClient.request(`
        mutation studentCoc {
            certificateOfConductCreate(
            studentId: ${student.student.id}, 
            criminalRecords: false, 
            dateOfIssue: "${date}", 
            dateOfInspection: "${date}")
        }
    `);

    const templates = await prisma.achievement_template.findMany({ where: { isActive: true } });
    console.log('TEMPLATES', templates);

    const events = await prisma.achievement_event.findMany({ where: { userId: student.userID } });
    console.log('EVENTS', events);

    // const {
    //     me: { achievements },
    // } = await client.request(`
    // query achievements {
    //     me {
    //         achievements {
    //             id
    //             name
    //             subtitle
    //             description
    //             image
    //             alternativeText
    //             actionType
    //             achievementType
    //             achievementState
    //             steps {
    //                 name
    //                 isActive
    //             }
    //             maxSteps
    //             currentStep
    //             isNewAchievement
    //             progressDescription
    //             actionName
    //             actionRedirectLink
    //         }
    //     }
    // }
    // `);

    // console.log('ACHIEVEMENTS:', achievements);

    // assert.ok(achievements.length > 0);
});
void test('Reward final sequential achievement', async () => {});

void test('Reward tiered achievement', async () => {});

void test('Reward new record streak achievement', async () => {});
void test('Broken Streak', async () => {});

void test('Get my achievements', async () => {
    const { client } = await screenedInstructorOne;

    const {
        me: { achievements },
    } = await client.request(`
    query achievements {
        me {
            achievements {
                id
                name
                subtitle
                description
                image
                alternativeText
                actionType
                achievementType
                achievementState
                steps {
                    name
                    isActive
                }
                maxSteps
                currentStep
                isNewAchievement
                progressDescription
                actionName
                actionRedirectLink
            }
        }
    }
    `);

    assert.ok(achievements);
    return achievements;
});
