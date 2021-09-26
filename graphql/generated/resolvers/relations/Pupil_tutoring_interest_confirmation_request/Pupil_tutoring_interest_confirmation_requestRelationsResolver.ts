import * as TypeGraphQL from "type-graphql";
import { Pupil } from "../../../models/Pupil";
import { Pupil_tutoring_interest_confirmation_request } from "../../../models/Pupil_tutoring_interest_confirmation_request";
import { transformFields, getPrismaFromContext, transformCountFieldIntoSelectRelationsCount } from "../../../helpers";

@TypeGraphQL.Resolver(_of => Pupil_tutoring_interest_confirmation_request)
export class Pupil_tutoring_interest_confirmation_requestRelationsResolver {
  @TypeGraphQL.FieldResolver(_type => Pupil, {
    nullable: true
  })
  async pupil(@TypeGraphQL.Root() pupil_tutoring_interest_confirmation_request: Pupil_tutoring_interest_confirmation_request, @TypeGraphQL.Ctx() ctx: any): Promise<Pupil | null> {
    return getPrismaFromContext(ctx).pupil_tutoring_interest_confirmation_request.findUnique({
      where: {
        id: pupil_tutoring_interest_confirmation_request.id,
      },
    }).pupil({});
  }
}
