import {assert} from "chai";
import * as sinon from "sinon";
import * as screening from "../../../../../common/mails/screening";
import * as mailHandler from "../../../../../common/mails";
import { Student } from "../../../../../common/entity/Student";
import { DEFAULTSENDERS } from "../../../../../common/mails/config";

describe("The screening invitation mails", function() {
    beforeEach(function() {
        this.TestStudent = new Student();
        this.TestStudent.email = "max@example.org";
        this.TestStudent.firstname = "Max";
        this.TestStudent.lastname = "Musterfrau";
        this.sendTemplateMailStub = sinon.stub(mailHandler, "sendTemplateMail").returns(
            Promise.resolve()
        );
    });

    afterEach(function() {
        this.TestStudent = null;
        this.sendTemplateMailStub.restore();
    });

    describe("The method sendFirstScreeningInvitationMail", function() {
        it("Prepares the mail data", function() {
            // Act
            return screening.sendFirstScreeningInvitationMail(this.TestStudent).then(function() {
                // Assert
                assert.ok(this.sendTemplateMailStub.calledWith(
                    {
                        title: "Wir möchten dich kennenlernen!",
                        sender: DEFAULTSENDERS.support,
                        id: 1362938,
                        type: "studentfirstscreeninginvitation",
                        variables: {
                            personFirstname: this.TestStudent.firstname,
                            confirmationURL: this.TestStudent.screeningURL()
                        },
                        disabled: false
                    },
                    this.TestStudent.email
                ), "The method sendTemplateMail was called correctly.");
            }.bind(this));
        });
    });

    describe("The method sendScreeningInvitationReminderMail", function() {
        it("Prepares the mail data", function() {
            // Act
            return screening.sendScreeningInvitationReminderMail(this.TestStudent).then(function() {
                // Assert
                assert.ok(this.sendTemplateMailStub.calledWith(
                    {
                        title: "Erinnerung: Wir möchten dich kennenlernen!",
                        sender: DEFAULTSENDERS.support,
                        id: 1391548,
                        type: "studentscreeningreminder",
                        variables: {
                            personFirstname: this.TestStudent.firstname,
                            confirmationURL: this.TestStudent.screeningURL()
                        },
                        disabled: false
                    },
                    this.TestStudent.email
                ), "The method sendTemplateMail was called correctly.");
            }.bind(this));
        });
    });

    describe("The method sendFirstInstructorScreeningInvitationMail", function() {
        it("Prepares the mail data", function() {
            // Act
            return screening.sendFirstInstructorScreeningInvitationMail(this.TestStudent).then(function() {
                // Assert
                assert.ok(this.sendTemplateMailStub.calledWith(
                    {
                        title: "Wir möchten dich kennenlernen!",
                        sender: DEFAULTSENDERS.support,
                        id: 1518623,
                        type: "instructorfirstscreeninginvitation",
                        variables: {
                            instructorFirstName: this.TestStudent.firstname,
                            confirmationURL: this.TestStudent.instructorScreeningURL()
                        },
                        disabled: false
                    },
                    this.TestStudent.email
                ), "The method sendTemplateMail was called correctly.");
            }.bind(this));
        });
    });
});
