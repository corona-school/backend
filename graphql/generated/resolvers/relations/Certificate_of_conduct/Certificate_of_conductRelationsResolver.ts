import * as TypeGraphQL from "type-graphql";
import { Certificate_of_conduct } from "../../../models/Certificate_of_conduct";
import { Screener } from "../../../models/Screener";
import { Student } from "../../../models/Student";
import { transformFields, getPrismaFromContext, transformCountFieldIntoSelectRelationsCount } from "../../../helpers";

@TypeGraphQL.Resolver(_of => Certificate_of_conduct)
export class Certificate_of_conductRelationsResolver {
  @TypeGraphQL.FieldResolver(_type => Screener, {
    nullable: true
  })
  async inspectingScreener(@TypeGraphQL.Root() certificate_of_conduct: Certificate_of_conduct, @TypeGraphQL.Ctx() ctx: any): Promise<Screener | null> {
    return getPrismaFromContext(ctx).certificate_of_conduct.findUnique({
      where: {
        id: certificate_of_conduct.id,
      },
    }).inspectingScreener({});
  }

  @TypeGraphQL.FieldResolver(_type => Student, {
    nullable: true
  })
  async student(@TypeGraphQL.Root() certificate_of_conduct: Certificate_of_conduct, @TypeGraphQL.Ctx() ctx: any): Promise<Student | null> {
    return getPrismaFromContext(ctx).certificate_of_conduct.findUnique({
      where: {
        id: certificate_of_conduct.id,
      },
    }).student({});
  }
}
