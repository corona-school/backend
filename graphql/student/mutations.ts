import * as GraphQLModel from '../generated/models';
import { Role } from '../authorizations';
import { ensureNoNull, getStudent } from '../util';
import { deactivateStudent } from '../../common/student/activation';
import { canStudentRequestMatch, createStudentMatchRequest, deleteStudentMatchRequest } from '../../common/match/request';
import { getSessionScreener, getSessionStudent, isElevated, updateSessionUser } from '../authentication';
import { GraphQLContext } from '../context';
import { Arg, Authorized, Ctx, Field, InputType, Int, Mutation, ObjectType, Resolver } from 'type-graphql';
import { prisma } from '../../common/prisma';
import { addInstructorScreening, addTutorScreening } from '../../common/student/screening';
import { becomeTutor, ProjectFieldWithGradeData, registerStudent } from '../../common/student/registration';
import { Subject } from '../types/subject';
import {
    pupil_projectfields_enum as ProjectField,
    pupil_registrationsource_enum as RegistrationSource,
    student as Student,
    student_state_enum as State,
} from '@prisma/client';
import { setProjectFields } from '../../common/student/update';
import { PrerequisiteError } from '../../common/util/error';
import { toStudentSubjectDatabaseFormat } from '../../common/util/subjectsutils';
import { logInContext } from '../logging';
import { userForStudent } from '../../common/user';
import { MaxLength } from 'class-validator';
import { BecomeTutorInput, RegisterStudentInput } from '../me/mutation';

@InputType('Instructor_screeningCreateInput', {
    isAbstract: true,
})
export class ScreeningInput {
    @Field((_type) => Boolean, {
        nullable: false,
    })
    success!: boolean;

    @Field((_type) => String, {
        nullable: true,
    })
    comment?: string | undefined;

    @Field((_type) => String, {
        nullable: true,
    })
    knowsCoronaSchoolFrom?: string | undefined;
}

@ObjectType()
class StudentRegisterPlusManyOutput {
    @Field((_type) => String, { nullable: true })
    email: string;

    @Field((_type) => Boolean, { nullable: false })
    success: boolean;
}

@InputType()
class StudentRegisterPlusInput {
    @Field((type) => RegisterStudentInput, { nullable: true })
    register: RegisterStudentInput;

    @Field((type) => BecomeTutorInput, { nullable: true })
    activate: BecomeTutorInput;

    @Field((type) => ScreeningInput, { nullable: true })
    screen: ScreeningInput;
}

@InputType()
class StudentRegisterPlusManyInput {
    @Field((type) => [StudentRegisterPlusInput], { nullable: true })
    entries: StudentRegisterPlusInput[];
}

@InputType()
export class ProjectFieldWithGradeInput implements ProjectFieldWithGradeData {
    @Field((type) => ProjectField)
    projectField: ProjectField;
    @Field((type) => Int, { nullable: true })
    min: number;
    @Field((type) => Int, { nullable: true })
    max: number;
}

@InputType()
export class StudentUpdateInput {
    @Field((type) => String, { nullable: true })
    firstname?: string;

    @Field((type) => String, { nullable: true })
    lastname?: string;

    @Field((type) => String, { nullable: true })
    email?: string;

    @Field((type) => [Subject], { nullable: true })
    subjects?: Subject[];

    @Field((type) => [ProjectFieldWithGradeInput], { nullable: true })
    projectFields: ProjectFieldWithGradeInput[];

    @Field((type) => RegistrationSource, { nullable: true })
    registrationSource?: RegistrationSource;

    @Field((type) => State, { nullable: true })
    state?: State;

    @Field((type) => String, { nullable: true })
    @MaxLength(500)
    aboutMe?: string;
}

export async function updateStudent(context: GraphQLContext, student: Student, update: StudentUpdateInput) {
    const log = logInContext('Student', context);
    const { firstname, lastname, email, projectFields, subjects, registrationSource, state, aboutMe } = update;

    if (projectFields && !student.isProjectCoach) {
        throw new PrerequisiteError(`Only project coaches can set the project fields`);
    }

    if (registrationSource != undefined && !isElevated(context)) {
        throw new PrerequisiteError(`RegistrationSource may only be changed by elevated users`);
    }

    if (email != undefined && !isElevated(context)) {
        throw new PrerequisiteError(`Only Admins may change the email without verification`);
    }

    if (projectFields) {
        await setProjectFields(student, projectFields);
    }

    const res = await prisma.student.update({
        data: {
            firstname: ensureNoNull(firstname),
            lastname: ensureNoNull(lastname),
            email: ensureNoNull(email),
            subjects: subjects ? JSON.stringify(subjects.map(toStudentSubjectDatabaseFormat)) : undefined,
            registrationSource: ensureNoNull(registrationSource),
            state: ensureNoNull(state),
            aboutMe: ensureNoNull(aboutMe),
        },
        where: { id: student.id },
    });

    // The email, firstname or lastname might have changed, so it is a good idea to refresh the session
    await updateSessionUser(context, userForStudent(res));

    log.info(`Student(${student.id}) updated their account with ${JSON.stringify(update)}`);
}

async function studentRegisterPlus(data: StudentRegisterPlusInput, ctx: GraphQLContext): Promise<boolean> {
    const log = logInContext('Student', ctx);
    const { register, activate, screen } = data;
    const screener = await getSessionScreener(ctx);

    const existingAccount = await prisma.student.findUnique({ where: { email: register.email } });
    let doRegister = register != null;
    let doActivate = activate != null;
    let doScreen = screen != null;

    if (doRegister && existingAccount) {
        log.info(`Account with email ${register.email} already exists, skipping registration phase`);
        doRegister = false;
    } else if (!register && !existingAccount) {
        throw new PrerequisiteError(`Account with email ${register.email} doesn't exist and no registration data was provided`);
    }

    if (activate && existingAccount?.isStudent) {
        log.info(`Account with email ${register.email} is already active, skipping activation phase`);
        doActivate = false;
    }

    if (existingAccount && (await canStudentRequestMatch(existingAccount))) {
        log.info(`Account with email ${register.email} is already screened, skipping screening phase`);
        doScreen = false;
    }

    try {
        await prisma.$transaction(async (prisma) => {
            let student;
            if (doRegister) {
                student = await registerStudent(register);
            } else {
                student = existingAccount;
            }

            if (doActivate) {
                await becomeTutor(student, activate);
            }

            if (doScreen) {
                await addTutorScreening(screener, student, screen);
            }
        });
    } catch (e) {
        log.error(`Error while registering student ${register.email}, skipping this one`, e);
        return false;
    }
    return true;
}

@Resolver((of) => GraphQLModel.Student)
export class MutateStudentResolver {
    @Mutation((returns) => Boolean)
    @Authorized(Role.STUDENT, Role.ADMIN)
    async studentUpdate(@Ctx() context: GraphQLContext, @Arg('data') data: StudentUpdateInput, @Arg('studentId', { nullable: true }) studentId?: number) {
        const student = await getSessionStudent(context, studentId);
        await updateStudent(context, student, data);
        return true;
    }

    @Mutation((returns) => Boolean)
    @Authorized(Role.ADMIN)
    async studentDeactivate(@Arg('studentId') studentId: number): Promise<boolean> {
        const student = await getStudent(studentId);
        await deactivateStudent(student);
        return true;
    }

    @Mutation((returns) => Boolean)
    @Authorized(Role.ADMIN, Role.TUTOR)
    async studentCreateMatchRequest(@Ctx() context: GraphQLContext, @Arg('studentId', { nullable: true }) studentId?: number): Promise<boolean> {
        const student = await getSessionStudent(context, /* elevated override */ studentId);

        await createStudentMatchRequest(student, isElevated(context));

        return true;
    }

    @Mutation((returns) => Boolean)
    @Authorized(Role.ADMIN, Role.TUTOR)
    async studentDeleteMatchRequest(@Ctx() context: GraphQLContext, @Arg('studentId', { nullable: true }) studentId?: number): Promise<boolean> {
        const student = await getSessionStudent(context, /* elevated override */ studentId);
        await deleteStudentMatchRequest(student);

        return true;
    }

    @Mutation((returns) => Boolean)
    @Authorized(Role.ADMIN, Role.SCREENER)
    async studentInstructorScreeningCreate(@Ctx() context: GraphQLContext, @Arg('studentId') studentId: number, @Arg('screening') screening: ScreeningInput) {
        const student = await getStudent(studentId);
        const screener = await getSessionScreener(context);
        await addInstructorScreening(screener, student, screening);
        return true;
    }

    @Mutation((returns) => Boolean)
    @Authorized(Role.ADMIN, Role.SCREENER)
    async studentTutorScreeningCreate(@Ctx() context: GraphQLContext, @Arg('studentId') studentId: number, @Arg('screening') screening: ScreeningInput) {
        const student = await getStudent(studentId);
        const screener = await getSessionScreener(context);
        await addTutorScreening(screener, student, screening);
        return true;
    }

    @Mutation((returns) => [StudentRegisterPlusManyOutput])
    @Authorized(Role.ADMIN, Role.SCREENER)
    async studentRegisterPlusMany(@Ctx() context: GraphQLContext, @Arg('data') data: StudentRegisterPlusManyInput) {
        const { entries } = data;
        const results = [];
        for (const entry of entries) {
            const res = await studentRegisterPlus(entry, context);
            results.push({ email: entry.register.email, success: res });
        }
        return results;
    }
}
