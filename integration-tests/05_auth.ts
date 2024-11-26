import { test } from './base';
import { defaultClient, createUserClient, adminClient } from './base/clients';
import { pupilOne } from './01_user';
import assert from 'assert';
import { assertUserReceivedNotification, createMockNotification } from './base/notifications';
import { randomBytes } from 'crypto';

void test('Token Login', async () => {
    const { client } = await pupilOne;

    // Create a new Token

    const { tokenCreate: token } = await client.request(`mutation CreateToken { tokenCreate }`);

    const secretsUnused = await client.request(`query RetrieveSecrets { me { secrets { type createdAt lastUsed }}}`);
    assert.equal(secretsUnused.me.secrets.filter((it) => it.type === 'TOKEN')[0].lastUsed, null);

    // Token can be used to log in

    await client.request(`mutation Logout { logout }`);

    await client.requestShallFail(`query RetrieveSecretsFails { me { secrets { type createdAt lastUsed }}}`);

    await client.request(`mutation LoginWithToken { loginToken(token: "${token}")}`);

    const secretsUsed = await client.request(`query RetrieveSecrets { me { secrets { id type createdAt lastUsed }}}`);
    assert.notEqual(secretsUsed.me.secrets.filter((it) => it.type === 'TOKEN')[0].lastUsed, null);

    // Token can be revoked

    await client.request(
        `mutation RevokeToken { tokenRevoke(id: ${secretsUsed.me.secrets.filter((it) => it.type === 'TOKEN')[0].id}, invalidateSessions: false)}`
    );

    const { tokenCreate: token2 } = await client.request(`mutation CreateTokenTwo { tokenCreate }`);

    await client.request(`mutation Logout { logout }`);

    await client.requestShallFail(`query RetrieveSecretsFails { me { secrets { type createdAt lastUsed }}}`);

    await client.requestShallFail(`mutation LoginWithRevokedFails { loginToken(token: "${token}")}`);

    await client.request(`mutation LoginWithTwo { loginToken(token: "${token2}")}`);

    const secretsSwapped = await client.request(`query RetrieveSecrets { me { secrets { type createdAt lastUsed }}}`);
    assert.equal(secretsSwapped.me.secrets.length, secretsUsed.me.secrets.length);
});

export const pupilOneWithPassword = test('Password Login', async () => {
    const { client, pupil } = await pupilOne;
    const password = 'test123';

    // Before the user has a password, email login is proposed:
    const emailLoginProposed = await defaultClient.request(`mutation EmailLoginProposed { userDetermineLoginOptions(email: "${pupil.email}") }`);
    assert.strictEqual(emailLoginProposed.userDetermineLoginOptions, 'email');

    await client.request(`mutation CreatePassword { passwordCreate(password: "test123")}`);

    // Now password login is proposed for the user:
    const passwordLoginProposed = await defaultClient.request(`mutation PasswordLoginProposed { userDetermineLoginOptions(email: "${pupil.email}") }`);
    assert.strictEqual(passwordLoginProposed.userDetermineLoginOptions, 'password');

    await client.request(`mutation Logout { logout }`);

    await client.requestShallFail(`query RetrieveSecrets { me { secrets { type createdAt lastUsed }}}`);

    await client.requestShallFail(`mutation InvalidEmailFails { loginPassword(email: "test+wrong@lern-fair.de", password: "${password}")}`);

    await client.requestShallFail(`mutation InvalidPasswordFails { loginPassword(email: "${pupil.email}", password: "test")}`);

    await client.request(`mutation LoginSucceeds { loginPassword(email: "${pupil.email}", password: "test123")}`);

    await client.request(`query RetrieveSecrets { me { secrets { type createdAt lastUsed }}}`);

    return { client, pupil, password };
});

void test('Token Request', async () => {
    const {
        client,
        pupil: {
            email,
            pupil: { id },
        },
    } = await pupilOne;

    const loginNotification = await createMockNotification('user-authenticate', 'LoginNotification');
    // With invalid email shall fail
    await client.requestShallFail(`mutation RequestTokenInvalidEmail { tokenRequest(email: "test+wrong@lern-fair.de") }`);

    await client.request(`mutation RequestToken { tokenRequest(email: "${email}")}`);

    const { context } = await assertUserReceivedNotification(loginNotification, `pupil/${id}`);
    const token = context.token as string;
    assert(token, "Token must be present in LoginNotification's context");

    const otherDeviceClient = createUserClient();
    await otherDeviceClient.request(`mutation LoginWithEmailToken { loginToken(token: "${token}")}`);

    const {
        me: {
            pupil: { id: id1 },
        },
    } = await otherDeviceClient.request(`
        query CheckLoggedIn {
            me { pupil { id } }
        }
    `);

    assert(id === id1, 'Expected login to be in the same account');

    // The Email Token can be used multiple times, as users might mess up between their email program and their browser
    const otherDeviceClient2 = createUserClient();
    await otherDeviceClient2.request(`mutation LoginWithEmailToken { loginToken(token: "${token}")}`);

    const {
        me: {
            pupil: { id: id2 },
        },
    } = await otherDeviceClient.request(`
        query CheckLoggedIn {
            me { pupil { id } }
        }
    `);

    assert(id === id2, 'Expected login to be in the same account');

    // Production only:
    // await client.requestShallFail(`mutation RequestPhishingToken { tokenRequest(email: "${email}", action: "user-password-reset", redirectTo: "https://phishing.example.com")}`);
});

void test('Token Request Password Reset', async () => {
    const {
        client,
        pupil: {
            email,
            pupil: { id },
        },
    } = await pupilOne;

    const passwordResetNotification = await createMockNotification('user-password-reset', 'PasswordResetNotification');

    await client.requestShallFail(`mutation RequestTokenInvalidAction { tokenRequest(email: "${email}", action: "what-the-heck")}`);

    await client.request(
        `mutation RequestTokenPasswordReset { tokenRequest(email: "${email}", action: "user-password-reset", redirectTo: "https://my.lern-fair.de/stuff") }`
    );

    const { context } = await assertUserReceivedNotification(passwordResetNotification, `pupil/${id}`);
    const token = context.token as string;
    assert(token, "Token must be present in PasswordResetNotification's context");

    const otherDeviceClient = createUserClient();
    await otherDeviceClient.request(`mutation LoginWithEmailToken { loginToken(token: "${token}")}`);

    const {
        me: {
            pupil: { id: id1 },
        },
    } = await otherDeviceClient.request(`
        query CheckLoggedIn {
            me { pupil { id } }
        }
    `);
});

void test('Admin Login', async () => {
    const { client: pupilClient } = await pupilOne;
    const unauthenticatedClient = createUserClient();

    await unauthenticatedClient.requestShallFail(`query { pupils(take: 1) { id } }`);
    await pupilClient.requestShallFail(`query { pupils(take: 1) { id } }`);
    await adminClient.request(`query { pupils(take: 1) { id } }`);
});

void test('Change Email', async () => {
    const { client, pupil } = await pupilOne;

    const {
        pupil: { id },
    } = pupil;
    const changedEmailNotification = await createMockNotification('user-email-change', 'EmailChangeNotification');

    const newEmail = `test+${randomBytes(5).toString('base64')}@lern-fair.de`;
    await client.request(`mutation MeChangeEmail { meChangeEmail(email: "${newEmail}")}`);

    const { context } = await assertUserReceivedNotification(changedEmailNotification, `pupil/${id}`);
    const token = context.token as string;
    assert(token, "Token mus be present in ChangeEmailNotification's context");

    const otherDeviceClient = createUserClient();
    await otherDeviceClient.request(`mutation LoginWithEmailToken { loginToken(token: "${token}")}`);

    const {
        me: {
            email: newMeEmailResult,
            pupil: { id: id1, email: newEmailResult },
        },
    } = await otherDeviceClient.request(`
        query CheckLoggedIn {
            me {
                email
                pupil {
                    id
                    email
                }
            }
        }
    `);

    assert.strictEqual(newMeEmailResult, newEmail.toLowerCase(), 'Should be the new email');
    assert.strictEqual(newEmailResult, newEmail.toLowerCase(), 'Should be the new email');
    assert.strictEqual(id, id1, 'Changed email of the correct user');

    // Override email to be used in further tests
    pupil.email = newEmail;
    (pupil.pupil as any).email = pupil.email;
});

void test('Invalidate Sessions', async () => {
    const { client, pupil } = await pupilOne;
    const deviceId = 'test-device-id';
    const otherDeviceId = 'test-other-device-id';
    await client.request(`mutation LoginPassword { loginPassword(email: "${pupil.email}", password: "test123", deviceId: "${deviceId}")}`);
    const { tokenCreate: token } = await client.request(`mutation CreateDeviceToken { tokenCreate(deviceId: "${deviceId}") }`);
    const {
        me: { secrets: secrets },
    } = await client.request(`query RetrieveSecrets { me { secrets { id lastUsedDeviceId } } }`);
    const secret = secrets.sort((a, b) => a.id - b.id).pop(); // get the last secret
    assert.strictEqual(secret.lastUsedDeviceId, deviceId);
    const otherDeviceClient = createUserClient();
    await otherDeviceClient.request(`mutation LoginWithToken { loginToken(token: "${token}", deviceId: "${otherDeviceId}")}`);
    const {
        me: { secrets: secrets2 },
    } = await otherDeviceClient.request(`query MeInfo { me { secrets { lastUsedDeviceId } } }`);
    const secret2 = secrets2.sort((a, b) => a.id - b.id).pop();
    assert.strictEqual(secret2.lastUsedDeviceId, otherDeviceId); // lastUsedDeviceId should be updated
    await client.request(`mutation RevokeToken { tokenRevoke(id: ${secret.id}, invalidateSessions: true)}`);
    await otherDeviceClient.requestShallFail(`query MeInfoFails { me { secrets { lastUsedDeviceId } } }`); // session should be invalidated
    await otherDeviceClient.requestShallFail(`mutation LoginWithTokenFails { loginToken(token: "${token}", deviceId: "${otherDeviceId}")}`); // token should be revoked
});

void test("Don't invalidate other people's sessions", async () => {
    const { client: client1, pupil: pupil1 } = await pupilOne;
    const { client: client2, pupil: pupil2 } = await pupilOne;
    const deviceId = 'test-device-id';
    await client1.request(`mutation LoginPassword { loginPassword(email: "${pupil1.email}", password: "test123", deviceId: "${deviceId}")}`);
    const { tokenCreate: token } = await client1.request(`mutation CreateDeviceToken { tokenCreate(deviceId: "${deviceId}") }`);
    await client2.request(`mutation LoginPassword { loginPassword(email: "${pupil2.email}", password: "test123", deviceId: "${deviceId}")}`);
    await client2.requestShallFail(`mutation RevokeToken { tokenRevoke(id: ${token.id}, invalidateSessions: true)}`);
});
