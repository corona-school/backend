import { Role } from "../authorizations";
import { Arg, Authorized, Ctx, Field, InputType, Int, Mutation, Resolver } from "type-graphql";
import { Me } from "./fields";
import { Subject } from "../types/subject";
import { GraphQLContext } from "../context";
import { getSessionPupil, getSessionStudent, getSessionUser, logInAsPupil, logInAsStudent } from "../authentication";
import { prisma } from "../../common/prisma";
import { activatePupil, deactivatePupil } from "../../common/pupil/activation";
import { ProjectField } from "../../common/jufo/projectFields";
import { pupil_projectfields_enum, student_languages_enum, student_state_enum } from ".prisma/client";
import { project_field_with_grade_restriction_projectfield_enum } from "@prisma/client";
import { TeacherModule } from "../../common/entity/Student";
import { MaxLength } from "class-validator";
import { sendFirstInstructorScreeningInvitationMail, sendFirstProjectCoachingJufoAlumniScreeningInvitationMail, sendFirstScreeningInvitationMail } from "../../common/mails/screening";
import { Language } from "../../common/daz/language";
import * as Notification from "../../common/notification";
import { DEFAULT_SCREENER_NUMBER_ID } from "../../common/entity/Screener";
import { TuteeJufoParticipationIndication, TutorJufoParticipationIndication } from "../../common/jufo/participationIndication";
import { RegistrationSource } from "../../common/entity/Person";
import { School } from "../../common/entity/School";
import { State } from "../../common/entity/State";
import { RateLimit } from "../rate-limit";
import { v4 as uuidv4 } from "uuid";
import { sendVerificationMail, generateToken } from "../../jobs/periodic/fetch/utils/verification";
import { getTransactionLog } from '../../common/transactionlog';
import VerificationRequestEvent from "../../common/transactionlog/types/VerificationRequestEvent";
import { getLogger } from "log4js";
import { Context } from "mocha";

const log = getLogger("Me Mutations");
@InputType()
class ProjectFieldWithGradeInput {

    @Field(type => ProjectField)
    name: ProjectField;
    @Field(type => Int, { nullable: true })
    min?: number;
    @Field(type => Int, { nullable: true })
    max?: number;
}

@InputType()
class RegisterStudentInput {
    @Field(type => String)
    @MaxLength(100)
    firstname: string;

    @Field(type => String)
    @MaxLength(100)
    lastname: string;

    @Field(type => String)
    @MaxLength(100)
    email: string;

    @Field(type => Boolean)
    newsletter: boolean;

    @Field(type => RegistrationSource)
    registrationSource: RegistrationSource;

    /* After registration, the user receives an email to verify their account.
   The user is redirected to this URL afterwards to continue with whatever they're registering for */
    @Field(type => String, { nullable: true })
    redirectTo?: string;
}


@InputType()
class RegisterPupilInput {
    @Field(type => String)
    @MaxLength(100)
    firstname: string;

    @Field(type => String)
    @MaxLength(100)
    lastname: string;

    @Field(type => String)
    @MaxLength(100)
    email: string;

    @Field(type => Boolean)
    newsletter: boolean;

    @Field(type => Int)
    schoolId: School["id"];

    @Field(type => State)
    state: State;

    @Field(type => RegistrationSource)
    registrationSource: RegistrationSource;

    /* After registration, the user receives an email to verify their account.
       The user is redirected to this URL afterwards to continue with whatever they're registering for */
    @Field(type => String, { nullable: true })
    redirectTo?: string;

}

@InputType()
class PupilUpdateInput {
    @Field(type => Int, { nullable: true })
    gradeAsInt?: number;

    @Field(type => [Subject], { nullable: true })
    subjects?: Subject[];

    @Field(type => [ProjectField], { nullable: true })
    projectFields: ProjectField[];
}

@InputType()
class StudentUpdateInput {
    @Field(type => [Subject], { nullable: true })
    subjects?: Subject[];

    @Field(type => [ProjectFieldWithGradeInput], { nullable: true })
    projectFields: ProjectFieldWithGradeInput[];
}


@InputType()
class MeUpdateInput {
    @Field(type => String, { nullable: true })
    @MaxLength(100)
    firstname?: string;

    @Field(type => String, { nullable: true })
    @MaxLength(100)
    lastname?: string;

    @Field(type => PupilUpdateInput, { nullable: true })
    pupil?: PupilUpdateInput;

    @Field(type => StudentUpdateInput, { nullable: true })
    student?: StudentUpdateInput;
}

@InputType()
class BecomeInstructorInput {
    @Field(type => String, { nullable: true })
    @MaxLength(100)
    university: string;

    @Field(type => State, { nullable: true })
    state: State;

    @Field(type => TeacherModule, { nullable: true })
    teacherModule: TeacherModule;

    @Field(type => Int, { nullable: true })
    moduleHours: number;

    @Field(type => String)
    @MaxLength(3000)
    message: string;
}

@InputType()
class BecomeTutorInput {
    @Field(type => [Subject])
    subjects: Subject[];

    @Field(type => [Language])
    languages: Language[];

    @Field(type => Boolean)
    supportsInDaZ: boolean;
}

@InputType()
class BecomeProjectCoachInput {
    @Field(type => [ProjectFieldWithGradeInput])
    projectFields: ProjectFieldWithGradeInput[];

    @Field(type => TutorJufoParticipationIndication)
    wasJufoParticipant: TutorJufoParticipationIndication;

    @Field(type => Boolean)
    isUniversityStudent: boolean;


    @Field(type => Boolean)
    hasJufoCertificate: boolean;

    @Field(type => String)
    @MaxLength(3000)
    jufoPastParticipationInfo: string;
}

@InputType()
class BecomeProjectCoacheeInput {
    @Field(type => [ProjectField])
    projectFields: ProjectField[];

    @Field(type => Boolean)
    isJufoParticipant: TuteeJufoParticipationIndication;

    @Field(type => Int)
    projectMemberCount: number;
}

async function isEmailAvailable(email: string) {
    email = email.toLowerCase();
    const pupilHasEmail = await prisma.pupil.count({ where: { email } }) > 0;
    const studentHasEmail = await prisma.student.count({ where: { email } }) > 0;
    return !pupilHasEmail && !studentHasEmail;
}


@Resolver(of => Me)
export class MutateMeResolver {
    @Mutation(returns => Boolean)
    @Authorized(Role.UNAUTHENTICATED)
    @RateLimit("RegisterStudent", 10 /* requests per */, 5 * 60 * 60 * 1000 /* 5 hours */)
    async meRegisterStudent(@Ctx() context: GraphQLContext, @Arg("data") data: RegisterStudentInput) {
        if (!(await isEmailAvailable(data.email))) {
            throw new Error(`Email is already used by another account`);
        }

        const student = await prisma.student.create({
            data: {
                email: data.email.toLowerCase(),
                firstname: data.firstname,
                lastname: data.lastname,
                newsletter: data.newsletter,
                registrationSource: data.registrationSource as any,

                // Compatibility with legacy foreign keys
                wix_id: "Z-" + uuidv4(),
                wix_creation_date: new Date(),

                // the authToken is used to verify the e-mail instead
                verification: "DEPRECATED"
            }
        });

        // TODO: Create a new E-Mail for registration
        // TODO: Send authToken with this
        await Notification.actionTaken(student, "student_registration_started", { redirectTo: data.redirectTo });
        await getTransactionLog().log(new VerificationRequestEvent(student));

        log.info(`Student(${student.id}, firstname = ${student.firstname}, lastname = ${student.lastname}) registered`);

        await logInAsStudent(student, context);

        return true;


        /* The student can now use the authToken passed to them via E-Mail to re authenticate the session.
           This will mark them as verified, and grant them the STUDENT role.
           With this role, they can use the meBecomeTutor, meBecomeInstructor or meBecomeProjectCoach to enhance their user account.
           With the STUDENT Role alone they can't do much (but at least deactivate their account and change their settings) */
    }

    @Mutation(returns => Boolean)
    @Authorized(Role.UNAUTHENTICATED)
    @RateLimit("RegisterPupil", 10 /* requests per */, 5 * 60 * 60 * 1000 /* 5 hours */)
    async meRegisterPupil(@Ctx() context: GraphQLContext, @Arg("data") data: RegisterPupilInput) {
        if (!(await isEmailAvailable(data.email))) {
            throw new Error(`Email is already used by another account`);
        }

        const school = await prisma.school.findUnique({ where: { id: data.schoolId } });
        if (!school) {
            throw new Error(`Invalid School ID '${data.schoolId}'`);
        }

        const pupil = await prisma.pupil.create({
            data: {
                email: data.email.toLowerCase(),
                firstname: data.firstname,
                lastname: data.lastname,
                newsletter: data.newsletter,
                createdAt: new Date(),
                schooltype: school.schooltype,
                school: { connect: school },
                state: data.state,
                registrationSource: data.registrationSource as any,

                // Compatibility with legacy foreign keys
                wix_id: "Z-" + uuidv4(),
                wix_creation_date: new Date(),

                // Every pupil can participate in courses
                isParticipant: true,

                // the authToken is used to verify the e-mail instead
                verification: "DEPRECATED"
            }
        });

        // TODO: Create a new E-Mail for registration
        // TODO: Send auth token with this
        await Notification.actionTaken(pupil, "pupil_registration_started", { redirectTo: data.redirectTo });
        await getTransactionLog().log(new VerificationRequestEvent(pupil));

        log.info(`Pupil(${pupil.id}, firstname = ${pupil.firstname}, lastname = ${pupil.lastname}) registered`);

        await logInAsPupil(pupil, context);

        return true;

        /* The pupil can now use the authToken passed to them via E-Mail to re authenticate the session.
           This will mark them as verified, and grant them the PUPIL role.
           With this role, they can use the meBecomeStatePupil, meBecomeTutee or meBecomeProjectCoachee to enhance their user account */
    }

    @Mutation(returns => Boolean)
    @Authorized(Role.USER)
    async meUpdate(@Ctx() context: GraphQLContext, @Arg("update") update: MeUpdateInput) {
        const user = getSessionUser(context);

        const { firstname, lastname, pupil, student } = update;

        if (user.pupilId) {
            const prevPupil = await getSessionPupil(context);

            if (student) {
                throw new Error(`Tried to update student data on a pupil`);
            }

            const { subjects, gradeAsInt, projectFields } = pupil;

            if (projectFields && !prevPupil.isProjectCoachee) {
                throw new Error(`Only project coachees can set the project fields`);
            }

            await prisma.pupil.update({
                data: {
                    firstname,
                    lastname,
                    // TODO: Store numbers as numbers maybe ...
                    grade: `${gradeAsInt}. Klasse`,
                    subjects: JSON.stringify(subjects),
                    projectFields: projectFields as pupil_projectfields_enum[]
                },
                where: { id: user.pupilId }
            });

            return true;
        }

        if (user.studentId) {
            const prevStudent = await getSessionStudent(context);

            if (pupil) {
                throw new Error(`Tried to update pupil data on student`);
            }

            const { projectFields, subjects } = student;

            if (projectFields && !prevStudent.isProjectCoach) {
                throw new Error(`Only project coaches can set the project fields`);
            }

            if (projectFields) {
                await prisma.$transaction(async prisma => {
                    await prisma.project_field_with_grade_restriction.deleteMany({ where: { studentId: user.studentId } });
                    await prisma.project_field_with_grade_restriction.createMany({ data: projectFields.map(it => ({ projectField: it.name as project_field_with_grade_restriction_projectfield_enum, min: it.min, max: it.max, studentId: user.studentId })) });
                });
            }

            await prisma.student.update({
                data: {
                    firstname,
                    lastname,
                    subjects: JSON.stringify(subjects)
                },
                where: { id: user.studentId }
            });

            return true;
        }
        throw new Error(`This mutation is currently not supported for this user type`);
    }


    @Mutation(returns => Boolean)
    @Authorized(Role.USER)
    async meDeactivate(@Ctx() context: GraphQLContext) {
        const user = getSessionUser(context);

        if (user.pupilId) {
            const pupil = await getSessionPupil(context);
            await deactivatePupil(pupil);

            return true;
        }

        // TODO: Student deactivation

        throw new Error(`This mutation is currently not supported for this user type`);
    }

    @Mutation(returns => Boolean)
    @Authorized(Role.USER)
    async meActivate(@Ctx() context: GraphQLContext) {
        const user = getSessionUser(context);

        if (user.pupilId) {
            const pupil = await getSessionPupil(context);
            await activatePupil(pupil);
            return true;
        }

        // TODO: Student activation

        throw new Error(`This mutation is currently not supported for this user type`);
    }

    @Mutation(returns => Boolean)
    @Authorized(Role.STUDENT)
    async meBecomeInstructor(@Ctx() context: GraphQLContext, @Arg("data") data: BecomeInstructorInput) {
        const student = await getSessionStudent(context);
        if (student.isInstructor) {
            throw new Error(`Student is already instructor`);
        }

        const { university, message, state, teacherModule, moduleHours } = data;

        await prisma.student.update({
            data: {
                isInstructor: true,
                state: state as student_state_enum,
                university,
                msg: message,
                module: teacherModule,
                moduleHours,
                lastSentInstructorScreeningInvitationDate: new Date()
            },
            where: { id: student.id }
        });


        const wasInstructorScreened = await prisma.instructor_screening.count({ where: { studentId: student.id, success: true } }) > 0;
        if (!wasInstructorScreened) {
            await sendFirstInstructorScreeningInvitationMail(student);
        }


        return true;
    }

    @Mutation(returns => Boolean)
    @Authorized(Role.STUDENT)
    async meBecomeTutor(@Ctx() context: GraphQLContext, @Arg("data") data: BecomeTutorInput) {
        const student = await getSessionStudent(context);

        if (student.isStudent) {
            throw new Error(`Student is already tutor`);
        }

        const { languages, subjects, supportsInDaZ } = data;

        await prisma.student.update({
            data: {
                isStudent: true,
                openMatchRequestCount: 1,
                subjects: JSON.stringify(subjects),
                languages: languages as student_languages_enum[],
                supportsInDaZ
            },
            where: { id: student.id }
        });

        const isScreenedCoach = await prisma.project_coaching_screening.count({
            where: { studentId: student.id, success: true }
        }) > 0;

        if (isScreenedCoach) {
            await prisma.screening.create({
                data: {
                    success: true,
                    screenerId: DEFAULT_SCREENER_NUMBER_ID,
                    comment: `[AUTOMATICALLY GENERATED SECONDARY SCREENING DUE TO VALID PROJECT COACHING SCREENING]`,
                    knowsCoronaSchoolFrom: ""
                }
            });

            await Notification.actionTaken(student, "tutor_screening_success", {});
        }

        // TODO: Currently students are not invited for screening again when they want to become tutors? Why is that?

        return true;
    }

    @Mutation(returns => Boolean)
    @Authorized(Role.STUDENT)
    async meBecomeProjectCoach(@Ctx() context: GraphQLContext, data: BecomeProjectCoachInput) {
        const student = await getSessionStudent(context);

        if (student.isProjectCoach) {
            throw new Error(`Student is already a coach`);
        }

        const { hasJufoCertificate, isUniversityStudent, jufoPastParticipationInfo, projectFields, wasJufoParticipant } = data;

        if (projectFields) {
            await prisma.$transaction(async prisma => {
                await prisma.project_field_with_grade_restriction.deleteMany({ where: { studentId: student.id } });
                await prisma.project_field_with_grade_restriction.createMany({ data: projectFields.map(it => ({ projectField: it.name as project_field_with_grade_restriction_projectfield_enum, min: it.min, max: it.max, studentId: student.id })) });
            });
        }

        await prisma.student.update({
            data: {
                isProjectCoach: true,
                wasJufoParticipant,
                isUniversityStudent,
                hasJufoCertificate,
                jufoPastParticipationInfo
            },
            where: { id: student.id }
        });


        const wasScreened = await prisma.project_coaching_screening.count({ where: { studentId: student.id, success: true } }) > 0;

        if (!wasScreened) {
            if (student.isUniversityStudent) {
                await sendFirstScreeningInvitationMail(student);
                await prisma.student.update({
                    data: { lastSentScreeningInvitationDate: new Date() },
                    where: { id: student.id }
                });
            } else {
                await sendFirstProjectCoachingJufoAlumniScreeningInvitationMail(student);
                await prisma.student.update({
                    data: { lastSentJufoAlumniScreeningInvitationDate: new Date() },
                    where: { id: student.id }
                });
            }
        }

        return true;
    }


    @Mutation(returns => Boolean)
    @Authorized(Role.PUPIL)
    async meBecomeProjectCoachee(@Ctx() context: GraphQLContext, @Arg("data") data: BecomeProjectCoacheeInput) {
        const pupil = await getSessionPupil(context);

        if (pupil.isProjectCoachee) {
            throw new Error(`Pupil is already project coachee`);
        }

        const { isJufoParticipant, projectFields, projectMemberCount } = data;

        await prisma.pupil.update({
            data: {
                isProjectCoachee: true,
                isJufoParticipant,
                projectFields: projectFields as pupil_projectfields_enum[],
                projectMemberCount
            },
            where: { id: pupil.id }
        });

        return true;
    }

    @Mutation(returns => Boolean)
    @Authorized(Role.PUPIL)
    async meBecomeTutee(@Ctx() context: GraphQLContext) {
        const pupil = await getSessionPupil(context);

        throw new Error(`Not implemented.`); // TODO: implement

        return true;
    }

    @Mutation(returns => Boolean)
    @Authorized(Role.PUPIL)
    async meBecomeStatePupil(@Ctx() context: GraphQLContext) {
        const pupil = await getSessionPupil(context);

        throw new Error(`Not implemented.`); // TODO: Implement
    }

    @Mutation(returns => Boolean)
    @Authorized(Role.UNAUTHENTICATED)
    @RateLimit("Email Availability", 50 /* requests per */, 5 * 60 * 60 * 1000 /* 5 hours */)
    async isEmailAvailable(@Arg("email") email: string) {
        return await isEmailAvailable(email);
    }

}