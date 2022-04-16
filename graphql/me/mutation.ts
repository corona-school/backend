import { Role } from "../authorizations";
import { Arg, Authorized, Ctx, Field, InputType, Int, Mutation, Resolver } from "type-graphql";
import { Me } from "./fields";
import { GraphQLContext } from "../context";
import { getSessionPupil, getSessionStudent, getSessionUser, isSessionPupil, isSessionStudent, logInAsPupil, logInAsStudent } from "../authentication";
import { prisma } from "../../common/prisma";
import { activatePupil, deactivatePupil } from "../../common/pupil/activation";
import { setProjectFields } from "../../common/student/update";
import {
    pupil_learninggermansince_enum as LearningGermanSince,
    pupil_languages_enum as Language,
    pupil_projectfields_enum as ProjectField,
    project_field_with_grade_restriction as ProjectFieldWithGrade,
    pupil_registrationsource_enum as RegistrationSource,
    pupil_schooltype_enum as SchoolType,
    pupil_state_enum as State,
    student_module_enum as TeacherModule
} from "@prisma/client";
import { MaxLength } from "class-validator";
import { TuteeJufoParticipationIndication, TutorJufoParticipationIndication } from "../../common/jufo/participationIndication";
import { School } from "../../common/entity/School";
import { RateLimit } from "../rate-limit";
import { becomeInstructor, BecomeInstructorData, becomeProjectCoach, BecomeProjectCoachData, becomeTutor, BecomeTutorData, ProjectFieldWithGradeData, registerStudent, RegisterStudentData } from "../../common/student/registration";
import { becomeProjectCoachee, BecomeProjectCoacheeData, becomeStatePupil, BecomeStatePupilData, becomeTutee, BecomeTuteeData, registerPupil, RegisterPupilData } from "../../common/pupil/registration";
import { logInContext } from "../logging";
import { isEmailAvailable } from "../../common/user/email";
import "../types/enums";
import { Subject } from "../types/subject";
import { PrerequisiteError } from "../../common/util/error";
import { Pupil, Student } from "../generated";
import { UserInputError } from "apollo-server-express";
import { toPupilSubjectDatabaseFormat, toStudentSubjectDatabaseFormat } from "../../common/util/subjectsutils";
@InputType()
class ProjectFieldWithGradeInput implements ProjectFieldWithGradeData {
    @Field(type => ProjectField)
    projectField: ProjectField;
    @Field(type => Int, { nullable: true })
    min: number;
    @Field(type => Int, { nullable: true })
    max: number;
}

@InputType()
class RegisterStudentInput implements RegisterStudentData {
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
class RegisterPupilInput implements RegisterPupilData {
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

    @Field(type => Int, { nullable: true })
    schoolId?: School["id"];

    @Field(type => SchoolType, { nullable: true })
    schooltype?: SchoolType;

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

    @Field(type => [String], { nullable: true })
    subjects?: string[];

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
class BecomeInstructorInput implements BecomeInstructorData {
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
class BecomeTutorInput implements BecomeTutorData {
    @Field(type => [Subject])
    subjects: Subject[];

    @Field(type => [Language])
    languages: Language[];

    @Field(type => Boolean)
    supportsInDaZ: boolean;
}

@InputType()
class BecomeProjectCoachInput implements BecomeProjectCoachData {
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
class BecomeProjectCoacheeInput implements BecomeProjectCoacheeData {
    @Field(type => [ProjectField])
    projectFields: ProjectField[];

    @Field(type => Boolean)
    isJufoParticipant: TuteeJufoParticipationIndication;

    @Field(type => Int)
    projectMemberCount: number;
}

@InputType()
class BecomeTuteeInput implements BecomeTuteeData {
    @Field(type => [Subject])
    subjects: Subject[];

    @Field(type => [Language])
    languages: Language[];

    @Field(type => LearningGermanSince, { nullable: true })
    learningGermanSince?: LearningGermanSince;

    @Field(type => Int)
    gradeAsInt: number;
}

@InputType()
class BecomeStatePupilInput implements BecomeStatePupilData {
    @Field(type => String)
    teacherEmail: string;
    @Field(type => Int, { nullable: true })
    gradeAsInt?: number;
}



@Resolver(of => Me)
export class MutateMeResolver {
    @Mutation(returns => Student)
    @Authorized(Role.UNAUTHENTICATED, Role.ADMIN)
    // @RateLimit("RegisterStudent", 10 /* requests per */, 5 * 60 * 60 * 1000 /* 5 hours */)
    async meRegisterStudent(@Ctx() context: GraphQLContext, @Arg("data") data: RegisterStudentInput) {
        const byAdmin = context.user!.roles.includes(Role.ADMIN);

        if (data.registrationSource === RegistrationSource.plus && !byAdmin) {
            throw new UserInputError("Lern-Fair Plus pupils may only be registered by admins");
        }

        const student = await registerStudent(data);
        const log = logInContext("Me", context);
        log.info(`Student(${student.id}, firstname = ${student.firstname}, lastname = ${student.lastname}) registered`);

        if (!byAdmin) {
            await logInAsStudent(student, context);
        }

        return student;

        /* The student can now use the authToken passed to them via E-Mail to re authenticate the session and have their E-Mail verified
           This session now also has the STUDENT role.
           With this role, they can use the meBecomeTutor, meBecomeInstructor or meBecomeProjectCoach to enhance their user account.
           With the STUDENT Role alone they can't do much (but at least deactivate their account and change their settings) */
    }

    @Mutation(returns => Pupil)
    @Authorized(Role.UNAUTHENTICATED, Role.ADMIN)
    // @RateLimit("RegisterPupil", 10 /* requests per */, 5 * 60 * 60 * 1000 /* 5 hours */)
    async meRegisterPupil(@Ctx() context: GraphQLContext, @Arg("data") data: RegisterPupilInput) {
        const byAdmin = context.user!.roles.includes(Role.ADMIN);

        if (data.registrationSource === RegistrationSource.plus && !byAdmin) {
            throw new UserInputError("Lern-Fair Plus pupils may only be registered by admins");
        }

        const pupil = await registerPupil(data);
        const log = logInContext("Me", context);
        log.info(`Pupil(${pupil.id}, firstname = ${pupil.firstname}, lastname = ${pupil.lastname}) registered`);

        if (!byAdmin) {
            await logInAsPupil(pupil, context);
        }

        return pupil;

        /* The pupil can now use the authToken passed to them via E-Mail to re authenticate the session.
           This will mark them as verified, and grant them the PUPIL role.
           With this role, they can use the meBecomeStatePupil, meBecomeTutee or meBecomeProjectCoachee to enhance their user account */
    }

    @Mutation(returns => Boolean)
    @Authorized(Role.USER)
    async meUpdate(@Ctx() context: GraphQLContext, @Arg("update") update: MeUpdateInput) {
        const log = logInContext("Me", context);

        const { firstname, lastname, pupil, student } = update;

        if (isSessionPupil(context)) {
            const prevPupil = await getSessionPupil(context);

            if (student) {
                throw new PrerequisiteError(`Tried to update student data on a pupil`);
            }

            const { subjects, gradeAsInt, projectFields } = pupil;

            if (projectFields && !prevPupil.isProjectCoachee) {
                throw new PrerequisiteError(`Only project coachees can set the project fields`);
            }

            await prisma.pupil.update({
                data: {
                    firstname,
                    lastname,
                    // TODO: Store numbers as numbers maybe ...
                    grade: `${gradeAsInt}. Klasse`,
                    subjects: JSON.stringify(subjects.map(name => toPupilSubjectDatabaseFormat({ name }))),
                    projectFields
                },
                where: { id: prevPupil.id }
            });

            log.info(`Pupil(${prevPupil.id}) updated their account with ${JSON.stringify(update)}`);

            return true;
        }

        if (isSessionStudent(context)) {
            const prevStudent = await getSessionStudent(context);

            if (pupil) {
                throw new PrerequisiteError(`Tried to update pupil data on student`);
            }

            const { projectFields, subjects } = student;

            if (projectFields && !prevStudent.isProjectCoach) {
                throw new PrerequisiteError(`Only project coaches can set the project fields`);
            }

            if (projectFields) {
                await setProjectFields(prevStudent, projectFields);
            }

            await prisma.student.update({
                data: {
                    firstname,
                    lastname,
                    subjects: JSON.stringify(subjects.map(toStudentSubjectDatabaseFormat))
                },
                where: { id: prevStudent.id }
            });

            log.info(`Student(${prevStudent.id}) updated their account with ${JSON.stringify(update)}`);
            return true;
        }

        throw new Error(`This mutation is currently not supported for this user type`);
    }


    @Mutation(returns => Boolean)
    @Authorized(Role.USER)
    async meDeactivate(@Ctx() context: GraphQLContext) {
        const log = logInContext("Me", context);

        if (isSessionPupil(context)) {
            const pupil = await getSessionPupil(context);
            const updatedPupil = await deactivatePupil(pupil);
            await logInAsPupil(updatedPupil, context);
            log.info(`Pupil(${pupil.id}) deactivated their account`);

            return true;
        }

        // TODO: Student deactivation

        throw new Error(`This mutation is currently not supported for this user type`);
    }

    @Mutation(returns => Boolean)
    @Authorized(Role.USER)
    async meActivate(@Ctx() context: GraphQLContext) {
        const log = logInContext("Me", context);

        if (isSessionPupil(context)) {
            const pupil = await getSessionPupil(context);
            const updatedPupil = await activatePupil(pupil);
            await logInAsPupil(updatedPupil, context);
            log.info(`Pupil(${pupil.id}) reactivated their account`);

            return true;
        }

        // TODO: Student activation

        throw new Error(`This mutation is currently not supported for this user type`);
    }

    @Mutation(returns => Boolean)
    @Authorized(Role.STUDENT)
    async meBecomeInstructor(@Ctx() context: GraphQLContext, @Arg("data") data: BecomeInstructorInput) {
        const student = await getSessionStudent(context);
        const log = logInContext("Me", context);

        await becomeInstructor(student, data);
        log.info(`Student(${student.id}) requested to become an instructor`);

        // After successful screening and re authentication, the user will receive the INSTRUCTOR role

        return true;
    }

    @Mutation(returns => Boolean)
    @Authorized(Role.STUDENT, Role.ADMIN)
    async meBecomeTutor(@Ctx() context: GraphQLContext, @Arg("data") data: BecomeTutorInput, @Arg("studentId", { nullable: true}) studentId: number) {
        const student = await getSessionStudent(context, studentId);
        const log = logInContext("Me", context);

        await becomeTutor(student, data);

        log.info(`Student(${student.id}) requested to become a tutor`);

        // After successful screening and re authentication, the user will receive the TUTOR role

        return true;
    }

    @Mutation(returns => Boolean)
    @Authorized(Role.STUDENT, Role.ADMIN)
    async meBecomeProjectCoach(@Ctx() context: GraphQLContext, data: BecomeProjectCoachInput, @Arg("studentId", { nullable: true}) studentId: number) {
        const student = await getSessionStudent(context, studentId);
        const log = logInContext("Me", context);

        await becomeProjectCoach(student, data);

        log.info(`Student(${student.id}) requested to become a project coach`);

        // After successful screening and re authentication, the user will receive the PROJECT_COACH role

        return true;
    }


    @Mutation(returns => Boolean)
    @Authorized(Role.PUPIL, Role.ADMIN)
    async meBecomeProjectCoachee(@Ctx() context: GraphQLContext, @Arg("data") data: BecomeProjectCoacheeInput, @Arg("pupilId", { nullable: true}) pupilId: number) {
        const pupil = await getSessionPupil(context, pupilId);
        const log = logInContext("Me", context);

        const updatedPupil = await becomeProjectCoachee(pupil, data);

        await logInAsPupil(updatedPupil, context);
        // The user should now have the PROJECT_COACHEE role

        log.info(`Pupil(${pupil.id}) upgraded their account to a PROJECT_COACHEE`);

        return true;
    }

    @Mutation(returns => Boolean)
    @Authorized(Role.PUPIL, Role.ADMIN)
    async meBecomeTutee(@Ctx() context: GraphQLContext, @Arg("data") data: BecomeTuteeInput, @Arg("pupilId", { nullable: true}) pupilId: number) {
        const byAdmin = context.user!.roles.includes(Role.ADMIN);

        const pupil = await getSessionPupil(context, pupilId);
        const log = logInContext("Me", context);
        const updatedPupil = await becomeTutee(pupil, data);
        if (!byAdmin) {
            await logInAsPupil(updatedPupil, context);
        }

        log.info(byAdmin ? `An admin upgraded the account of pupil(${pupil.id}) to a TUTEE` : `Pupil(${pupil.id}) upgraded their account to a TUTEE`);

        return true;
    }

    @Mutation(returns => Boolean)
    @Authorized(Role.PUPIL, Role.ADMIN)
    async meBecomeStatePupil(@Ctx() context: GraphQLContext, @Arg("data") data: BecomeStatePupilInput, @Arg("pupilId", { nullable: true}) pupilId: number) {
        const pupil = await getSessionPupil(context, pupilId);
        const log = logInContext("Me", context);

        const updatedPupil = await becomeStatePupil(pupil, data);
        await logInAsPupil(updatedPupil, context);

        log.info(`Pupil(${pupil.id}) upgraded their account to become a STATE_PUPIL`);

        return true;
    }

    @Mutation(returns => Boolean)
    @Authorized(Role.UNAUTHENTICATED)
    @RateLimit("Email Availability", 50 /* requests per */, 5 * 60 * 60 * 1000 /* 5 hours */)
    async isEmailAvailable(@Arg("email") email: string) {
        return await isEmailAvailable(email);
    }

}