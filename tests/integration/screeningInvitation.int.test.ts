import * as assert from "assert";
import * as sinon from "sinon";
import mailjet from "../../common/mails/mailjet";
import {DEFAULTSENDERS} from "../../common/mails/config";
import {Connection} from "typeorm";
import {createTestingConnection, closeTestingConnection} from "../utils/typeorm";
import TestStudents from "../utils/TestStudents";
import {verifyToken} from "../../web/controllers/tokenController";

describe("Screening Invitation", function() {
    this.timeout(20000);

    // The connection that should be used for tests
    let connection: Connection;
    let sandbox = sinon.createSandbox();

    beforeEach(() => {
        return new Promise(resolve => {
            createTestingConnection({
                name: "default", //use the default name, because the function that we wanna test use the getConnection function
                dropSchema: true //reset database before each test
            }).then(result => {
                connection = result;

                // create tables etc.
                connection.synchronize().then(() => {
                    resolve();
                });
            });
        });
    });

    afterEach(() => {
        return new Promise(resolve => {
            connection.dropDatabase().then(() => {
                closeTestingConnection(connection).then(() => {
                    sandbox.restore();
                    resolve();
                });
            });
        });
    });

    // setup environment variables to not set mailjet api to live
    process.env.MAILJET_LIVE = "0";

    it("verifies the token and send screening invitation", () => {
        // Arrange
        // create default database connection
        // get the default manager for the connection
        const manager = connection.manager;

        // insert test student
        const testStudent = TestStudents.max();

        // add verification token
        const verificationToken = `asupersecureverificationtokenlol`;
        testStudent.verification = verificationToken;

        // save test student
        return new Promise((resolve) => {
            manager.save(testStudent).then(() => {
                //setup mailjetStub
                const mailjetStub = sandbox.spy(mailjet, "send");

                // Act
                verifyToken(verificationToken).then(() => {

                    // Assert
                    assert.strictEqual(mailjetStub.callCount, 2);

                    const dashboardURLUUIDMatchRegex = new RegExp(
                        /^https:\/\/my.corona-school.de\/login\?token=[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}/i
                    );

                    assert.strictEqual(mailjetStub.getCall(0).args[0], "Corona School - Dein Account");
                    assert.strictEqual(mailjetStub.getCall(0).args[1], DEFAULTSENDERS.noreply);
                    assert.strictEqual(mailjetStub.getCall(0).args[2], testStudent.email);
                    assert.strictEqual(mailjetStub.getCall(0).args[3], 1337159);
                    assert.strictEqual(mailjetStub.getCall(0).args[4].personFirstname, testStudent.firstname);
                    assert.ok(dashboardURLUUIDMatchRegex.test(mailjetStub.getCall(0).args[4].dashboardURL));
                    assert.strictEqual(mailjetStub.getCall(0).args[5], false);

                    assert.strictEqual(mailjetStub.getCall(1).args[0], "Wir möchten dich kennenlernen!");
                    assert.strictEqual(mailjetStub.getCall(1).args[1], DEFAULTSENDERS.screening);
                    assert.strictEqual(mailjetStub.getCall(1).args[2], testStudent.email);
                    assert.strictEqual(mailjetStub.getCall(1).args[3], 1362938);
                    assert.strictEqual(mailjetStub.getCall(1).args[4].personFirstname, testStudent.firstname);
                    assert.strictEqual(mailjetStub.getCall(1).args[4].confirmationURL, testStudent.screeningURL());
                    assert.strictEqual(mailjetStub.getCall(1).args[5], false);

                    resolve();
                });
            });
        });
    });
});
