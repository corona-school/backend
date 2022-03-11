import { prisma } from "../../common/prisma";
import { Resolver, Mutation, Root, Arg, Authorized, Ctx } from "type-graphql";
import * as GraphQLModel from "../generated/models";
import { AuthorizedDeferred, hasAccess, Role } from "../authorizations";
import * as TypeGraphQL from "type-graphql";
import { course_category_enum } from "@prisma/client";
import { getLogger } from "log4js";
import { getSessionStudent } from "../authentication";
import { GraphQLContext } from "../context"

export class PublicCourseCreateInput {
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

const logger = getLogger("MutateCourseResolver");

@Resolver((of) => GraphQLModel.Course)
export class MutateCourseResolver {
    @Mutation((returns) => Boolean)
    @Authorized(Role.ADMIN, Role.INSTRUCTOR)
    async courseCreate(@Ctx() context: GraphQLContext, @Arg("course") course: PublicCourseCreateInput, @Arg("studentId", { nullable: true }) studentId?: number): Promise<boolean> {
        const student = await getSessionStudent(context, studentId);
        const result = await prisma.course.create({ data: { ...course, courseState: "created" } });
        logger.info(`Course (${result.id}) created by Student (${student.id})`);
        return true;
    }
}
