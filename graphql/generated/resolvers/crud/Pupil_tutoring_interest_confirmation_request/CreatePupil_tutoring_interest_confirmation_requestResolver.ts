import * as TypeGraphQL from "type-graphql";
import graphqlFields from "graphql-fields";
import { GraphQLResolveInfo } from "graphql";
import { CreatePupil_tutoring_interest_confirmation_requestArgs } from "./args/CreatePupil_tutoring_interest_confirmation_requestArgs";
import { Pupil_tutoring_interest_confirmation_request } from "../../../models/Pupil_tutoring_interest_confirmation_request";
import { transformFields, getPrismaFromContext, transformCountFieldIntoSelectRelationsCount } from "../../../helpers";

@TypeGraphQL.Resolver(_of => Pupil_tutoring_interest_confirmation_request)
export class CreatePupil_tutoring_interest_confirmation_requestResolver {
  @TypeGraphQL.Mutation(_returns => Pupil_tutoring_interest_confirmation_request, {
    nullable: false
  })
  async createPupil_tutoring_interest_confirmation_request(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: CreatePupil_tutoring_interest_confirmation_requestArgs): Promise<Pupil_tutoring_interest_confirmation_request> {
    const { _count } = transformFields(
      graphqlFields(info as any)
    );
    return getPrismaFromContext(ctx).pupil_tutoring_interest_confirmation_request.create({
      ...args,
      ...(_count && transformCountFieldIntoSelectRelationsCount(_count)),
    });
  }
}
