import { OAuth2Client } from 'google-auth-library';
import { USER_APP_DOMAIN } from '../../util/environment';
import type { AuthenticateResponse } from '..';

const oAuth2Client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_KEY, `https://${USER_APP_DOMAIN}/login-with`);

export const authenticateWithGoogle = async (code: string): Promise<AuthenticateResponse> => {
    const { tokens } = await oAuth2Client.getToken(code);
    const loginTicket = await oAuth2Client.verifyIdToken({
        idToken: tokens.id_token,
        audience: oAuth2Client._clientId,
    });
    const payload = loginTicket.getPayload();
    return {
        email: payload.email,
        firstname: payload.given_name,
        clientId: oAuth2Client._clientId,
        lastname: payload.family_name,
        sub: payload.sub,
    };
};
