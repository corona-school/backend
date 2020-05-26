import { sendFirstScreeningInvitation } from "../../common/mails/screening";
import { Student } from "../../common/entity/Student";
import mailjet from "../../common/mails/mailjet";
import { DEFAULTSENDERS } from "../../common/mails/config";
import { Connection } from "typeorm";
import {
    createTestingConnection,
    closeTestingConnection,
} from "../utils/typeorm";
import TestStudents from "../utils/TestStudents";
import { verifyToken } from "../../web/controllers/tokenController";

describe("Screening Invitation", () => {
    // The connection that should be used for tests
    let connection: Connection;

    beforeEach(async (done) => {
        connection = await createTestingConnection({
            name: "default", //use the default name, because the function that we wanna test use the getConnection function
            dropSchema: true, //reset database before each test
        });

        //create tables etc.
        await connection.synchronize();

        done();
    });

    afterEach(async (done) => {
        //delete database after testing
        await connection.dropDatabase();

        //close testing connection
        await closeTestingConnection(connection);

        //clear all mock data
        jest.clearAllMocks();

        done();
    });

    // setup environment variables to not set mailjet api to live
    process.env.MAILJET_LIVE = "0";

    test("send first screening invitation", async () => {
        const testStudent = new Student();
        testStudent.email = "max@example.org";
        testStudent.firstname = "Max";
        testStudent.lastname = "Musterfrau";

        const spy = jest.spyOn(mailjet, "send");

        await sendFirstScreeningInvitation(testStudent);

        expect(spy).toBeCalledWith(
            "Wir möchten dich kennenlernen!",
            DEFAULTSENDERS.screening,
            testStudent.email,
            1362938,
            {
                personFirstname: testStudent.firstname,
                confirmationURL: testStudent.screeningURL(),
            },
            false
        );
    });

    test("verify token and send screening invitation", async () => {
        //create default database connection
        //get the default manager for the connection
        const manager = connection.manager;

        //insert test student
        const testStudent = TestStudents.max();

        //add verification token
        const verificationToken = `asupersecureverificationtokenlol`;
        testStudent.verification = verificationToken;

        //save test student
        await manager.save(testStudent);

        //setup spy
        const spy = jest.spyOn(mailjet, "send");

        //the actually function that is tested
        await verifyToken(verificationToken);

        //expect...
        expect(spy).toBeCalledTimes(2);

        const dashboardURLUUIDMatchRegex = new RegExp(
            /^https:\/\/dashboard.corona-school.de\/login\?token\=[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i
        );
        expect(spy).toHaveBeenNthCalledWith(
            1,
            "Corona School - Dein Account",
            DEFAULTSENDERS.noreply,
            testStudent.email,
            1337159,
            {
                personFirstname: testStudent.firstname,
                dashboardURL: expect.stringMatching(dashboardURLUUIDMatchRegex),
            },
            false
        );
        expect(spy).toHaveBeenNthCalledWith(
            2,
            "Wir möchten dich kennenlernen!",
            DEFAULTSENDERS.screening,
            testStudent.email,
            1362938,
            {
                personFirstname: testStudent.firstname,
                confirmationURL: testStudent.screeningURL(),
            },
            false
        );
    });
});
