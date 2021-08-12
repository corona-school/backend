import * as TypeGraphQL from "type-graphql";
import graphqlFields from "graphql-fields";
import { GraphQLResolveInfo } from "graphql";
import { UpdateManyPupil_tutoring_interest_confirmation_requestArgs } from "./args/UpdateManyPupil_tutoring_interest_confirmation_requestArgs";
import { Pupil_tutoring_interest_confirmation_request } from "../../../models/Pupil_tutoring_interest_confirmation_request";
import { AffectedRowsOutput } from "../../outputs/AffectedRowsOutput";
import { transformFields, getPrismaFromContext, transformCountFieldIntoSelectRelationsCount } from "../../../helpers";

@TypeGraphQL.Resolver(_of => Pupil_tutoring_interest_confirmation_request)
export class UpdateManyPupil_tutoring_interest_confirmation_requestResolver {
  @TypeGraphQL.Mutation(_returns => AffectedRowsOutput, {
    nullable: false
  })
  async updateManyPupil_tutoring_interest_confirmation_request(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: UpdateManyPupil_tutoring_interest_confirmation_requestArgs): Promise<AffectedRowsOutput> {
    const { _count } = transformFields(
      graphqlFields(info as any)
    );
    return getPrismaFromContext(ctx).pupil_tutoring_interest_confirmation_request.updateMany({
      ...args,
      ...(_count && transformCountFieldIntoSelectRelationsCount(_count)),
    });
  }
}
