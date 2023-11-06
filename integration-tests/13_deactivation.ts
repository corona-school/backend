import { pupilOneWithPassword } from './05_auth';
import { test } from './base';
import { createNewPupil, createNewStudent, createInactivityMockNotification } from './01_user';
import { adminClient } from './base/clients';
import { prisma } from '../common/prisma';
import { DEACTIVATE_ACCOUNTS_INACTIVITY_DAYS, deactivateInactiveAccounts } from '../jobs/periodic/redact-inactive-accounts/deactivate-inactive-accounts';
import { sendInactivityNotification, NOTIFY_AFTER_DAYS } from '../jobs/periodic/redact-inactive-accounts/send-inactivity-notification';
import moment from 'moment';
import assert from 'assert';

void test('Pupil Account Deactivation', async () => {
    const { client, pupil, password } = await pupilOneWithPassword;

    await client.request(`mutation { meDeactivate(reason: "Keine Lust mehr auf Integration-Tests")}`);
    await client.request(`mutation { logout }`);

    await client.requestShallFail(`mutation { loginPassword(email: "${pupil.email}", password: "${password}")}`);

    // requestToken will fail silently, so we cannot test this
});

// ------------------------------------
// Notify inactive accounts
// ------------------------------------
void test('Pupil should be notified after inactivity', async () => {
    await adminClient.request(`mutation ResetRateLimits { _resetRateLimits }`);
    const notification = await createInactivityMockNotification;

    const pupil = await createNewPupil();
    await prisma.pupil.update({
        where: { id: pupil.pupil.pupil.id },
        data: {
            lastLogin: moment().subtract(NOTIFY_AFTER_DAYS, 'days').subtract(1, 'day').toDate(),
            active: true,
        },
    });

    await sendInactivityNotification();

    const notifications = await prisma.concrete_notification.findMany({ where: { notificationID: notification.id, userId: pupil.pupil.userID } });
    assert.strictEqual(notifications.length, 1);
});

void test('Pupil not should be notified as it is not inactive for long enough', async () => {
    await adminClient.request(`mutation ResetRateLimits { _resetRateLimits }`);
    const notification = await createInactivityMockNotification;

    const pupil = await createNewPupil();
    await prisma.pupil.update({
        where: { id: pupil.pupil.pupil.id },
        data: {
            lastLogin: moment().subtract(NOTIFY_AFTER_DAYS, 'days').add(1, 'day').toDate(),
            active: true,
        },
    });

    await sendInactivityNotification();

    const notifications = await prisma.concrete_notification.findMany({ where: { notificationID: notification.id, userId: pupil.pupil.userID } });
    assert.strictEqual(notifications.length, 0);
});

void test('Pupil not should be notified as it is deactivated already', async () => {
    await adminClient.request(`mutation ResetRateLimits { _resetRateLimits }`);
    const notification = await createInactivityMockNotification;

    const pupil = await createNewPupil();
    await prisma.pupil.update({
        where: { id: pupil.pupil.pupil.id },
        data: {
            lastLogin: moment().subtract(NOTIFY_AFTER_DAYS, 'days').subtract(NOTIFY_AFTER_DAYS, 'days').toDate(),
            active: false,
        },
    });

    await sendInactivityNotification();

    const notifications = await prisma.concrete_notification.findMany({ where: { notificationID: notification.id, userId: pupil.pupil.userID } });
    assert.strictEqual(notifications.length, 0);
});

void test('Pupil should not get notification twice', async () => {
    await adminClient.request(`mutation ResetRateLimits { _resetRateLimits }`);
    const notification = await createInactivityMockNotification;

    const pupil = await createNewPupil();
    await prisma.pupil.update({
        where: { id: pupil.pupil.pupil.id },
        data: {
            lastLogin: moment().subtract(NOTIFY_AFTER_DAYS, 'days').subtract(1, 'days').toDate(),
            active: true,
        },
    });

    await sendInactivityNotification();
    await sendInactivityNotification();

    const notifications = await prisma.concrete_notification.findMany({ where: { notificationID: notification.id, userId: pupil.pupil.userID } });
    assert.strictEqual(notifications.length, 1);
});

void test('Student should be notified after inactivity', async () => {
    await adminClient.request(`mutation ResetRateLimits { _resetRateLimits }`);
    const notification = await createInactivityMockNotification;

    const student = await createNewStudent();
    await prisma.student.update({
        where: { id: student.student.student.id },
        data: {
            lastLogin: moment().subtract(NOTIFY_AFTER_DAYS, 'days').subtract(1, 'day').toDate(),
            active: true,
        },
    });

    await sendInactivityNotification();

    const notifications = await prisma.concrete_notification.findMany({ where: { notificationID: notification.id, userId: student.student.userID } });
    assert.strictEqual(notifications.length, 1);
});

void test('Student not should be notified as it is not inactive for long enough', async () => {
    await adminClient.request(`mutation ResetRateLimits { _resetRateLimits }`);
    const notification = await createInactivityMockNotification;

    const student = await createNewStudent();
    await prisma.student.update({
        where: { id: student.student.student.id },
        data: {
            lastLogin: moment().subtract(NOTIFY_AFTER_DAYS, 'days').add(1, 'day').toDate(),
            active: true,
        },
    });

    await sendInactivityNotification();

    const notifications = await prisma.concrete_notification.findMany({ where: { notificationID: notification.id, userId: student.student.userID } });
    assert.strictEqual(notifications.length, 0);
});

void test('Student not should be notified as it is deactivated already', async () => {
    await adminClient.request(`mutation ResetRateLimits { _resetRateLimits }`);
    const notification = await createInactivityMockNotification;

    const student = await createNewStudent();
    await prisma.student.update({
        where: { id: student.student.student.id },
        data: {
            lastLogin: moment().subtract(NOTIFY_AFTER_DAYS, 'days').subtract(NOTIFY_AFTER_DAYS, 'days').toDate(),
            active: false,
        },
    });

    await sendInactivityNotification();

    const notifications = await prisma.concrete_notification.findMany({ where: { notificationID: notification.id, userId: student.student.userID } });
    assert.strictEqual(notifications.length, 0);
});

// ------------------------------------
// Deactivate inactive accounts
// ------------------------------------
void test('Pupil should be deactivated after inactivity', async () => {
    await adminClient.request(`mutation ResetRateLimits { _resetRateLimits }`);
    const pupil = await createNewPupil();
    await prisma.pupil.update({
        where: { id: pupil.pupil.pupil.id },
        data: {
            lastLogin: moment().subtract(DEACTIVATE_ACCOUNTS_INACTIVITY_DAYS, 'days').subtract(1, 'day').toDate(),
            active: true,
        },
    });

    await deactivateInactiveAccounts();
    const dbPupilNew = await prisma.pupil.findUnique({ where: { id: pupil.pupil.pupil.id } });

    assert.strictEqual(dbPupilNew?.active, false);
});

void test('Pupil not should be deactivated as it is not inactive for long enough', async () => {
    await adminClient.request(`mutation ResetRateLimits { _resetRateLimits }`);
    const pupil = await createNewPupil();
    await prisma.pupil.update({
        where: { id: pupil.pupil.pupil.id },
        data: {
            lastLogin: moment().subtract(DEACTIVATE_ACCOUNTS_INACTIVITY_DAYS, 'days').add(1, 'day').toDate(),
            active: true,
        },
    });

    await deactivateInactiveAccounts();
    const dbPupilNew = await prisma.pupil.findUnique({ where: { id: pupil.pupil.pupil.id } });

    assert.strictEqual(dbPupilNew?.active, true);
});

void test('Student should be deactivated after inactivity', async () => {
    await adminClient.request(`mutation ResetRateLimits { _resetRateLimits }`);
    const student = await createNewStudent();
    await prisma.student.update({
        where: { id: student.student.student.id },
        data: {
            lastLogin: moment().subtract(DEACTIVATE_ACCOUNTS_INACTIVITY_DAYS, 'days').subtract(1, 'day').toDate(),
            active: true,
        },
    });

    await deactivateInactiveAccounts();
    const dbStudentNew = await prisma.student.findUnique({ where: { id: student.student.student.id } });

    assert.strictEqual(dbStudentNew?.active, false);
});

void test('Student not should be deactivated as it is not inactive for long enough', async () => {
    await adminClient.request(`mutation ResetRateLimits { _resetRateLimits }`);
    const student = await createNewStudent();
    await prisma.student.update({
        where: { id: student.student.student.id },
        data: {
            lastLogin: moment().subtract(DEACTIVATE_ACCOUNTS_INACTIVITY_DAYS, 'days').add(1, 'day').toDate(),
            active: true,
        },
    });

    await deactivateInactiveAccounts();
    const dbStudentNew = await prisma.student.findUnique({ where: { id: student.student.student.id } });

    assert.strictEqual(dbStudentNew?.active, true);
});
