import { createZoomUser } from './zoom-user';
import { getAccessToken } from './zoom-authorization';
/*
test('Create a Zoom user', async () => {
    // Act
    const auth = await createZoomUser('zoom-user@trash-mail.com', 1);
    // Assert
    // console.log(auth);
    expect(typeof auth).toBe('object');
});
*/
test('Create a access token', async () => {
    const apiKey = 'J1MfvLGeStCTF_uP7DREVg';
    const apiSecret = 'Lp0031nELalGE55LgTqz3yk3wP6oykOC';
    const grantType = 'authorization_code';
    const accountId = 'idsIiH7RTvOcCIii8hrtEA';
    // Act
    const auth = await getAccessToken(apiKey, apiSecret, grantType, accountId);
    // Assert
    console.log(auth);
    expect(typeof auth).toBe('object');
});
