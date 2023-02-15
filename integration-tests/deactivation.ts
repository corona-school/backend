import { pupilOneWithPassword } from "./auth";
import { test } from "./base";

test("Pupil Account Deactivation", async () => {
    const { client, pupil, password } = await pupilOneWithPassword;

    await client.request(`mutation { meDeactivate(reason: "Keine Lust mehr auf Integration-Tests")}`);
    await client.request(`mutation { logout }`);

    await client.requestShallFail(`mutation { loginPassword(email: "${pupil.email}", password: "${password}")}`);

    // requestToken will fail silently, so we cannot test this
});