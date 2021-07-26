import * as TypeGraphQL from "type-graphql";
import graphqlFields from "graphql-fields";
import { GraphQLResolveInfo } from "graphql";
import { DeleteProject_field_with_grade_restrictionArgs } from "./args/DeleteProject_field_with_grade_restrictionArgs";
import { Project_field_with_grade_restriction } from "../../../models/Project_field_with_grade_restriction";
import { transformFields, getPrismaFromContext, transformCountFieldIntoSelectRelationsCount } from "../../../helpers";

@TypeGraphQL.Resolver(_of => Project_field_with_grade_restriction)
export class DeleteProject_field_with_grade_restrictionResolver {
  @TypeGraphQL.Mutation(_returns => Project_field_with_grade_restriction, {
    nullable: true
  })
  async deleteProject_field_with_grade_restriction(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: DeleteProject_field_with_grade_restrictionArgs): Promise<Project_field_with_grade_restriction | null> {
    const { _count } = transformFields(
      graphqlFields(info as any)
    );
    return getPrismaFromContext(ctx).project_field_with_grade_restriction.delete({
      ...args,
      ...(_count && transformCountFieldIntoSelectRelationsCount(_count)),
    });
  }
}
