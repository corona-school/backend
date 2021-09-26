import * as TypeGraphQL from "type-graphql";
import graphqlFields from "graphql-fields";
import { GraphQLResolveInfo } from "graphql";
import { AggregateCourse_tagArgs } from "./args/AggregateCourse_tagArgs";
import { Course_tag } from "../../../models/Course_tag";
import { AggregateCourse_tag } from "../../outputs/AggregateCourse_tag";
import { transformFields, getPrismaFromContext, transformCountFieldIntoSelectRelationsCount } from "../../../helpers";

@TypeGraphQL.Resolver(_of => Course_tag)
export class AggregateCourse_tagResolver {
  @TypeGraphQL.Query(_returns => AggregateCourse_tag, {
    nullable: false
  })
  async aggregateCourse_tag(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: AggregateCourse_tagArgs): Promise<AggregateCourse_tag> {
    return getPrismaFromContext(ctx).course_tag.aggregate({
      ...args,
      ...transformFields(graphqlFields(info as any)),
    });
  }
}
