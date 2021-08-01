import * as TypeGraphQL from "type-graphql";
import graphqlFields from "graphql-fields";
import { GraphQLResolveInfo } from "graphql";
import { GroupByPupil_tutoring_interest_confirmation_requestArgs } from "./args/GroupByPupil_tutoring_interest_confirmation_requestArgs";
import { Pupil_tutoring_interest_confirmation_request } from "../../../models/Pupil_tutoring_interest_confirmation_request";
import { Pupil_tutoring_interest_confirmation_requestGroupBy } from "../../outputs/Pupil_tutoring_interest_confirmation_requestGroupBy";
import { transformFields, getPrismaFromContext, transformCountFieldIntoSelectRelationsCount } from "../../../helpers";

@TypeGraphQL.Resolver(_of => Pupil_tutoring_interest_confirmation_request)
export class GroupByPupil_tutoring_interest_confirmation_requestResolver {
  @TypeGraphQL.Query(_returns => [Pupil_tutoring_interest_confirmation_requestGroupBy], {
    nullable: false
  })
  async groupByPupil_tutoring_interest_confirmation_request(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: GroupByPupil_tutoring_interest_confirmation_requestArgs): Promise<Pupil_tutoring_interest_confirmation_requestGroupBy[]> {
    const { _count, _avg, _sum, _min, _max } = transformFields(
      graphqlFields(info as any)
    );
    return getPrismaFromContext(ctx).pupil_tutoring_interest_confirmation_request.groupBy({
      ...args,
      ...Object.fromEntries(
        Object.entries({ _count, _avg, _sum, _min, _max }).filter(([_, v]) => v != null)
      ),
    });
  }
}
