import * as TypeGraphQL from "type-graphql";
import graphqlFields from "graphql-fields";
import { GraphQLResolveInfo } from "graphql";
import { GroupByProject_coaching_screeningArgs } from "./args/GroupByProject_coaching_screeningArgs";
import { Project_coaching_screening } from "../../../models/Project_coaching_screening";
import { Project_coaching_screeningGroupBy } from "../../outputs/Project_coaching_screeningGroupBy";
import { transformFields, getPrismaFromContext, transformCountFieldIntoSelectRelationsCount } from "../../../helpers";

@TypeGraphQL.Resolver(_of => Project_coaching_screening)
export class GroupByProject_coaching_screeningResolver {
  @TypeGraphQL.Query(_returns => [Project_coaching_screeningGroupBy], {
    nullable: false
  })
  async groupByProject_coaching_screening(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: GroupByProject_coaching_screeningArgs): Promise<Project_coaching_screeningGroupBy[]> {
    const { _count, _avg, _sum, _min, _max } = transformFields(
      graphqlFields(info as any)
    );
    return getPrismaFromContext(ctx).project_coaching_screening.groupBy({
      ...args,
      ...Object.fromEntries(
        Object.entries({ _count, _avg, _sum, _min, _max }).filter(([_, v]) => v != null)
      ),
    });
  }
}
