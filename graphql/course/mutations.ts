import { course_category_enum } from '@prisma/client';
import { getLogger } from 'log4js';
import * as TypeGraphQL from 'type-graphql';
import { Arg, Authorized, Ctx, InputType, Mutation, Resolver } from 'type-graphql';
import { prisma } from '../../common/prisma';
import { getSessionStudent } from '../authentication';
import { AuthorizedDeferred, hasAccess, Role } from '../authorizations';
import { GraphQLContext } from '../context';
import * as GraphQLModel from '../generated/models';
import { getCourse, getStudent } from '../util';

@InputType()
class PublicCourseCreateInput {
    @TypeGraphQL.Field((_type) => String)
    name!: string;
    @TypeGraphQL.Field((_type) => String)
    outline!: string;
    @TypeGraphQL.Field((_type) => String)
    description!: string;
    // @TypeGraphQL.Field(_type => String, {
    //   nullable: true
    // })
    // image?: string | undefined;
    @TypeGraphQL.Field((_type) => course_category_enum)
    category!: 'revision' | 'club' | 'coaching';
    @TypeGraphQL.Field((_type) => Boolean)
    allowContact?: boolean;
}

@InputType()
class PublicCourseEditInput {
    @TypeGraphQL.Field((_type) => String, { nullable: true })
    name?: string;
    @TypeGraphQL.Field((_type) => String, { nullable: true })
    outline?: string;
    @TypeGraphQL.Field((_type) => String, { nullable: true })
    description?: string;
    // @TypeGraphQL.Field(_type => String, {
    //   nullable: true
    // })
    // image?: string | undefined;
    @TypeGraphQL.Field((_type) => course_category_enum, { nullable: true })
    category?: 'revision' | 'club' | 'coaching';
    @TypeGraphQL.Field((_type) => Boolean, { nullable: true })
    allowContact?: boolean | undefined;
}

const logger = getLogger('MutateCourseResolver');

@Resolver((of) => GraphQLModel.Course)
export class MutateCourseResolver {
    @Mutation((returns) => GraphQLModel.Course)
    @Authorized(Role.ADMIN, Role.INSTRUCTOR)
    async courseCreate(
        @Ctx() context: GraphQLContext,
        @Arg('course') course: PublicCourseCreateInput,
        @Arg('studentId', { nullable: true }) studentId?: number
    ): Promise<GraphQLModel.Course> {
        const student = await getSessionStudent(context, studentId);
        const result = await prisma.course.create({ data: { ...course, courseState: 'created' } });
        await prisma.course_instructors_student.create({ data: { courseId: result.id, studentId: student.id } });
        logger.info(`Course (${result.id}) created by Student (${student.id})`);
        return result;
    }

    @Mutation((returns) => GraphQLModel.Course)
    @AuthorizedDeferred(Role.ADMIN, Role.OWNER)
    async courseEdit(
        @Ctx() context: GraphQLContext,
        @Arg('courseId') courseId: number,
        @Arg('course') data: PublicCourseEditInput
    ): Promise<GraphQLModel.Course> {
        const course = await getCourse(courseId);
        await hasAccess(context, 'Course', course);
        const result = await prisma.course.update({ data, where: { id: courseId } });
        logger.info(`Course (${result.id}) updated by Student (${context.user.studentId})`);
        return result;
    }

    @Mutation((returns) => Boolean)
    @Authorized(Role.ADMIN)
    async courseAddInstructor(@Arg('courseId') courseId: number, @Arg('studentId') studentId: number): Promise<boolean> {
        await getCourse(courseId);
        await getStudent(studentId);
        await prisma.course_instructors_student.create({ data: { courseId, studentId } });
        logger.info(`Student (${studentId}) was added as an instructor to course ${courseId}`);
        return true;
    }

    @Mutation((returns) => Boolean)
    @Authorized(Role.ADMIN)
    async courseDeleteInstructor(@Arg('courseId') courseId: number, @Arg('studentId') studentId: number): Promise<boolean> {
        await getCourse(courseId);
        await getStudent(studentId);
        await prisma.course_instructors_student.delete({ where: { courseId_studentId: { courseId, studentId } } });
        logger.info(`Student (${studentId}) was deleted from course ${courseId}`);
        return true;
    }
    @Mutation((returns) => Boolean)
    @AuthorizedDeferred(Role.ADMIN, Role.OWNER)
    async courseSubmit(@Ctx() context: GraphQLContext, @Arg('courseId') courseId: number): Promise<boolean> {
        const course = await getCourse(courseId);
        await hasAccess(context, 'Course', course);
        await prisma.course.update({ data: { courseState: 'submitted' }, where: { id: courseId } });
        logger.info(`Course (${courseId}) submitted by Student (${context.user.studentId})`);
        return true;
    }

    @Mutation((returns) => Boolean)
    @Authorized(Role.ADMIN)
    async courseAllow(@Arg('courseId') courseId: number, @Arg('screeningComment', { nullable: true }) screeningComment?: string | null): Promise<boolean> {
        await getCourse(courseId);
        await prisma.course.update({ data: { screeningComment, courseState: 'allowed' }, where: { id: courseId } });
        logger.info(`Admin allowed (approved) course ${courseId} with screening comment: ${screeningComment}`);
        return true;
    }
}
