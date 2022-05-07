import { prisma } from "../../common/prisma";
import { Resolver, Mutation, Root, Arg, Authorized, Ctx, InputType } from "type-graphql";
import * as GraphQLModel from "../generated/models";
import { AuthorizedDeferred, hasAccess, Role } from "../authorizations";
import * as TypeGraphQL from "type-graphql";
import { course_category_enum } from "@prisma/client";
import { getLogger } from "log4js";
import { getSessionStudent } from "../authentication";
import { GraphQLContext } from "../context";
import { getCourse, getStudent, getSubcourse } from "../util";
import { ForbiddenError } from "apollo-server-express";
import { fillSubcourse } from "../../common/courses/participants";

@InputType()
class PublicCourseCreateInput {
  @TypeGraphQL.Field(_type => String)
  name!: string;
  @TypeGraphQL.Field(_type => String)
  outline!: string;
  @TypeGraphQL.Field(_type => String)
  description!: string;
  // @TypeGraphQL.Field(_type => String, {
  //   nullable: true
  // })
  // image?: string | undefined;
  @TypeGraphQL.Field(_type => course_category_enum)
  category!: "revision" | "club" | "coaching";
  @TypeGraphQL.Field(_type => Boolean)
  allowContact?: boolean;
}

@InputType()
class PublicCourseEditInput {
  @TypeGraphQL.Field(_type => String, { nullable: true })
  name?: string;
  @TypeGraphQL.Field(_type => String, { nullable: true })
  outline?: string;
  @TypeGraphQL.Field(_type => String, { nullable: true })
  description?: string;
  // @TypeGraphQL.Field(_type => String, {
  //   nullable: true
  // })
  // image?: string | undefined;
  @TypeGraphQL.Field(_type => course_category_enum, { nullable: true })
  category?: "revision" | "club" | "coaching";
  @TypeGraphQL.Field(_type => Boolean, { nullable: true })
  allowContact?: boolean | undefined;
}

@InputType()
class PublicSubcourseCreateInput {
  @TypeGraphQL.Field(_type => TypeGraphQL.Int)
  minGrade!: number;
  @TypeGraphQL.Field(_type => TypeGraphQL.Int)
  maxGrade!: number;
  @TypeGraphQL.Field(_type => TypeGraphQL.Int)
  maxParticipants!: number;
  @TypeGraphQL.Field(_type => Boolean)
  joinAfterStart!: boolean;
  @TypeGraphQL.Field(_type => [PublicLectureInput], { nullable: true })
  lecture?: PublicLectureInput[];
}

@InputType()
class PublicLectureInput {
  @TypeGraphQL.Field(_type => Date)
  start!: Date;
  @TypeGraphQL.Field(_type => TypeGraphQL.Int)
  duration!: number;
  @TypeGraphQL.Field(_type => TypeGraphQL.Int, { nullable: true })
  instructorId?: number | null;
}

const logger = getLogger("MutateCourseResolver");


@Resolver((of) => GraphQLModel.Course)
export class MutateCourseResolver {
    @Mutation((returns) => GraphQLModel.Course)
    @Authorized(Role.ADMIN, Role.INSTRUCTOR)
    async courseCreate(@Ctx() context: GraphQLContext, @Arg("course") course: PublicCourseCreateInput, @Arg("studentId", { nullable: true }) studentId?: number): Promise<GraphQLModel.Course> {
        const student = await getSessionStudent(context, studentId);
        const result = await prisma.course.create({ data: { ...course, courseState: "created" } });
        await prisma.course_instructors_student.create({data: { courseId: result.id, studentId: student.id}});
        logger.info(`Course (${result.id}) created by Student (${student.id})`);
        return result;
    }

    @Mutation((returns) => GraphQLModel.Course)
    @AuthorizedDeferred(Role.ADMIN, Role.OWNER)
    async courseEdit(@Ctx() context: GraphQLContext, @Arg("courseId")courseId: number, @Arg("course") data: PublicCourseEditInput): Promise<GraphQLModel.Course> {
        const course = await getCourse(courseId);
        await hasAccess(context, "Course", course);
        const result = await prisma.course.update({ data, where: {id: courseId}});
        logger.info(`Course (${result.id}) updated by Student (${context.user.studentId})`);
        return result;
    }

    @Mutation((returns) => Boolean)
    @Authorized(Role.ADMIN)
    async courseAddInstructor(@Arg("courseId") courseId: number, @Arg("studentId") studentId: number): Promise<boolean> {
        await getCourse(courseId);
        await getStudent(studentId);
        await prisma.course_instructors_student.create({data: { courseId, studentId}});
        logger.info(`Student (${studentId}) was added as an instructor to course ${courseId}`);
        return true;
    }

    @Mutation((returns) => Boolean)
    @Authorized(Role.ADMIN)
    async courseDeleteInstructor(@Arg("courseId") courseId: number, @Arg("studentId") studentId: number): Promise<boolean> {
        await getCourse(courseId);
        await getStudent(studentId);
        await prisma.course_instructors_student.delete({where: { courseId_studentId: {courseId, studentId}}});
        logger.info(`Student (${studentId}) was deleted from course ${courseId}`);
        return true;
    }
    @Mutation((returns) => Boolean)
    @AuthorizedDeferred(Role.ADMIN, Role.OWNER)
    async courseSubmit(@Ctx() context: GraphQLContext, @Arg("courseId") courseId: number): Promise<boolean> {
        const course = await getCourse(courseId);
        await hasAccess(context, "Course", course);
        await prisma.course.update({ data: { courseState: "submitted"}, where: { id: courseId}});
        logger.info(`Course (${courseId}) submitted by Student (${context.user.studentId})`);
        return true;
    }

    @Mutation((returns) => Boolean)
    @Authorized(Role.ADMIN)
    async courseAllow(@Arg("courseId") courseId: number, @Arg("screeningComment", { nullable: true }) screeningComment?: string | null): Promise<boolean> {
        await getCourse(courseId);
        await prisma.course.update({data: {screeningComment, courseState: "allowed"}, where: {id: courseId}});
        logger.info(`Admin allowed (approved) course ${courseId} with screening comment: ${screeningComment}`);
        return true;
    }

    @Mutation((returns) => GraphQLModel.Subcourse)
    @AuthorizedDeferred(Role.ADMIN, Role.OWNER)
    async subcourseCreate(@Ctx() context: GraphQLContext, @Arg("courseId") courseId: number, @Arg("subcourse") subcourse: PublicSubcourseCreateInput, @Arg("studentId", { nullable: true }) studentId?: number): Promise<GraphQLModel.Subcourse> {
        const course = await getCourse(courseId);
        await hasAccess(context, "Course", course);
        if (course.courseState !== "allowed") {
            throw new Error(`Course (${courseId}) not allowed (approved) yet`);
        }
        const student = await getSessionStudent(context, studentId);
        const result = await prisma.subcourse.create({ data: { ...subcourse, courseId, published: false}});
        await prisma.subcourse_instructors_student.create({data: { subcourseId: result.id, studentId: student.id}});
        logger.info(`Subcourse ${result.id} was created on course ${courseId}`);
        return result;
    }

    @Mutation((returns) => Boolean)
    @AuthorizedDeferred(Role.ADMIN, Role.OWNER)
    async subcoursePublish(@Ctx() context: GraphQLContext, @Arg("subcourseId") subcourseId: number): Promise<Boolean> {
        const subcourse = await getSubcourse(subcourseId);
        await hasAccess(context, "Subcourse", subcourse);

        const lectures = await prisma.lecture.findMany({where: {subcourseId}});
        if (lectures.length == 0) {
            throw new Error(`Subcourse (${subcourseId}) must have at least one lecture to be published`);
        }
        let currentDate = new Date();
        const pastLectures = lectures.filter(lecture => +lecture.start < +currentDate);
        if (pastLectures.length != 0) {
            throw new Error(`Lectures (${pastLectures.toString()}) of subcourse (${subcourseId}) must happen in the future.`);
        }
        await prisma.subcourse.update({data: { published: true }, where: { id: subcourseId}});
        logger.info(`Subcourse (${subcourseId}) was published`);
        return true;
    }

    @Mutation((returns) => Boolean)
    @AuthorizedDeferred(Role.ADMIN, Role.OWNER)
    async subcourseFill(@Ctx() context: GraphQLContext, @Arg("subcourseId") subcourseId: number) {
        const subcourse = await getSubcourse(subcourseId);
        await hasAccess(context, "Subcourse", subcourse);

        await fillSubcourse(subcourse);
        return true;
    }
}
