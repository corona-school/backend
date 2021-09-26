import * as TypeGraphQL from "type-graphql";
import graphqlFields from "graphql-fields";
import { GraphQLResolveInfo } from "graphql";
import { FindManyProject_field_with_grade_restrictionArgs } from "./args/FindManyProject_field_with_grade_restrictionArgs";
import { Project_field_with_grade_restriction } from "../../../models/Project_field_with_grade_restriction";
import { transformFields, getPrismaFromContext, transformCountFieldIntoSelectRelationsCount } from "../../../helpers";

@TypeGraphQL.Resolver(_of => Project_field_with_grade_restriction)
export class FindManyProject_field_with_grade_restrictionResolver {
  @TypeGraphQL.Query(_returns => [Project_field_with_grade_restriction], {
    nullable: false
  })
  async project_field_with_grade_restrictions(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: FindManyProject_field_with_grade_restrictionArgs): Promise<Project_field_with_grade_restriction[]> {
    const { _count } = transformFields(
      graphqlFields(info as any)
    );
    return getPrismaFromContext(ctx).project_field_with_grade_restriction.findMany({
      ...args,
      ...(_count && transformCountFieldIntoSelectRelationsCount(_count)),
    });
  }
}
