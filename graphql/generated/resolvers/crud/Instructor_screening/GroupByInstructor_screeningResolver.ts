import * as TypeGraphQL from "type-graphql";
import graphqlFields from "graphql-fields";
import { GraphQLResolveInfo } from "graphql";
import { GroupByInstructor_screeningArgs } from "./args/GroupByInstructor_screeningArgs";
import { Instructor_screening } from "../../../models/Instructor_screening";
import { Instructor_screeningGroupBy } from "../../outputs/Instructor_screeningGroupBy";
import { transformFields, getPrismaFromContext, transformCountFieldIntoSelectRelationsCount } from "../../../helpers";

@TypeGraphQL.Resolver(_of => Instructor_screening)
export class GroupByInstructor_screeningResolver {
  @TypeGraphQL.Query(_returns => [Instructor_screeningGroupBy], {
    nullable: false
  })
  async groupByInstructor_screening(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: GroupByInstructor_screeningArgs): Promise<Instructor_screeningGroupBy[]> {
    const { _count, _avg, _sum, _min, _max } = transformFields(
      graphqlFields(info as any)
    );
    return getPrismaFromContext(ctx).instructor_screening.groupBy({
      ...args,
      ...Object.fromEntries(
        Object.entries({ _count, _avg, _sum, _min, _max }).filter(([_, v]) => v != null)
      ),
    });
  }
}
