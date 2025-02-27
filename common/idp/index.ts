import { authenticateWithGoogle } from './clients/google';

export interface AuthenticateResponse {
    email: string;
    firstname: string;
    lastname?: string;
    clientId: string;
    sub: string;
}

interface AuthenticateArgs {
    referrer: string;
    code: string;
}

const identityProviders = {
    'https://accounts.google.com/': authenticateWithGoogle,
};

export const authenticateWithIDP = ({ code, referrer }: AuthenticateArgs): Promise<AuthenticateResponse> => {
    const authenticate = identityProviders[referrer];
    if (!authenticate) {
        throw new Error(`Unknown identity provider: ${referrer}`);
    }

    return authenticate(code);
};
