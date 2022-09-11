import * as GraphQLModel from '../generated/models';
import { Role } from '../authorizations';
import { getStudent } from '../util';
import { deactivateStudent } from '../../common/student/activation';
import { deleteStudentMatchRequest, createStudentMatchRequest } from '../../common/match/request';
import { isElevated, getSessionStudent, getSessionScreener } from '../authentication';
import { GraphQLContext } from '../context';
import { Arg, Authorized, Ctx, Mutation, Resolver, InputType, Field, Int } from 'type-graphql';
import { prisma } from '../../common/prisma';
import { addInstructorScreening, addTutorScreening } from '../../common/student/screening';
import { ProjectFieldWithGradeData } from '../../common/student/registration';
import { Subject } from '../types/subject';
import { student as Student, pupil_registrationsource_enum as RegistrationSource, pupil_projectfields_enum as ProjectField } from '@prisma/client';
import { setProjectFields } from '../../common/student/update';
import { PrerequisiteError } from '../../common/util/error';
import { toStudentSubjectDatabaseFormat } from '../../common/util/subjectsutils';
import { logInContext } from '../logging';

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

    @Field((type) => [Subject], { nullable: true })
    subjects?: Subject[];

    @Field((type) => [ProjectFieldWithGradeInput], { nullable: true })
    projectFields: ProjectFieldWithGradeInput[];

    @Field((type) => RegistrationSource, { nullable: true })
    registrationSource?: RegistrationSource;
}

export async function updateStudent(context: GraphQLContext, student: Student, update: StudentUpdateInput) {
    const log = logInContext('Student', context);
    const { firstname, lastname, projectFields, subjects, registrationSource } = update;

    if (projectFields && !student.isProjectCoach) {
        throw new PrerequisiteError(`Only project coaches can set the project fields`);
    }

    if (registrationSource != undefined && !isElevated(context)) {
        throw new PrerequisiteError(`RegistrationSource may only be changed by elevated users`);
    }

    if (projectFields) {
        await setProjectFields(student, projectFields);
    }

    await prisma.student.update({
        data: {
            firstname,
            lastname,
            subjects: subjects ? JSON.stringify(subjects.map(toStudentSubjectDatabaseFormat)) : undefined,
            registrationSource,
        },
        where: { id: student.id },
    });

    log.info(`Student(${student.id}) updated their account with ${JSON.stringify(update)}`);
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
}
