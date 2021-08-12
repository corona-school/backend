import * as TypeGraphQL from "type-graphql";
import graphqlFields from "graphql-fields";
import { GraphQLResolveInfo } from "graphql";
import { GroupByProject_field_with_grade_restrictionArgs } from "./args/GroupByProject_field_with_grade_restrictionArgs";
import { Project_field_with_grade_restriction } from "../../../models/Project_field_with_grade_restriction";
import { Project_field_with_grade_restrictionGroupBy } from "../../outputs/Project_field_with_grade_restrictionGroupBy";
import { transformFields, getPrismaFromContext, transformCountFieldIntoSelectRelationsCount } from "../../../helpers";

@TypeGraphQL.Resolver(_of => Project_field_with_grade_restriction)
export class GroupByProject_field_with_grade_restrictionResolver {
  @TypeGraphQL.Query(_returns => [Project_field_with_grade_restrictionGroupBy], {
    nullable: false
  })
  async groupByProject_field_with_grade_restriction(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: GroupByProject_field_with_grade_restrictionArgs): Promise<Project_field_with_grade_restrictionGroupBy[]> {
    const { _count, _avg, _sum, _min, _max } = transformFields(
      graphqlFields(info as any)
    );
    return getPrismaFromContext(ctx).project_field_with_grade_restriction.groupBy({
      ...args,
      ...Object.fromEntries(
        Object.entries({ _count, _avg, _sum, _min, _max }).filter(([_, v]) => v != null)
      ),
    });
  }
}
