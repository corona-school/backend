import {assert} from "chai";
import sinon from "sinon";
import mailjet from "../../common/mails/mailjet";
import {DEFAULTSENDERS} from "../../common/mails/config";
import {Connection} from "typeorm";
import TestStudents from "../utils/TestStudents";
import {verifyToken} from "../../web/controllers/tokenController";
import databaseHelper from "../utils/databaseHelper";

describe("Screening Invitation", function() {
    this.timeout(5000);

    // The connection that should be used for tests
    let connection: Connection;
    let sandbox = sinon.createSandbox();

    before(() => {
        return databaseHelper.createConnection().then(response => {
            connection = response;
        });
    });

    after(() => {
        return databaseHelper.closeConnection(connection);
    });

    afterEach(() => {
        sandbox.restore();
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
        return new Promise<void>((resolve) => {
            manager.save(testStudent).then(() => {
                //setup mailjetStub
                const mailjetStub = sandbox.spy(mailjet, "sendTemplate");

                // Act
                verifyToken(verificationToken).then(() => {

                    // Assert
                    assert.strictEqual(mailjetStub.callCount, 2);

                    const dashboardURLUUIDMatchRegex = new RegExp(
                        /^https:\/\/my.lern-fair.de\/login\?token=[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}/i
                    );

                    assert.strictEqual(mailjetStub.getCall(0).args[0], "Lern-Fair - Dein Account");
                    assert.strictEqual(mailjetStub.getCall(0).args[1], DEFAULTSENDERS.support);
                    assert.strictEqual(mailjetStub.getCall(0).args[2], testStudent.email);
                    assert.strictEqual(mailjetStub.getCall(0).args[3], 1337159);
                    assert.strictEqual(mailjetStub.getCall(0).args[4].personFirstname, testStudent.firstname);
                    assert.ok(dashboardURLUUIDMatchRegex.test(mailjetStub.getCall(0).args[4].dashboardURL));
                    assert.strictEqual(mailjetStub.getCall(0).args[5], false);

                    assert.strictEqual(mailjetStub.getCall(1).args[0], "Wir möchten dich kennenlernen!");
                    assert.strictEqual(mailjetStub.getCall(1).args[1], DEFAULTSENDERS.support);
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
