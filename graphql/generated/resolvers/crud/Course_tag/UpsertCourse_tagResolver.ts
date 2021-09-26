import * as TypeGraphQL from "type-graphql";
import graphqlFields from "graphql-fields";
import { GraphQLResolveInfo } from "graphql";
import { UpsertCourse_tagArgs } from "./args/UpsertCourse_tagArgs";
import { Course_tag } from "../../../models/Course_tag";
import { transformFields, getPrismaFromContext, transformCountFieldIntoSelectRelationsCount } from "../../../helpers";

@TypeGraphQL.Resolver(_of => Course_tag)
export class UpsertCourse_tagResolver {
  @TypeGraphQL.Mutation(_returns => Course_tag, {
    nullable: false
  })
  async upsertCourse_tag(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: UpsertCourse_tagArgs): Promise<Course_tag> {
    const { _count } = transformFields(
      graphqlFields(info as any)
    );
    return getPrismaFromContext(ctx).course_tag.upsert({
      ...args,
      ...(_count && transformCountFieldIntoSelectRelationsCount(_count)),
    });
  }
}
