import * as TypeGraphQL from "type-graphql";
import { Course } from "../../../models/Course";
import { Course_tag } from "../../../models/Course_tag";
import { Course_tags_course_tag } from "../../../models/Course_tags_course_tag";
import { transformFields, getPrismaFromContext, transformCountFieldIntoSelectRelationsCount } from "../../../helpers";

@TypeGraphQL.Resolver(_of => Course_tags_course_tag)
export class Course_tags_course_tagRelationsResolver {
  @TypeGraphQL.FieldResolver(_type => Course, {
    nullable: false
  })
  async course(@TypeGraphQL.Root() course_tags_course_tag: Course_tags_course_tag, @TypeGraphQL.Ctx() ctx: any): Promise<Course> {
    return getPrismaFromContext(ctx).course_tags_course_tag.findUnique({
      where: {
        courseId_courseTagId: {
          courseId: course_tags_course_tag.courseId,
          courseTagId: course_tags_course_tag.courseTagId,
        },
      },
    }).course({});
  }

  @TypeGraphQL.FieldResolver(_type => Course_tag, {
    nullable: false
  })
  async course_tag(@TypeGraphQL.Root() course_tags_course_tag: Course_tags_course_tag, @TypeGraphQL.Ctx() ctx: any): Promise<Course_tag> {
    return getPrismaFromContext(ctx).course_tags_course_tag.findUnique({
      where: {
        courseId_courseTagId: {
          courseId: course_tags_course_tag.courseId,
          courseTagId: course_tags_course_tag.courseTagId,
        },
      },
    }).course_tag({});
  }
}
