import assert from 'assert';
import { randomBytes } from 'crypto';
import { adminClient, test } from './base';
import { pupilOne, studentOne } from './user';

/* eslint-disable  */

void test('Admin set Email of Pupil', async () => {
    const { pupil, client } = await pupilOne;

    const otherEmail = `TEST+${randomBytes(5).toString('base64')}@lern-fair.de`;

    await adminClient.request(`mutation PupilChangeEmail { pupilUpdate(pupilId: ${pupil.pupil.id} data: { email: "${otherEmail}" })}`);

    const {
        me: {
            pupil: { email: updatedEmail },
        },
    } = await client.request(`query { me { pupil { email }}}`);
    // When admins set the email of a student the same validation and normalization happens as when the user registers
    // This is mandatory as we perform case sensitive lookup on the email column to find accounts
    assert.strictEqual(updatedEmail, otherEmail.toLowerCase());

    await adminClient.request(`mutation PupilRevertEmailChange { pupilUpdate(pupilId: ${pupil.pupil.id} data: { email: "${pupil.email}" })}`);
});

void test('Admin set Email of Student', async () => {
    const { student, client } = await studentOne;

    const otherEmail = `TEST+${randomBytes(5).toString('base64')}@lern-fair.de`;

    await adminClient.request(`mutation StudentChangeEmail { studentUpdate(studentId: ${student.student.id} data: { email: "${otherEmail}" })}`);

    const {
        me: {
            student: { email: updatedEmail },
        },
    } = await client.request(`query { me { student { email }}}`);
    assert.strictEqual(updatedEmail, otherEmail.toLowerCase());

    await adminClient.request(`mutation StudentRevertEmailChange { studentUpdate(studentId: ${student.student.id} data: { email: "${student.email}" })}`);
});

void test('Admin Pupil to Plus', async () => {
    const { pupil } = await pupilOne;

    await adminClient.request(`
      mutation PupilToPlus {
        pupilUpdate(pupilId: ${pupil.pupil.id} data: { registrationSource: plus })
      }
    `);
});

void test('Admin Search Users', async () => {
    const { pupil } = await pupilOne;
    const { student } = await studentOne;
    // As in other places, the search ignores case differences in emails:
    const pupilEmail = pupil.email.toLowerCase();
    const studentEmail = student.email.toLowerCase();

    const { usersSearch: searchPupilInStudents } = await adminClient.request(`
        query SearchPupilInStudents {
            usersSearch(query: "${pupil.firstname} ${pupil.lastname}" only: "student") {
                email
            }
        }
    `);
    assert.strictEqual(searchPupilInStudents.length, 0);

    const { usersSearch: searchPupilByFirstname } = await adminClient.request(`
        query SearchPupilByFirstname {
            usersSearch(query: "${pupil.firstname}" only: "pupil") {
                email
            }
        }
    `);
    assert.strictEqual(searchPupilByFirstname.length, 1);
    assert.strictEqual(searchPupilByFirstname[0].email, pupilEmail);

    const { usersSearch: searchPupilByLastname } = await adminClient.request(`
        query SearchPupilByLastname {
            usersSearch(query: "${pupil.lastname}" only: "pupil") {
                email
            }
        }
    `);
    assert.strictEqual(searchPupilByLastname.length, 1);
    assert.strictEqual(searchPupilByLastname[0].email, pupilEmail);

    const { usersSearch: searchPupilByFullName } = await adminClient.request(`
        query SearchPupilByFullName {
            usersSearch(query: "${pupil.firstname} ${pupil.lastname}" only: "pupil") {
                email
            }
        }
    `);
    assert.strictEqual(searchPupilByFullName.length, 1);
    assert.strictEqual(searchPupilByFullName[0].email, pupilEmail);

    const { usersSearch: searchPupilByEmail } = await adminClient.request(`
        query SearchPupilByEmail {
            usersSearch(query: "${pupil.email}" only: "pupil") {
                email
            }
        }
    `);
    assert.strictEqual(searchPupilByEmail.length, 1);
    assert.strictEqual(searchPupilByEmail[0].email, pupilEmail);

    const { usersSearch: searchUsersByPartialEmail } = await adminClient.request(`
        query SearchUsersByPartialEmail {
            usersSearch(query: " @lern-fair.de", take: 1000) {
                email
            }
        }
    `);

    assert(searchUsersByPartialEmail.some((it) => it.email === pupilEmail));
    assert(searchUsersByPartialEmail.some((it) => it.email === studentEmail));

    const { usersSearch: searchStudentsByPartialEmail } = await adminClient.request(`
        query SearchStudentsByPartialEmail {
            usersSearch(query: "@lern-fair.de " only: "student", take: 1000) {
                email
            }
        }
    `);

    assert(!searchStudentsByPartialEmail.some((it) => it.email === pupilEmail));
    assert(searchStudentsByPartialEmail.some((it) => it.email === studentEmail));

    const { usersSearch: searchUsersByPartialName } = await adminClient.request(`
        query SearchUsersByPartialName {
            usersSearch(query: "firstname lastname", take: 1000) {
                email
            }
        }
    `);

    assert(searchUsersByPartialName.some((it) => it.email === pupilEmail));
    assert(searchUsersByPartialName.some((it) => it.email === studentEmail));
});

void test('Admin Manage Notifications', async () => {
    const { client: pupilClient, pupil } = await pupilOne;

    const { notificationCreate: { id } } = await adminClient.request(`mutation CreateNotification {
        notificationCreate(notification: { 
            description: "MOCK"
            active: false
            recipient: 0
            onActions: { set: []}
            cancelledOnAction: { set: []}
            sample_context: { test: "test" }
        }) { id }
    }`);


    await adminClient.requestShallFail(`mutation SetMessageWithInvalidTemplate {
        notificationSetMessageTranslation(
            notificationId: ${id}
            language: "de"
            headline: "{{user.firstname}}"
            body: "{{user.fullName"
            navigateTo: "/{{test}}"
            modalText: ""
        )
    }`);

    await adminClient.request(`mutation SetMessage {
        notificationSetMessageTranslation(
            notificationId: ${id}
            language: "de"
            headline: "{{user.firstname}}"
            body: "{{user.fullName}}"
            navigateTo: "/{{test}}"
            modalText: ""
        )
    }`);

    await adminClient.request(`mutation Activate { notificationActivate(notificationId: ${id}, active: true)}`);

    
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
        skipDraft: true
        context: { test: "test2", uniqueId: "test_${Date.now()}" }
        userIds: ["${pupil.userID}"]
        notificationId: ${id}
      )
    }`);

    const { me: { concreteNotifications: scheduled }} = await pupilClient.request(`query NotificationScheduled { 
        me { 
          concreteNotifications(take:100) { 
            notificationID
            state
            sentAt
            message { 
              headline
              body
              navigateTo
              modalText
            }
        }
      }
    }`);

    assert.ok(!scheduled.find(it => it.notificationID === id), "Concrete notification already visible?");

    await adminClient.request(`mutation { _executeJob(job: "Notification") }`);

    const { me: { concreteNotifications: sent }} = await pupilClient.request(`query NotificationSent { 
        me { 
          concreteNotifications(take:100) { 
            notificationID
            state
            sentAt
            message { 
              headline
              body
              navigateTo
              modalText
            }
        }
      }
    }`);

    const notification = sent.find(it => it.notificationID === id);
    assert.strictEqual(notification.state, 2);
    assert.strictEqual(notification.message.headline, pupil.firstname);
    assert.strictEqual(notification.message.body, pupil.firstname + " " + pupil.lastname);
    assert.strictEqual(notification.message.navigateTo, "/test2");

    // Ensure the cache is properly invalidated:
    await adminClient.request(`mutation SetMessage {
        notificationSetMessageTranslation(
            notificationId: ${id}
            language: "de"
            headline: "{{user.firstname}}"
            body: "TEST"
            navigateTo: ""
            modalText: ""
        )
    }`);

    const { me: { concreteNotifications: sent2 }} = await pupilClient.request(`query NotificationSent2 { 
        me { 
          concreteNotifications(take:100) { 
            notificationID
            state
            sentAt
            message { 
              headline
              body
              navigateTo
              modalText
            }
        }
      }
    }`);

    const notification2 = sent2.find(it => it.notificationID === id);
    assert.strictEqual(notification2.state, 2);
    assert.strictEqual(notification2.message.headline, pupil.firstname);
    assert.strictEqual(notification2.message.body, "TEST");
    assert.strictEqual(notification2.message.navigateTo, null);


}) 
