import { getLogger } from '../common/logger/logger';
import { prisma } from '../common/prisma';

const logger = getLogger('Notification Preferences Migration');

export default async function execute() {
    await updateNotificationPreferencesForPupils();
    await updateNotificationPreferencesForStudents();
    await updateNotificationPreferencesForScreeners();
}

export async function updateNotificationPreferencesForPupils() {
    const pupils = await prisma.pupil.findMany({
        where: { notificationPreferences: { not: null } },
        select: { id: true, notificationPreferences: true },
    });

    const updatedPupils = await Promise.all(
        pupils.map(async (pupil) => {
            const pupilPreferences = pupil.notificationPreferences;

            if (!pupilPreferences) {
                logger.info(`Pupil ${pupil.id} has no notification preferences.`);
                return;
            }

            if (typeof pupilPreferences === 'string') {
                const updatedPreferences = JSON.parse(pupilPreferences);
                const updatedPupilPreferences = await prisma.pupil.update({
                    where: {
                        id: pupil.id,
                    },
                    data: {
                        notificationPreferences: updatedPreferences,
                    },
                });

                if (typeof updatedPupilPreferences === 'object') {
                    logger.info(`Migrated notificiation preferences for pupil: ${pupil.id}`);
                } else {
                    logger.info(`Migration of notificiation preferences didn't work`);
                }
            } else {
                logger.info(`Notification preferences is already a JSON.`);
            }
        })
    );

    return updatedPupils;
}

export async function updateNotificationPreferencesForStudents() {
    const students = await prisma.student.findMany({
        where: { notificationPreferences: { not: null } },
        select: { id: true, notificationPreferences: true },
    });

    const updatedStudents = await Promise.all(
        students.map(async (student) => {
            const studentPreferences = student.notificationPreferences;

            if (!studentPreferences) {
                logger.info(`Student ${student.id} has no notification preferences.`);
                return;
            }

            if (typeof studentPreferences === 'string') {
                const updatedPreferences = JSON.parse(studentPreferences);
                const updatedStudentPreferences = await prisma.student.update({
                    where: {
                        id: student.id,
                    },
                    data: {
                        notificationPreferences: updatedPreferences,
                    },
                });

                if (typeof updatedStudentPreferences === 'object') {
                    logger.info(`Migrated notificiation preferences for student: ${student.id}`);
                } else {
                    logger.info(`Migration of notificiation preferences didn't work`);
                }
            } else {
                logger.info(`Notification preferences is already a JSON.`);
            }
        })
    );

    return updatedStudents;
}

export async function updateNotificationPreferencesForScreeners() {
    const screeners = await prisma.screener.findMany({
        where: { notificationPreferences: { not: null } },
        select: { id: true, notificationPreferences: true },
    });

    const updatedScreeners = await Promise.all(
        screeners.map(async (screener) => {
            const screenerPreferences = screener.notificationPreferences;

            if (!screenerPreferences) {
                logger.info(`Screener ${screener.id} has no notification preferences.`);

                return;
            }

            if (typeof screenerPreferences === 'string') {
                const updatedPreferences = JSON.parse(screenerPreferences);
                const updatedScreenerPreferences = await prisma.screener.update({
                    where: {
                        id: screener.id,
                    },
                    data: {
                        notificationPreferences: updatedPreferences,
                    },
                });

                if (typeof updatedScreenerPreferences === 'object') {
                    logger.info(`Migrated notificiation preferences for screener: ${screener.id}`);
                } else {
                    logger.info(`Migration of notificiation preferences didn't work`);
                }
            } else {
                logger.info(`Notification preferences is already a JSON.`);
            }
        })
    );

    return updatedScreeners;
}
