import * as TypeGraphQL from "type-graphql";
import graphqlFields from "graphql-fields";
import { GraphQLResolveInfo } from "graphql";
import { AggregateCourse_tags_course_tagArgs } from "./args/AggregateCourse_tags_course_tagArgs";
import { Course_tags_course_tag } from "../../../models/Course_tags_course_tag";
import { AggregateCourse_tags_course_tag } from "../../outputs/AggregateCourse_tags_course_tag";
import { transformFields, getPrismaFromContext, transformCountFieldIntoSelectRelationsCount } from "../../../helpers";

@TypeGraphQL.Resolver(_of => Course_tags_course_tag)
export class AggregateCourse_tags_course_tagResolver {
  @TypeGraphQL.Query(_returns => AggregateCourse_tags_course_tag, {
    nullable: false
  })
  async aggregateCourse_tags_course_tag(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: AggregateCourse_tags_course_tagArgs): Promise<AggregateCourse_tags_course_tag> {
    return getPrismaFromContext(ctx).course_tags_course_tag.aggregate({
      ...args,
      ...transformFields(graphqlFields(info as any)),
    });
  }
}
