import * as TypeGraphQL from "type-graphql";
import graphqlFields from "graphql-fields";
import { GraphQLResolveInfo } from "graphql";
import { GroupBySubcourse_waiting_list_pupilArgs } from "./args/GroupBySubcourse_waiting_list_pupilArgs";
import { Subcourse_waiting_list_pupil } from "../../../models/Subcourse_waiting_list_pupil";
import { Subcourse_waiting_list_pupilGroupBy } from "../../outputs/Subcourse_waiting_list_pupilGroupBy";
import { transformFields, getPrismaFromContext, transformCountFieldIntoSelectRelationsCount } from "../../../helpers";

@TypeGraphQL.Resolver(_of => Subcourse_waiting_list_pupil)
export class GroupBySubcourse_waiting_list_pupilResolver {
  @TypeGraphQL.Query(_returns => [Subcourse_waiting_list_pupilGroupBy], {
    nullable: false
  })
  async groupBySubcourse_waiting_list_pupil(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: GroupBySubcourse_waiting_list_pupilArgs): Promise<Subcourse_waiting_list_pupilGroupBy[]> {
    const { _count, _avg, _sum, _min, _max } = transformFields(
      graphqlFields(info as any)
    );
    return getPrismaFromContext(ctx).subcourse_waiting_list_pupil.groupBy({
      ...args,
      ...Object.fromEntries(
        Object.entries({ _count, _avg, _sum, _min, _max }).filter(([_, v]) => v != null)
      ),
    });
  }
}
