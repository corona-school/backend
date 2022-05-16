import { prisma } from "../../common/prisma";
import { Resolver, Mutation, Root, Arg, Authorized, Ctx, InputType } from "type-graphql";
import * as GraphQLModel from "../generated/models";
import * as TypeGraphQL from "type-graphql";
import { AuthorizedDeferred, hasAccess, Role } from "../authorizations";
import { GraphQLContext } from "../context";
import { fillSubcourse } from "../../common/courses/participants";
import { getCourse, getStudent, getSubcourse, getLecture } from "../util";
import { getSessionStudent } from "../authentication";
import { getLogger } from "log4js";

const logger = getLogger("MutateCourseResolver");

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

@Resolver((of) => GraphQLModel.Subcourse)
export class MutateSubcourseResolver {
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
        if (pastLectures.length !== 0) {
            throw new Error(`Lectures (${pastLectures.toString()}) of subcourse (${subcourseId}) must happen in the future.`);
        }
        await prisma.subcourse.update({data: { published: true }, where: { id: subcourseId}});
        logger.info(`Subcourse (${subcourseId}) was published`);
        return true;
    }

    @Mutation((returns) => Boolean)
    @AuthorizedDeferred(Role.ADMIN, Role.OWNER)
    async subcourseFill(@Ctx() context: GraphQLContext, @Arg("subcourseId") subcourseId: number): Promise<Boolean> {
        const subcourse = await getSubcourse(subcourseId);
        await hasAccess(context, "Subcourse", subcourse);

        await fillSubcourse(subcourse);
        return true;
    }

    @Mutation((returns) => Boolean)
    @AuthorizedDeferred(Role.ADMIN, Role.OWNER)
    async subcourseCancel(@Ctx() context: GraphQLContext, @Arg("subcourseId") subcourseId: number): Promise<Boolean> {
        const subcourse = await getSubcourse(subcourseId);
        await hasAccess(context, "Subcourse", subcourse);
        await prisma.subcourse.update({ data: { cancelled: true }, where: { id: subcourse.id }});
        // TODO send emails
        return true;
    }

    @Mutation((returns) => GraphQLModel.Lecture)
    @AuthorizedDeferred(Role.ADMIN, Role.OWNER)
    async lectureCreate(@Ctx() context: GraphQLContext, @Arg("subcourseId") subcourseId: number, @Arg("lecture") lecture: PublicLectureInput/*, @Arg("studentId", { nullable: true }) studentId?: number*/): Promise<GraphQLModel.Lecture> {
        const subcourse = await getSubcourse(subcourseId);
        await hasAccess(context, "Subcourse", subcourse);

        let currentDate = new Date();
        if (+lecture.start < +currentDate) {
            throw new Error(`Inputed lecture of subcourse (${subcourseId}) must happen in the future.`);
        }
        // TODO add student to lecture_instructors. Need to create lecture instructor table
        // const student = await getSessionStudent(context, studentId);
        const result = await prisma.lecture.create({ data: { ...lecture, subcourseId }});
        // TODO send emails
        return result;
    }

    @Mutation((returns) => Boolean)
    @AuthorizedDeferred(Role.ADMIN, Role.OWNER)
    async lectureDelete(@Ctx() context: GraphQLContext, @Arg("lectureId") lectureId: number): Promise<Boolean> {
        const lecture = await getLecture(lectureId);
        // TODO Maybe access for instructors of lecture
        const subcourse = await getSubcourse(lecture.subcourseId);
        await hasAccess(context, "Subcourse", subcourse);

        await prisma.lecture.delete({ where: { id: lecture.id }});
        return true;
    }
}
