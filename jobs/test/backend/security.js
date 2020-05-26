const paseto = require("paseto.js");
const security = require("../../../backend/security");

const { keypair, minutesFrom, verifyToken, signToken } = security.testOnly;

export default function (t) {
    t.test("keypair", async (t) => {
        const pair = await keypair();

        t.test("contains 64-byte private key", (t) => {
            const priv = pair.privateKey;

            t.plan(2);
            t.equal(Buffer.byteLength(priv.raw()), 64);
            t.deepEqual(priv.protocol(), new paseto.V2());
        });

        t.test("contains 32-byte public key", (t) => {
            const pub = pair.publicKey;

            t.plan(2);
            t.equal(Buffer.byteLength(Buffer.from(pub.raw())), 32);
            t.deepEqual(pub.protocol(), new paseto.V2());
        });
    });

    t.test("minutesFrom", (t) => {
        t.test("correctly adds 30 minutes", (t) => {
            const now = new Date("2020-03-22T17:39:15.761Z");
            const then = new Date("2020-03-22T18:09:15.761Z");

            t.plan(1);
            t.deepEqual(minutesFrom(now, 30), then);
        });
    });

    t.test("signToken / verifyToken", async (t) => {
        const now = new Date("2020-03-22T17:39:15.761Z");
        const beforeExpiry = minutesFrom(now, 1);
        const expiry = minutesFrom(now, 2);
        const afterExpiry = minutesFrom(now, 3);

        const user = "user@domain.tld";
        const pair = await keypair();
        const token = await signToken(pair, user, expiry);

        t.test("signed token can be verified and read", async (t) => {
            t.plan(1);
            const verifiedUser = await verifyToken(pair, token, beforeExpiry);
            t.equal(verifiedUser, user);
        });

        t.test("expired token fails verification", async (t) => {
            t.plan(1);
            await verifyToken(pair, token, afterExpiry).catch((e) =>
                t.equal(e.type(), security.ERROR_EXPIRED)
            );
        });

        t.test("invalid token fails verification", async (t) => {
            t.plan(1);
            const invalidToken = Buffer.from("not a token", "utf-8").toString(
                "base64"
            );
            await verifyToken(pair, invalidToken, beforeExpiry).catch((e) =>
                t.equal(e.type(), security.ERROR_FAILED)
            );
        });
    });

    t.test("sign / verify", async (t) => {
        const user = "me@mine.de";
        t.plan(1);
        t.equal(await security.verify(await security.sign(user)), user);
    });
}
