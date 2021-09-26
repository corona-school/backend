import * as TypeGraphQL from "type-graphql";
import graphqlFields from "graphql-fields";
import { GraphQLResolveInfo } from "graphql";
import { FindManyPupil_tutoring_interest_confirmation_requestArgs } from "./args/FindManyPupil_tutoring_interest_confirmation_requestArgs";
import { Pupil_tutoring_interest_confirmation_request } from "../../../models/Pupil_tutoring_interest_confirmation_request";
import { transformFields, getPrismaFromContext, transformCountFieldIntoSelectRelationsCount } from "../../../helpers";

@TypeGraphQL.Resolver(_of => Pupil_tutoring_interest_confirmation_request)
export class FindManyPupil_tutoring_interest_confirmation_requestResolver {
  @TypeGraphQL.Query(_returns => [Pupil_tutoring_interest_confirmation_request], {
    nullable: false
  })
  async pupil_tutoring_interest_confirmation_requests(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: FindManyPupil_tutoring_interest_confirmation_requestArgs): Promise<Pupil_tutoring_interest_confirmation_request[]> {
    const { _count } = transformFields(
      graphqlFields(info as any)
    );
    return getPrismaFromContext(ctx).pupil_tutoring_interest_confirmation_request.findMany({
      ...args,
      ...(_count && transformCountFieldIntoSelectRelationsCount(_count)),
    });
  }
}
