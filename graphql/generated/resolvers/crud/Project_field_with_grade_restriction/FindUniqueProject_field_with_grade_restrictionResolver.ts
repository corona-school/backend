import * as TypeGraphQL from "type-graphql";
import graphqlFields from "graphql-fields";
import { GraphQLResolveInfo } from "graphql";
import { FindUniqueProject_field_with_grade_restrictionArgs } from "./args/FindUniqueProject_field_with_grade_restrictionArgs";
import { Project_field_with_grade_restriction } from "../../../models/Project_field_with_grade_restriction";
import { transformFields, getPrismaFromContext, transformCountFieldIntoSelectRelationsCount } from "../../../helpers";

@TypeGraphQL.Resolver(_of => Project_field_with_grade_restriction)
export class FindUniqueProject_field_with_grade_restrictionResolver {
  @TypeGraphQL.Query(_returns => Project_field_with_grade_restriction, {
    nullable: true
  })
  async project_field_with_grade_restriction(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: FindUniqueProject_field_with_grade_restrictionArgs): Promise<Project_field_with_grade_restriction | null> {
    const { _count } = transformFields(
      graphqlFields(info as any)
    );
    return getPrismaFromContext(ctx).project_field_with_grade_restriction.findUnique({
      ...args,
      ...(_count && transformCountFieldIntoSelectRelationsCount(_count)),
    });
  }
}
