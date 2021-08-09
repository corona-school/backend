import * as TypeGraphQL from "type-graphql";
import { Screener } from "../../../models/Screener";
import { Screening } from "../../../models/Screening";
import { Student } from "../../../models/Student";
import { transformFields, getPrismaFromContext, transformCountFieldIntoSelectRelationsCount } from "../../../helpers";

@TypeGraphQL.Resolver(_of => Screening)
export class ScreeningRelationsResolver {
  @TypeGraphQL.FieldResolver(_type => Screener, {
    nullable: true
  })
  async screener(@TypeGraphQL.Root() screening: Screening, @TypeGraphQL.Ctx() ctx: any): Promise<Screener | null> {
    return getPrismaFromContext(ctx).screening.findUnique({
      where: {
        id: screening.id,
      },
    }).screener({});
  }

  @TypeGraphQL.FieldResolver(_type => Student, {
    nullable: true
  })
  async student(@TypeGraphQL.Root() screening: Screening, @TypeGraphQL.Ctx() ctx: any): Promise<Student | null> {
    return getPrismaFromContext(ctx).screening.findUnique({
      where: {
        id: screening.id,
      },
    }).student({});
  }
}
