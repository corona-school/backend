import * as TypeGraphQL from "type-graphql";
import { Remission_request } from "../../../models/Remission_request";
import { Student } from "../../../models/Student";
import { transformFields, getPrismaFromContext, transformCountFieldIntoSelectRelationsCount } from "../../../helpers";

@TypeGraphQL.Resolver(_of => Remission_request)
export class Remission_requestRelationsResolver {
  @TypeGraphQL.FieldResolver(_type => Student, {
    nullable: true
  })
  async student(@TypeGraphQL.Root() remission_request: Remission_request, @TypeGraphQL.Ctx() ctx: any): Promise<Student | null> {
    return getPrismaFromContext(ctx).remission_request.findUnique({
      where: {
        id: remission_request.id,
      },
    }).student({});
  }
}
