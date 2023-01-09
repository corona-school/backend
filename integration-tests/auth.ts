import { adminClient, createUserClient, defaultClient, test } from "./base";
import { pupilOne } from "./user";
import * as assert from "assert";

test("Token Login", async () => {
    const { client } = await pupilOne;

    // Create a new Token

    const { tokenCreate: token } = await client.request(`mutation CreateToken { tokenCreate }`);

    const secretsUnused = await client.request(`query RetrieveSecrets { me { secrets { type createdAt lastUsed }}}`);
    assert.equal(secretsUnused.me.secrets[0].lastUsed, null);

    // Token can be used to log in

    await client.request(`mutation Logout { logout }`);

    await client.requestShallFail(`query RetrieveSecretsFails { me { secrets { type createdAt lastUsed }}}`);

    await client.request(`mutation LoginWithToken { loginToken(token: "${token}")}`);

    const secretsUsed = await client.request(`query RetrieveSecrets { me { secrets { id type createdAt lastUsed }}}`);
    assert.notEqual(secretsUsed.me.secrets[0].lastUsed, null);

    // Token can be revoked

    await client.request(`mutation RevokeToken { tokenRevoke(id: ${secretsUsed.me.secrets[0].id})}`);

    const { tokenCreate: token2 } = await client.request(`mutation CreateTokenTwo { tokenCreate }`);

    await client.request(`mutation Logout { logout }`);

    await client.requestShallFail(`query RetrieveSecretsFails { me { secrets { type createdAt lastUsed }}}`);

    await client.requestShallFail(`mutation LoginWithRevokedFails { loginToken(token: "${token}")}`);

    await client.request(`mutation LoginWithTwo { loginToken(token: "${token2}")}`);

    const secretsSwapped = await client.request(`query RetrieveSecrets { me { secrets { type createdAt lastUsed }}}`);
    assert.equal(secretsSwapped.me.secrets.length, 1);
});

export const pupilOneWithPassword = test("Password Login", async () => {
    const { client, pupil } = await pupilOne;
    const password = "test123";

    // Before the user has a password, email login is proposed:
    const emailLoginProposed = await defaultClient.request(`mutation EmailLoginProposed { userDetermineLoginOptions(email: "${pupil.email}") }`);
    assert.strictEqual(emailLoginProposed.userDetermineLoginOptions, "email");

    await client.request(`mutation CreatePassword { passwordCreate(password: "test123")}`);

    // Now password login is proposed for the user:
    const passwordLoginProposed = await defaultClient.request(`mutation PasswordLoginProposed { userDetermineLoginOptions(email: "${pupil.email}") }`);
    assert.strictEqual(passwordLoginProposed.userDetermineLoginOptions, "password");

    await client.request(`mutation Logout { logout }`);

    await client.requestShallFail(`query RetrieveSecrets { me { secrets { type createdAt lastUsed }}}`);

    await client.requestShallFail(`mutation InvalidEmailFails { loginPassword(email: "test+wrong@lern-fair.de", password: "${password}")}`);

    await client.requestShallFail(`mutation InvalidPasswordFails { loginPassword(email: "${pupil.email}", password: "test")}`);

    await client.request(`mutation LoginSucceeds { loginPassword(email: "${pupil.email}", password: "test123")}`);

    await client.request(`query RetrieveSecrets { me { secrets { type createdAt lastUsed }}}`);

    return { client, pupil, password };
});

test("Token Request", async () => {
    const { client, pupil: { email } } = await pupilOne;

    // With invalid email shall fail
    await client.requestShallFail(`mutation RequestTokenInvalidEmail { tokenRequest(email: "test+wrong@lern-fair.de") }`);

    await client.request(`mutation RequestToken { tokenRequest(email: "${email}")}`);

    await client.request(`mutation RequestTokenPasswordReset { tokenRequest(email: "${email}", action: "user-password-reset")}`);
    await client.requestShallFail(`mutation RequestTokenInvalidAction { tokenRequest(email: "${email}", action: "what-the-heck")}`);

    await client.request(`mutation RequestTokenPasswordReset { tokenRequest(email: "${email}", action: "user-password-reset", redirectTo: "https://my.lern-fair.de/stuff") }`);

    // Production only:
    // await client.requestShallFail(`mutation RequestPhishingToken { tokenRequest(email: "${email}", action: "user-password-reset", redirectTo: "https://phishing.example.com")}`);

    // NOTE: We cannot further test integration here, as we cannot access the emails that might have been sent to the user
});

test("Admin Login", async () => {
    const { client: pupilClient } = await pupilOne;
    const unauthenticatedClient = createUserClient();

    await unauthenticatedClient.requestShallFail(`query { pupils(take: 1) { id } }`);
    await pupilClient.requestShallFail(`query { pupils(take: 1) { id } }`);
    await adminClient.request(`query { pupils(take: 1) { id } }`);
});
