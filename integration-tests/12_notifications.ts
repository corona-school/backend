import assert from 'assert';
import { prisma } from '../common/prisma';
import { pupilOne, pupilTwo } from './01_user';
import { test } from './base';
import { adminClient } from './base/clients';
import { addMockNotification, createMockNotification } from './base/notifications';
import { expectFetch } from './base/mock';

// ------------------ Scheduling, Cancellation --------------------------------------

void test('Action Notification Timing (Dry Run)', async () => {
    const { pupil } = await pupilOne;

    const instant = await createMockNotification('TEST', 'Instant');
    const before = await createMockNotification('TEST', 'Before', -1);
    const beforeInterval = await createMockNotification('TEST', 'BeforeInterval', -1, 1);
    const after = await createMockNotification('TEST', 'After', 1);
    const afterInterval = await createMockNotification('TEST', 'AfterInterval', 1, 1);

    const isSent = (result, notification) => assert.ok(result.directSends.some((it) => it.id === notification.id));
    const isReminder = (result, notification) => assert.ok(result.reminders.some((it) => it.notification.id === notification.id));
    const isIgnored = (result, notification) =>
        assert.ok(!result.directSends.some((it) => it.id === notification.id) && !result.reminders.some((it) => it.notification.id === notification.id));

    // -------- NOW -----------------

    const { _actionTakenAt: actionNow } = await adminClient.request(`mutation TriggerAction {
        _actionTakenAt(action: "TEST", at: "${new Date().toISOString()}" context: { a: "a" } dryRun: true, userID: "${pupil.userID}")
    }`);

    isIgnored(actionNow, before);
    isSent(actionNow, beforeInterval);
    isSent(actionNow, instant);
    isReminder(actionNow, after);
    isReminder(actionNow, afterInterval);

    // -------- 1 HOUR BEFORE ---
    const before1Hour = new Date();
    before1Hour.setHours(before1Hour.getHours() - 1);

    const { _actionTakenAt: actionBefore1 } = await adminClient.request(`mutation TriggerAction1HourBefore {
        _actionTakenAt(action: "TEST", at: "${before1Hour.toISOString()}" context: { a: "a" } dryRun: true, userID: "${pupil.userID}")
    }`);

    isIgnored(actionBefore1, before);
    isIgnored(actionBefore1, instant);
    isSent(actionBefore1, beforeInterval);
    isSent(actionBefore1, after);
    isSent(actionBefore1, afterInterval);

    // -------- 2 HOURS BEFORE ---
    const before2Hours = new Date();
    before2Hours.setHours(before2Hours.getHours() - 2);

    const { _actionTakenAt: actionBefore2 } = await adminClient.request(`mutation TriggerAction2HoursBefore {
        _actionTakenAt(action: "TEST", at: "${before2Hours.toISOString()}" context: { a: "a" } dryRun: true, userID: "${pupil.userID}")
    }`);

    isIgnored(actionBefore2, before);
    isIgnored(actionBefore2, instant);
    isIgnored(actionBefore2, after);
    isSent(actionBefore2, beforeInterval);
    isSent(actionBefore2, afterInterval);

    // -------- 1 HOUR AFTER ---
    const after1Hour = new Date();
    after1Hour.setHours(after1Hour.getHours() + 1);

    const { _actionTakenAt: actionAfter1 } = await adminClient.request(`mutation TriggerAction1HourAfter {
        _actionTakenAt(action: "TEST", at: "${after1Hour.toISOString()}" context: { a: "a" } dryRun: true, userID: "${pupil.userID}")
    }`);

    isSent(actionAfter1, beforeInterval);
    isSent(actionAfter1, before);
    isReminder(actionAfter1, instant);
    isReminder(actionAfter1, after);
    isReminder(actionAfter1, afterInterval);

    // -------- 2 HOURS AFTER ---
    const after2Hours = new Date();
    after2Hours.setHours(after2Hours.getHours() + 2);

    const { _actionTakenAt: actionAfter2 } = await adminClient.request(`mutation TriggerAction2HoursAfter {
        _actionTakenAt(action: "TEST", at: "${after2Hours.toISOString()}" context: { a: "a" } dryRun: true, userID: "${pupil.userID}")
    }`);

    isReminder(actionAfter2, before);
    isReminder(actionAfter2, beforeInterval);
    isReminder(actionAfter2, instant);
    isReminder(actionAfter2, after);
    isReminder(actionAfter2, afterInterval);

    const sentNotifications = await prisma.concrete_notification.count({
        where: {
            notificationID: { in: [before.id, beforeInterval.id, instant.id, after.id, afterInterval.id] },
        },
    });

    assert.strictEqual(sentNotifications, 0, 'Expected no notification to be sent in dryRun');
});

void test('Action Notification Timing', async () => {
    const { pupil } = await pupilOne;

    const instant = await createMockNotification('TEST', 'Instant');
    const before = await createMockNotification('TEST', 'Before', -1);
    const beforeInterval = await createMockNotification('TEST', 'BeforeInterval', -1, 1);
    const after = await createMockNotification('TEST', 'After', 1);
    const afterInterval = await createMockNotification('TEST', 'AfterInterval', 1, 1);

    const isSent = (result, notification) => assert.ok(result.directSends.some((it) => it.id === notification.id));
    const isReminder = (result, notification) => assert.ok(result.reminders.some((it) => it.notification.id === notification.id));
    const isIgnored = (result, notification) =>
        assert.ok(!result.directSends.some((it) => it.id === notification.id) && !result.reminders.some((it) => it.notification.id === notification.id));

    // -------- NOW -----------------

    const { _actionTakenAt: actionNow } = await adminClient.request(`mutation TriggerAction {
        _actionTakenAt(action: "TEST", at: "${new Date().toISOString()}" context: { a: "a" } dryRun: false, userID: "${pupil.userID}")
    }`);

    isIgnored(actionNow, before);
    isSent(actionNow, beforeInterval);
    isSent(actionNow, instant);
    isReminder(actionNow, after);
    isReminder(actionNow, afterInterval);

    // -------- 1 HOUR BEFORE ---
    const before1Hour = new Date();
    before1Hour.setHours(before1Hour.getHours() - 1);

    const { _actionTakenAt: actionBefore1 } = await adminClient.request(`mutation TriggerAction1HourBefore {
        _actionTakenAt(action: "TEST", at: "${before1Hour.toISOString()}" context: { a: "a" } dryRun: false, userID: "${pupil.userID}")
    }`);

    isIgnored(actionBefore1, before);
    isIgnored(actionBefore1, instant);
    isSent(actionBefore1, beforeInterval);
    isSent(actionBefore1, after);
    isSent(actionBefore1, afterInterval);

    // -------- 2 HOURS BEFORE ---
    const before2Hours = new Date();
    before2Hours.setHours(before2Hours.getHours() - 2);

    const { _actionTakenAt: actionBefore2 } = await adminClient.request(`mutation TriggerAction2HoursBefore {
        _actionTakenAt(action: "TEST", at: "${before2Hours.toISOString()}" context: { a: "a" } dryRun: false, userID: "${pupil.userID}")
    }`);

    isIgnored(actionBefore2, before);
    isIgnored(actionBefore2, instant);
    isIgnored(actionBefore2, after);
    isSent(actionBefore2, beforeInterval);
    isSent(actionBefore2, afterInterval);

    // -------- 1 HOUR AFTER ---
    const after1Hour = new Date();
    after1Hour.setHours(after1Hour.getHours() + 1);

    const { _actionTakenAt: actionAfter1 } = await adminClient.request(`mutation TriggerAction1HourAfter {
        _actionTakenAt(action: "TEST", at: "${after1Hour.toISOString()}" context: { a: "a" } dryRun: false, userID: "${pupil.userID}")
    }`);

    isSent(actionAfter1, beforeInterval);
    isSent(actionAfter1, before);
    isReminder(actionAfter1, instant);
    isReminder(actionAfter1, after);
    isReminder(actionAfter1, afterInterval);

    // -------- 2 HOURS AFTER ---
    const after2Hours = new Date();
    after2Hours.setHours(after2Hours.getHours() + 2);

    const { _actionTakenAt: actionAfter2 } = await adminClient.request(`mutation TriggerAction2HoursAfter {
        _actionTakenAt(action: "TEST", at: "${after2Hours.toISOString()}" context: { a: "a" } dryRun: false, userID: "${pupil.userID}")
    }`);

    isReminder(actionAfter2, before);
    isReminder(actionAfter2, beforeInterval);
    isReminder(actionAfter2, instant);
    isReminder(actionAfter2, after);
    isReminder(actionAfter2, afterInterval);

    const delayedBeforeNotifications = await prisma.concrete_notification.count({
        where: {
            notificationID: before.id,
            state: 0 /* DELAYED */,
        },
    });

    const sentBeforeNotifications = await prisma.concrete_notification.count({
        where: {
            notificationID: before.id,
            state: 2 /* SENT */,
        },
    });

    assert.strictEqual(delayedBeforeNotifications, 1, 'Expected before notification to be in delayed state once');
    assert.strictEqual(sentBeforeNotifications, 1, 'Expected before notification to be in sent state once');

    const delayedBeforeIntervalNotifications = await prisma.concrete_notification.count({
        where: {
            notificationID: beforeInterval.id,
            state: 0 /* DELAYED */,
        },
    });

    const sentBeforeIntervalNotifications = await prisma.concrete_notification.count({
        where: {
            notificationID: beforeInterval.id,
            state: 2 /* SENT */,
        },
    });

    assert.strictEqual(delayedBeforeIntervalNotifications, 1, 'Expected beforeInterval notification to be in delayed state once');
    assert.strictEqual(sentBeforeIntervalNotifications, 4, 'Expected beforeInterval notification to be in sent state four times');

    const delayedInstantNotifications = await prisma.concrete_notification.count({
        where: {
            notificationID: instant.id,
            state: 0 /* DELAYED */,
        },
    });

    const sentInstantNotifications = await prisma.concrete_notification.count({
        where: {
            notificationID: instant.id,
            state: 2 /* SENT */,
        },
    });

    assert.strictEqual(delayedInstantNotifications, 2, 'Expected instant notification to be in delayed state twice');
    assert.strictEqual(sentInstantNotifications, 1, 'Expected instant notification to be in sent state once');

    const delayedAfterNotifications = await prisma.concrete_notification.count({
        where: {
            notificationID: after.id,
            state: 0 /* DELAYED */,
        },
    });

    const sentAfterNotifications = await prisma.concrete_notification.count({
        where: {
            notificationID: after.id,
            state: 2 /* SENT */,
        },
    });

    assert.strictEqual(delayedAfterNotifications, 3, 'Expected after notification to be in delayed state three times');
    assert.strictEqual(sentAfterNotifications, 1, 'Expected after notification to be in sent state once');

    const delayedAfterIntervalNotifications = await prisma.concrete_notification.count({
        where: {
            notificationID: afterInterval.id,
            state: 0 /* DELAYED */,
        },
    });

    const sentAfterIntervalNotifications = await prisma.concrete_notification.count({
        where: {
            notificationID: afterInterval.id,
            state: 2 /* SENT */,
        },
    });

    assert.strictEqual(delayedAfterIntervalNotifications, 3, 'Expected afterInterval notification to be in delayed three times');
    assert.strictEqual(sentAfterIntervalNotifications, 2, 'Expected afterInterval notification to be in sent state two times');
});

void test('Reminder Cancellation', async () => {
    const { pupil } = await pupilOne;

    const notification = await createMockNotification('TEST', 'SelfCancellation', 1, undefined, 'TEST');

    const { _actionTakenAt: first } = await adminClient.request(`mutation TriggerAction {
        _actionTakenAt(action: "TEST", at: "${new Date().toISOString()}" context: { a: "a" } dryRun: false, userID: "${pupil.userID}")
    }`);

    const delayedNotifications = await prisma.concrete_notification.count({
        where: { notificationID: notification.id, state: 0 /* DELAYED */ },
    });

    assert.strictEqual(delayedNotifications, 1, 'Expected notification to be delayed');

    const { _actionTakenAt: second } = await adminClient.request(`mutation TriggerAction {
        _actionTakenAt(action: "TEST", at: "${new Date().toISOString()}" context: { a: "a" } dryRun: false, userID: "${pupil.userID}")
    }`);

    const delayedNotifications2 = await prisma.concrete_notification.count({
        where: { notificationID: notification.id, state: 0 /* DELAYED */ },
    });

    const cancelledNotifications = await prisma.concrete_notification.count({
        where: { notificationID: notification.id, state: 4 /* ACTION_TAKEN */ },
    });

    assert.strictEqual(delayedNotifications2, 1, 'Expected notification to be delayed');
    assert.strictEqual(cancelledNotifications, 1, 'Expected notification to be cancelled');
});

void test('Reminder Cancellation with UniqueID', async () => {
    const { pupil } = await pupilOne;

    const notification = await createMockNotification('TEST2', 'SelfCancellation', 1, undefined, 'TEST2');

    const { _actionTakenAt: first } = await adminClient.request(`mutation TriggerAction {
        _actionTakenAt(action: "TEST2", at: "${new Date().toISOString()}" context: { a: "a", uniqueId: "1" } dryRun: false, userID: "${pupil.userID}")
    }`);

    const { _actionTakenAt: second } = await adminClient.request(`mutation TriggerAction {
        _actionTakenAt(action: "TEST2", at: "${new Date().toISOString()}" context: { a: "a", uniqueId: "2" } dryRun: false, userID: "${pupil.userID}")
    }`);

    const delayedNotifications = await prisma.concrete_notification.count({
        where: { notificationID: notification.id, state: 0 /* DELAYED */ },
    });

    assert.strictEqual(delayedNotifications, 2, 'Expected notifications to be delayed');

    const { _actionTakenAt: third } = await adminClient.request(`mutation TriggerAction {
        _actionTakenAt(action: "TEST2", at: "${new Date().toISOString()}" context: { a: "a", uniqueId: "1" } dryRun: false, userID: "${pupil.userID}")
    }`);

    console.log(await prisma.concrete_notification.findMany({ where: { notificationID: notification.id } }));

    const delayedNotifications2 = await prisma.concrete_notification.count({
        where: { notificationID: notification.id, state: 0 /* DELAYED */ },
    });

    const cancelledNotifications = await prisma.concrete_notification.count({
        where: { notificationID: notification.id, state: 4 /* ACTION_TAKEN */ },
    });

    assert.strictEqual(delayedNotifications2, 2, 'Expected notifications to be delayed');
    assert.strictEqual(cancelledNotifications, 1, 'Expected notification to be cancelled');
});

void test('Duplicate Prevention', async () => {
    const { pupil } = await pupilOne;

    const notification = await createMockNotification('TEST', 'DuplicatePrevention');

    // Usually Duplicates just trigger the same notification multiple times:

    await adminClient.request(`mutation TriggerAction {
        _actionTakenAt(action: "TEST", at: "${new Date().toISOString()}" context: { a: "a", uniqueId: "1" } dryRun: false, userID: "${pupil.userID}")
    }`);

    await adminClient.request(`mutation TriggerAction {
        _actionTakenAt(action: "TEST", at: "${new Date().toISOString()}" context: { a: "a", uniqueId: "1" } dryRun: false, userID: "${pupil.userID}")
    }`);

    const sentWithDuplicates = await prisma.concrete_notification.count({
        where: {
            notificationID: notification.id,
            state: 2 /* SENT */,
        },
    });

    assert.strictEqual(sentWithDuplicates, 2, 'Expected Notification to be sent out twice with duplicate prevention');

    // With Duplicate Prevention we still send out if the uniqueId is different:

    await adminClient.request(`mutation TriggerAction {
        _actionTakenAt(action: "TEST", at: "${new Date().toISOString()}" context: { a: "a", uniqueId: "2" } dryRun: false, noDuplicates: true, userID: "${
        pupil.userID
    }")
    }`);

    const sentWithDifferentUniqueId = await prisma.concrete_notification.count({
        where: {
            notificationID: notification.id,
            state: 2 /* SENT */,
        },
    });

    assert.strictEqual(sentWithDifferentUniqueId, 3, 'Expected Notification to be sent out three times');

    // With Duplicate Prevention but different uniqueId sending out the notification is prevented:

    await adminClient.request(`mutation TriggerAction {
        _actionTakenAt(action: "TEST", at: "${new Date().toISOString()}" context: { a: "a", uniqueId: "1" } dryRun: false, noDuplicates: true, userID: "${
        pupil.userID
    }")
    }`);

    const sentWithSameUniqueId = await prisma.concrete_notification.count({
        where: {
            notificationID: notification.id,
            state: 2 /* SENT */,
        },
    });

    assert.strictEqual(sentWithSameUniqueId, 3, 'Expected that no additional notification is sent out');
});

// ---------------------------- Mailjet Channel ------------------------------

void test('Notification sent via Mailjet', async () => {
    const { pupil, client: pupilClient } = await pupilOne;

    const {
        notificationCreate: { id },
    } = await adminClient.request(`mutation CreateNotification {
        notificationCreate(notification: {
            description: "MOCK Campaign1"
            active: false
            recipient: 0
            mailjetTemplateId: 42
            onActions: { set: ["TEST"]}
            cancelledOnAction: { set: []}
            type: chat
        }) { id }
    }`);

    await addMockNotification(id);

    expectFetch({
        url: 'https://api.mailjet.com/v3.1/send',
        method: 'POST',
        body: `{"SandboxMode":true,"Messages":[{"From":{"Email":"support@lern-fair.de","Name":"Lern-Fair Team"},"To":[{"Email":"${pupil.email.toLowerCase()}"}],"TemplateID":42,"TemplateLanguage":true,"Variables":{"authToken":"*","a":"a","uniqueId":"2","user":{"userID":"${
            pupil.userID
        }","firstname":"${pupil.firstname}","lastname":"${pupil.lastname}","email":"${pupil.email.toLowerCase()}","active":true,"lastLogin":"*","pupilId":${
            pupil.pupil.id
        },"fullName":"${pupil.firstname} ${
            pupil.lastname
        }"},"USER_APP_DOMAIN":"*","attachmentGroup":""},"CustomID":"*","TemplateErrorReporting":{"Email":"backend@lern-fair.de"},"CustomCampaign":"Backend Notification ${id}"}]}`,
        responseStatus: 200,
        response: '{ "Messages": [{ "Status": "success" }]}',
    });

    await adminClient.request(`mutation TriggerAction {
        _actionTakenAt(action: "TEST", at: "${new Date().toISOString()}" context: { a: "a", uniqueId: "2" } dryRun: false, noDuplicates: true, userID: "${
        pupil.userID
    }")
    }`);

    const sent = await prisma.concrete_notification.count({
        where: {
            notificationID: id,
            state: 2 /* SENT */,
        },
    });

    assert.strictEqual(sent, 1, 'Expected Notification to be sent');

    await pupilClient.request(`mutation PupilDisabledNotifications {
        meUpdate(update: { notificationPreferences: { chat: { email: false }}})
    }`);

    await adminClient.request(`mutation TriggerAction2 {
        _actionTakenAt(action: "TEST", at: "${new Date().toISOString()}" context: { a: "a", uniqueId: "3" } dryRun: false, noDuplicates: true, userID: "${
        pupil.userID
    }")
    }`);

    // As the mail preference was disabled, the notification was not sent via mailjet

    const sent2 = await prisma.concrete_notification.count({
        where: {
            notificationID: id,
            state: 2 /* SENT */,
        },
    });

    assert.strictEqual(sent2, 2, 'Expected Notification to be sent');
});

void test('Notification sent via Mailjet to overrideEmail', async () => {
    const { pupil, client: pupilClient } = await pupilOne;

    const {
        notificationCreate: { id },
    } = await adminClient.request(`mutation CreateNotification {
        notificationCreate(notification: {
            description: "MOCK Campaign1"
            active: false
            recipient: 0
            mailjetTemplateId: 42
            onActions: { set: ["TEST"]}
            cancelledOnAction: { set: []}
            type: legacy
        }) { id }
    }`);

    await addMockNotification(id);

    expectFetch({
        url: 'https://api.mailjet.com/v3.1/send',
        method: 'POST',
        body: `{"SandboxMode":true,"Messages":[{"From":{"Email":"support@lern-fair.de","Name":"Lern-Fair Team"},"To":[{"Email":"override@example.org"}],"TemplateID":42,"TemplateLanguage":true,"Variables":{"authToken":"*","a":"a","uniqueId":"2","overrideReceiverEmail":"override@example.org","user":{"userID":"${
            pupil.userID
        }","firstname":"${pupil.firstname}","lastname":"${pupil.lastname}","email":"${pupil.email.toLowerCase()}","active":true,"lastLogin":"*","pupilId":${
            pupil.pupil.id
        },"fullName":"${pupil.firstname} ${
            pupil.lastname
        }"},"USER_APP_DOMAIN":"*","attachmentGroup":""},"CustomID":"*","TemplateErrorReporting":{"Email":"backend@lern-fair.de"},"CustomCampaign":"Backend Notification ${id}"}]}`,
        responseStatus: 200,
        response: '{ "Messages": [{ "Status": "success" }]}',
    });

    await adminClient.request(`mutation TriggerAction {
        _actionTakenAt(action: "TEST", at: "${new Date().toISOString()}" context: { a: "a", uniqueId: "2", overrideReceiverEmail: "override@example.org" } dryRun: false, noDuplicates: true, userID: "${
        pupil.userID
    }")
    }`);
});

// ---------------------------- Campaigns ------------------------------------

void test('Create Campaign', async () => {
    const { pupil } = await pupilOne;

    const {
        notificationCreate: { id },
    } = await adminClient.request(`mutation CreateCampaign {
        notificationCreate(notification: {
            description: "MOCK Campaign1"
            active: false
            recipient: 0
            onActions: { set: []}
            cancelledOnAction: { set: []}
            sample_context: { test: "test" }
        }) { id }
    }`);

    await addMockNotification(id);

    const campaignId = `Campaign ${new Date().toISOString()}`;

    await adminClient.requestShallFail(`mutation SendOutWithMissingContext {
        concreteNotificationBulkCreate(
        startAt: "${new Date(0).toISOString()}"
        skipDraft: true
        context: { }
        userIds: ["${pupil.userID}"]
        notificationId: ${id}
      )
    }`);

    await adminClient.request(`mutation SendOut {
        concreteNotificationBulkCreate(
        startAt: "${new Date(0).toISOString()}"
        skipDraft: false
        context: { test: "something", uniqueId: "${campaignId}", campaign: "${campaignId}" }
        userIds: ["${pupil.userID}"]
        notificationId: ${id}
      )
    }`);

    // Ensure this is not yet picked up by the worker:
    await adminClient.request(`mutation { _executeJob(job: "checkReminders") }`);

    const drafted = await prisma.concrete_notification.count({
        where: {
            notificationID: id,
            state: 6 /* DRAFTED */,
        },
    });

    assert.strictEqual(drafted, 1, 'Expected Campaign Notification to be drafted');

    await adminClient.request(`mutation PublishCampaign {
        concreteNotificationPublishDraft(notificationId: ${id} contextID: "${campaignId}")
    }`);

    const delayed = await prisma.concrete_notification.count({
        where: {
            notificationID: id,
            state: 0 /* DELAYED */,
        },
    });

    assert.strictEqual(delayed, 1, 'Expected Campaign Notification to be delayed');

    await adminClient.request(`mutation { _executeJob(job: "checkReminders") }`);

    const sent = await prisma.concrete_notification.count({
        where: {
            notificationID: id,
            state: 2 /* SENT */,
        },
    });

    assert.strictEqual(sent, 1, 'Expected Campaign Notification to be sent');
});

void test('Create Campaign with Overrides', async () => {
    const { pupil } = await pupilOne;
    const { pupil: pupil2, client: pupilTwoClient } = await pupilTwo;

    const {
        notificationCreate: { id },
    } = await adminClient.request(`mutation CreateCampaign {
        notificationCreate(notification: {
            description: "MOCK Campaign1"
            active: false
            recipient: 0
            onActions: { set: []}
            cancelledOnAction: { set: []}
            sample_context: { overrideMailjetTemplateID: "1", overrideType: "campaign" }
        }) { id }
    }`);

    await addMockNotification(id);

    const campaignId = `Campaign ${new Date().toISOString()}`;

    await adminClient.request(`mutation SendOut {
        concreteNotificationBulkCreate(
        startAt: "${new Date(0).toISOString()}"
        skipDraft: true
        context: { overrideMailjetTemplateID: "42", overrideType: "suggestion", uniqueId: "${campaignId}", campaign: "${campaignId}" }
        userIds: ["${pupil.userID}", "${pupil2.userID}"]
        notificationId: ${id}
      )
    }`);

    await pupilTwoClient.request(`mutation PupilDisabledNotifications {
        meUpdate(update: { notificationPreferences: { suggestion: { email: false }}})
    }`);

    // Ensures that the notification is sent although it has no mailjetId (but it is overriden)
    // Also ensures that the overriden mailjet template is used, and the CustomCampaignId is set
    // Additionally pupil2 is skipped as he turned off mail notifications for the overriden type "suggestion"
    expectFetch({
        url: 'https://api.mailjet.com/v3.1/send',
        method: 'POST',
        body: `{"SandboxMode":true,"Messages":[{"From":{"Email":"support@lern-fair.de","Name":"Lern-Fair Team"},"To":[{"Email":"${pupil.email.toLowerCase()}"}],"TemplateID":42,"TemplateLanguage":true,"Variables":{"authToken":"*","overrideMailjetTemplateID":"42","overrideType":"suggestion","uniqueId":"${campaignId}","campaign":"${campaignId}","user":{"userID":"${
            pupil.userID
        }","firstname":"${pupil.firstname}","lastname":"${
            pupil.lastname
        }","email":"${pupil.email.toLowerCase()}","active":true,"lastLogin":"*","pupilId":*,"fullName":"${pupil.firstname} ${
            pupil.lastname
        }"},"USER_APP_DOMAIN":"*","attachmentGroup":""},"CustomID":"*","TemplateErrorReporting":{"Email":"backend@lern-fair.de"},"CustomCampaign":"${campaignId}"}]}`,
        responseStatus: 200,
        response: '{ "Messages": [{ "Status": "success" }]}',
    });

    await adminClient.request(`mutation { _executeJob(job: "checkReminders") }`);

    const sent = await prisma.concrete_notification.count({
        where: {
            notificationID: id,
            state: 2 /* SENT */,
        },
    });

    assert.strictEqual(sent, 2, 'Expected Campaign Notification to be sent');
});
