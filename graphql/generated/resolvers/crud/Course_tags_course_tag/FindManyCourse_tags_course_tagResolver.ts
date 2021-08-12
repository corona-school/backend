import * as TypeGraphQL from "type-graphql";
import graphqlFields from "graphql-fields";
import { GraphQLResolveInfo } from "graphql";
import { FindManyCourse_tags_course_tagArgs } from "./args/FindManyCourse_tags_course_tagArgs";
import { Course_tags_course_tag } from "../../../models/Course_tags_course_tag";
import { transformFields, getPrismaFromContext, transformCountFieldIntoSelectRelationsCount } from "../../../helpers";

@TypeGraphQL.Resolver(_of => Course_tags_course_tag)
export class FindManyCourse_tags_course_tagResolver {
  @TypeGraphQL.Query(_returns => [Course_tags_course_tag], {
    nullable: false
  })
  async course_tags_course_tags(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: FindManyCourse_tags_course_tagArgs): Promise<Course_tags_course_tag[]> {
    const { _count } = transformFields(
      graphqlFields(info as any)
    );
    return getPrismaFromContext(ctx).course_tags_course_tag.findMany({
      ...args,
      ...(_count && transformCountFieldIntoSelectRelationsCount(_count)),
    });
  }
}
