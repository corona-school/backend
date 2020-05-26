import sodium from "libsodium-wrappers";
import paseto from "paseto.js";
import url from "url";

export const ERROR_FAILED = 0;
export const ERROR_EXPIRED = 1;

export class VerificationError extends Error {
    constructor(type, ...params) {
        super(...params);

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, VerificationError);
        }

        this.name = "VerificationError";
        this._type = type;
    }

    type() {
        return this._type;
    }
}

// Create a new signed user token that expires in 30 minutes
export async function sign(user) {
    const pair = await keypair();
    return signToken(pair, user, minutesFrom(new Date(), 30));
}

// Verify that the token is signed correctly and has not yet expired
export async function verify(token) {
    const pair = await keypair();
    return verifyToken(pair, token, new Date());
}

async function keypair() {
    // Generate a new public keypair as follows:
    // import sodium from 'libsodium-wrappers'
    // (async () => {
    //     await sodium.ready
    //     const {privateKey: priv, publicKey: pub} = sodium.crypto_sign_keypair()
    //     console.log(`const privateHex = \'${Buffer.from(priv).toString('hex')}\'`)
    //     console.log(`const publicHex = \'${Buffer.from(pub).toString('hex')}\'`)
    // })()
    const privateHex =
        "6ec9959fc8791dcf605a9ef10f2b00cbade0262c3cbb9548984ebff21e600ae79e87c6bca56abc72b2f95b2199ee488787f40de8d022f27a8075021b968b2ed7";
    const publicHex =
        "9e87c6bca56abc72b2f95b2199ee488787f40de8d022f27a8075021b968b2ed7";

    const privateKey = new paseto.PrivateKey(new paseto.V2());
    const publicKey = new paseto.PublicKey(new paseto.V2());

    await privateKey.hex(privateHex);
    await publicKey.hex(publicHex);

    return { privateKey, publicKey };
}

function minutesFrom(now, minutes) {
    return new Date(now.getTime() + minutes * 60 * 1000);
}

async function signToken(keypair, user, expiry) {
    const signer = new paseto.V2();
    const payload = { user: user, exp: expiry.toISOString() };
    const signed = await signer.sign(
        JSON.stringify(payload),
        keypair.privateKey
    );
    return Buffer.from(signed, "utf-8").toString("base64");
}

async function verifyToken(keypair, token, now) {
    const verifier = new paseto.V2();
    let verified;
    try {
        verified = await verifier
            .verify(
                Buffer.from(token, "base64").toString("utf-8"),
                keypair.publicKey
            )
            .then(JSON.parse);
    } catch (e) {
        throw new VerificationError(ERROR_FAILED, e);
    }
    if (now <= new Date(verified.exp)) {
        return verified.user;
    } else {
        throw new VerificationError(ERROR_EXPIRED);
    }
}

export const testOnly = { keypair, minutesFrom, signToken, verifyToken };
