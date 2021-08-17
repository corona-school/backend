import * as TypeGraphQL from "type-graphql";
import { Course_tag } from "../../../models/Course_tag";
import { Course_tags_course_tag } from "../../../models/Course_tags_course_tag";
import { Course_tagCourse_tags_course_tagArgs } from "./args/Course_tagCourse_tags_course_tagArgs";
import { transformFields, getPrismaFromContext, transformCountFieldIntoSelectRelationsCount } from "../../../helpers";

@TypeGraphQL.Resolver(_of => Course_tag)
export class Course_tagRelationsResolver {
  @TypeGraphQL.FieldResolver(_type => [Course_tags_course_tag], {
    nullable: false
  })
  async course_tags_course_tag(@TypeGraphQL.Root() course_tag: Course_tag, @TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Args() args: Course_tagCourse_tags_course_tagArgs): Promise<Course_tags_course_tag[]> {
    return getPrismaFromContext(ctx).course_tag.findUnique({
      where: {
        id: course_tag.id,
      },
    }).course_tags_course_tag(args);
  }
}
