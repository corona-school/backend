import { prisma } from "../../common/prisma";
import { Resolver, Mutation, Root, Arg, Authorized, Ctx, InputType } from "type-graphql";
import * as GraphQLModel from "../generated/models";
import { AuthorizedDeferred, hasAccess, Role } from "../authorizations";
import * as TypeGraphQL from "type-graphql";
import { course_category_enum } from "@prisma/client";
import { getLogger } from "log4js";
import { getSessionStudent } from "../authentication";
import { GraphQLContext } from "../context";
import { getCourse, getStudent } from "../util";

@InputType()
class PublicCourseCreateInput {
  @TypeGraphQL.Field(_type => String, {
      nullable: false
  })
  name!: string;

  @TypeGraphQL.Field(_type => String, {
      nullable: false
  })
  outline!: string;

  @TypeGraphQL.Field(_type => String, {
      nullable: false
  })
  description!: string;

  // @TypeGraphQL.Field(_type => String, {
  //   nullable: true
  // })
  // image?: string | undefined;

  @TypeGraphQL.Field(_type => course_category_enum, {
      nullable: false
  })
  category!: "revision" | "club" | "coaching";

  @TypeGraphQL.Field(_type => Boolean, {
      nullable: true
  })
  allowContact?: boolean | undefined;

    // @TypeGraphQL.Field(_type => Course_tags_course_tagCreateNestedManyWithoutCourseInput, {
    //   nullable: true
    // })
    // tags?: Course_tags_course_tagCreateNestedManyWithoutCourseInput | undefined;
}

@InputType()
class PublicCourseEditInput {
  @TypeGraphQL.Field(_type => String, {
      nullable: false
  })
  name?: string;

  @TypeGraphQL.Field(_type => String, {
      nullable: false
  })
  outline?: string;

  @TypeGraphQL.Field(_type => String, {
      nullable: false
  })
  description?: string;

  // @TypeGraphQL.Field(_type => Course_instructors_studentUpdateManyWithoutCourseInput, {
  //     nullable: true
  // })
  // course_instructors_student?: Course_instructors_studentUpdateManyWithoutCourseInput | undefined;

  // @TypeGraphQL.Field(_type => String, {
  //   nullable: true
  // })
  // image?: string | undefined;

  @TypeGraphQL.Field(_type => course_category_enum, {
      nullable: false
  })
  category?: "revision" | "club" | "coaching";

  @TypeGraphQL.Field(_type => Boolean, {
      nullable: true
  })
  allowContact?: boolean | undefined;

    // @TypeGraphQL.Field(_type => Course_tags_course_tagCreateNestedManyWithoutCourseInput, {
    //   nullable: true
    // })
    // tags?: Course_tags_course_tagCreateNestedManyWithoutCourseInput | undefined;
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

    @Mutation((returns) => Boolean)
    @AuthorizedDeferred(Role.ADMIN, Role.OWNER)
    async courseEdit(@Ctx() context: GraphQLContext, @Arg("courseId")courseId: number, @Arg("course") data: PublicCourseEditInput, @Arg("studentId", { nullable: true }) studentId?: number): Promise<boolean> {
        const course = await getCourse(courseId);
        await hasAccess(context, "Course", course);
        const student = await getSessionStudent(context, studentId);
        const result = await prisma.course.update({ data, where: {id: courseId}});
        logger.info(`Course (${result.id}) updated by Student (${student.id})`);
        return true;
    }

    @Mutation((returns) => Boolean)
    @Authorized(Role.ADMIN)
    async courseAddInstructor(@Ctx() context: GraphQLContext, @Arg("courseId") courseId: number, @Arg("studentId") studentId: number): Promise<boolean> {
        await getCourse(courseId);
        await getStudent(studentId);
        await prisma.course_instructors_student.create({data: { courseId, studentId}});
        logger.info(`Student (${studentId}) was added as an instructor to course ${courseId}`);
        return true;
    }

    @Mutation((returns) => Boolean)
    @Authorized(Role.ADMIN)
    async courseDeleteInstructor(@Ctx() context: GraphQLContext, @Arg("courseId") courseId: number, @Arg("studentId") studentId: number): Promise<boolean> {
        await getCourse(courseId);
        await getStudent(studentId);
        await prisma.course_instructors_student.delete({where: { courseId_studentId: {courseId, studentId}}});
        logger.info(`Student (${studentId}) was deleted from course ${courseId}`);
        return true;
    }
}








