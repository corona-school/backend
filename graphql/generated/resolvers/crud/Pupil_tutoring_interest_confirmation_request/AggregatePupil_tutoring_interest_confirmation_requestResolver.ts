import * as TypeGraphQL from "type-graphql";
import graphqlFields from "graphql-fields";
import { GraphQLResolveInfo } from "graphql";
import { AggregatePupil_tutoring_interest_confirmation_requestArgs } from "./args/AggregatePupil_tutoring_interest_confirmation_requestArgs";
import { Pupil_tutoring_interest_confirmation_request } from "../../../models/Pupil_tutoring_interest_confirmation_request";
import { AggregatePupil_tutoring_interest_confirmation_request } from "../../outputs/AggregatePupil_tutoring_interest_confirmation_request";
import { transformFields, getPrismaFromContext, transformCountFieldIntoSelectRelationsCount } from "../../../helpers";

@TypeGraphQL.Resolver(_of => Pupil_tutoring_interest_confirmation_request)
export class AggregatePupil_tutoring_interest_confirmation_requestResolver {
  @TypeGraphQL.Query(_returns => AggregatePupil_tutoring_interest_confirmation_request, {
    nullable: false
  })
  async aggregatePupil_tutoring_interest_confirmation_request(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: AggregatePupil_tutoring_interest_confirmation_requestArgs): Promise<AggregatePupil_tutoring_interest_confirmation_request> {
    return getPrismaFromContext(ctx).pupil_tutoring_interest_confirmation_request.aggregate({
      ...args,
      ...transformFields(graphqlFields(info as any)),
    });
  }
}
