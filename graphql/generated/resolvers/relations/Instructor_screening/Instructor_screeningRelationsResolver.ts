import * as TypeGraphQL from "type-graphql";
import { Instructor_screening } from "../../../models/Instructor_screening";
import { Screener } from "../../../models/Screener";
import { Student } from "../../../models/Student";
import { transformFields, getPrismaFromContext, transformCountFieldIntoSelectRelationsCount } from "../../../helpers";

@TypeGraphQL.Resolver(_of => Instructor_screening)
export class Instructor_screeningRelationsResolver {
  @TypeGraphQL.FieldResolver(_type => Screener, {
    nullable: true
  })
  async screener(@TypeGraphQL.Root() instructor_screening: Instructor_screening, @TypeGraphQL.Ctx() ctx: any): Promise<Screener | null> {
    return getPrismaFromContext(ctx).instructor_screening.findUnique({
      where: {
        id: instructor_screening.id,
      },
    }).screener({});
  }

  @TypeGraphQL.FieldResolver(_type => Student, {
    nullable: true
  })
  async student(@TypeGraphQL.Root() instructor_screening: Instructor_screening, @TypeGraphQL.Ctx() ctx: any): Promise<Student | null> {
    return getPrismaFromContext(ctx).instructor_screening.findUnique({
      where: {
        id: instructor_screening.id,
      },
    }).student({});
  }
}
